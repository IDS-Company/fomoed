import { PRIVATE_CRYPTOPANIC_KEY } from '$env/static/private';
import type { NewsFilterVal, NewsKindVal } from '$ts/types';

export class NewsService {
	async getFromCryptoPanic({
		filter = 'all',
		kind = 'all',
		page = 1
	}: {
		filter: NewsFilterVal;
		kind: NewsKindVal;
		page: number;
	}) {
		const url = new URL('https://cryptopanic.com/api/posts/');

		url.searchParams.set('auth_token', PRIVATE_CRYPTOPANIC_KEY);
		url.searchParams.set('metadata', 'true');

		if (filter !== 'all') {
			url.searchParams.set('filter', filter);
		}

		if (kind !== 'all') {
			url.searchParams.set('kind', kind);
		}

		url.searchParams.set('page', page.toString());

		const res = await fetch(url);

		if (!res.ok) {
			console.error(await res.text());
			throw new Error('Failed to fetch news from CryptoPanic');
		}

		return await res.json();
	}
}
