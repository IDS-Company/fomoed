<script lang="ts">
	import { writable } from 'svelte/store';
	import type { ActionData } from './$types';
	import { failure, success } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { auth_user } from '$lib/stores/user';

	const action = writable<'login' | 'signup' | 'forgot' | 'update_password'>('login');

	onMount(() => {
		if ($page.url.searchParams.get('uid') && $auth_user) {
			action.set('update_password');
		}
	});

	export let form: ActionData;

	$: form && console.log('Auth Response: ', form);

	// TODO Change from toast notifications as they are not working as expected
	$: if (form) {
		if (form.error) {
			failure(form.error);
		} else {
			if (form.action === 'signup') {
				success(
					'Successfully created your account. Please check your email for additional instructions'
				);
			}
			if (form.action === 'forgot') {
				success(
					'Successfully sent password reset email. Please check your email for the confirmation link'
				);
			}
			if (form.action === 'update_password') {
				goto('/').then(() => {
					success('Successfully updated password');
				});
			}
		}
	}

	auth_user.subscribe((u) => {
		if (u && $page.url.searchParams.get('uid')) {
			action.set('update_password');
		}
	});
</script>

<section class="w-full h-full mx-auto overflow-hidden login">
	<form
		method="POST"
		action="?/{$action}"
		class="absolute flex flex-col w-full space-y-6 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 max-w-96"
	>
		{#if $action === 'signup'}
			<div class="flex flex-col w-full space-y-3 input_group">
				<label for="username" class="text-white text-opacity-40">Username</label>
				<input
					type="text"
					name="username"
					id="username"
					class="w-full px-4 py-3 border-2 border-blue-400 rounded bg-background"
				/>
			</div>
		{/if}

		{#if $action !== 'update_password'}
			<div class="flex flex-col w-full space-y-3 input_group">
				<label for="email" class="text-white text-opacity-40">Email</label>
				<input
					type="email"
					name="email"
					id="email"
					class="w-full px-4 py-3 border-2 border-blue-400 rounded bg-background"
				/>
			</div>
		{/if}

		{#if $action !== 'forgot'}
			<div class="flex flex-col w-full space-y-3 input_group">
				<label for="password" class="text-white text-opacity-40">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					class="w-full px-4 py-3 border-2 border-blue-400 rounded bg-background"
				/>
			</div>
		{/if}

		<div
			class="flex items-center justify-between w-full text-xs text-white text-opacity-40 input_group"
		>
			{#if $action === 'login'}
				<button
					class="font-bold hover:text-blue-400"
					on:click={() => action.set('forgot')}
					type="button"
				>
					Forgot Password
				</button>
			{/if}
			<button
				class="font-bold hover:text-blue-400"
				on:click={() => ($action === 'login' ? action.set('signup') : action.set('login'))}
				type="button"
			>
				{#if $action === 'login'}
					New User ? Sign Up
				{:else}
					Already have an account ? Login
				{/if}
			</button>
		</div>

		<div class="flex flex-col w-full space-y-3 input_group">
			<button class="px-4 py-3 font-extrabold tracking-widest bg-red-500 rounded">
				{#if $action === 'login'}
					LOGIN
				{:else if $action === 'forgot'}
					Send Password Reset Email
				{:else if $action === 'update_password'}
					Update Password
				{:else}
					SIGNUP
				{/if}
			</button>
		</div>
	</form>
</section>
