<script lang="ts">
	import {
		fetchLiqMapDataMerged,
		getSupportedExchangeLiqMapBaseAssets
	} from '$lib/comps/charts/chartUtils';
	import Legend from '$lib/comps/charts/Legend.svelte';
	import BaseLiqMapCard from '../_BaseLiqMapCard/BaseLiqMapCard.svelte';
</script>

<BaseLiqMapCard
	getTitle={(s) => `${s.value} Exchange Liquidation Map`}
	getInstrumentOptions={getSupportedExchangeLiqMapBaseAssets}
	fetchLiqMapData={(timeframe, selAssetOption) =>
		fetchLiqMapDataMerged(timeframe, selAssetOption.value)}
	defaultAssetOption={{ label: 'BTC', value: 'BTC' }}
>
	<Legend
		slot="legend"
		legends={[
			{ color: '#21AA94', label: 'Cumulative Short Liquidation Leverage' },
			{ color: '#F23645', label: 'Cumulative Long Liquidation Leverage' },
			{ color: '#FF8300', label: 'Binance' },
			{ color: '#FFC403', label: 'OKX' },
			{ color: '#73D8DA', label: 'Bybit' }
		]}
	></Legend>
</BaseLiqMapCard>
