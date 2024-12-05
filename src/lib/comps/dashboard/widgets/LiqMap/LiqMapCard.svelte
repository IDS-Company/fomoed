<script lang="ts">
	import {
		fetchLiqMapData,
		getSupportedLiqMapInstrumentOptions
	} from '$lib/comps/charts/chartUtils';
	import Legend from '$lib/comps/charts/Legend.svelte';
	import { coinstats_selected_coin } from '$lib/stores';
	import type { Chart } from 'chart.js';
	import BaseLiqMapCard from '../_BaseLiqMapCard/BaseLiqMapCard.svelte';

	export let hideCard = false;
	export let chart: Chart;
</script>

<BaseLiqMapCard
	bind:chart
	{hideCard}
	getTitle={(s) =>
		`${s?.value.baseAsset || $coinstats_selected_coin?.symbol}/${s?.value.quoteAsset || 'USDT'}`}
	getInstrumentOptions={getSupportedLiqMapInstrumentOptions}
	fetchLiqMapData={(timeframe, selAssetOption) =>
		fetchLiqMapData(timeframe, [selAssetOption.value])}
>
	<Legend
		slot="legend"
		legends={[
			{ color: '#21AA94', label: 'Cumulative Short Liquidation Leverage' },
			{ color: '#F23645', label: 'Cumulative Long Liquidation Leverage' },
			{ color: '#FF8300', label: '100x Leverage' },
			{ color: '#FFC403', label: '50x Leverage' },
			{ color: '#73D8DA', label: '25x Leverage' },
			{ color: '#6EC2F0', label: '10x Leverage' }
		]}
	></Legend>
</BaseLiqMapCard>
