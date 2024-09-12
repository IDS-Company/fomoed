<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import SecondaryButton from '../buttons/SecondaryButton.svelte';
	import { changingSubscription } from '$lib/stores/subs';
	import Time from 'svelte-time/Time.svelte';
	import type { PlanInfo } from '$lib/plans';
	import type { Readable } from 'svelte/motion';
	import type Stripe from 'stripe';

	const dispatch = createEventDispatcher();

	export let planInfo: PlanInfo;
	export let yearlySelected: boolean;
	export let matchingActivePlanStore: Readable<Stripe.Subscription | null>;

	$: disabled = $changingSubscription;
</script>

<div
	class="--container bg-black w-[333px] rounded-[20px] flex flex-col border-transparent relative"
	class:recommended={planInfo.recommended}
>
	<div class="h-1/2 grid place-items-center text-center">
		<div>
			<div
				class="text-[28px] font-paralucent-demibold leading-[32px] bg-gradient-to-r from-primary to-yellow bg-clip-text text-transparent mt-4"
			>
				{planInfo.name}
			</div>

			<div class="text-[48px] mt-[9px] leading-[54px] font-paralucent-demibold">
				${yearlySelected ? planInfo.priceUsdYear : planInfo.priceUsdMonth}
			</div>

			<div class="opacity-60 font-paralucent font-medium">
				{#if yearlySelected}
					/year
				{:else}
					/month
				{/if}
			</div>

			<div class="pt-[12px] opacity-60 text-sm font-paralucent font-medium">
				{#if $matchingActivePlanStore && !$matchingActivePlanStore.cancel_at_period_end}
					Renews <Time relative timestamp={$matchingActivePlanStore.current_period_end * 1000} />
				{:else if $matchingActivePlanStore && $matchingActivePlanStore.cancel_at_period_end}
					Cancels <Time relative timestamp={$matchingActivePlanStore.current_period_end * 1000} />
				{:else if yearlySelected}
					Renews every 1 year
				{:else}
					Renews every month
				{/if}
			</div>
		</div>
	</div>

	<div class="h-px bg-[#FFFFFF33] mx-[10px]"></div>

	<ul class="px-[24px] pt-[20px] grid gap-y-[10px] text-sm mb-8">
		{#each planInfo.features as feat}
			<li class="checkmark-list-item">{@html feat}</li>
		{/each}
	</ul>

	<div class="flex-grow"></div>

	<div class="px-[20px] pb-[25px]">
		{#if $matchingActivePlanStore && !$matchingActivePlanStore.cancel_at_period_end}
			<SecondaryButton on:click={() => dispatch('click-unsubscribe')}>Unsubscribe</SecondaryButton>
		{:else if $matchingActivePlanStore && $matchingActivePlanStore.cancel_at_period_end}
			<SecondaryButton {disabled} on:click={() => dispatch('click-resubscribe')}>
				Resubscribe
			</SecondaryButton>
		{:else if !$matchingActivePlanStore}
			<SecondaryButton on:click={() => dispatch('click-subscribe')}>Select Plan</SecondaryButton>
		{/if}
	</div>

	{#if planInfo.recommended}
		<div class="absolute top-[-2px] inset-x-0 flex justify-center">
			<div class="px-[20px] py-[6px] bg-primary rounded-b-xl font-paralucent-demibold">
				Recommended
			</div>
		</div>
	{/if}
</div>

<style>
	.--container {
		@apply h-[436px] border;

		background:
			linear-gradient(#0f0f0f, #0f0f0f) padding-box,
			linear-gradient(165.22deg, rgba(255, 255, 255, 0.4) -12.61%, rgba(153, 153, 159, 0.1) 104.22%)
				border-box;
	}

	.--container.recommended {
		@apply h-[540px] border-2;

		background:
			linear-gradient(#0f0f0f, #0f0f0f) padding-box,
			linear-gradient(163.28deg, rgba(255, 59, 16, 0.7) 0.31%, rgba(255, 255, 255, 0.3) 102.77%)
				border-box;
	}
</style>
