<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import _ from 'lodash-es';
	import Sentiment from '$lib/comps/widgets/Sentiment.svelte';

	onMount(() => {
		const now = $page.url.searchParams.get('aped-score');
	});
</script>

<Sentiment for_screenshot={true} />
