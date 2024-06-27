<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Logo from '$lib/icons/Logo.svelte';
	import { auth_email, auth_user } from '$lib/stores/user';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { getContext } from 'svelte';
	import { get_user } from '$lib';

	const supabase = getContext<SupabaseClient>('supabase');

	async function handleActions() {
		if ($auth_email) {
			const { error } = await supabase.auth.signOut();
			error && console.log('Auth Action Error: ', error);
		} else {
			await goto('/auth');
		}
	}

	auth_email.subscribe(async (email) => {
		if (email) {
			if (browser && supabase) {
				await get_user(supabase);
			}
		} else {
			auth_user.set(null);
		}
	});
</script>

<nav
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
</nav>
