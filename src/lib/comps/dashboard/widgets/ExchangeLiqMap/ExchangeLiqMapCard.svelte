<script lang="ts">
	import { coinstats_selected_coin } from '$lib/stores';
	import { ClientSubscriptionManager } from '$ts/utils/client/plans';
	import PlusRequiredOverlay from '$lib/comps/overlays/PlusRequiredOverlay.svelte';
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import DropdownNew from '$lib/comps/DropdownNew.svelte';
	import { getContext, tick } from 'svelte';
	import IconRefresh from '$lib/icons/IconRefresh.svelte';
	import IconButton from '$lib/comps/buttons/IconButton.svelte';
	import Legend from '$lib/comps/charts/Legend.svelte';
	import BaseLiqMapChart from '../_BaseLiqMapCard/BaseLiqMapChart.svelte';
	import { fetchLiqMapDataMerged } from '$lib/comps/charts/chartUtils';
	import DashboardCardTitle from '$lib/comps/DashboardCardTitle.svelte';
	import DashboardCardHeader from '$lib/comps/DashboardCardHeader.svelte';
	import InCardChartContainer from '$lib/comps/InCardChartContainer.svelte';
	import type { Chart } from 'chart.js';
	import type { Readable } from 'svelte/store';

	const isFullscreenCardStore: Readable<boolean> = getContext('isFullscreenCardStore');

	export let hideCard = false;
	export let chart: Chart;

	const enablePlusFeatures = ClientSubscriptionManager.enableProFeatures;

	type Option = { label: string; value: any };

	const timeframeOptions: Option[] = [
		{ label: '1 day', value: '1d' },
		{ label: '7 days', value: '7d' }
	];

	let selectedTimeframe: Option = timeframeOptions[0];

	let refreshData: () => any;
	let loading: boolean;
	let currentPrice: number;

	async function safeRefreshData() {
		loading = true;

		await tick();

		try {
			await refreshData?.();
		} catch (ex) {
			console.error(ex);
		} finally {
			loading = false;
		}
	}

	coinstats_selected_coin.subscribe(() => {
		safeRefreshData();
	});
</script>

<div class="h-full w-full overflow-hidden relative">
	<DashboardCard isChartCard {hideCard}>
		{#if !$enablePlusFeatures}
			<div class="absolute inset-px">
				<PlusRequiredOverlay />
			</div>
		{/if}

		<div class="flex flex-col w-full h-full max-w-full overflow-hidden">
			<DashboardCardHeader>
				<DashboardCardTitle
					title={$coinstats_selected_coin?.name.toUpperCase()}
					subtitle="Exchange Liquidation Map"
				/>

				<div class="-desktop:mt-2 flex gap-x-1 place-self-end">
					<div class="z-10">
						<DropdownNew
							options={timeframeOptions}
							bind:selected={selectedTimeframe}
							on:change={async () => {
								safeRefreshData();
							}}
						/>
					</div>

					<div class="-desktop:flex-grow"></div>

					<div class={$isFullscreenCardStore && 'pr-10'}>
						<IconButton disabled={loading} on:click={safeRefreshData}>
							<div class:animate-reverse-spin={loading}>
								<IconRefresh />
							</div>
						</IconButton>
					</div>
				</div>
			</DashboardCardHeader>

			<!-- Legend and Chart -->
			<div class="flex-grow h-full flex flex-col">
				<div class="flex-grow-0 mt-4 -desktop:mt-6 px-[30px] -desktop:px-4">
					<Legend
						legends={[
							{ color: '#21AA94', label: 'Cumulative Short Liquidation Leverage' },
							{ color: '#F23645', label: 'Cumulative Long Liquidation Leverage' },
							{ color: '#FF8300', label: 'Binance' },
							{ color: '#FFC403', label: 'OKX' },
							{ color: '#73D8DA', label: 'Bybit' }
						]}
					></Legend>
				</div>

				<!-- <div class="text-sm text-center pt-1 -desktop:text-xs">
					Current Price: {currentPrice}
				</div> -->

				{#if $enablePlusFeatures}
					<InCardChartContainer {loading}>
						<BaseLiqMapChart
							bind:chart
							bind:refreshData
							bind:currentPrice
							fetchLiqMapData={() =>
								fetchLiqMapDataMerged(selectedTimeframe.value, $coinstats_selected_coin.symbol)}
						/>
					</InCardChartContainer>
				{/if}
			</div>
		</div>
	</DashboardCard>
</div>
