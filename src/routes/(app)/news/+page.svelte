<script lang="ts">
	import AppNav from '$lib/comps/AppNav.svelte';
	import NewsCardContent from '$lib/comps/dashboard/NewsCardContent.svelte';
	import { setContext } from 'svelte';
	import { NewsService } from '$ts/client/services/NewsService.client';
	import { innerHeight } from '$lib/stores/ui';

	let scrollY = 0;

	const newsService = new NewsService();

	setContext('newsService', newsService);
</script>

<svelte:window bind:scrollY />

<div class="bg-[url(/background/dashboard.svg)] inset-0 fixed min-h-screen bg-cover -z-10"></div>

<div
	class="fixed top-0 w-full z-40 -desktop:bg-[50%_50%]"
	style="backdrop-filter: brightness({1 - Math.min(0.7, scrollY / 100)}) blur(16px);"
>
	<AppNav showDashboardLink />
</div>

<div class="pt-12 max-w-screen-xl mx-auto overflow-hidden" style="height: {$innerHeight}px;">
	<NewsCardContent
		alwaysShowFilters
		autoListWrapperHeight
		disableGradientEdges
		class="desktop:!px-6 -desktop:!px-2 !pb-0"
	/>
</div>
