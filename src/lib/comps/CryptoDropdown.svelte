<script>
	let isOpen = false;

	const options = [
		['/icons/dropdown/btc.svg', 'Bitcoin'],
		['/icons/dropdown/eth.svg', 'Ethereum'],
		['/icons/dropdown/tetra.svg', 'Tetra'],
		['/icons/dropdown/bnb.svg', 'BNB'],
		['/icons/dropdown/sol.svg', 'Solana'],
		['/icons/dropdown/usdc.svg', 'USDC']
	];

	let selected = options[0];
</script>

<div class="relative">
	<button
		on:click={() => (isOpen = !isOpen)}
		class="border-[#FFFFFF1A] duration-150 border rounded-[11px] px-[14px] py-[12px] flex items-center text-[#FFFFFFCC] w-[140px] hover:bg-[#FFFFFF0D] hover:border-[#FFFFFF4D]"
	>
		<img src={selected[0]} width={21} height={21} alt={selected[1]} />

		<div class="pl-2 font-paralucent font-medium flex-grow text-left">{selected[1]}</div>

		<img
			src="/icons/dropdown-arrow-up.svg"
			width={12}
			height={9}
			alt=""
			class="duration-100 ml-[7px] flex-shrink-0"
			class:rotate-180={isOpen}
		/>
	</button>

	{#if isOpen}
		<div
			class="absolute top-16 bg-[#0F0D0DE5] border-[#FFFFFF1A] border rounded-[10px] h-[260px] w-[200px] overflow-hidden flex flex-col"
		>
			<div class="text-[#FFFFFFCC] py-[10px] pl-[13px] text-start text-sm">Select a Network</div>

			<div class="h-px bg-[#FFFFFF1A]"></div>

			<div class="overflow-scroll">
				{#each options as [icon, label]}
					<button
						on:click={() => {
							selected = [icon, label];
							isOpen = false;
						}}
						class="flex items-center gap-x-3 text-[#FFFFFFCC] hover:bg-[#FFFFFF0D] hover:text-[#FFFFFFCC] w-full py-3 px-[15px] h-[37px]"
					>
						<img src={icon} width={21} height={21} alt={label} />
						<div>{label}</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
