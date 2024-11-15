import type { ClientFetchStatus, NewsItem, ServerResponse } from '$ts/types';
import { writable } from 'svelte/store';

type NewsFilterVal =
	| 'rising'
	| 'hot'
	| 'bullish'
	| 'bearish'
	| 'important'
	| 'saved'
	| 'lol'
	| 'all';
export type NewsFilterOption = { value: NewsFilterVal; label: string };

export const newsFilterOpts: NewsFilterOption[] = [
	{ value: 'all', label: 'Top news' },
	{ value: 'rising', label: 'Rising' },
	{ value: 'hot', label: 'Hot' },
	{ value: 'bullish', label: 'Bullish' },
	{ value: 'bearish', label: 'Bearish' },
	{ value: 'important', label: 'Important' },
	{ value: 'saved', label: 'Saved' },
	{ value: 'lol', label: 'LOL' }
];

export type NewsKind = 'news' | 'media' | 'all';
export type NewsKindOption = { value: NewsKind; label: string };

export const newsKindOpts: NewsKindOption[] = [
	{ value: 'all', label: 'News & Media' },
	{ value: 'news', label: 'News' },
	{ value: 'media', label: 'Media' }
];

interface FetchNewsOpts {
	currrency?: string;
	filter?: NewsFilterVal;
	kind?: NewsKind;
}

export class NewsService {
	news = writable<NewsItem[]>([]);
	status = writable<ClientFetchStatus>('idle');
	error = writable<string>('');

	async fetchNews(opts: FetchNewsOpts = {}) {
		this.status.set('loading');

		const url = new URL(window.location.origin + '/api/news');

		if (opts.currrency) {
			url.searchParams.set('currencies', opts.currrency);
		}

		if (opts.filter) {
			url.searchParams.set('filter', opts.filter);
		}

		if (opts.kind) {
			url.searchParams.set('kind', opts.kind);
		}

		const res = await fetch(url);

		if (!res.ok) {
			this.status.set('error');
			this.error.set(res.statusText);

			return;
		}

		const json = (await res.json()) as ServerResponse;

		if (!json.success) {
			this.status.set('error');
			this.error.set(json.message);

			return;
		}

		this.news.set(json.data.results);
		this.status.set('success');

		// For testing
		this.news.update((news) => {
			news[0].votes.positive = 3;
			news[1].votes.positive = 2;
			news[3].votes.positive = 1;

			news[4].votes.negative = 0;
			news[5].votes.negative = 1;
			news[6].votes.negative = 2;

			return news;
		});
	}
}
