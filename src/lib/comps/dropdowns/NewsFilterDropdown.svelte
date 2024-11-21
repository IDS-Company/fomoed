<script lang="ts">
	import { newsFilterOpts, type NewsFilterOption } from '$ts/client/services/NewsService.client';
	import BaseDropdown from './BaseDropdown.svelte';

	let { selected = $bindable() }: { selected: NewsFilterOption } = $props();
</script>

<BaseDropdown options={newsFilterOpts} bind:selected />
