import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import stripe from '../stripe/stripe';

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

		// For some reason, on stripe there are multiple customers with the same email
		// Here we are searching for all customers with the email and retrieving all their subscriptions

		const user_customers = await stripe.customers.search({ query: `email:"${auth_user.email}"` });

		const user_subscriptions = [];

		for (const customer of user_customers.data) {
			const customer_subs = await stripe.subscriptions.list({ customer: customer.id });

			user_subscriptions.push(...customer_subs.data);
		}

		const active_subs = user_subscriptions.filter(
			(sub) => sub.status === 'active' || sub.status === 'trialing'
		);

		// @ts-expect-error subscriptions is an array of Stripe subscriptions
		auth_user.subscriptions = active_subs;
		auth_user.has_valid_sub = active_subs.length > 0;
	}

	return json({
		data: auth_user as IUser & { has_valid_sub: boolean; subscriptions: ISubscription[] }
	});
}
