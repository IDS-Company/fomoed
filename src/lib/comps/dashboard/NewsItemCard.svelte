<script lang="ts">
	import type { NewsItem } from '$ts/types';

	export let newsItem: NewsItem;
</script>

<div class="border-white border-opacity-20 rounded-lg border p-4 w-full">
	{newsItem.title}
</div>
