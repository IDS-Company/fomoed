import { derived, writable, type Readable } from 'svelte/store';
import { auth_user } from './user';
import { PREMIUM_PRICE_ID } from '$lib/prices';
import type Stripe from 'stripe';

export const active_premium_sub: Readable<Stripe.Subscription | null> = derived(
	auth_user,
	($auth_user) => {
		if (!$auth_user) return null;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return $auth_user.subscriptions.find((sub: any) => sub.plan.id === PREMIUM_PRICE_ID) || null;
	}
);

export const active_degen_sub: Readable<Stripe.Subscription | null> = derived(
	auth_user,
	($auth_user) => {
		if (!$auth_user) return null;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return $auth_user.subscriptions.find((sub: any) => sub.plan.id !== PREMIUM_PRICE_ID) || null;
	}
);

export const active_sub: Readable<Stripe.Subscription | null> = derived(auth_user, ($auth_user) => {
	if (!$auth_user) {
		return null;
	}

	return $auth_user.subscriptions[0];
});

export const changingSubscription = writable(false);
