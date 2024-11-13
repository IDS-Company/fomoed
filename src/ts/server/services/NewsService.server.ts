import { PRIVATE_CRYPTOPANIC_KEY } from '$env/static/private';

export class NewsService {
	async getFromCryptoPanic() {
		const url = `https://cryptopanic.com/api/posts/?auth_token=${PRIVATE_CRYPTOPANIC_KEY}`;
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error('Failed to fetch news from CryptoPanic');
		}

		return await res.json();
	}
}
