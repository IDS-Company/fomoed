<script lang="ts">
	import SimpleBar from 'simplebar';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import LoadingAnim from './animations/LoadingAnim.svelte';

	export let loading = false;

	onMount(() => {
		new SimpleBar(container, {
			autoHide: false,
			scrollbarMinSize: 50
		});
	});

	let container: HTMLElement;
</script>

<div class="px-2 h-full relative">
	<div
		bind:this={container}
		class="w-full overflow-x-scroll h-full no-scrollbar"
		class:opacity-0={loading}
	>
		<div class="-desktop:min-w-[700px] -desktop:h-full desktop:h-full -desktop:pb-3">
			<slot />
		</div>
	</div>

	{#if loading}
		<div out:fade class="absolute inset-0 grid place-items-center">
			<LoadingAnim />
		</div>
	{/if}
</div>

<style>
	:global(.simplebar-content) {
		@apply h-full;
	}
</style>
