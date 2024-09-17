import { get, writable } from 'svelte/store';

async function fetchSupportedExchangePairs() {
	const res = await fetch('/api/supported-exchange-pairs');
	const data = await res.json();

	return data.data;
}

const cachedSupportedPairs = writable(null);

export async function getCacheOrFetchSupportedExchangePairs() {
	const cached = get(cachedSupportedPairs);

	if (cached) {
		return cached;
	}

	const fetched = await fetchSupportedExchangePairs();

	cachedSupportedPairs.set(fetched);

	return fetched;
}
