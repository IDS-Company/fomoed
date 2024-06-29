import { derived, readable, writable, type Readable } from 'svelte/store';
import { auth_user } from './user';
import { PREMIUM_PRICE_ID } from '$lib/prices';

export const active_premium_sub: Readable<ISubscription | null> = derived(
	auth_user,
	($auth_user) => {
		if (!$auth_user) return null;
		return $auth_user.subscriptions.find((sub) => sub.price_id === PREMIUM_PRICE_ID) || null;
	}
);

export const active_degen_sub: Readable<ISubscription | null> = derived(auth_user, ($auth_user) => {
	if (!$auth_user) return null;
	return $auth_user.subscriptions.find((sub) => sub.price_id !== PREMIUM_PRICE_ID) || null;
});

export const active_sub: Readable<ISubscription | null> = derived(auth_user, ($auth_user) => {
	if (!$auth_user) {
		return null;
	}

	return $auth_user.subscriptions[0];
});

export const changingSubscription = writable(false);
