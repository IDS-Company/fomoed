<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import MainButton from '../buttons/MainButton.svelte';

	import TextInput from '../TextInput.svelte';

	const dispatch = createEventDispatcher();
</script>

<div>
	<h1 class="font-paralucent-demibold text-[32px]">Reset Password</h1>
	<div class="text-[#FFFFFFCC] pt-3">
		Enter your email and please wait to get the link for password reset
	</div>

	<div class="pt-5">
		<div class="flex text-[#FFFFFF99] mt-3">
			<label for="Email" class="font-satoshi font-medium flex-grow mb-2"> Email </label>
		</div>
		<TextInput id="email" placeholder="example@mail.com" />
	</div>

	<div class="pt-[30px]">
		<MainButton>Get the link</MainButton>
	</div>

	<div class="pt-3">
		<button
			on:click={() => dispatch('click-login-link')}
			class="text-primary text-center block w-full">Return to login</button
		>
	</div>
</div>
