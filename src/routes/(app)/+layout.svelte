<script lang="ts">
	import 'simplebar';
	import 'simplebar/dist/simplebar.css';
	import '$lib/app.css';

	import ResizeObserver from 'resize-observer-polyfill';
	import { browser } from '$app/environment';
	import { goto, invalidate } from '$app/navigation';
	import { onMount, setContext } from 'svelte';

	import { page } from '$app/stores';
	import { no_reroute_routes } from '$lib';
	import { auth_email, logged_in } from '$lib/stores/user';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { failure, fetch_global_data } from '$lib/utils/index.js';
	import { MetaTags } from 'svelte-meta-tags';
	import { refresh_coinstats_coin_list } from '$lib/utils';
	import MobileMenu from '$lib/comps/mobile/MobileMenu.svelte';
	import { displayLogoutPopup, innerWidth, mobileMenuOpen } from '$lib/stores/ui.js';
	import SignOutPopup from '$lib/comps/popups/SignOutPopup.svelte';
	import { signOut } from '$lib/utils/user.js';

	// const supabase = getContext<SupabaseClient>('supabase');

	// Redirected here once the user has bought and they will add the sessionId as a query parameter

	export let data;
	$: ({ session, supabase, user } = data);

	onMount(() => {
		refresh_coinstats_coin_list();
		fetch_global_data();

		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				auth_email.set(null);
				logged_in.set(false);

				if ($page.route.id && !no_reroute_routes.includes($page.route.id)) {
					setTimeout(() => {
						goto('/auth', { invalidateAll: true });
					});
				}
			} else {
				if (newSession?.expires_at && Date.now() / 1000 < newSession?.expires_at) {
					// Refresh the user data/information
					if (browser && user?.email) {
						auth_email.set(user?.email);
						logged_in.set(true);
					}
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

<!-- <main>
	<SvelteToast />
	<Nav />

	<slot />
</main> -->

<svelte:window bind:innerWidth={$innerWidth} />

{#if $displayLogoutPopup}
	<SignOutPopup
		on:sign-out={() => signOut(supabase)}
		on:cancel={() => displayLogoutPopup.set(false)}
	/>
{/if}

{#if $mobileMenuOpen && !$displayLogoutPopup}
	<MobileMenu />
{/if}

<SvelteToast />

<slot />
