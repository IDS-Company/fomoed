import { PRIVATE_CRYPTOPANIC_KEY } from '$env/static/private';
import type { NewsFilterVal, NewsKindVal } from '$ts/types';

export class NewsService {
	async getFromCryptoPanic({
		filter = 'all',
		kind = 'all',
		currencies = null,
		page = 1
	}: {
		filter: NewsFilterVal;
		kind: NewsKindVal;
		currencies: string | null;
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

		if (currencies) {
			url.searchParams.set('currencies', currencies);
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
