<script lang="ts">
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import DashboardCardTitle from '$lib/comps/DashboardCardTitle.svelte';
	import DurationSwitcher from '$lib/comps/DurationSwitcher.svelte';
	import HomepageBigChart from '$lib/comps/HomepageBigChart.svelte';
	import InCardChartContainer from '$lib/comps/InCardChartContainer.svelte';
	import GetFreeTrialOverlay from '$lib/comps/overlays/GetFreeTrialOverlay.svelte';
	import { coinstats_selected_coin } from '$lib/stores';

	export let hideCard = false;

	let showSubRequired = false;
</script>

<DashboardCard isChartCard {hideCard}>
	{#if showSubRequired}
		<div class="absolute inset-px">
			<GetFreeTrialOverlay />
		</div>
	{/if}

	<div class="w-full h-full flex flex-col overflow-hidden -desktop:px-4 desktop:px-[30px]">
		<div class="desktop:flex items-center w-full">
			<DashboardCardTitle
				title={$coinstats_selected_coin?.name || 'Bitcoin'}
				subtitle="Crypto Fear and Greed Chart"
			></DashboardCardTitle>

			<div class="flex-grow"></div>

			<div class="-desktop:mt-3">
				<DurationSwitcher on:show-subscription-required={() => (showSubRequired = true)}
				></DurationSwitcher>
			</div>
		</div>

		<div class="pt-4 flex-grow">
			<InCardChartContainer>
				<HomepageBigChart></HomepageBigChart>
			</InCardChartContainer>
		</div>
	</div>
</DashboardCard>
