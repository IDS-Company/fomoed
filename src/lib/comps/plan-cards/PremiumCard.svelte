<script lang="ts">
	import { auth_user } from '$lib/stores/user';
	import { createEventDispatcher } from 'svelte';
	import MainButton from '../buttons/MainButton.svelte';
	import { active_premium_sub, changingSubscription } from '$lib/stores/subs';
	import Time from 'svelte-time/Time.svelte';

	const dispatch = createEventDispatcher();

	$: disabled = $changingSubscription;
</script>

<div
	class="bg-black w-[333px] h-[480px] rounded-[20px] border-2 border-transparent flex flex-col relative"
	style="background: linear-gradient( #0F0F0F, #0F0F0F) padding-box, linear-gradient(163.28deg, rgba(255, 59, 16, 0.7) 0.31%, rgba(255, 255, 255, 0.3) 102.77%) border-box"
>
	<div class="h-1/2 grid place-items-center text-center">
		<div>
			<div
				class="text-[28px] leading-[32px] bg-gradient-to-r from-primary to-yellow bg-clip-text text-transparent mt-[35px] font-paralucent-demibold"
			>
				Premium
			</div>
			<div class="text-[48px] mt-[9px] leading-[54px] font-paralucent-demibold">$4.99</div>
			<div class="opacity-60 font-paralucent font-medium">/month</div>
			<div class="pt-[12px] opacity-60 text-sm font-paralucent font-medium">
				{#if $active_premium_sub && !$active_premium_sub.has_cancelled}
					Renews <Time relative timestamp={$active_premium_sub.end_timestamp} />
				{:else if $active_premium_sub && $active_premium_sub.has_cancelled}
					Cancels <Time relative timestamp={$active_premium_sub.end_timestamp} />
				{:else}
					Renews once a month
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

	<div class="px-[20px] pb-[24px] pt-[24px] uppercase">
		{#if !$auth_user?.has_had_free_trial}
			<MainButton {disabled} on:click={() => dispatch('click-free-trial')}>
				Start Free Trial
			</MainButton>
		{:else if $active_premium_sub && !$active_premium_sub.has_cancelled}
			<MainButton {disabled} on:click={() => dispatch('click-unsubscribe')}>Unsubscribe</MainButton>
		{:else if $active_premium_sub && $active_premium_sub.has_cancelled}
			<MainButton {disabled} on:click={() => dispatch('click-resubscribe')}>Resubscribe</MainButton>
		{:else if !$active_premium_sub}
			<MainButton {disabled} on:click={() => dispatch('click-subscribe')}>Select Plan</MainButton>
		{/if}
	</div>

	<div class="text-center opacity-60 pb-[22px] text-xs">
		{#if !$auth_user?.has_had_free_trial}
			$4.99 After Trial <br />
		{/if}

		Recurring Billing, Cancel Anytime
	</div>

	<div class="absolute top-[-2px] inset-x-0 flex justify-center">
		<div class="px-[20px] py-[6px] bg-primary rounded-b-xl font-paralucent-demibold">
			Recommended
		</div>
	</div>
</div>
