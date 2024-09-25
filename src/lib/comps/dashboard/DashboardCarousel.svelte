<script>
	import CarouselArrowLeft from '$lib/icons/CarouselArrowLeft.svelte';
	import CarouselArrowRight from '$lib/icons/CarouselArrowRight.svelte';
	import DetailedCfgiCard from './widgets/DetailedCfgi/DetailedCfgiCard.svelte';
	import ExchangeLiqMapCard from './widgets/ExchangeLiqMap/ExchangeLiqMapCard.svelte';
	import LiqHeatmapCard from './widgets/LiqHeatmap/LiqHeatmapCard.svelte';
	import LiqMapCard from './widgets/LiqMap/LiqMapCard.svelte';
	import SimpleCfgiCard from './widgets/SimpleCfgi/SimpleCfgiCard.svelte';

	let page = 0;

	function goLeft() {
		page = page === 0 ? components.length - 1 : page - 1;
	}

	function goRight() {
		page = (page + 1) % components.length;
	}

	const components = [
		DetailedCfgiCard,
		SimpleCfgiCard,
		LiqHeatmapCard,
		LiqMapCard,
		ExchangeLiqMapCard
	];
</script>

<div class="w-full h-full relative">
	<svelte:component this={components[page]} />

	<div class="absolute inset-0 flex items-center h-full z-30 pointer-events-none">
		<div class="flex w-full">
			<button on:click={() => goLeft()} class="-translate-x-1/2 pointer-events-auto"
				><CarouselArrowLeft /></button
			>
			<div class="flex-grow"></div>
			<button on:click={() => goRight()} class="translate-x-1/2 pointer-events-auto"
				><CarouselArrowRight /></button
			>
		</div>
	</div>
</div>

<style>
	button {
		@apply rounded-xl border border-[#FFFFFF1A] bg-[#0F0D0D] p-4 active:scale-90 duration-100;
	}
</style>
