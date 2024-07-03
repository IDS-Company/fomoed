<script lang="ts">
	import { coinstats_global_data } from '$lib/stores';

	import HomepageSmallChart from './HomepageSmallChart.svelte';

	let container: HTMLElement;
	let page = 0;

	function onScroll() {
		const scroll = container.scrollTop;

		if (scroll < 50) page = 0;
		if (scroll > 50 && scroll < 150) page = 1;
		if (scroll > 150) page = 2;
	}
</script>

<div class="relative">
	<div
		bind:this={container}
		on:scroll={onScroll}
		class="-desktop:pl-16 grid grid-cols-3 pl-[50px] pr-[80px] gap-x-16 -desktop:grid-cols-1 -desktop:h-[100px] -desktop:overflow-scroll -desktop:snap-y -desktop:snap-mandatory"
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

		<div
			class="absolute left-[18px] flex flex-col gap-y-[3px] inset-y-0 justify-center desktop:hidden"
		>
			<div class:selected={page === 0} class="--dot"></div>
			<div class:selected={page === 1} class="--dot"></div>
			<div class:selected={page === 2} class="--dot"></div>
		</div>
	</div>
</div>

<style>
	.--dot {
		@apply duration-300 snap-always;
		width: 4px;
		height: 4px;
		background-color: #ffffff80;
		border-radius: 2px;
	}

	.--dot.selected {
		background-color: #fff;
		height: 9px;
	}
</style>
