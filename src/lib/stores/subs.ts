import { derived, writable, type Readable } from 'svelte/store';
import { auth_user } from './user';
import type Stripe from 'stripe';

export const active_sub: Readable<Stripe.Subscription | null> = derived(auth_user, ($auth_user) => {
	if (!$auth_user) {
		return null;
	}

	console.log($auth_user.subscriptions);

	// Select the most expensive subscription
	// Find a PRO plan if available
	for (const sub of $auth_user.subscriptions) {
		const plan_id = sub.plan.metadata.plan_id;

		console.log({ plan_id });

		if (plan_id.includes('pro')) {
			return sub;
		}
	}

	return $auth_user.subscriptions[0];
});

export const changingSubscription = writable(false);

auth_user.subscribe(console.log);
