<script lang="ts">
	import { coinstats_selected_coin } from '$lib/stores';
	import { auth_user } from '$lib/stores/user';
	import { fetch_token_data } from '$lib/utils';
	import { CfgiPeriods, type CfgiPeriod } from '$lib/utils/cfgi_data';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const options = CfgiPeriods;

	export let selected = options[0];

	$: if ($coinstats_selected_coin && selected) {
		fetch_token_data(
			$coinstats_selected_coin.symbol,
			$coinstats_selected_coin.slug,
			selected.value,
			$coinstats_selected_coin.name
		);
	}

	function selectDuration(option: CfgiPeriod) {
		if ($auth_user?.has_valid_sub) {
			selected = option;
		} else {
			dispatch('show-subscription-required');
		}
	}
</script>

<div class="h-[38px] flex gap-x-[5px]">
	{#each options as duration}
		<button
			on:click={() => selectDuration(duration)}
			class="font-paralucent font-light border border-[#FFFFFF1A] rounded-[11px] w-[44px] h-[38px] {selected ===
			duration
				? 'bg-[#FFFFFF1A]'
				: ''}"
		>
			{duration.label}
		</button>
	{/each}
</div>
