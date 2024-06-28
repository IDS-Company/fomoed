<script>
	const options = ['15M', '1H', '7H', '1D'];

	let selected = options[0];
</script>

<div class="h-[38px] flex gap-x-[5px]">
	{#each options as duration}
		<button
			on:click={() => (selected = duration)}
			class="font-paralucent font-light border border-[#FFFFFF1A] rounded-[11px] w-[44px] h-[38px] {selected ===
			duration
				? 'bg-[#FFFFFF1A]'
				: ''}"
		>
			{duration}
		</button>
	{/each}
</div>
