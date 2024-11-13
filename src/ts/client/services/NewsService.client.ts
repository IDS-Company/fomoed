import type { ClientFetchStatus, NewsItem, ServerResponse } from '$ts/types';
import { writable } from 'svelte/store';

export class NewsService {
	news = writable<NewsItem[]>([]);
	status = writable<ClientFetchStatus>('idle');
	error = writable<string>('');

	async fetchNews() {
		this.status.set('loading');

		const url = `/api/news`;

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
	}
}
