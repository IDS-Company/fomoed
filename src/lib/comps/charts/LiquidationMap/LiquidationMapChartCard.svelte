<script lang="ts">
	import Autocomplete from '$lib/comps/Autocomplete.svelte';
	import DropdownNew from '$lib/comps/DropdownNew.svelte';
	import { onMount, tick } from 'svelte';
	import DashboardCard from '../../DashboardCard.svelte';
	import LiquidationMapChart from './LiquidationMapChart.svelte';
	import IconRefresh from '$lib/icons/IconRefresh.svelte';
	import IconButton from '$lib/comps/buttons/IconButton.svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import type { LiqMapData } from '../chartUtils';

	type TAssetOptionVal = $$Generic;
	type TAssetOption = { label: string; value: TAssetOptionVal };

	export let getTitle: (selExchangeOption: Option) => string;
	export let getInstrumentOptions: (searchTerm: string) => Promise<TAssetOption[]>;
	export let defaultAssetOption: TAssetOption;
	export let fetchLiqMapData: (timeframe: string, selAssetOption: Option) => Promise<LiqMapData>;

	type Option = { label: string; value: any };

	const timeframeOptions: Option[] = [
		{ label: '1 day', value: '1d' },
		{ label: '7 days', value: '7d' }
	];

	let selectedTimeframe: Option = timeframeOptions[0];

	let assetOptions: Option[] = [];
	let selAssetOption = writable<TAssetOption>(defaultAssetOption);

	let refreshData: () => any;
	let isLoading: boolean;
	let currentPrice: number;

	const pairSearchTerm = writable($selAssetOption.label);

	pairSearchTerm.subscribe(async (val) => {
		if (!browser) {
			return;
		}

		assetOptions = await getInstrumentOptions(val);
	});

	async function safeRefreshData() {
		isLoading = true;

		await tick();

		try {
			await refreshData();
		} catch (ex) {
			console.error(ex);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		// Automatically load data on mount
		selAssetOption.subscribe(async (val) => {
			safeRefreshData();
		});
	});
</script>

<div class="h-[600px] overflow-hidden">
	<DashboardCard disablePadding>
		<div class="flex flex-col w-full h-full py-[22px] px-3">
			<div
				class="flex items-center w-full -desktop:flex-col -desktop:items-start px-[30px] -desktop:px-4"
			>
				<div class="flex-grow font-paralucent-demibold font-light text-[20px]">
					{getTitle($selAssetOption)}
				</div>

				<div class="-desktop:mt-2 flex gap-x-2">
					<div class="w-40 z-10">
						<Autocomplete
							options={assetOptions}
							bind:inputValue={$pairSearchTerm}
							bind:selected={$selAssetOption}
						/>
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
					<slot name="legend" />
				</div>

				<div class="text-sm text-center pt-1">
					Current Price: {currentPrice}
				</div>

				<div class="flex-grow desktop:px-[30px]">
					<LiquidationMapChart
						{isLoading}
						bind:refreshData
						bind:currentPrice
						fetchLiqMapData={() => fetchLiqMapData(selectedTimeframe.value, $selAssetOption)}
					/>
				</div>
			</div>
		</div>
	</DashboardCard>
</div>
