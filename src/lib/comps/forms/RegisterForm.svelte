<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import MainButton from '../buttons/MainButton.svelte';
	import TextInput from '../TextInput.svelte';

	const dispatch = createEventDispatcher();
</script>

<div>
	<h1 class="font-paralucent-demibold text-[32px]">Create an account</h1>
	<div class="text-[#FFFFFFCC] pt-[12px]">Join the club and start you 30 day free trial.</div>

	<div class="pt-5">
		<label for="username" class="font-satoshi font-medium mb-2 block text-[#FFFFFF99]">
			Username
		</label>
		<TextInput id="username" placeholder="fomoed00" />

		<div class="flex text-[#FFFFFF99] mt-3">
			<label for="Email" class="font-satoshi font-medium flex-grow mb-2"> Email </label>
		</div>
		<TextInput id="email" placeholder="example@mail.com" />

		<div class="flex text-[#FFFFFF99] mt-3">
			<label for="password" class="font-satoshi font-medium flex-grow mb-2"> Password </label>
		</div>
		<TextInput id="password" placeholder="••••••••" hidden />
	</div>

	<div class="pt-[30px]">
		<MainButton>Register now</MainButton>
	</div>

	<div class="pt-3">
		<span class="opacity-40">Already have an account? </span>
		<button on:click={() => dispatch('click-login-link')} class="text-primary">Login</button>
	</div>
</div>
