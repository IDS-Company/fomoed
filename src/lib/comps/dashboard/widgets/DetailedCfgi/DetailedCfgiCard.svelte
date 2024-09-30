<script lang="ts">
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import DurationSwitcher from '$lib/comps/DurationSwitcher.svelte';
	import HomepageBigChart from '$lib/comps/HomepageBigChart.svelte';
	import GetFreeTrialOverlay from '$lib/comps/overlays/GetFreeTrialOverlay.svelte';
	import { coinstats_selected_coin } from '$lib/stores';

	export let hideCard = false;

	let showSubRequired = false;
</script>

<DashboardCard disablePadding {hideCard}>
	{#if showSubRequired}
		<div class="absolute inset-px">
			<GetFreeTrialOverlay />
		</div>
	{/if}

	<div
		class="w-full h-full flex flex-col overflow-hidden -desktop:px-4 -desktop:py-5 desktop:px-[30px] desktop:py-[22px]"
	>
		<div class="desktop:flex items-center w-full">
			<div>
				<div class="text-[20px] font-paralucent-heavy uppercase -desktop:text-sm">
					{$coinstats_selected_coin?.name || 'Bitcoin'}
				</div>

				<div class="text-[#FFFFFFCC] text-lg font-paralucent font-medium -desktop:text-xs">
					Crypto Fear and Greed Chart
				</div>
			</div>

			<div class="flex-grow"></div>

			<div class="-desktop:mt-4">
				<DurationSwitcher on:show-subscription-required={() => (showSubRequired = true)}
				></DurationSwitcher>
			</div>
		</div>

		<div class="pt-[70px] flex-grow">
			<HomepageBigChart></HomepageBigChart>
		</div>
	</div>
</DashboardCard>
