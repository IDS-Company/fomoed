import type { ICoinCfgiPriceData } from '$lib';
import { coinstats_selected_coin } from '$lib/stores';
import { searchPairInSupportedExchanges, type InstrumentInfo } from '$ts/utils/client';
import {
	cgSupportedExchangeLiqMapBaseAssets,
	getCacheOrFetchSupportedExchangePairs
} from '$ts/utils/client/api';
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

type FetchLiqMapDataInstrument = {
	exchange: string;
	instrumentId: string;
	baseAsset: string;
	quoteAsset: string;
};

export async function fetchLiqMapData(
	timeframe: string,
	instruments: FetchLiqMapDataInstrument[]
): Promise<LiqMapData> {
	const combinedLiqData: Record<number, [number, number, number, null][]> = {};
	let currentPrice = null;

	console.log({ instruments });

	for (const instrument of instruments) {
		const res = await fetch(
			`/api/liq-map?timeframe=${timeframe}&exchange=${instrument.exchange}&instrumentId=${instrument.instrumentId}&baseAsset=${instrument.baseAsset}&quoteAsset=${instrument.quoteAsset}`
		);
		const data_ = await res.json();

		const liquidationData = data_.data.liquidationData.data.data;

		for (const [price, arrays] of Object.entries(liquidationData)) {
			const price_ = parseInt(price);

			if (combinedLiqData[price_]) {
				combinedLiqData[price_].push(...(arrays as any));
			} else {
				combinedLiqData[price_] = arrays as any;
			}
		}

		// Use current price of base asset from the first exchange
		if (currentPrice === null) {
			// Current price is indeed 'price' and not 'indexPrice'
			currentPrice = data_.data.pairMarketData.price;
		}
	}

	// Add empty data for missing prices
	const prices = Object.keys(combinedLiqData).map((i) => parseInt(i));
	const minPrice = Math.min(...prices);
	const maxPrice = Math.max(...prices);

	const sparseLiqBars = [];

	// Extract liquidation bars
	for (const [price, arrays] of Object.entries(combinedLiqData)) {
		for (const point of arrays as any) {
			const [price_, liqLevel, levRatio, null_] = point;
			const liqBar: LiquidationBar = { price: price_, liqLevel, levRatio };

			sparseLiqBars.push(liqBar);
		}
	}

	// Sort the liqBars, important
	sparseLiqBars.sort((a, b) => a.price - b.price);

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

	// Extract long cumulative liquidation leverage
	// [price, leverageValue]
	const cumulativeLongLiqLeverage: { x: number; y: number }[] = [];
	const cumulativeShortLiqLeverage: { x: number; y: number }[] = [];
	const lastCurrPriceIdx = liqBars.findLastIndex((i) => i.price < currentPrice) + 1;

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

export async function fetchLiqMapDataMerged(timeframe: string, baseAsset: string) {
	const instruments: FetchLiqMapDataInstrument[] = [
		// ['Binance', baseAsset + 'USD_PERP']
		// ['OKX', baseAsset + '-USD-SWAP']
		['Bybit', baseAsset + 'PERP']
	].map((i) => ({ exchange: i[0], instrumentId: i[1], baseAsset, quoteAsset: 'USD' }));

	return await fetchLiqMapData(timeframe, instruments);
}

export async function getSupportedLiqMapInstrumentOptions(
	searchTerm: string | null
): Promise<{ label: string; value: InstrumentInfo }[]> {
	const data = await getCacheOrFetchSupportedExchangePairs();

	searchTerm = searchTerm || 'BTC/USDT';

	return searchPairInSupportedExchanges(data, searchTerm);
}

export async function getSupportedExchangeLiqMapBaseAssets(
	searchTerm: string | null
): Promise<{ label: string; value: string }[]> {
	// Make sure supported futures are loaded
	await getCacheOrFetchSupportedExchangePairs();

	searchTerm = searchTerm || 'BTC';

	const cgSupported = get(cgSupportedExchangeLiqMapBaseAssets);
	const filtered = cgSupported.filter((i) =>
		i.toLocaleLowerCase().includes(searchTerm.toLowerCase())
	);
	const options = filtered.map((i) => ({ label: i, value: i }));

	return options;
}
