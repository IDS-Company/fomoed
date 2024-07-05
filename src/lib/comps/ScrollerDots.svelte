<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';

	export let container: HTMLElement;
	export let vertical = false;

	let page = 0;

	function onScroll() {
		let pageSize: number;

		if (vertical) {
			pageSize = container.scrollHeight / 3;
			page = ~~(container.scrollTop / pageSize + 0.5);
		} else {
			pageSize = container.scrollWidth / 3;
			page = ~~(container.scrollLeft / pageSize + 0.5);
		}
	}

	onMount(async () => {
		await tick();

		container.addEventListener('scroll', onScroll);
	});

	onDestroy(() => {
		container?.removeEventListener('scroll', onScroll);
	});
</script>

<div class="flex gap-[3px] justify-center w-full items-center" class:flex-col={vertical}>
	<div class:selected={page === 0} class="--dot"></div>
	<div class:selected={page === 1} class="--dot"></div>
	<div class:selected={page === 2} class="--dot"></div>
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
		width: 9px;
		height: 4px;
	}

	.flex-col .--dot.selected {
		width: 4px;
		height: 9px;
	}
</style>
