<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import SecondaryButton from '../buttons/SecondaryButton.svelte';
	import { active_degen_sub, changingSubscription } from '$lib/stores/subs';
	import Time from 'svelte-time/Time.svelte';

	const dispatch = createEventDispatcher();

	$: disabled = $changingSubscription;
</script>

<div
	class="bg-black w-[333px] h-[436px] rounded-[20px] border border-transparent flex flex-col"
	style="background: linear-gradient( #0F0F0F, #0F0F0F) padding-box, linear-gradient(165.22deg, rgba(255, 255, 255, 0.4) -12.61%, rgba(153, 153, 159, 0.1) 104.22%) border-box"
>
	<div class="h-1/2 grid place-items-center text-center">
		<div>
			<div
				class="text-[28px] font-paralucent-demibold leading-[32px] bg-gradient-to-r from-primary to-yellow bg-clip-text text-transparent"
			>
				Degen
			</div>
			<div class="text-[48px] mt-[9px] leading-[54px] font-paralucent-demibold">$50</div>
			<div class="opacity-60 font-paralucent font-medium">/year</div>
			<div class="pt-[12px] opacity-60 text-sm font-paralucent font-medium">
				{#if $active_degen_sub && !$active_degen_sub.has_cancelled}
					Renews <Time relative timestamp={$active_degen_sub.end_timestamp} />
				{:else if $active_degen_sub && $active_degen_sub.has_cancelled}
					Cancels <Time relative timestamp={$active_degen_sub.end_timestamp} />
				{:else}
					Renews every 1 year
				{/if}
			</div>
		</div>
	</div>

	<div class="h-px bg-[#FFFFFF33] mx-[10px]"></div>

	<ul class="px-[24px] pt-[20px] grid gap-y-[10px] text-sm">
		<li class="checkmark-list-item">Access to all time frame 15M, 1H, and 4H Data</li>
		<li class="checkmark-list-item">Access to more than 45 of the most popular crypto assets</li>
	</ul>

	<div class="flex-grow"></div>

	<div class="px-[20px] pb-[25px]">
		{#if $active_degen_sub && !$active_degen_sub.has_cancelled}
			<SecondaryButton on:click={() => dispatch('click-unsubscribe')}>Unsubscribe</SecondaryButton>
		{:else if $active_degen_sub && $active_degen_sub.has_cancelled}
			<SecondaryButton {disabled} on:click={() => dispatch('click-resubscribe')}>
				Resubscribe
			</SecondaryButton>
		{:else if !$active_degen_sub}
			<SecondaryButton on:click={() => dispatch('click-subscribe')}>Select Plan</SecondaryButton>
		{/if}
	</div>
</div>
