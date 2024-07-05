<script lang="ts">
	import { coinstats_global_data } from '$lib/stores';

	import HomepageSmallChart from './HomepageSmallChart.svelte';
	import ScrollerDots from './ScrollerDots.svelte';

	let container: HTMLElement;
</script>

<div class="relative">
	<div
		bind:this={container}
		class="-desktop:pl-16 grid grid-cols-3 pl-[50px] pr-[80px] gap-x-16 -desktop:grid-cols-1 -desktop:h-[100px] -desktop:overflow-scroll -desktop:snap-y -desktop:snap-mandatory no-scrollbar"
	>
		<HomepageSmallChart
			change={$coinstats_global_data?.marketCapChange}
			value={$coinstats_global_data?.marketCap.toLocaleString()}
			title="Market Cap"
			prefix="$"
			postfix=""
		/>
		<HomepageSmallChart
			change={$coinstats_global_data?.volumeChange}
			value={$coinstats_global_data?.volume.toLocaleString()}
			title="Volume 24H"
			prefix="$"
			postfix=""
		/>
		<HomepageSmallChart
			change={$coinstats_global_data?.btcDominanceChange}
			value={$coinstats_global_data?.btcDominance.toLocaleString()}
			title="BTC Dominance"
			prefix=""
			postfix="%"
		/>

		<div class="absolute left-[18px] inset-y-0 desktop:hidden flex items-center">
			<ScrollerDots vertical {container} />
		</div>
	</div>
</div>
