<script lang="ts">
	import Autocomplete from '$lib/comps/Autocomplete.svelte';
	import DropdownNew from '$lib/comps/DropdownNew.svelte';
	import { onMount, tick } from 'svelte';
	import DashboardCard from '../../DashboardCard.svelte';
	import Legend from '../Legend.svelte';
	import LiquidationMapChart from './LiquidationMapChart.svelte';
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

	type Option = { label: string; value: string };

	const timeframeOptions: Option[] = [
		{ label: '1 day', value: '1d' },
		{ label: '7 days', value: '7d' }
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
	}

	let refreshData: () => any;
	let isLoading: boolean;
	let currentPrice: number;

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
			refreshData();
		});
	});

	$: title =
		$selectedExchangeOption.value.exchange +
		' ' +
		$selectedExchangeOption.value.baseAsset +
		'/' +
		$selectedExchangeOption.value.quoteAsset +
		' ' +
		'Liquidation Map';
</script>

<div class="h-[600px] overflow-hidden">
	<DashboardCard disablePadding>
		<div class="flex flex-col w-full h-full py-[22px] px-3">
			<div
				class="flex items-center w-full -desktop:flex-col -desktop:items-start px-[30px] -desktop:px-4"
			>
				<div class="flex-grow font-paralucent-demibold font-light text-[20px]">
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

			<!-- Legend and Chart -->
			<div class="flex-grow h-full flex flex-col">
				<div class="flex-grow-0 mt-4 -desktop:mt-6 px-[30px] -desktop:px-4">
					<Legend
						legends={[
							{ color: '#21AA94', label: 'Cumulative Short Liquidation Leverage' },
							{ color: '#F23645', label: 'Cumulative Long Liquidation Leverage' },
							{ color: '#FF8300', label: '100x Leverage' },
							{ color: '#FFC403', label: '50x Leverage' },
							{ color: '#73D8DA', label: '25x Leverage' },
							{ color: '#6EC2F0', label: '10x Leverage' }
						]}
					></Legend>
				</div>

				<div class="text-sm text-center pt-1">
					Current Price: {currentPrice}
				</div>

				<div class="flex-grow desktop:px-[30px]">
					<LiquidationMapChart
						bind:refreshData
						bind:isLoading
						bind:currentPrice
						timeframe={selectedTimeframe.value}
						exchange={$selectedExchangeOption.value.exchange}
						baseAsset={$selectedExchangeOption.value.baseAsset}
						quoteAsset={$selectedExchangeOption.value.quoteAsset}
					/>
				</div>
			</div>
		</div>
	</DashboardCard>
</div>
