<script lang="ts">
	import { newsKindOpts, type NewsKindOption } from '$ts/client/services/NewsService.client';
	import BaseDropdown from './BaseDropdown.svelte';

	let { selected = $bindable() }: { selected: NewsKindOption } = $props();
</script>

<BaseDropdown options={newsKindOpts} bind:selected />
