<script lang="ts">
	import { DashboardService } from '$ts/client/services/DashboardService.client';
	import { NewsService } from '$ts/client/services/NewsService.client';
	import { setContext } from 'svelte';

	const newsService = new NewsService();
	const dashboardService = new DashboardService();

	setContext('newsService', newsService);
	setContext('dashboardService', dashboardService);
</script>

<slot />
