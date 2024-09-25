<script lang="ts">
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import DurationSwitcher from '$lib/comps/DurationSwitcher.svelte';
	import Legend from '$lib/comps/charts/Legend.svelte';
	import GetFreeTrialOverlay from '$lib/comps/overlays/GetFreeTrialOverlay.svelte';
	import PlusRequiredOverlay from '$lib/comps/overlays/PlusRequiredOverlay.svelte';
	import { enablePlusFeatures } from '$lib/stores/subs';
	import { auth_user } from '$lib/stores/user';

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
</script>

<div class="h-full w-full overflow-hidden">
	<DashboardCard disablePadding>
		{#if !$enablePlusFeatures}
			<div class="absolute inset-px">
				<PlusRequiredOverlay />
			</div>
		{/if}

		<div class="flex flex-col h-full py-[22px] w-full">
			<div
				class="flex items-center w-full -desktop:flex-col -desktop:items-start px-[30px] -desktop:px-4"
			>
				<div
					class="flex-grow font-paralucent-demibold font-light text-[20px] h-full z-50"
					class:brightness-50={!$enablePlusFeatures}
				>
					Crypto Fear & Greed Index Over Time
				</div>

				<div class="-desktop:mt-2">
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

			<div class="flex-grow mt-4 desktop:px-[30px]">
				<SimpleCfgiChart daysBack={selectedDuration.value} />
			</div>
		</div>
	</DashboardCard>
</div>
