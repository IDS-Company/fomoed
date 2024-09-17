import type { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

export async function hasActiveSubscription(supabase: SupabaseClient, userId: string) {
	const { data: subscriptions, error: sub_error }: PostgrestSingleResponse<ISubscription[]> =
		await supabase.from('subscriptions').select().eq('user_id', userId);

	if (sub_error) {
		console.error('Error retrieving subscriptions!');

		return false;
	}

	const activeSubscriptions = subscriptions.filter(
		(sub) => new Date(sub.end_timestamp).getTime() > Date.now()
	);

	if (activeSubscriptions.length > 0) {
		return true;
	}

	return false;
}
