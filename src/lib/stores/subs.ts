import { derived, writable, type Readable } from 'svelte/store';
import { auth_user } from './user';
import type Stripe from 'stripe';

export const active_sub: Readable<Stripe.Subscription | null> = derived(auth_user, ($auth_user) => {
	if (!$auth_user) {
		return null;
	}

	return $auth_user.subscriptions[0];
});

export const changingSubscription = writable(false);

auth_user.subscribe(console.log);
