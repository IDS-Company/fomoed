<script lang="ts">
	import CarouselArrowLeft from '$lib/icons/CarouselArrowLeft.svelte';
	import CarouselArrowRight from '$lib/icons/CarouselArrowRight.svelte';
	import IconExpand from '$lib/icons/IconExpand.svelte';
	import { isDesktop } from '$lib/stores/ui';
	import { fade } from 'svelte/transition';
	import FullScreenModal from '../FullScreenModal.svelte';
	import ScrollerDots from '../ScrollerDots.svelte';
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

	let mobileScrollIndex = 0;
	let mobileCarouselContainer: HTMLElement;
</script>

<div class="w-full relative desktop:h-[450px]">
	{#if $isDesktop === true}
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
	{:else if $isDesktop === false}
		<div
			bind:this={mobileCarouselContainer}
			class="w-full flex overflow-x-scroll snap-x snap-mandatory h-[700px] px-3 no-scrollbar"
		>
			{#each components as component, i}
				<div class="flex-shrink-0 snap-center w-[calc(100vw-1.5rem)]">
					{#if mobileScrollIndex === i}
						<div class="h-full" transition:fade={{ duration: 200 }}>
							<svelte:component this={component} />
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div class="pt-4">
			<ScrollerDots
				bind:page={mobileScrollIndex}
				pages={components.length}
				container={mobileCarouselContainer}
			></ScrollerDots>
		</div>
	{/if}

	<button
		class="absolute bottom-4 left-4 -desktop:bottom-12 -desktop:left-8 opacity-75 hover:opacity-100 duration-200"
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
