<script lang="ts">
	import { prices_store } from '$lib/stores/stripe';
	import { goto } from '$app/navigation';
	import { auth_user } from '$lib/stores/user';
	import { failure, success, warning } from '$lib/utils';
	import { getContext } from 'svelte';
	import type { Stripe } from '@stripe/stripe-js';
	import { browser } from '$app/environment';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { get_user, sleep } from '$lib';
	import PremiumBadge from './decorations/PremiumBadge.svelte';
	import FreeCard from './plan-cards/FreeCard.svelte';
	import PremiumCard from './plan-cards/PremiumCard.svelte';
	import DegenCard from './plan-cards/DegenCard.svelte';
	import AppNav from './AppNav.svelte';
	import UnsubscribeConfirmPopup from './popups/UnsubscribeConfirmPopup.svelte';
	import UnsubscribeSuccessPopup from './popups/UnsubscribeSuccessPopup.svelte';
	import { writable } from 'svelte/store';
	import { active_degen_sub, active_premium_sub, changingSubscription } from '$lib/stores/subs';

	let stripeContext = getContext<{
		getStripe: () => Stripe;
	}>('stripe');
	const supabase = getContext<SupabaseClient>('supabase');

	async function subscribeTo(price_id: string) {
		if (!$auth_user) {
			// warning('Please login before proceeding to your checkout');
			goto('/auth');
			return;
		} else if (
			$auth_user.subscriptions.length &&
			$auth_user.subscriptions.some((sub) => sub.price_id === price_id)
		) {
			warning('Seems you are already subscribed to a plan');
			return;
		}

		changingSubscription.set(true);

		if (price_id === 'free' && $auth_user.subscriptions.length) {
			// UnSubscribe all plans
			await Promise.all(
				$prices_store.map(async (price) => {
					if (price.id !== 'free') {
						await unsubscribeFrom(price.id, true);
					}
				})
			);

			if (browser && supabase) {
				await sleep(5000);
				await get_user(supabase);
			}
		} else {
			// UnSub from all others
			await Promise.all(
				$prices_store.map(async (price) => {
					if (price.id !== 'free') {
						await unsubscribeFrom(price.id, true);
					}
				})
			);

			if (price_id !== 'free') {
				const res = await fetch('/api/stripe/checkout', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						priceId: price_id,
						email: $auth_user.email,
						user_id: $auth_user.user_id
					})
				})
					.then((res) => res.json())
					.then((res) => res)
					.catch((err) => {
						failure(err.message || 'Encountered an error while processing checkout.');
						console.error(err);

						return null;
					});

				if (res) {
					if (res.url) {
						window.location = res.url;
						return;
					} else {
						await stripeContext.getStripe().redirectToCheckout({
							sessionId: res.sessionId
						});
					}
				}
			}
		}

		changingSubscription.set(false);
	}

	async function unsubscribeFrom(price_id: string, implicit = false) {
		changingSubscription.set(true);

		if ($auth_user) {
			await Promise.all(
				$auth_user.subscriptions
					.filter((sub) => sub.price_id === price_id)
					.map(async (sub) => {
						await fetch('/api/cancel_subscription', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								subscription: sub.subscription_id
							})
						})
							.then((res) => res.json())
							.then((res) => res)
							.catch((err) => {
								failure(
									err.message || 'Encountered an error while processing subscription cancellation.'
								);

								return null;
							});

						return sub;
					})
			);

			if (
				!!$auth_user.subscriptions.filter((sub) => sub.price_id === price_id).length &&
				!implicit
			) {
				// success(
				// 	'Success\nYour subscription will not be billed at the end of your current payment period'
				// );

				showUnsubSuccess.set(true);

				if (browser && supabase) {
					await sleep(5000);
					await get_user(supabase);
				}
			}
		}

		changingSubscription.set(false);
	}

	async function resubscribePlan(planName: 'Premium' | 'Degen') {
		changingSubscription.set(true);

		let sub_id: string;

		if (planName === 'Premium') {
			sub_id = $active_premium_sub!.subscription_id;
		} else {
			sub_id = $active_degen_sub!.subscription_id;
		}

		await fetch('/api/resume_subscription', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				subscription: sub_id
			})
		})
			.then((res) => res.json())
			.then((res) => res)
			.catch((err) => {
				failure(err.message || 'Encountered an error while processing subscription resumption.');

				return null;
			});

		if (browser && supabase) {
			await sleep(5000);
			await get_user(supabase);
		}

		changingSubscription.set(false);
	}

	function subscribeFreeTrial() {
		if (!$auth_user) {
			goto('/auth');
			return;
		}

		if (!$auth_user?.has_had_free_trial) {
			const price = $prices_store.find(
				(price) => price.recurring?.interval === 'month' && price.id !== 'free'
			);

			if (price) {
				subscribeTo(price.id);
			}
		}
	}

	function subscribeToPlan(planName: string) {
		if (!$auth_user) {
			goto('/auth');
			return;
		}

		const price = $prices_store.find((price) => price.name === planName);

		if (price) {
			subscribeTo(price.id);
		}
	}

	const unsubFromName = writable<string | null>(null);
	const showUnsubSuccess = writable(false);

	function unsubPlanFromCard(planName: string) {
		unsubFromName.set(planName);
	}

	function unsubPlanFromConfirm() {
		const price = $prices_store.find((price) => price.name === $unsubFromName);
		unsubFromName.set(null);

		if (price) {
			unsubscribeFrom(price.id);
		}
	}

	$: console.log('premium', $active_premium_sub);
