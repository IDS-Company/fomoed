export function humanizeNumber(num: number) {
	if (num < 1000) {
		return num.toString(); // Less than 1000, return the number as it is
	} else if (num >= 1000 && num < 1000000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'; // Thousand (K)
	} else if (num >= 1000000 && num < 1000000000) {
		return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'; // Million (M)
	} else if (num >= 1000000000) {
		return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'; // Billion (B)
	}
}

type ForeignInstrument = {
	instrumentId: string;
	baseAsset: string;
	quoteAsset: string;
};

export type InstrumentInfo = ForeignInstrument & { exchange: string; symbol: string };
export const defaultSelectedInstrument: InstrumentInfo = {
	instrumentId: 'HARDCODED',
	baseAsset: 'BTC',
	quoteAsset: 'USDT',
	exchange: 'Binance',
	symbol: 'BTCUSDT'
};

export function searchPairInSupportedExchanges(
	supportedExchanges: Record<string, ForeignInstrument[]>,
	searchTerm: string
): { label: string; value: InstrumentInfo }[] {
	const labelToInstrument: { label: string; value: InstrumentInfo }[] = [];
	const addedLabels: string[] = [];

	for (const [exchangeName, instruments] of Object.entries(supportedExchanges)) {
		for (const instrument of instruments) {
			// if (!instrument.instrumentId.includes('_PERP')) {
			// 	continue;
			// }

			const label = exchangeName + ' ' + instrument.baseAsset + '/' + instrument.quoteAsset;

			if (addedLabels.includes(label)) {
				continue;
			}

			labelToInstrument.push({
				label,
				value: {
					...instrument,
					exchange: exchangeName,
					symbol: instrument.baseAsset + instrument.quoteAsset
				}
			});
			addedLabels.push(label);
		}
	}

	const filtered = labelToInstrument.filter((i) =>
		i.label.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return filtered;
}
