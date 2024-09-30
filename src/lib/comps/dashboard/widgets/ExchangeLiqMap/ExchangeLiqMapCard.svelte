<script lang="ts">
	import { coinstats_selected_coin } from '$lib/stores';
	import { ClientSubscriptionManager } from '$ts/utils/client/plans';
	import PlusRequiredOverlay from '$lib/comps/overlays/PlusRequiredOverlay.svelte';
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import DropdownNew from '$lib/comps/DropdownNew.svelte';
	import { tick } from 'svelte';
	import IconRefresh from '$lib/icons/IconRefresh.svelte';
	import IconButton from '$lib/comps/buttons/IconButton.svelte';
	import Legend from '$lib/comps/charts/Legend.svelte';
	import BaseLiqMapChart from '../_BaseLiqMapCard/BaseLiqMapChart.svelte';
	import { fetchLiqMapDataMerged } from '$lib/comps/charts/chartUtils';

	const enablePlusFeatures = ClientSubscriptionManager.enableProFeatures;

	type Option = { label: string; value: any };

	const timeframeOptions: Option[] = [
		{ label: '1 day', value: '1d' },
		{ label: '7 days', value: '7d' }
	];

	let selectedTimeframe: Option = timeframeOptions[0];

	let refreshData: () => any;
	let isLoading: boolean;
	let currentPrice: number;

	async function safeRefreshData() {
		isLoading = true;

		await tick();

		try {
			await refreshData?.();
		} catch (ex) {
			console.error(ex);
		} finally {
			isLoading = false;
		}
	}

	coinstats_selected_coin.subscribe(() => {
		safeRefreshData();
	});
</script>

<div class="h-full overflow-hidden">
	<DashboardCard disablePadding>
		{#if !$enablePlusFeatures}
			<div class="absolute inset-px">
				<PlusRequiredOverlay />
			</div>
		{/if}

		<div class="flex flex-col w-full h-full py-[22px] px-3">
			<div
				class="flex items-center w-full -desktop:flex-col -desktop:items-start px-[30px] -desktop:px-4"
			>
				<div
					class="flex-grow font-paralucent-demibold font-light text-[20px] z-50"
					class:brightness-50={!$enablePlusFeatures}
				>
					{$coinstats_selected_coin.symbol} Exchange Liquidation Map
				</div>

				<div class="-desktop:mt-2 flex gap-x-2">
					<div class="w-32 z-10">
						<DropdownNew
							options={timeframeOptions}
							bind:selected={selectedTimeframe}
							on:change={async () => {
								safeRefreshData();
							}}
						/>
					</div>

					<div class="mr-4">
						<IconButton disabled={isLoading} on:click={safeRefreshData}>
							<div class:animate-reverse-spin={isLoading}>
								<IconRefresh />
							</div>
						</IconButton>
					</div>
				</div>
			</div>

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

				<div class="text-sm text-center pt-1">
					Current Price: {currentPrice}
				</div>

				{#if $enablePlusFeatures}
					<div class="flex-grow desktop:px-[30px]">
						<BaseLiqMapChart
							{isLoading}
							bind:refreshData
							bind:currentPrice
							fetchLiqMapData={() =>
								fetchLiqMapDataMerged(selectedTimeframe.value, $coinstats_selected_coin.symbol)}
						/>
					</div>
				{/if}
			</div>
		</div>
	</DashboardCard>
</div>
