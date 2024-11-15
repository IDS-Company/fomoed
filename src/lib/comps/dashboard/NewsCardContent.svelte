<script lang="ts">
	import {
		newsFilterOpts,
		newsKindOpts,
		type NewsService
	} from '$ts/client/services/NewsService.client';
	import { getContext, onMount } from 'svelte';
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
	import ChevronLeft from '$lib/icons/ChevronLeft.icon.svelte';
	import Heart from '$lib/icons/Heart.icon.svelte';
	import { negate } from 'lodash-es';
	import CancelIcon from '$lib/icons/CancelIcon.svelte';
	import Share from '$lib/icons/Share.icon.svelte';

	const newsService = getContext<NewsService>('newsService');

	const { status, error, news } = newsService;

	onMount(() => {
		newsService.fetchNews();
	});

	let newsFilterSelected = $state(newsFilterOpts[0]);
	let newsKindSelected = $state(newsKindOpts[0]);
	let searchValue = $state('');
	let showFilters = $state(false);
	let detailShownItem = $state<NewsItem | null>(null);
	let clientWidth = $state(0);
</script>

{#snippet statsRow(item: NewsItem | null)}
	<div class="items-center pt-2 flex gap-x-2 opacity-75">
		<div class="w-4">
			<Heart />
		</div>

		<div class="min-w-4 rounded text-center whitespace-pre text-sm" class:bg-skeleton={!item}>
			{item?.votes.liked ?? ' '}
		</div>

		<div class="flex-grow"></div>

		{#if item}
			{#each new Array(item.votes.negative) as _}
				<div class="w-3 h-3 rounded-full bg-red"></div>
			{/each}

			{#each new Array(item.votes.positive) as _}
				<div class="w-3 h-3 rounded-full bg-green"></div>
			{/each}
		{/if}
	</div>
{/snippet}

{#snippet newsItem(item: NewsItem | null)}
	<button class="py-1 group w-full text-left" onclick={() => (detailShownItem = item)}>
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

{#if $status === 'error'}
	<div>Error: {$error}</div>
{:else}
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
			<div class="overflow-y-scroll">
				{#each $news.length ? $news : new Array(10) as item}
					{@render newsItem(item)}
				{/each}
			</div>

			<div
				class="absolute bottom-0 w-full h-12 bg-gradient-to-b from-transparent to-[#0F0D0D]"
			></div>
		</div>

		{#if detailShownItem}
			<div
				class="absolute inset-0 backdrop-blur-3xl backdrop-brightness-90 p-12"
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

					<div class="mt-4 text-justify">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
						dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
						Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
						mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
						do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
						quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
						aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
						deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing
						elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
						minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
						consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
						eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
						qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
						adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
						enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
						commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
						dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet,
						consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
						aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
						velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
						proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</div>

					{@render statsRow(detailShownItem)}
				</div>
			</div>
		{/if}
	</div>
{/if}

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
</style>
