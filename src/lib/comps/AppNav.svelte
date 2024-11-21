<script>
	import { auth_user } from '$lib/stores/user';
	import AllNewsButton from './AllNewsButton.svelte';
	import DashboardButton from './buttons/DashboardButton.svelte';
	import LoginButton from './buttons/LoginButton.svelte';
	import CryptoDropdown from './CryptoDropdown.svelte';
	import LoadUserData from './func/LoadUserData.svelte';
	import MobileMenuButton from './mobile/MobileMenuButton.svelte';
	import ProfileButton from './ProfileButton.svelte';

	export let showCurrencyDropdown = false;
	export let showAllNewsLink = false;
	export let showDashboardLink = false;
</script>

<LoadUserData />

<nav
	class="relative flex h-[75px] items-center justify-center w-full max-w-screen-xl mx-auto z-10 flex-shrink-0"
>
	<div class="absolute h-full left-2 top-0 z-10 ml-4">
		<a href="/" class="h-[75px] flex items-center">
			<img src="/fomoed.svg" alt="Fomoed." />
		</a>
	</div>

	<div class="absolute right-2 flex gap-x-[10px] w-full items-center h-full py-3">
		<div class="flex-grow"></div>

		{#if showDashboardLink}
			<DashboardButton />
		{/if}

		{#if showAllNewsLink}
			<AllNewsButton />
		{/if}

		{#if showCurrencyDropdown}
			<CryptoDropdown />
		{/if}

		{#if $auth_user}
			<div class="-desktop:hidden">
				<ProfileButton></ProfileButton>
			</div>
		{:else}
			<div class="-desktop:hidden">
				<LoginButton></LoginButton>
			</div>
		{/if}

		<div class="desktop:hidden">
			<MobileMenuButton></MobileMenuButton>
		</div>
	</div>
</nav>
