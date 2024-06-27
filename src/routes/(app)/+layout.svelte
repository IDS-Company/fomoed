<script lang="ts">
	import 'simplebar';
	import 'simplebar/dist/simplebar.css';
	import '$lib/app.css';

	import ResizeObserver from 'resize-observer-polyfill';
	import { browser } from '$app/environment';
	import { goto, invalidate } from '$app/navigation';
	import { onMount, setContext } from 'svelte';

	import Nav from '$lib/comps/Nav.svelte';
	import { page } from '$app/stores';
	import { no_reroute_routes } from '$lib';
	import { auth_email } from '$lib/stores/user';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { failure } from '$lib/utils/index.js';
	import { MetaTags } from 'svelte-meta-tags';

	// Redirected here once the user has bought and they will add the sessionId as a query parameter

	export let data;
	$: ({ session, supabase, user } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				auth_email.set(null);

				if ($page.route.id && !no_reroute_routes.includes($page.route.id)) {
					setTimeout(() => {
						goto('/auth', { invalidateAll: true });
					});
				}
			} else {
				if (newSession?.expires_at && Date.now() / 1000 < newSession?.expires_at) {
					// Refresh the user data/information
					browser && user?.email && auth_email.set(user?.email);
				}
			}

			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		if (
			$page.url.hash
				.split('&')
				.filter((m) => m.startsWith('error_description'))[0]
				?.split('=')[1]
				?.replaceAll('+', ' ')
		) {
			failure(
				$page.url.hash
					.split('&')
					.filter((m) => m.startsWith('error_description'))[0]
					?.split('=')[1]
					?.replaceAll('+', ' ')
			);
		}

		return () => data.subscription.unsubscribe();
	});

	if (browser) {
		window.ResizeObserver = ResizeObserver;
	}

	$: ((supabase) => browser && setContext('supabase', supabase))(supabase);
</script>

<MetaTags
	title="Fomoed"
	description="Fomoed provides a toolset for effortlessly navigating the emotional rollercoaster that is
crypto. Have complete access to your favorite Altcoins and get precise data-based market
sentiment analysis"
	openGraph={{
		title: `Fomoed ${$page.url.searchParams.get('score') ? `Score ${$page.url.searchParams.get('score')}` : ''}`,
		url: $page.url.href,
		images: [
			{
				url: '/images/plans_graphic.png',
				width: 1200,
				height: 630,
				alt: `Fomoed Score ${$page.url.searchParams.get('score') ? $page.url.searchParams.get('score') : ''}`
			}
		],
		siteName: 'Fomoed',
		description:
			'Fomoed provides a toolset for effortlessly navigating the emotional rollercoaster that is crypto. Have complete access to your favorite Altcoins and get precise data-based market sentiment analysis'
	}}
	twitter={{
		cardType: 'summary_large_image',
		title: `Fomoed ${$page.url.searchParams.get('score') ? `Score ${$page.url.searchParams.get('score')}` : ''}`,
		description:
			'Fomoed provides a toolset for effortlessly navigating the emotional rollercoaster that is crypto. Have complete access to your favorite Altcoins and get precise data-based market sentiment analysis',
		image: '/images/plans_graphic.png',
		imageAlt: `Fomoed Score ${$page.url.searchParams.get('score') ? $page.url.searchParams.get('score') : ''}`
	}}
/>

<main>
	<SvelteToast />
	<Nav />

	<slot />
</main>
