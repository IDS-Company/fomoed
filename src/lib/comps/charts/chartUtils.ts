import type { ICoinCfgiPriceData } from '$lib';
import { coinstats_selected_coin } from '$lib/stores';
import { get } from 'svelte/store';

export async function fetchCfgi(daysBack: number) {
	const _selectedCoin = get(coinstats_selected_coin);

	const data = await fetch(`/api/cfgi`, {
		method: 'POST',
		body: JSON.stringify({
			token_symbol: _selectedCoin.symbol,
			token_name: _selectedCoin.name,
			token_slug: _selectedCoin.slug,
			days_back: daysBack
		})
	})
		.then((res) => res.json())
		.then((res) => res.data as ICoinCfgiPriceData[])
		.catch((err) => {
			console.error(err);

			return [];
		});

	return data;
}
