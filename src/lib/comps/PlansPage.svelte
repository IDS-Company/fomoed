<script lang="ts">
	import { prices_store } from '$lib/stores/stripe';
	import { goto } from '$app/navigation';
	import { auth_user } from '$lib/stores/user';
	import { failure, warning } from '$lib/utils';
	import { getContext, onMount } from 'svelte';
	import type { Stripe } from '@stripe/stripe-js';
	import { browser } from '$app/environment';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { get_user, sleep } from '$lib';
	import PremiumBadge from './decorations/PremiumBadge.svelte';
	import FreeCard from './plan-cards/FreeCard.svelte';
	import AppNav from './AppNav.svelte';
	import UnsubscribeConfirmPopup from './popups/UnsubscribeConfirmPopup.svelte';
	import UnsubscribeSuccessPopup from './popups/UnsubscribeSuccessPopup.svelte';
	import { writable } from 'svelte/store';
	import { active_degen_sub, active_premium_sub, changingSubscription } from '$lib/stores/subs';
	import ScrollerDots from './ScrollerDots.svelte';
	import Toggle from './Toggle.svelte';
	import PaidPlanCard from './plan-cards/PaidPlanCard.svelte';
	import { planPlus, planPro } from '$lib/plans';

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
			$auth_user.subscriptions.some((sub) => sub.plan.id === price_id)
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
					.filter((sub) => sub.plan.id === price_id)
					.map(async (sub) => {
						console.log(sub);

						await fetch('/api/cancel_subscription', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								subscription: sub.id
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
				!!$auth_user.subscriptions.filter((sub) => sub.plan.id === price_id).length &&
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
			sub_id = $active_premium_sub!.id;
		} else {
			sub_id = $active_degen_sub!.id;
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

	let cardsContainer: HTMLElement;

	onMount(() => {
		cardsContainer.scrollTo({ left: cardsContainer.scrollWidth / 3 });
	});

	let yearlySelected = false;
</script>

<div
	style="background-image: url(/background/select-plan.svg)"
	class="absolute inset-0 overflow-hidden bg-cover flex flex-col"
>
	<AppNav />

	<div class="flex-grow grid place-items-center pb-24">
		<div
			class="grid place-items-center grid-cols-3 gap-[7px] mx-auto h-full pb-6 w-full max-w-[1050px] max-h-[760px]"
		>
			<div class="col-span-3 w-full">
				<h1
					class="font-paralucent-demibold text-[28px] text-center -desktop:text-[22px] -desktop:mt-12"
				>
					Get your free trial to unlock more!
				</h1>

				<div class="mt-[9px] flex items-center justify-center gap-x-[20px]">
					<img src="/fomoed.svg" alt="Fomoed." class="w-[158px] -desktop:w-[125px]" />
					<PremiumBadge />
				</div>

				<div
					class="grid place-items-center mt-4 desktop:place-items-end desktop:pr-3 desktop:translate-y-10"
				>
					<Toggle labelLeft="Monthly" labelRight="Yearly" bind:state={yearlySelected}></Toggle>
				</div>
			</div>

			<div
				bind:this={cardsContainer}
				class="desktop:grid desktop:grid-cols-subgrid col-span-3 desktop:place-items-center -desktop:flex -desktop:overflow-x-scroll -desktop:gap-x-2 items-center -desktop:w-full -desktop:px-2 -xs:snap-x -xs:snap-mandatory no-scrollbar -desktop:mt-[18px] desktop:mt-[20px]"
			>
				<div class="--card-container">
					<FreeCard />
				</div>

				<div class="--card-container">
					<PaidPlanCard
						planInfo={planPro}
						matchingActivePlanStore={active_premium_sub}
						{yearlySelected}
						on:click-free-trial={subscribeFreeTrial}
						on:click-subscribe={() => subscribeToPlan('Premium')}
						on:click-unsubscribe={() => unsubPlanFromCard('Premium')}
						on:click-resubscribe={() => resubscribePlan('Premium')}
					/>
				</div>

				<div class="--card-container">
					<PaidPlanCard
						planInfo={planPlus}
						matchingActivePlanStore={active_degen_sub}
						{yearlySelected}
						on:click-subscribe={() => subscribeToPlan('Degen')}
						on:click-unsubscribe={() => unsubPlanFromCard('Degen')}
						on:click-resubscribe={() => resubscribePlan('Degen')}
					/>
				</div>
			</div>
		</div>

		<div class="col-span-3 xs:hidden">
			<ScrollerDots pages={3} container={cardsContainer} />
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

<style>
	.--card-container {
		@apply flex-shrink-0 snap-center;
	}
</style>
