<script lang="ts">
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import DashboardCardTitle from '$lib/comps/DashboardCardTitle.svelte';
	import DurationSwitcher from '$lib/comps/DurationSwitcher.svelte';
	import InCardChartContainer from '$lib/comps/InCardChartContainer.svelte';
	import Legend from '$lib/comps/charts/Legend.svelte';
	import PlusRequiredOverlay from '$lib/comps/overlays/PlusRequiredOverlay.svelte';
	import { coinstats_selected_coin } from '$lib/stores';
	import { ClientSubscriptionManager } from '$ts/utils/client/plans';

	export let hideCard = false;

	const enablePlusFeatures = ClientSubscriptionManager.enableProFeatures;

	import SimpleCfgiChart from './SimpleCfgiChart.svelte';

	type Option = { label: string; value: number };

	const durationOptions: Option[] = [
		{ label: '7D', value: 7 },
		{ label: '1M', value: 30 },
		{ label: '3M', value: 90 },
		{ label: '1Y', value: 365 },
		{ label: 'Max', value: 9999 }
	];

	let selectedDuration: Option = durationOptions[0];
	let loading: boolean;
</script>

<div class="h-full w-full overflow-hidden">
	<DashboardCard isChartCard {hideCard}>
		{#if !$enablePlusFeatures}
			<div class="absolute inset-px">
				<PlusRequiredOverlay />
			</div>
		{/if}

		<div class="flex flex-col h-full w-full">
			<div
				class="flex items-center w-full -desktop:flex-col -desktop:items-start px-[30px] -desktop:px-4"
			>
				<DashboardCardTitle
					title={$coinstats_selected_coin?.name || 'Bitcoin'}
					subtitle="Simplified Crypto Fear and Greed Chart"
				></DashboardCardTitle>

				<div class="-desktop:mt-3 -desktop:w-full">
					<DurationSwitcher
						autoFetchTokenData={false}
						bind:selected={selectedDuration}
						options={durationOptions}
					></DurationSwitcher>
				</div>
			</div>

			<div class="flex-grow-0 mt-4 -desktop:mt-6 px-[30px] -desktop:px-4">
				<Legend legends={[{ color: '#399F57', label: 'Crypto Fear & Greed Index' }]}></Legend>
			</div>

			<div class="flex-grow desktop:px-[30px]">
				<InCardChartContainer {loading}>
					<SimpleCfgiChart bind:loading daysBack={selectedDuration.value} />
				</InCardChartContainer>
			</div>
		</div>
	</DashboardCard>
</div>
