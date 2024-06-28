<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import MainButton from '$lib/comps/buttons/MainButton.svelte';
	import GoogleSignInButton from '$lib/comps/GoogleSignInButton.svelte';
	import TextInput from '$lib/comps/TextInput.svelte';

	const dispatch = createEventDispatcher();
</script>

<div>
	<h1 class="font-paralucent-demibold text-[32px]">Welcome!</h1>
	<div class="text-[#FFFFFFCC]">Log in to fomoed to continue access more tools.</div>

	<div class="pt-[30px]">
		<GoogleSignInButton />
	</div>

	<div class="pt-5 flex items-center">
		<div class="h-px bg-[#FFFFFF33] mr-8 flex-grow"></div>
		<div class="font-paralucent font-medium opacity-80">or</div>
		<div class="h-px bg-[#FFFFFF33] ml-8 flex-grow"></div>
	</div>

	<div class="pt-5">
		<label for="email" class="font-satoshi font-medium mb-2 block text-[#FFFFFF99]"> Email </label>
		<TextInput id="email" placeholder="example@mail.com" />

		<div class="flex text-[#FFFFFF99] mt-3">
			<label for="password" class="font-satoshi font-medium flex-grow mb-2"> Password </label>
			<button on:click={() => dispatch('click-forgot-password')}>Forgot your password?</button>
		</div>
		<TextInput id="password" placeholder="••••••••" hidden />
	</div>

	<div class="pt-[30px]">
		<MainButton>Sign In</MainButton>
	</div>

	<div class="pt-3">
		<span class="opacity-40">Don't have an account? </span>
		<button on:click={() => dispatch('click-register-link')} class="text-primary">
			Register now!
		</button>
	</div>
</div>
