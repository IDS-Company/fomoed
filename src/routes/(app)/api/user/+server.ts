import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import _ from 'lodash-es';

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals: { supabase, user } }: RequestEvent) {
	if (!user?.email) {
		return error(401, {
			message: 'Unauthorized Request Detected'
		});
	}

	const { data: users, error: err }: PostgrestSingleResponse<IUser[]> = await supabase
		.from('users')
		.select()
		.eq('email', user?.email);

	if (err) {
		return error(+err.code, {
			message: err.message
		});
	}

	if (!users[0]) {
		await supabase.auth.signOut();

		return error(404, {
			message: 'User not Found'
		});
	}

	const auth_user = users[0];

	if (auth_user) {
		auth_user.has_valid_sub = false;

		const { data: subscriptions, error: err }: PostgrestSingleResponse<ISubscription[]> =
			await supabase.from('subscriptions').select().eq('user_id', auth_user.user_id);

		if (err) {
			console.error('⚠️ Could not fetch subscriptions: ', err);
		}

		// Removes the potential of returning subscriptions that have already been unsubbed
		const filtered_subs = _.orderBy(
			subscriptions
				?.filter((sub) => Date.now() < new Date(sub.end_timestamp).getTime())
				.map((sub) => ({ ...sub, start_timestamp: new Date(sub.start_timestamp) })),
			['start_timestamp'],
			['desc']
		);

		(auth_user as any).subscriptions = filtered_subs[0] ? [filtered_subs[0]] : [];
		(auth_user as any).has_valid_sub = (auth_user as any).subscriptions.length > 0;
	}

	return json({
		data: auth_user as IUser & { has_valid_sub: boolean; subscriptions: ISubscription[] }
	});
}
