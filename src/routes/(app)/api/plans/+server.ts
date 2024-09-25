import { json } from '@sveltejs/kit';
import stripe from '../stripe/stripe';
import type { RequestEvent } from './$types';
import type { PlanInfo } from '$lib/types';

const planInfos: PlanInfo[] = [
	{
		planIdPrefix: 'pro',
		name: 'PRO',
		recommended: true,
		features: [
			'Access to all time frame 15M, 1H, and 4H Data',
			'Access to more than 45 of the most popular crypto assets',
			'Access to liquidations charts on all markets',
			"<p>Chance to win a personal charts training with <a href='https://example.com' class='text-primary underline'>Joshua&nbsp;Jake</a></p>"
		]
	},
	{
		planIdPrefix: 'plus',
		name: 'Plus',
		recommended: false,
		features: [
			'Access to all time frame 15M, 1H, and 4H Data',
			'Access to more than 45 of the most popular crypto assets'
		]
	}
];

// These are set in metadata of prices on stripe under the key 'plan_id'
// const plan_ids = ['pro_monthly', 'pro_yearly', 'plus_monthly', 'plus_yearly'];

export async function GET({ request }: RequestEvent) {
	const prices = await stripe.prices.list();

	console.log(prices);

	for (const price of prices.data) {
		const planId = price.metadata.plan_id;
		const planInfo = planInfos.find((i) => planId.startsWith(i.planIdPrefix));

		if (!planInfo) {
			continue;
		}

		const priceUsd = (price.unit_amount || 0) / 100;

		if (price.recurring?.interval === 'month') {
			planInfo.priceIdMonth = price.id;
			planInfo.priceUsdMonth = priceUsd || 0;
		}

		if (price.recurring?.interval === 'year') {
			planInfo.priceIdYear = price.id;
			planInfo.priceUsdYear = priceUsd || 0;
		}
	}

	const data = {
		plans: planInfos
	};

	return json({ success: true, data });
}
