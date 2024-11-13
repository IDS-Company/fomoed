<script lang="ts">
	import { type NewsService } from '$ts/client/services/NewsService.client';
	import { getContext, onMount } from 'svelte';
	import NewsCard from './NewsItemCard.svelte';

	const newsService = getContext<NewsService>('newsService');

	const { status, error, news } = newsService;

	onMount(() => {
		newsService.fetchNews();
	});
</script>

{#if $status === 'loading'}
	<div>Loading...</div>
{:else if $status === 'error'}
	<div>Error: {$error}</div>
{:else}
	<div class="grid gap-y-2">
		{#each $news as newsItem}
			<NewsCard {newsItem} />
		{/each}
	</div>
{/if}
