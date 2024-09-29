<script lang="ts">
	import Autocomplete from '$lib/comps/Autocomplete.svelte';
	import DropdownNew from '$lib/comps/DropdownNew.svelte';
	import { onMount, tick } from 'svelte';
	import {
		defaultSelectedInstrument,
		humanizeNumber,
		searchPairInSupportedExchanges,
		type InstrumentInfo
	} from '$ts/utils/client';
	import IconRefresh from '$lib/icons/IconRefresh.svelte';
	import IconButton from '$lib/comps/buttons/IconButton.svelte';
	import { getCacheOrFetchSupportedExchangePairs } from '$ts/utils/client/api';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import LiqHeatmapChart from './LiqHeatmapChart.svelte';
	import Legend from '$lib/comps/charts/Legend.svelte';
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import PlusRequiredOverlay from '$lib/comps/overlays/PlusRequiredOverlay.svelte';
	import { ClientSubscriptionManager } from '$ts/utils/client/plans';

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
	let selectedExchangeOption = writable<ExchangeOption>({
		label: 'Binance BTC/USDT',
		value: defaultSelectedInstrument
	});

	async function loadExchangeOptions(searchTerm: string | null) {
		const data = await getCacheOrFetchSupportedExchangePairs();

		searchTerm = searchTerm || 'BTC/USDT';

		exchangeOptions = searchPairInSupportedExchanges(data, searchTerm);

		console.log(exchangeOptions);
	}

	let refreshData: () => any;
	let maxLiqValue: number;
	let isLoading: boolean;

	const pairSearchTerm = writable($selectedExchangeOption.label);

	pairSearchTerm.subscribe((val) => {
		if (!browser) {
			return;
		}

		loadExchangeOptions(val);
	});

	onMount(() => {
		selectedExchangeOption.subscribe(async (val) => {
			await tick();
			refreshData?.();
		});
	});

	$: title =
		$selectedExchangeOption.value.exchange +
		' ' +
		$selectedExchangeOption.value.baseAsset +
		'/' +
		$selectedExchangeOption.value.quoteAsset +
		' ' +
		'Liquidation Heatmap';
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
					{title}
				</div>

				<div class="-desktop:mt-2 flex gap-x-2">
					<div class="w-40 z-10">
						<Autocomplete
							options={exchangeOptions}
							bind:inputValue={$pairSearchTerm}
							bind:selected={$selectedExchangeOption}
						/>
					</div>

					<div class="w-32 z-10">
						<DropdownNew
							options={timeframeOptions}
							bind:selected={selectedTimeframe}
							on:change={async () => {
								await tick();
								refreshData();
							}}
						/>
					</div>

					<div class="mr-4">
						<IconButton disabled={isLoading} on:click={refreshData}>
							<div class:animate-reverse-spin={isLoading}>
								<IconRefresh />
							</div>
						</IconButton>
					</div>
				</div>
			</div>

			<div class="flex flex-grow gap-x-4 px-4 mt-4">
				<!-- Scale -->
				<div
					class="pt-10 w-[40px] flex flex-col items-center text-[#FFFFFF66] font-paralucent font-medium text-xs gap-y-[5px]"
				>
					<div class="whitespace-nowrap">{humanizeNumber(maxLiqValue)}</div>

					<div
						class="rounded-[10px] flex-grow w-full"
						style="background: linear-gradient(180deg, #E7E60B 0%, #63C752 22.5%, #27A77D 47%, #2F5C86 75%, #44095F 100%);"
					></div>

					<div>0</div>
				</div>

				<!-- Legend and Chart -->
				<div class="flex-grow h-full flex flex-col">
					<div class="flex-grow-0 mt-4 -desktop:mt-6 px-[30px] -desktop:px-4">
						<Legend
							legends={[
								{ color: '#440253', label: 'Liquidation Leverage' },
								{ color: '#0DCB81', label: 'Supercharts' }
							]}
						></Legend>
					</div>

					<div class="flex-grow mt-4 desktop:px-[30px]">
						{#if $enablePlusFeatures}
							<LiqHeatmapChart
								bind:refreshData
								bind:maxLiqValue
								bind:isLoading
								timeframe={selectedTimeframe.value}
								exchange={$selectedExchangeOption.value.exchange}
								symbol={$selectedExchangeOption.value.symbol}
							/>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</DashboardCard>
</div>
