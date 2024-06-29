<script>
	import { auth_user } from '$lib/stores/user';
	import CryptoDropdown from './CryptoDropdown.svelte';
	import LoadUserData from './func/LoadUserData.svelte';
	import ProfileButton from './ProfileButton.svelte';

	export let showCurrencyDropdown = false;
</script>

<LoadUserData />

<nav class="relative flex h-[75px] items-center justify-center w-full max-w-screen-xl mx-auto z-10">
	<div class="absolute h-full left-2 top-0 z-10">
		<a href="/">
			<img src="/fomoed.svg" alt="Fomoed." class="h-full" width={110} height={23} />
		</a>
	</div>

	<div class="absolute right-2 flex gap-x-[10px] w-full">
		<div class="flex-grow"></div>

		{#if showCurrencyDropdown}
			<CryptoDropdown />
		{/if}

		{#if $auth_user}
			<ProfileButton></ProfileButton>
		{/if}
	</div>
</nav>
