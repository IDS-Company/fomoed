<script lang="ts">
	import DropdownArrow from '$lib/icons/DropdownArrow.svelte';

	type Option = { label: string; value: string };

	interface Props {
		options: Option[];
		selected: Option;
	}

	let { options, selected = $bindable(options[0]) }: Props = $props();

	let expanded = $state(false);
</script>

<div class="relative">
	<button
		onclick={() => (expanded = !expanded)}
		class="flex items-center gap-x-2 border rounded-xl border-white/20 px-[14px] py-[15px] w-full bg-white/5 active:bg-[#FBFBFB1A] hover:border-white/30 duration-100"
	>
		<div class="font-medium font-paralucent flex-grow text-left pl-1 whitespace-nowrap">
			{selected.label}
		</div>

		<div class:rotate-180={expanded} class="duration-200">
			<DropdownArrow></DropdownArrow>
		</div>
	</button>

	{#if expanded}
		<div
			class="absolute top-0 translate-y-16 border border-[#FFFFFF1A] bg-white/10 backdrop-brightness-50 rounded-xl w-full overflow-hidden z-20 backdrop-blur-md"
		>
			<div class="h-full max-h-[300px]" data-simplebar>
				{#each options as option}
					<div>
						<button
							onclick={() => {
								selected = option;
								expanded = false;
							}}
							class="py-2.5 hover:bg-[#ffffff22] pl-3 pr-1 w-full text-left">{option.label}</button
						>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
