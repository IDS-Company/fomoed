<script lang="ts">
	import {
		newsFilterOpts,
		newsKindOpts,
		type NewsService
	} from '$ts/client/services/NewsService.client';
	import { getContext, tick } from 'svelte';
	import type { NewsItem } from '$ts/types';
	import NewsFilterDropdown from '../dropdowns/NewsFilterDropdown.svelte';
	import NewsKindDropdown from '../dropdowns/NewsKindDropdown.svelte';
	import BaseSearch from '../search/BaseSearch.svelte';
	import TextSkeleton from '../skeletons/TextSkeleton.svelte';
	import { coinstats_selected_coin } from '$lib/stores';
	import Funnel from '$lib/icons/Funnel.icon.svelte';
	import { fly, slide } from 'svelte/transition';
	import Time from 'svelte-time/Time.svelte';
	import { quintOut } from 'svelte/easing';
	import Heart from '$lib/icons/Heart.icon.svelte';
	import CancelIcon from '$lib/icons/CancelIcon.svelte';
	import Share from '$lib/icons/Share.icon.svelte';
	import CardError from '../CardError.svelte';
	import Youtube from 'svelte-youtube-embed';
	import Film from '$lib/icons/Film.icon.svelte';
	import SimpleBar from 'simplebar';
	import { inview } from 'svelte-inview';
	import { fill } from 'lodash-es';

	const newsService = getContext<NewsService>('newsService');

	const { status, error, news, hasNextPage } = newsService;

	let newsFilterSelected = $state(newsFilterOpts[0]);
	let newsKindSelected = $state(newsKindOpts[0]);
	let searchValue = $state('');
	let showFilters = $state(false);
	let detailShownItem = $state<NewsItem | null>(null);
	let clientWidth = $state(0);

	let isDetailBullish = $derived(
		detailShownItem && detailShownItem.votes.positive > detailShownItem.votes.negative
	);

	let isDetailBearish = $derived(
		detailShownItem && detailShownItem.votes.positive < detailShownItem.votes.negative
	);

	$effect(() => {
		console.log('running');

		newsService.fetchNews({
			filter: newsFilterSelected.value,
			kind: newsKindSelected.value
			// search: searchValue
		});
	});

	$inspect(detailShownItem);

	let placeholderMediaUrl = $state('https://www.youtube.com/watch?v=29-NlwqtijM');

	const videoId = $derived(() => {
		const url = new URL(placeholderMediaUrl);
		return url.searchParams.get('v');
	});

	function getRedGreenDotCounts(item: NewsItem | null) {
		if (!item?.votes) {
			return { red: 0, green: 0 };
		}

		const maxDots = 10;

		const red = item.votes.negative;
		const green = item.votes.positive;

		if (red + green < maxDots) {
			return { red, green };
		}

		const total = red + green;
		const redRatio = red / total;
		const greenRatio = green / total;

		return {
			red: Math.round(redRatio * maxDots),
			green: Math.round(greenRatio * maxDots)
		};
	}

	let listContainer = $state<HTMLElement>();
	let showTopGradient = $state(false);
	let simplebar: SimpleBar;

	$effect(() => {
		simplebar = new SimpleBar(listContainer as HTMLElement, {
			autoHide: false
		});

		function listScrollHandler(e: Event) {
			showTopGradient = (e.target as HTMLElement).scrollTop > 0;
		}

		// @ts-ignore
		simplebar.contentWrapperEl.style.overscrollBehavior = 'contain';
		simplebar.contentWrapperEl?.addEventListener('scroll', listScrollHandler);

		return () => {
			simplebar.contentWrapperEl?.removeEventListener('scroll', listScrollHandler);
			simplebar.unMount();
		};
	});

	async function fetchNextPage() {
		await newsService.fetchNextPage();
	}
</script>

