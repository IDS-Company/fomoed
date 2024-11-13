export type NewsItem = {
	id: number;
	title: string;
	published_at: string;
};

export type ClientFetchStatus = 'idle' | 'loading' | 'success' | 'error';
export type ServerResponse = { success: true; data: any } | { success: false; message: string };
