export type ClientFetchStatus = 'idle' | 'loading' | 'success' | 'error';
export type ServerResponse = { success: true; data: any } | { success: false; message: string };

export type NewsItem = {
	id: number;
	title: string;
	published_at: string;
	url: string;
	domain: string;
	kind: 'news' | 'media';
	votes: {
		positive: number;
		negative: number;
		important: number;
		liked: number;
		disliked: number;
		lol: number;
		toxic: number;
		saved: number;
		comments: number;
	};
	metadata: {
		image: string;
		description: string;
	};
	source: {
		title: string;
		region: string;
		domain: string;
	};
};

export const newsFilterVals = [
	'rising',
	'hot',
	'bullish',
	'bearish',
	'important',
	'saved',
	'lol',
	'all'
] as const;
export type NewsFilterVal = (typeof newsFilterVals)[number];

export const newsKindVals = ['news', 'media', 'all'] as const;
export type NewsKindVal = (typeof newsKindVals)[number];

const planIds = ['plus', 'pro'] as const;
export type PlanId = (typeof planIds)[number];
