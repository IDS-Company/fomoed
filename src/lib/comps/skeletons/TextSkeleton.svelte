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
	class="flex gap-2 inset-0 items-center animate-pulse flex-wrap {props.class}"
	out:fade={{ duration: 500 }}
>
	{#each widths as w}
		<div class="bg-white/10 rounded-md whitespace-pre" style="width: {w}px;">{' '}</div>
	{/each}
</div>
