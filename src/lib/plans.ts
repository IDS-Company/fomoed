export type PlanInfo = {
	name: string;
	priceUsdMonth: number;
	priceUsdYear: number;
	features: string[];
	recommended: boolean;
};

export const planPro: PlanInfo = {
	name: 'PRO',
	priceUsdMonth: 9.99,
	priceUsdYear: 89.99,
	features: [
		'Access to all time frame 15M, 1H, and 4H Data',
		'Access to more than 45 of the most popular crypto assets',
		'Access to liquidations charts on all markets',
		"<p>Chance to win a personal charts training with <a href='https://example.com' class='text-primary underline'>Joshua&nbsp;Jake</a></p>"
	],
	recommended: true
};

export const planPlus: PlanInfo = {
	name: 'Plus',
	priceUsdMonth: 4.99,
	priceUsdYear: 39.99,
	features: [
		'Access to all time frame 15M, 1H, and 4H Data',
		'Access to more than 45 of the most popular crypto assets'
	],
	recommended: false
};
