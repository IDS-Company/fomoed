<script>
	import CarouselArrowLeft from '$lib/icons/CarouselArrowLeft.svelte';
	import CarouselArrowRight from '$lib/icons/CarouselArrowRight.svelte';
	import IconExpand from '$lib/icons/IconExpand.svelte';
	import FullScreenModal from '../FullScreenModal.svelte';
	import DetailedCfgiCard from './widgets/DetailedCfgi/DetailedCfgiCard.svelte';
	import ExchangeLiqMapCard from './widgets/ExchangeLiqMap/ExchangeLiqMapCard.svelte';
	import LiqHeatmapCard from './widgets/LiqHeatmap/LiqHeatmapCard.svelte';
	import LiqMapCard from './widgets/LiqMap/LiqMapCard.svelte';
	import SimpleCfgiCard from './widgets/SimpleCfgi/SimpleCfgiCard.svelte';

	let page = 0;
	let isFullscreen = false;

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

<div class="w-full h-full relative -desktop:h-[700px] desktop:h-[450px]">
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

	<button
		class="absolute bottom-4 left-4 opacity-50 hover:opacity-100 duration-200"
		on:click={() => (isFullscreen = true)}
	>
		<IconExpand></IconExpand>
	</button>
</div>

{#if isFullscreen}
	<FullScreenModal on:close={() => (isFullscreen = false)}>
		<svelte:component this={components[page]} hideCard />
	</FullScreenModal>
{/if}

<style>
	button {
		@apply rounded-xl border border-[#FFFFFF1A] bg-[#0F0D0D] p-4 active:scale-90 duration-100;
	}
</style>
