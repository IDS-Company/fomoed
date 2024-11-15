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
	import { slide } from 'svelte/transition';
	import Time from 'svelte-time/Time.svelte';

	const newsService = getContext<NewsService>('newsService');

	const { status, error, news } = newsService;

	onMount(() => {
		newsService.fetchNews();
	});

	let newsFilterSelected = $state(newsFilterOpts[0]);
	let newsKindSelected = $state(newsKindOpts[0]);
	let searchValue = $state('');
	let showFilters = $state(false);
</script>

{#snippet newsItem(item: NewsItem | null)}
	<div class="py-1 group w-full">
		<div
			class="border-white border-opacity-20 rounded-lg border px-4 py-6 w-full cursor-pointer duration-200 group-hover:!duration-0 relative flex gap-x-4 font-paralucent"
			class:item-bearish={item ? item.votes.negative > item.votes.positive : false}
			class:item-bullish={item ? item.votes.negative < item.votes.positive : false}
			class:item-neutral={item ? item.votes.negative === item.votes.positive : false}
		>
			<div class="flex-grow" class:whitespace-pre={!item}>
				{item?.title || ' '}
			</div>

			<div class="opacity-50 whitespace-nowrap flex">
				{#if item}
					<Time live timestamp={new Date(item?.published_at).getTime()} relative />
				{/if}
			</div>

			{#if !item}
				<TextSkeleton class="inset-4" />
			{/if}
		</div>
	</div>
{/snippet}

{#if $status === 'error'}
	<div>Error: {$error}</div>
{:else}
	<div class="w-full px-8 pb-4">
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
			<div class="flex gap-x-2 pt-2" transition:slide>
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
			<div class="overflow-y-scroll h-full">
				{#each $news.length ? $news : new Array(10) as item}
					{@render newsItem(item)}
				{/each}
			</div>

			<div
				class="absolute bottom-0 w-full h-12 bg-gradient-to-b from-transparent to-[#0F0D0D]"
			></div>
		</div>
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
