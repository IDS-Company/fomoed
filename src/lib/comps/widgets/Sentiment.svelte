<!-- <script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FomoedLogo from '$lib/icons/FomoedLogo.svelte';
	import { aped_score, cfgi_summary, show_social_share } from '$lib/stores';
	import { auth_user } from '$lib/stores/user';
	import { get_data_color, success } from '$lib/utils';
	import { onMount } from 'svelte';
	import { Diamonds } from 'svelte-loading-spinners';
	import { writable } from 'svelte/store';
	import _ from 'lodash-es';

	enum SentimentRatingEnum {
		BEARISH = 'BEARISH',
		BULLISH = 'BULLISH'
	}

	export let for_screenshot = false;

	const loading = writable(false);
	const has_voted = writable(false);
	const votes = writable<{ device_id: string; sentiment: number }[]>([]);
	const device_id = writable<string>();

	async function vote(rating: SentimentRatingEnum) {
		if (!$device_id) {
			console.log('Failed to Extract Device ID');
			return;
		}

		loading.set(true);
		const num_rating =
			rating == SentimentRatingEnum.BEARISH ? 25 : rating == SentimentRatingEnum.BULLISH ? 75 : 50;

		$votes.push({
			device_id: $device_id,
			sentiment: num_rating
		});

		has_voted.set(true);

		await fetch('/api/sentiment', {
			method: 'POST',
			body: JSON.stringify({
				sentiment: num_rating,
				device_id: $device_id
			})
		});

		await get_votes();
		loading.set(false);
	}

	async function get_votes() {
		loading.set(true);

		const site_votes = await fetch('/api/sentiment')
			.then((res) => res.json())
			.then((res) => res)
			.catch((err) => {
				console.error('Error Fetching Sentiment: ', err.toString());

				return { sentiment: [] };
			});

		// Loop through this result to determine if user has already voted

		site_votes?.sentiment?.length && votes.set(site_votes.sentiment);
		loading.set(false);
	}

	onMount(() => {
		if (for_screenshot) {
			has_voted.set(true);
			_.toNumber($page.url.searchParams.get('score'))
				? aped_score.set(_.toNumber($page.url.searchParams.get('score')))
				: aped_score.set(0);
		} else {
			if (typeof window !== 'undefined') {
				const calculated_device_id = new (window as any).DeviceUUID().get();
				device_id.set(calculated_device_id);
				console.log(calculated_device_id);
			}
			get_votes();
		}
	});

	async function update_mean_rating(all_votes: { device_id: string; sentiment: number }[]) {
		if (typeof window === 'undefined') return;

		let ratings_mean = 0;
		let did_vote = false;

		if (!$device_id) {
			console.log('Failed to Extract Device ID');
			return;
		}

		if (all_votes?.length) {
			ratings_mean =
				all_votes
					.map((v) => {
						if (v.device_id === $device_id) {
							has_voted.set(true);
							did_vote = true;
						}

						return v.sentiment;
					})
					.reduce((a, b) => a + b) / all_votes.length;
		}

		if (ratings_mean <= 1 && did_vote) {
			// Use CFGI
			ratings_mean = $cfgi_summary?.now.value || ratings_mean;
		}

		aped_score.set(ratings_mean);
	}

	votes.subscribe((v) => v?.length && update_mean_rating(v));
	cfgi_summary.subscribe((cfgi) => cfgi && update_mean_rating($votes));
</script>

<div
	class="sentiment p-6 mb-6 sm:mb-0 flex flex-col items-center justify-evenly mx-auto relative {for_screenshot
		? 'h-screen'
		: 'max-w-[90%] sm:max-w-[600px] h-[300px] sm:h-[300px] '}"
>
	{#if $has_voted && ($auth_user || for_screenshot)}
		<div
			class="flex flex-col items-center justify-center w-20 h-20 px-4 uppercase border-2 rating_score"
			style="border-color: {get_data_color($aped_score)}; color: {get_data_color($aped_score)}"
		>
			<div>
				{Math.round($aped_score)}
			</div>
			<div class="text-xs uppercase">
				{$aped_score < 50 ? 'Bearish' : 'Bullish'}
			</div>
		</div>
	{/if}
	<div class="image">
		<FomoedLogo />
	</div>

	<div class="text-white text-opacity-50 prompt_text">
		{#if $has_voted}
			{#if $auth_user || for_screenshot}
				Aped Score
			{:else}
				Please login to view the Aped Score
			{/if}
		{:else}
			How do you feel about the market today?
		{/if}
	</div>

	{#if $has_voted}
		{#if !$auth_user && !for_screenshot}
			<button
				class="relative w-full px-2 py-2 text-center uppercase rounded cursor-pointer bg-platform_red whitespace-nowrap"
				on:click={() => goto('auth')}
			>
				<div class="text">Login</div>
			</button>
		{/if}
	{:else}
		<div
			class="flex items-center w-full space-x-4 text-xs font-semibold sentiment_buttons justify-evenly"
		>
			<button
				class="relative flex items-center justify-center w-full px-2 py-2 text-center uppercase rounded cursor-pointer bg-platform_red whitespace-nowrap disabled:opacity-30"
				on:click={() => vote(SentimentRatingEnum.BEARISH)}
				disabled={$loading}
			>
				<div
					class="absolute -translate-x-1/2 -translate-y-1/2 loader top-1/2 left-1/2"
					class:opacity-100={$loading}
					class:opacity-0={!$loading}
				>
					<Diamonds color="white" size={20} />
				</div>
				<div class="text" class:opacity-0={$loading}>Bearish</div>
			</button>
			<button
				class="relative flex items-center justify-center w-full px-2 py-2 text-center uppercase rounded cursor-pointer whitespace-nowrap bg-platform_green disabled:opacity-30"
				on:click={() => vote(SentimentRatingEnum.BULLISH)}
				disabled={$loading}
			>
				<div
					class="absolute -translate-x-1/2 -translate-y-1/2 loader top-1/2 left-1/2"
					class:opacity-100={$loading}
					class:opacity-0={!$loading}
				>
					<Diamonds color="white" size={20} />
				</div>
				<div class="text" class:opacity-0={$loading}>Bullish</div>
			</button>
		</div>
	{/if}

	{#if !for_screenshot && $auth_user && $has_voted && $aped_score}
		<div class="absolute bottom-0 right-0 pb-1 pr-8 share_btn">
			<button
				class="flex items-center justify-center px-4 py-2 -mr-3 space-x-1 text-xs uppercase bg-background rounded-2xl"
				on:click={() => {
					show_social_share.set(true);
					return;
				}}
			>
				<span class="inline-block">Share</span>
				<span class="inline-block pb-[0.1rem]">
					<svg
						width="16"
						height="13"
						viewBox="0 0 18 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M18 7L11 0V4C4 5 1 10 0 15C2.5 11.5 6 9.9 11 9.9V14L18 7Z" fill="white" />
					</svg>
				</span>
			</button>
		</div>
	{/if}
</div> -->
