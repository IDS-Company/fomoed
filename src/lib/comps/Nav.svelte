<script lang="ts">
	import { auth_email } from '$lib/stores/user';
	import Navlink from './Navlink.svelte';
	import ProfileButton from '$lib/comps/ProfileButton.svelte';
	import LoadUserData from './func/LoadUserData.svelte';
	import LoginButton from './buttons/LoginButton.svelte';
	import DashboardButton from './buttons/DashboardButton.svelte';
</script>

<LoadUserData />

<!-- <nav
	class="z-50 flex items-center justify-between px-3 text-xs border-b-2 sm:px-6 border-background bg-background h-14 sm:text-base"
>
	<a href="/" class="flex items-center justify-center h-full mr-10 cursor-pointer">
		<Logo />
	</a>

	<div class="flex">
		<a
			href="/plans"
			class="flex items-center justify-center px-4 py-2 font-bold text-white cursor-pointer text-opacity-70 hover:text-red-500"
			>Plans</a
		>
		<button
			class="flex items-center justify-center px-4 py-2 font-bold text-blue-500 cursor-pointer text-opacity-70 hover:text-red-500"
			on:click={() => handleActions()}
		>
			{#if $auth_email}
				Sign Out
			{:else}
				Login
			{/if}
		</button>
	</div>
</nav> -->

<nav class="relative flex h-[75px] items-center justify-center w-full z-10">
	<div class="absolute h-full left-4 top-0">
		<img src="/fomoed.svg" alt="Fomoed." class="h-full w-[110px] -sm:w-[80px]" />
	</div>

	<div class="font-paralucent font-medium flex gap-x-8 -sm:hidden">
		<!-- <Navlink href="/about">About</Navlink> -->
		<Navlink href="/plans">Plans</Navlink>
		<Navlink href="/#contact">Contact</Navlink>
		<Navlink href="/dashboard">Dashboard</Navlink>
	</div>

	<div class="absolute right-4 items-center flex">
		<div class="sm:hidden">
			<DashboardButton />
		</div>

		{#if $auth_email}
			<div class="ml-1">
				<ProfileButton></ProfileButton>
			</div>
		{:else}
			<div class="ml-2">
				<LoginButton></LoginButton>
			</div>
		{/if}
	</div>
</nav>
