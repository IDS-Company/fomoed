<script lang="ts">
	import { browser } from '$app/environment';
	import {
		coinstats_coin_list,
		coinstats_selected_coin,
		free_tokens,
		type CoinstatsCoinListItem
	} from '$lib/stores';
	import { auth_user } from '$lib/stores/user';

	let isOpen = false;

	export let selected: CoinstatsCoinListItem | null = null;

	$: selected && coinstats_selected_coin.set(selected);

	coinstats_coin_list.subscribe((value) => {
		if (!selected && value) {
			selected = value[0];
		}
	});

	let enabledSymbols: string[] = free_tokens;

	$: if ($coinstats_coin_list) {
		enabledSymbols =
			$auth_user && $auth_user?.has_valid_sub
				? $coinstats_coin_list.map((t) => t.symbol)
				: free_tokens;
	}

	$: console.log(enabledSymbols);
</script>

<div class="relative">
	<button
		on:click={() => (isOpen = !isOpen)}
		class="border-[#FFFFFF1A] duration-150 border rounded-[11px] px-[14px] py-[12px] flex items-center text-[#FFFFFFCC] w-[140px] hover:bg-[#FFFFFF0D] hover:border-[#FFFFFF4D]"
	>
		<img
			src={selected?.icon || 'https://static.coinstats.app/coins/1650455588819.png'}
			width={21}
			height={21}
			alt={selected?.name || 'Bitcoin'}
		/>

		<div class="pl-2 font-paralucent font-medium flex-grow text-left truncate">
			{selected?.name || 'Bitcoin'}
		</div>

		<img
			src="/icons/dropdown-arrow-up.svg"
			width={12}
			height={9}
			alt=""
			class="duration-100 ml-[7px] flex-shrink-0"
			class:rotate-180={isOpen}
		/>
	</button>

	<div
		class:hidden={!isOpen}
		class="absolute top-16 bg-[#0F0D0DE5] border-[#FFFFFF1A] border rounded-[10px] h-[260px] w-[200px] overflow-hidden flex flex-col backdrop-blur-sm"
	>
		<div class="text-[#FFFFFFCC] py-[10px] pl-[13px] text-start text-sm">Select a Network</div>

		<div class="h-px bg-[#FFFFFF1A]"></div>

		<div class="overflow-scroll">
			{#each $coinstats_coin_list || [] as item}
				<button
					on:click={() => {
						selected = item;
						isOpen = false;
					}}
					class="flex items-center gap-x-3 text-[#FFFFFFCC] disabled:opacity-40 enabled:hover:bg-[#FFFFFF0D] hover:text-[#FFFFFFCC] w-full py-3 px-[15px] h-[37px]"
					disabled={!enabledSymbols.includes(item.symbol)}
				>
					<img src={item.icon} width={21} height={21} alt={item.name} />
					<div>{item.name}</div>
				</button>
			{/each}
		</div>
	</div>
</div>