{#snippet statsRow(item: NewsItem | null)}
	{@const { red, green } = getRedGreenDotCounts(item)}

	<div class="items-center pt-2 flex gap-x-2 opacity-75">
		<div class="w-4">
			<Heart />
		</div>

		<div class="min-w-4 rounded text-center whitespace-pre text-sm" class:bg-skeleton={!item}>
			{#if item?.votes.liked != null}
				<span class="-ml-2 inline-block">
					{item?.votes.liked}
				</span>
			{:else}
				{' '}
			{/if}
		</div>

		{#if item?.kind === 'media'}
			<div class="w-5">
				<Film />
			</div>

			<!-- <a
				class="border-white/20 bg-white/10 border px-2 py-1 text-xs font-medium rounded mr-1 hover:border-primary"
				href={placeholderMediaUrl}
				target="_blank"
			>
				Watch
			</a> -->
		{/if}

		<div class="flex-grow"></div>

		{#if item?.votes.negative}
			<div class="text-xs text-red font-semibold">{item?.votes.negative}</div>
		{/if}

		{#if item}
			{#each new Array(red) as _}
				<div class="w-3 h-3 rounded-full bg-red"></div>
			{/each}

			{#each new Array(green) as _}
				<div class="w-3 h-3 rounded-full bg-green"></div>
			{/each}
		{/if}

		{#if item?.votes.positive}
			<div class="text-xs text-green font-semibold">{item?.votes.positive}</div>
		{/if}
	</div>
{/snippet}

{#snippet newsItem(item: NewsItem | null, onFirstInView: any)}
	<button
		use:inview={{ unobserveOnEnter: true }}
		oninview_enter={onFirstInView}
		class="py-1 group w-full text-left"
		onclick={() => (detailShownItem = item)}
	>
		<div
			class="border-white border-opacity-20 rounded-lg border px-4 py-6 w-full duration-200 group-hover:!duration-0"
			class:cursor-pointer={item}
			class:item-bearish={item ? item.votes.negative > item.votes.positive : false}
			class:item-bullish={item ? item.votes.negative < item.votes.positive : false}
			class:item-neutral={item ? item.votes.negative === item.votes.positive : false}
		>
			<div class="flex gap-x-4 font-paralucent relative items-center">
				<div class="flex-grow text-lg" class:whitespace-pre={!item}>
					{item?.title || ' '}

					{#if !item}
						<TextSkeleton class="inset-0" />
					{/if}
				</div>

				<div class="opacity-50 min-w-32 rounded-lg text-right" class:bg-skeleton={!item}>
					{#if item}
						<Time live timestamp={new Date(item?.published_at).getTime()} relative />
					{:else}
						<span class="whitespace-pre">
							{' '}
						</span>
					{/if}
				</div>
			</div>

			{@render statsRow(item)}
		</div>
	</button>
{/snippet}

<div bind:clientWidth class="w-full px-8 pb-4 relative">
	<div class="flex gap-x-2">
		<h2 class="text-[20px] font-paralucent-heavy pt-5">{$coinstats_selected_coin?.name} news</h2>

		<div class="flex-grow"></div>

		<button
			onclick={() => (showFilters = !showFilters)}
			class="pl-2 pr-1 hover:text-white text-transparent duration-200 pt-5"
		>
			<div class="w-4">
				<Funnel />
			</div>
		</button>
	</div>

	{#if showFilters}
		<div class="flex gap-x-2 pt-2 pb-3 border-b border-white/20" transition:slide>
			<div class="flex-grow">
				<BaseSearch bind:value={searchValue} />
			</div>

			<div class="w-40">
				<NewsFilterDropdown bind:selected={newsFilterSelected} />
			</div>

			<div class="w-40">
				<NewsKindDropdown bind:selected={newsKindSelected} />
			</div>
		</div>
	{/if}

	<div class="grid h-[500px] overflow-hidden w-full mt-2 relative">
		{#if $status === 'error'}
			<CardError>{$error}</CardError>
		{:else}
			<div
				id="list-container"
				bind:this={listContainer}
				class="no-scrollbar"
				style="overflow-y: scroll;"
			>
				{#each [...$news, ...($hasNextPage ? fill(new Array(4), null) : [])] as item, index}
					{@render newsItem(
						item,
						index === $news.length ? () => $news.length && fetchNextPage() : null
					)}
				{/each}

				{#if !$hasNextPage}
					<div class="text-center text-white opacity-50 py-32 text-lg font-semibold">
						No more news
					</div>
				{/if}
			</div>

			<div
				class="absolute top-0 w-full h-8 bg-gradient-to-t from-transparent to-[#0F0D0D] duration-200"
				class:opacity-0={!showTopGradient}
			></div>

			<div
				class="absolute bottom-0 w-full h-12 bg-gradient-to-b from-transparent to-[#0F0D0D]"
			></div>
		{/if}
	</div>

	<!-- Detail overlay -->
	{#if detailShownItem}
		<div
			id="detail-container"
			class="absolute inset-0 backdrop-blur-3xl backdrop-brightness-90 p-12"
			class:bullish={isDetailBullish}
			class:bearish={isDetailBearish}
			transition:fly={{ x: clientWidth, duration: 600, opacity: 1, easing: quintOut }}
		>
			<button
				class="z-10 h-10 active:brightness-50 items-center duration-100 absolute top-12 right-12 p-2 border-white/10 border rounded-lg bg-white/10"
				onclick={() => (detailShownItem = null)}
			>
				<div class="h-6 w-6">
					<CancelIcon />
				</div>
			</button>

			<div
				data-simplebar
				class="overflow-y-scroll h-full max-w-prose mx-auto pr-6 translate-x-3 no-scrollbar"
			>
				<div class="flex gap-x-4">
					<div class="font-paralucent-heavy text-4xl">
						{detailShownItem.title}
					</div>
				</div>

				<div class="pt-2 opacity-60 flex">
					<div>
						<a href={detailShownItem.url} class="underline" target="_blank">Link to source</a>
					</div>

					<div class="flex-grow"></div>

					<div class="flex items-center gap-x-2">
						<a href={detailShownItem.url} class="underline" target="_blank">Share</a>

						<div class="w-4">
							<Share />
						</div>
					</div>
				</div>

				{#if detailShownItem.kind === 'media'}
					<div class="mt-4">
						<Youtube id={videoId} animations={false} />
					</div>
				{/if}

				<div class="mt-4 text-justify">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
					sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
					est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
					tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
					exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
					dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
					Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
					anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
					nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
					irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
					pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
					deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing
					elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
					veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
					Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
					nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
					deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing
					elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
					veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
					Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
					nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
					deserunt mollit anim id est laborum.
				</div>

				{@render statsRow(detailShownItem)}
			</div>
		</div>
	{/if}
</div>

<style>
	.item-bullish {
		@apply bg-green bg-opacity-10 group-hover:bg-opacity-20;
	}

	.item-bearish {
		@apply bg-red bg-opacity-10 group-hover:bg-opacity-20;
	}

	.item-neutral {
		@apply bg-white/5 group-hover:bg-white/10;
	}

	#detail-container.bullish {
		@apply bg-green bg-opacity-5;
	}

	#detail-container.bearish {
		@apply bg-red bg-opacity-5;
	}

	#list-container :global(.simplebar-vertical) {
		@apply opacity-0;
	}
</style>
