import { PRIVATE_COINGLASS_KEY } from '$env/static/private';

export async function fetchCoinglassHeatmap(range: string, exchange: string, symbol: string) {
	const url = `https://open-api-v3.coinglass.com/api/futures/liquidation/heatmap?exchange=${exchange}&symbol=${symbol}&range=${range}`;
	const options = {
		method: 'GET',
		headers: { accept: 'application/json', 'CG-API-KEY': PRIVATE_COINGLASS_KEY }
	};

	const res = await fetch(url, options);
	const data = await res.json();

	return data;
}

export async function fetchCoinglassSupportedPairs() {
	const url = 'https://open-api-v3.coinglass.com/api/futures/supported-exchange-pairs';
	const options = {
		method: 'GET',
		headers: { accept: 'application/json', 'CG-API-KEY': PRIVATE_COINGLASS_KEY }
	};

	const res = await fetch(url, options);

	const data = await res.json();

	return data;
}
