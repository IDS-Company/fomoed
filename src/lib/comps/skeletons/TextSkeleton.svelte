<script lang="ts">
	import { random, sum } from 'lodash-es';
	import { fade } from 'svelte/transition';

	let { totalWidth = 600, ...props }: { totalWidth?: number; class?: string } = $props();

	const widths: number[] = [];

	while (sum(widths) < totalWidth) {
		widths.push(random(20, 120));
	}
</script>

<div
	class="flex gap-x-2 absolute items-center animate-pulse {props.class}"
	out:fade={{ duration: 500 }}
>
	{#each widths as w}
		<div class="bg-white/10 h-4 rounded-md" style="width: {w}px;">{' '}</div>
	{/each}
</div>
