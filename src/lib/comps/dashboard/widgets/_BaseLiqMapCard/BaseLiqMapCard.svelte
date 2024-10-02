<script lang="ts">
	import { coinstats_selected_coin } from '$lib/stores';
	import { ClientSubscriptionManager } from '$ts/utils/client/plans';
	import PlusRequiredOverlay from '$lib/comps/overlays/PlusRequiredOverlay.svelte';
	import BaseLiqMapChart from './BaseLiqMapChart.svelte';
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import Autocomplete from '$lib/comps/Autocomplete.svelte';
	import DropdownNew from '$lib/comps/DropdownNew.svelte';
	import { onMount, tick } from 'svelte';
	import IconRefresh from '$lib/icons/IconRefresh.svelte';
	import IconButton from '$lib/comps/buttons/IconButton.svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import type { LiqMapData } from '$lib/comps/charts/chartUtils';
	import DashboardCardTitle from '$lib/comps/DashboardCardTitle.svelte';
	import DashboardCardHeader from '$lib/comps/DashboardCardHeader.svelte';
	import InCardChartContainer from '$lib/comps/InCardChartContainer.svelte';

	export let hideCard = false;

	const enablePlusFeatures = ClientSubscriptionManager.enableProFeatures;

	type TAssetOptionVal = $$Generic;
	type TAssetOption = { label: string; value: TAssetOptionVal };

	export let getTitle: (selExchangeOption: Option) => string;
	export let getInstrumentOptions: () => Promise<TAssetOption[]>;
	export let fetchLiqMapData: (
		timeframe: string,
		selAssetOption: Option
	) => Promise<LiqMapData | null>;

	type Option = { label: string; value: any };

	const timeframeOptions: Option[] = [
		{ label: '1 day', value: '1d' },
		{ label: '7 days', value: '7d' }
	];

	let selectedTimeframe: Option = timeframeOptions[0];

	let assetOptions: Option[] = [];
	let selAssetOption = writable<TAssetOption | null>(null);

	let refreshData: () => any;
	let loading: boolean;
	let currentPrice: number;

	const pairSearchTerm = writable($selAssetOption?.label || '');

	async function loadAssetOptions() {
		assetOptions = await getInstrumentOptions();
		selAssetOption.set(assetOptions[0]);
		pairSearchTerm.set(assetOptions[0].label);
	}

	coinstats_selected_coin.subscribe(() => {
		browser && loadAssetOptions();
	});

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

	onMount(() => {
		// Automatically load data on mount
		selAssetOption.subscribe(async (val) => {
			safeRefreshData();
		});
	});
</script>

<div class="h-full overflow-hidden">
	<DashboardCard isChartCard {hideCard}>
		{#if !$enablePlusFeatures}
			<div class="absolute inset-px">
				<PlusRequiredOverlay />
			</div>
		{/if}

		<div class="flex flex-col w-full h-full">
			<DashboardCardHeader>
				<DashboardCardTitle
					title={($selAssetOption && getTitle($selAssetOption)) || ''}
					subtitle="Liquidation Map"
				/>

				<div class="col-span-2 -desktop:order-3 flex gap-x-2">
					<div class="w-40 z-10 -desktop:flex-grow desktop:w-56 h-14">
						{#if $selAssetOption}
							<Autocomplete
								options={assetOptions}
								bind:inputValue={$pairSearchTerm}
								bind:selected={$selAssetOption}
							/>
						{/if}
					</div>

					<div class="w-32 z-10">
						<DropdownNew
							options={timeframeOptions}
							bind:selected={selectedTimeframe}
							on:change={async () => {
								safeRefreshData();
							}}
						/>
					</div>
				</div>

				<div class="-desktop:order-2 place-self-end">
					<IconButton disabled={loading} on:click={safeRefreshData}>
						<div class:animate-reverse-spin={loading}>
							<IconRefresh />
						</div>
					</IconButton>
				</div>
			</DashboardCardHeader>

			<!-- Legend and Chart -->
			<div class="flex-grow h-full flex flex-col">
				<div class="flex-grow-0 mt-4 -desktop:mt-6 px-[30px] -desktop:px-4">
					<slot name="legend" />
				</div>

				<div class="text-sm text-center pt-1 -desktop:text-xs">
					Current Price: {currentPrice}
				</div>

				{#if $enablePlusFeatures}
					<InCardChartContainer {loading}>
						{#if $selAssetOption}
							<BaseLiqMapChart
								bind:refreshData
								bind:currentPrice
								fetchLiqMapData={() => fetchLiqMapData(selectedTimeframe.value, $selAssetOption)}
							/>
						{/if}
					</InCardChartContainer>
				{/if}
			</div>
		</div>
	</DashboardCard>
</div>
