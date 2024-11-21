<script lang="ts">
	import NewsFilterDropdown from '$lib/comps/dropdowns/NewsFilterDropdown.svelte';
	import NewsKindDropdown from '$lib/comps/dropdowns/NewsKindDropdown.svelte';
	import BaseSearch from '$lib/comps/search/BaseSearch.svelte';
	import { newsFilterOpts, newsKindOpts } from '$ts/client/services/NewsService.client';

	let newsFilterSelected = $state(newsFilterOpts[0]);
	let newsKindSelected = $state(newsKindOpts[0]);
	let searchValue = $state('');
</script>

<div class="max-w-prose mx-auto pt-8 grid gap-y-2">
	<div class="w-40">
		<NewsFilterDropdown bind:selected={newsFilterSelected} />
	</div>

	<div class="w-40">
		<NewsKindDropdown bind:selected={newsKindSelected} />
	</div>

	<div class="w-40">
		<BaseSearch bind:value={searchValue} />
	</div>
</div>
