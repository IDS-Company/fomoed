import type { ICoinCfgiPriceData } from '$lib';
import { coinstats_selected_coin } from '$lib/stores';
import { range } from 'lodash-es';
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

export async function fetchHeatmapData(timeframe: string, exchange: string, symbol: string) {
	const res = await fetch(
		`/api/liquidity-heatmap?timeframe=${timeframe}&exchange=${exchange}&symbol=${symbol}`
	);
	const data = await res.json();

	return data.data;
}

export type LiquidationBar = {
	price: number;
	liqLevel: number;
	levRatio: number;
};

export type CumulativeLeveragePoint = {
	x: number;
	y: number;
};

export type LiqMapData = {
	liqBars: LiquidationBar[];
	currentPrice: number;
	cumulativeLongLiqLeverage: CumulativeLeveragePoint[];
	cumulativeShortLiqLeverage: CumulativeLeveragePoint[];
	maxCumulativeValue: number;
	minPrice: number;
	maxPrice: number;
};

export async function fetchLiqMapData(
	timeframe: string,
	exchange: string,
	instrumentId: string,
	baseAsset: string,
	quoteAsset: string
): Promise<LiqMapData> {
	const res = await fetch(
		`/api/liq-map?timeframe=${timeframe}&exchange=${exchange}&instrumentId=${instrumentId}&baseAsset=${baseAsset}&quoteAsset=${quoteAsset}`
	);
	const data_ = await res.json();

	console.log({ data_ });

	const liquidationData = data_.data.liquidationData.data.data;
	const pairMarketData = data_.data.pairMarketData;

	// Add empty data for missing prices
	const prices = Object.keys(liquidationData).map((i) => parseInt(i));
	const minPrice = Math.min(...prices);
	const maxPrice = Math.max(...prices);

	const sparseLiqBars = [];

	// Extract liquidation bars
	for (const [price, arrays] of Object.entries(liquidationData)) {
		for (const point of arrays as any) {
			const [price_, liqLevel, levRatio, null_] = point;
			const liqBar: LiquidationBar = { price: price_, liqLevel, levRatio };

			sparseLiqBars.push(liqBar);
		}
	}

	// Add data for missing prices
	const liqBars: LiquidationBar[] = [];

	let liqBarsIdx = 0;

	for (const price of range(minPrice, maxPrice)) {
		let pushed = false;

		while (sparseLiqBars[liqBarsIdx].price === price) {
			liqBars.push(sparseLiqBars[liqBarsIdx]);
			liqBarsIdx++;
			pushed = true;
		}

		if (!pushed) {
			liqBars.push({ levRatio: 0, liqLevel: 0, price });
		}
	}

	// Current price is indeed price and not indexPrice
	const currentPrice = pairMarketData.price;

	// Extract long cumulative liquidation leverage
	// [price, leverageValue]
	const cumulativeLongLiqLeverage: { x: number; y: number }[] = [];
	const cumulativeShortLiqLeverage: { x: number; y: number }[] = [];
	const lastCurrPriceIdx = liqBars.findLastIndex((i) => i.price < currentPrice) + 1;

	console.log({ currentPrice });
	console.log(liqBars[lastCurrPriceIdx]);

	// Long
	let cumulativeLongLiqLeverageAcc = 0;

	for (const liqBar of liqBars.slice(lastCurrPriceIdx, -1)) {
		cumulativeLongLiqLeverageAcc += liqBar.liqLevel;
		cumulativeLongLiqLeverage.push({ x: liqBar.price, y: ~~cumulativeLongLiqLeverageAcc });
	}

	// Short
	let cumulativeShortLiqLeverageAcc = 0;

	for (const liqBar of liqBars.slice(0, lastCurrPriceIdx).toReversed()) {
		cumulativeShortLiqLeverageAcc += liqBar.liqLevel;
		cumulativeShortLiqLeverage.push({ x: liqBar.price, y: ~~cumulativeShortLiqLeverageAcc });
	}

	return {
		liqBars: liqBars,
		currentPrice,
		cumulativeLongLiqLeverage,
		cumulativeShortLiqLeverage,
		maxCumulativeValue: Math.max(cumulativeLongLiqLeverageAcc, cumulativeShortLiqLeverageAcc),
		minPrice,
		maxPrice
	};
}

// export async function fetchLiqMapDataMerged(timeframe: string, baseAsset: string) {

// }
