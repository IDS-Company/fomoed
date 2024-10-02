<script lang="ts">
	import Autocomplete from '$lib/comps/Autocomplete.svelte';
	import DropdownNew from '$lib/comps/DropdownNew.svelte';
	import { onMount, tick } from 'svelte';
	import {
		humanizeNumber,
		supportedExchangePairsToOptions,
		type InstrumentInfo
	} from '$ts/utils/client';
	import IconRefresh from '$lib/icons/IconRefresh.svelte';
	import IconButton from '$lib/comps/buttons/IconButton.svelte';
	import { getCacheOrFetchSupportedExchangePairs } from '$ts/utils/client/api';
	import { writable } from 'svelte/store';
	import LiqHeatmapChart from './LiqHeatmapChart.svelte';
	import Legend from '$lib/comps/charts/Legend.svelte';
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import PlusRequiredOverlay from '$lib/comps/overlays/PlusRequiredOverlay.svelte';
	import { ClientSubscriptionManager } from '$ts/utils/client/plans';
	import { coinstats_selected_coin } from '$lib/stores';
	import InCardChartContainer from '$lib/comps/InCardChartContainer.svelte';
	import DashboardCardTitle from '$lib/comps/DashboardCardTitle.svelte';
	import DashboardCardHeader from '$lib/comps/DashboardCardHeader.svelte';

	export let hideCard = false;

	const enablePlusFeatures = ClientSubscriptionManager.enableProFeatures;

	type Option = { label: string; value: string };

	const timeframeOptions: Option[] = [
		{ label: '12 hours', value: '12h' },
		{ label: '24 hours', value: '24h' },
		{ label: '3 days', value: '3d' },
		{ label: '1 week', value: '7d' },
		{ label: '1 month', value: '30d' },
		{ label: '3 months', value: '90d' },
		{ label: '6 months', value: '180d' },
		{ label: '1 year', value: '1y' }
	];

	let selectedTimeframe: Option = timeframeOptions[0];

	type ExchangeOption = { label: string; value: InstrumentInfo };

	let exchangeOptions: ExchangeOption[] = [];
	let selectedExchangeOption = writable<ExchangeOption | null>();

	async function loadExchangeOptions() {
		const suppExchangePairs = await getCacheOrFetchSupportedExchangePairs();
		const options = supportedExchangePairsToOptions(suppExchangePairs);

		// Filter by selected coin
		const symbol = $coinstats_selected_coin?.symbol || 'BTC';
		const filtered = options.filter((o) => o.value.baseAsset === symbol);

		exchangeOptions = filtered;
		selectedExchangeOption.set(filtered[0]);
		pairSearchTerm.set(filtered[0].label);
	}

	let refreshData: () => any;
	let maxLiqValue: number;
	let loading: boolean;

	const pairSearchTerm = writable($selectedExchangeOption?.label || '');

	onMount(async () => {
		selectedExchangeOption.subscribe(async (val) => {
			console.log(val?.value);
			await tick();
			refreshData?.();
		});
	});

	coinstats_selected_coin.subscribe(() => {
		loadExchangeOptions();
	});

	$: title =
		($selectedExchangeOption?.value.baseAsset || $coinstats_selected_coin.symbol) +
		'/' +
		($selectedExchangeOption?.value.quoteAsset || 'USDT');
</script>

<div class="h-full w-full overflow-hidden">
	<DashboardCard isChartCard {hideCard}>
		{#if !$enablePlusFeatures}
			<div class="absolute inset-px">
				<PlusRequiredOverlay />
			</div>
		{/if}

		<div class="flex flex-col w-full h-full">
			<DashboardCardHeader>
				<DashboardCardTitle {title} subtitle="Liquidation Heatmap"></DashboardCardTitle>

				<div class="col-span-2 -desktop:order-3 flex gap-x-2">
					<div class="desktop:w-56 z-10 -desktop:w-32 h-14 -desktop:order-3 -desktop:flex-grow">
						{#if $selectedExchangeOption}
							<Autocomplete
								options={exchangeOptions}
								bind:inputValue={$pairSearchTerm}
								bind:selected={$selectedExchangeOption}
							/>
						{/if}
					</div>

					<div class="w-32 z-10 h-14 -desktop:order-4">
						<DropdownNew
							options={timeframeOptions}
							bind:selected={selectedTimeframe}
							on:change={async () => {
								await tick();
								refreshData();
							}}
						/>
					</div>
				</div>

				<div class="-desktop:order-2 place-self-end">
					<IconButton disabled={loading} on:click={refreshData}>
						<div class:animate-reverse-spin={loading}>
							<IconRefresh />
						</div>
					</IconButton>
				</div>
			</DashboardCardHeader>

			<div class="px-[30px] -desktop:px-4 pb-3 pt-3 desktop:pl-32">
				<Legend
					legends={[
						{ color: '#440253', label: 'Liquidation Leverage' },
						{ color: '#0DCB81', label: 'Supercharts' }
					]}
				></Legend>
			</div>

			<div class="flex-grow gap-x-4">
				<InCardChartContainer {loading}>
					<div class="flex gap-x-4 h-full px-[30px]">
						<div
							class="w-[40px] flex flex-col items-center text-[#FFFFFF66] font-paralucent font-medium text-xs gap-y-[5px]"
						>
							<div class="whitespace-nowrap">{humanizeNumber(maxLiqValue)}</div>

							<div
								class="rounded-[10px] flex-grow w-full"
								style="background: linear-gradient(180deg, #E7E60B 0%, #63C752 22.5%, #27A77D 47%, #2F5C86 75%, #44095F 100%);"
							></div>

							<div>0</div>
						</div>

						<div class="flex-grow h-full">
							{#if $enablePlusFeatures && $selectedExchangeOption}
								<LiqHeatmapChart
									bind:refreshData
									bind:maxLiqValue
									bind:loading
									timeframe={selectedTimeframe.value}
									exchange={$selectedExchangeOption.value.exchange}
									symbol={$selectedExchangeOption.value.instrumentId}
								/>
							{/if}
						</div>
					</div>
				</InCardChartContainer>
			</div>
		</div>
	</DashboardCard>
</div>
