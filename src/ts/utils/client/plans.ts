import type { PlanInfo } from '$lib/types';
import { derived, get } from 'svelte/store';
import { autoFetchStore } from './stores';
import { auth_user } from '$lib/stores/user';
import { failure, warning } from '$lib/utils';
import { stripeStore } from './stripe';
import { active_sub, changingSubscription } from '$lib/stores/subs';
import type { SupabaseClient } from '@supabase/supabase-js';
import { get_user, sleep } from '$lib';

export const availablePlans = autoFetchStore<PlanInfo[]>(async () => {
	const res = await fetch('/api/plans');
	const json = await res.json();

	return json.data.plans;
}, []);

export const planInfoPro = derived<typeof availablePlans, PlanInfo | undefined>(
	availablePlans,
	(plans) => {
		return plans.find((i) => i.name === 'PRO');
	}
);

export const planInfoPlus = derived<typeof availablePlans, PlanInfo | undefined>(
	availablePlans,
	(plans) => {
		return plans.find((i) => i.name === 'Plus');
	}
);

export class ClientSubscriptionManager {
	supabase: SupabaseClient;

	constructor(supabase: SupabaseClient) {
		this.supabase = supabase;
	}

	async subscribe(price_id: string): Promise<boolean> {
		const $auth_user = get(auth_user);
		const $stripe = get(stripeStore);

		if (!$auth_user) {
			throw new Error('User not authenticated!');
		}

		if (
			$auth_user.subscriptions.length &&
			$auth_user.subscriptions.some((sub) => sub.plan.id === price_id)
		) {
			warning('Seems you are already subscribed to a plan');
			return false;
		}

		changingSubscription.set(true);

		const unsubOk = await this.unsubscribe();

		if (!unsubOk) {
			return false;
		}

		const res = await fetch('/api/stripe/checkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				priceId: price_id,
				email: $auth_user.email,
				user_id: $auth_user.user_id
			})
		});
		const json = await res.json();

		if (json.url) {
			window.location = json.url;
			return true;
		}

		await $stripe!.redirectToCheckout({
			sessionId: json.sessionId
		});

		changingSubscription.set(false);

		return true;
	}

	async subscribeFreeTrial(): Promise<boolean> {
		// Pro plan monthly has a free trial set on stripe
		const proPlan = get(availablePlans).find((i) => i.name === 'PRO');
		const monthlyProPriceId = proPlan?.priceIdMonth!;

		return await this.subscribe(monthlyProPriceId);
	}

	async _unsub(subId: string) {
		const res = await fetch('/api/cancel_subscription', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				subscription: subId
			})
		});
	}

	async unsubscribe(): Promise<boolean> {
		const $auth_user = get(auth_user)!;

		changingSubscription.set(true);

		if (!$auth_user) {
			throw new Error('User not authenticated!');
		}

		for (const sub of $auth_user.subscriptions) {
			await this._unsub(sub.id);
		}

		await sleep(5000);
		await get_user(this.supabase);

		changingSubscription.set(false);

		return true;
	}

	async resubscribe(): Promise<boolean> {
		changingSubscription.set(true);

		const $auth_user = get(auth_user)!;

		if (!$auth_user) {
			throw new Error('User not authenticated!');
		}

		const subId = get(active_sub)?.id;

		await fetch('/api/resume_subscription', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				subscription: subId
			})
		})
			.then((res) => res.json())
			.then((res) => res)
			.catch((err) => {
				failure(err.message || 'Encountered an error while processing subscription resumption.');

				return null;
			});

		await sleep(5000);
		await get_user(this.supabase);

		changingSubscription.set(false);

		return true;
	}
}