</script>

<!-- <section class="px-6 pt-16 mx-auto max-w-screen-2xl">
	<header class="flex flex-col items-center justify-between pb-10 md:flex-row header">
		<div class="start_section">
			<div class="text-2xl font-bold sm:text-3xl title_tag">Stop Trading With Emotions</div>
			<div
				class="px-0 text-4xl sm:text-5xl font-extrabold leading-none py-4 sm:py-0 sm:leading-relaxed tracking-wide text-transparent title bg-gradient-to-r bg-clip-text from-[#ff3432] to-[#ff9851]"
			>
				Get Fomoed Premium
			</div>
			<div class="text-sm title_description sm:text-base">
				Fomoed provides a toolset for effortlessly navigating the emotional rollercoaster that is
				crypto. Have complete access to your favorite Altcoins and get precise data-based market
				sentiment analysis
			</div>

			<div
				class="flex flex-col items-center justify-center w-full py-4 lg:items-start md:w-auto free_trial"
			>
				<button
					class="px-10 py-3 text-sm font-bold md:px-16 rounded-3xl disabled:opacity-40 whitespace-nowrap disabled:cursor-not-allowed bg-gradient-to-r text-black from-[#ff3432] to-[#ff9851]"
					on:click={() => {
						if (!$auth_user?.has_had_free_trial) {
							const price = $prices_store.find(
								(price) => price.recurring?.interval === 'month' && price.id !== 'free'
							);

							if (price) {
								subscribeTo(price.id);
							}
						}
					}}
					disabled={$auth_user?.has_had_free_trial}
				>
					Start Free Trial
				</button>

				<div
					class="flex flex-col items-center justify-center px-5 py-3 space-y-1 text-xs font-medium text-white tagline_text text-opacity-30"
				>
					<span>
						${($prices_store.filter((p) => p.recurring?.interval === 'month')?.[0]?.unit_amount ||
							499) / 100} After Trial
					</span>
					<span> Recurring Billing, Cancel Anytime </span>
				</div>
			</div>
		</div>

		<div class="block image">
			<img src="/images/plans_graphic.png" alt="" />
		</div>
	</header>

	<article class="w-full">
		<div class="text-2xl font-medium text-center sm:text-3xl title">
			Unlock a Full Suite of Professional Tools
		</div>

		<div
			class="flex flex-col items-center justify-center py-6 space-y-3 sm:py-16 sm:flex-row sm:space-y-0 sm:space-x-3 plans_list"
		>
			{#each $prices_store as price}
				<div class="w-full sm:w-1/3 {price.name === 'Premium' ? 'premium' : ''} rounded-xl">
					<div
						class="relative flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-white border-opacity-30 price rounded-xl bg-background inner_wrapper"
					>
						<div
							class="text-3xl font-bold tracking-wide text-center {price.id === 'free'
								? 'text-white'
								: `bg-gradient-to-r bg-clip-text text-transparent`}"
							class:from-[#ff3432]={price.recurring?.interval === 'month'}
							class:from-[#ffe5ce]={price.recurring?.interval === 'year'}
							class:to-[#ff9851]={price.recurring?.interval === 'month'}
							class:to-[#ee9843]={price.recurring?.interval === 'year'}
						>
							{price.name}
						</div>

						<div class="py-5 price">
							<div class="flex items-center justify-center price_details">
								<div class="flex items-center justify-center text-4xl font-bold price_value">
									{price.unit_amount === 0 ? 'Free' : `$${(price.unit_amount || 0) / 100 || 0}`}
								</div>
								<div
									class="flex items-center justify-center pt-2 pl-2 text-white duration text-opacity-30"
								>
									/{price.recurring?.interval || 'month'}
								</div>
							</div>
						</div>

						<div class="extra_details">
							{#if price.unit_amount !== 0}
								<div class="text-xs text-white text-opacity-25 extra_info">
									billed every {price.recurring?.interval_count}
									{price.recurring?.interval}
								</div>
							{/if}

							{#if $auth_user?.subscriptions.some((sub) => sub.price_id === price.id)}
								<div class="py-1 text-xs text-white text-opacity-25 timestamp">
									{$auth_user?.subscriptions.filter((sub) => sub.price_id === price.id)?.[0]
										?.has_cancelled
										? 'Cancels'
										: 'Renews'}
									<Time
										relative
										timestamp={$auth_user?.subscriptions.find((sub) => sub.price_id === price.id)
											?.end_timestamp}
									/>
								</div>
							{/if}
						</div>

						<div class="flex items-center justify-center py-5 action_btn">
							<button
								class="w-full px-10 md:px-16 py-3 mx-auto rounded-3xl text-sm font-bold disabled:opacity-40 whitespace-nowrap disabled:cursor-not-allowed
									{price.id === 'free' ? 'text-white bg-black' : 'bg-gradient-to-r text-black'}
									"
								class:from-[#ff3432]={price.recurring?.interval === 'month'}
								class:from-[#ffe5ce]={price.recurring?.interval === 'year'}
								class:to-[#ff9851]={price.recurring?.interval === 'month'}
								class:to-[#ee9843]={price.recurring?.interval === 'year'}
								on:click={async () => {
									const found_sub = $auth_user?.subscriptions.find(
										(sub) => sub.price_id === price.id
									);

									if (found_sub) {
										if (found_sub.has_cancelled) {
											await resume_subscription(found_sub.subscription_id);
										} else {
											await unsubscribeFrom(price.id, true);
										}
									} else {
										await subscribeTo(price.id);
									}
								}}
								disabled={!$auth_user?.subscriptions.length && price.id === 'free'}
							>
								{#if $auth_user?.subscriptions.some((sub) => sub.price_id === price.id) && price.id !== 'free'}
									{#if $auth_user?.subscriptions.find((sub) => sub.price_id === price.id)?.has_cancelled}
										Resume Plan
									{:else}
										Unsubscribe
									{/if}
								{:else if !$auth_user?.subscriptions.length && price.id === 'free'}
									Current Plan
								{:else}
									Select Plan
								{/if}
							</button>
						</div>

						<div class="flex flex-col items-center justify-start w-full px-5 text-sm features">
							{#each price.features as feature}
								<div class="w-full py-1 text-left feature">
									{feature}
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</article>
</section>
-->

<!-- <style lang="postcss">
	.premium {
		@apply border-none relative p-[1px];
		@apply content-none block bg-gradient-to-r from-[#ff3432] to-[#ff9851];

		.inner_wrapper {
			@apply border-none mx-auto;
		}
	}
</style> -->

<div
	style="background-image: url(/background/select-plan.svg)"
	class="absolute inset-0 overflow-hidden bg-cover flex flex-col"
>
	<AppNav />

	<div class="flex-grow grid place-items-center pb-24">
		<div
			style="grid-template-rows;: 1fr 3fr"
			class="grid place-items-center grid-cols-3 gap-[7px] mx-auto h-full pb-6 w-full max-w-[1050px] max-h-[700px]"
		>
			<div class="col-span-3">
				<h1 class="font-paralucent-demibold text-[28px] text-center">
					Get your free trial to unlock more!
				</h1>

				<div class="mt-[9px] flex items-center justify-center gap-x-[20px]">
					<img src="/fomoed.svg" alt="Fomoed." class="h-full" width={158} height={33} />
					<PremiumBadge />
				</div>
			</div>

			<FreeCard />
			<PremiumCard
				on:click-free-trial={subscribeFreeTrial}
				on:click-subscribe={() => subscribeToPlan('Premium')}
				on:click-unsubscribe={() => unsubPlanFromCard('Premium')}
				on:click-resubscribe={() => resubscribePlan('Premium')}
			/>
			<DegenCard
				on:click-subscribe={() => subscribeToPlan('Degen')}
				on:click-unsubscribe={() => unsubPlanFromCard('Degen')}
				on:click-resubscribe={() => resubscribePlan('Degen')}
			/>
		</div>
	</div>
</div>

{#if $unsubFromName}
	<UnsubscribeConfirmPopup
		planName={$unsubFromName}
		monthlyFee={$prices_store.find((price) => price.name === $unsubFromName)?.unit_amount || 0}
		on:click-confirm={unsubPlanFromConfirm}
		on:click-cancel={() => unsubFromName.set(null)}
	/>
{/if}

{#if $showUnsubSuccess}
	<UnsubscribeSuccessPopup on:click-close={() => showUnsubSuccess.set(false)} />
{/if}
