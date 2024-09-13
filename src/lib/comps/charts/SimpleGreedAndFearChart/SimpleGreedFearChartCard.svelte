<script lang="ts">
	import DashboardCard from '../../DashboardCard.svelte';
	import DurationSwitcher from '../../DurationSwitcher.svelte';
	import Legend from '../Legend.svelte';
	import SimpleFeedAndGreedChart from './SimpleFeedAndGreedChart.svelte';

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

<div class="h-[600px]">
	<DashboardCard>
		<div class="flex flex-col w-full h-full">
			<div class="flex items-center w-full">
				<div class="flex-grow font-paralucent-demibold font-light text-[20px]">
					Crypto Fear & Greed Index Over Time
				</div>

				<DurationSwitcher
					autoFetchTokenData={false}
					bind:selected={selectedDuration}
					options={durationOptions}
				></DurationSwitcher>
			</div>

			<div class="flex-grow-0 mt-4">
				<Legend legends={[{ color: '#399F57', label: 'Crypto Fear & Greed Index' }]}></Legend>
			</div>

			<div class="flex-grow mt-4">
				<SimpleFeedAndGreedChart daysBack={selectedDuration.value} />
			</div>
		</div>
	</DashboardCard>
</div>
