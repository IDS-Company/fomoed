import { PRIVATE_CRYPTOPANIC_KEY } from '$env/static/private';
import type { NewsFilterVal, NewsKindVal } from '$ts/types';

export class NewsService {
	async getFromCryptoPanic({
		filter = 'all',
		kind = 'all'
	}: {
		filter: NewsFilterVal;
		kind: NewsKindVal;
	}) {
		const url = new URL('https://cryptopanic.com/api/posts/');
		url.searchParams.set('auth_token', PRIVATE_CRYPTOPANIC_KEY);

		if (filter !== 'all') {
			url.searchParams.set('filter', filter);
		}

		if (kind !== 'all') {
			url.searchParams.set('kind', kind);
		}

		const res = await fetch(url);

		if (!res.ok) {
			throw new Error('Failed to fetch news from CryptoPanic');
		}

		return await res.json();
	}
}
