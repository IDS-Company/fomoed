<script lang="ts">
	import { NewsService } from '$ts/client/services/NewsService.client';
	import { setContext } from 'svelte';

	const newsService = new NewsService();

	setContext('newsService', newsService);
</script>

<slot />
