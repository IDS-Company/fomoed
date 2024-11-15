export type ClientFetchStatus = 'idle' | 'loading' | 'success' | 'error';
export type ServerResponse = { success: true; data: any } | { success: false; message: string };

export type NewsItem = {
	id: number;
	title: string;
	published_at: string;
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
};
