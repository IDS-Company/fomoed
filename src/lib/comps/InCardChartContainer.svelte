<script lang="ts">
	import SimpleBar from 'simplebar';
	import { onMount } from 'svelte';

	onMount(() => {
		new SimpleBar(container, {
			autoHide: false,
			scrollbarMinSize: 50
		});
	});

	let container: HTMLElement;
</script>

<div class="px-2 h-full">
	<div bind:this={container} class="w-full overflow-x-scroll h-full">
		<div class="-desktop:min-w-[700px] -desktop:h-full desktop:h-full -desktop:pb-3">
			<slot />
		</div>
	</div>
</div>

<style>
	:global(.simplebar-content) {
		@apply h-full;
	}
</style>
