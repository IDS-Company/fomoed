import {
	fetchAssetPriceUsd,
	fetchCoinglassLiqMap,
	fetchCoinglassSupportedPairs
} from '$ts/utils/server/coinglass';
import { type RequestEvent, error, json } from '@sveltejs/kit';
import { cachedExLiqData } from './cached';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals: { supabase, user } }: RequestEvent) {
	// if (!user) {
	// 	return error(401, { message: 'Unauthorized' });
	// }

	// if (!hasActiveSubscription(supabase, user.id)) {
	// 	return error(401, { message: 'Unauthorized' });
	// }

	const url = new URL(request.url);
	const timeframe = url.searchParams.get('timeframe');
	const asset = url.searchParams.get('asset');

	if (!timeframe) {
		return error(400, 'timeframe parameter must be specified!');
	}

	if (!asset) {
		return error(400, 'asset parameter must be specified!');
	}

	const currentPriceUsd = await fetchAssetPriceUsd(asset);

	return json({ success: true, data: { currentPriceUsd, exLiqData: cachedExLiqData } });

	const supportedFuturePairs: Record<string, { baseAsset: string; instrumentId: string }[]> = (
		await fetchCoinglassSupportedPairs()
	).data;

	if (!supportedFuturePairs) {
		return error(500);
	}

	const aggregatedExchanges = ['Binance', 'OKX', 'Bybit'];

	type ExName = string;
	type TotalExLiqMap = Record<number, number>;

	const totalExLiq: Record<ExName, TotalExLiqMap> = {};

	// Kep only Binance, OKX, Bybit
	for (const exchange of Object.keys(supportedFuturePairs)) {
		if (!aggregatedExchanges.includes(exchange)) {
			delete supportedFuturePairs[exchange];
		} else {
			totalExLiq[exchange] = {};
		}
	}

	// Keep only instruments with requested asset
	for (const [exchange, instruments] of Object.entries(supportedFuturePairs)) {
		supportedFuturePairs[exchange] = instruments.filter((i) => i.baseAsset === asset);
	}

	// console.log(supportedFuturePairs);

	type CgLiquidationMapData = Record<number, [number, number, number, null][]>;

	for (const [exchange, instruments] of Object.entries(supportedFuturePairs)) {
		for (const instrument of instruments) {
			// Probably error here
			console.log('Fetching instrument: ', exchange, instrument.instrumentId);

			const liquidationData: CgLiquidationMapData = (
				await fetchCoinglassLiqMap(timeframe, exchange, instrument.instrumentId)
			).data.data;

			for (const [price, liquidations] of Object.entries(liquidationData)) {
				const roundedPrice = parseInt(price);

				for (const liquidation of liquidations) {
					const liqLevel = liquidation[1];

					totalExLiq[exchange][roundedPrice] = (totalExLiq[exchange][roundedPrice] || 0) + liqLevel;
				}
			}
		}
	}

	return json({ success: true, data: totalExLiq });
}
