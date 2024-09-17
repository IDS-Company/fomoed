<script lang="ts">
	import AutocompleteSearch from '$lib/icons/AutocompleteSearch.svelte';
	import DropdownArrow from '$lib/icons/DropdownArrow.svelte';

	type Option = { label: string; value: any };

	export let options: Option[];
	export let selected = options[0];
	export let inputValue: string = selected.label;

	let hasFocus = false;
	let startedTyping = false;

	$: if (hasFocus) {
		startedTyping = false;
	}

	let filteredOptions = options;
</script>

<div
	class="relative w-full rounded-xl border-[#FFFFFF4D] border h-full pl-[14px] flex items-center gap-x-2 bg-[#12100F]"
>
	<div class="pb-px">
		<AutocompleteSearch />
	</div>

	<input
		bind:value={inputValue}
		class="w-full bg-transparent font-paralucent font-medium text-sm outline-none placeholder-[#FFFFFF80]"
		placeholder="Search"
		on:focusin={() => {
			hasFocus = true;
			filteredOptions = options;
		}}
		on:input={() => {
			startedTyping = true;
			filteredOptions = options.filter((o) =>
				o.label.toLowerCase().includes(inputValue.toLowerCase())
			);
		}}
	/>

	<button on:click={() => (hasFocus = !hasFocus)} class="pr-[14px]">
		<div class:rotate-180={hasFocus} class="duration-200">
			<DropdownArrow />
		</div>
	</button>

	{#if hasFocus}
		<div
			class="absolute top-0 left-0 translate-y-16 border border-[#FFFFFF1A] bg-[#0F0D0DE5] rounded-xl w-full h-[200px]"
		>
			<div class="overflow-y-scroll py-3 h-full">
				{#each filteredOptions as option}
					<div>
						<button
							on:click={() => {
								selected = option;
								hasFocus = false;
								inputValue = selected.label;
							}}
							class="py-2.5 hover:bg-[#ffffff22] pl-3 pr-1 w-full text-left">{option.label}</button
						>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.simplebar-scrollbar)::before {
		background-color: #3e3d3d;
	}
</style>
