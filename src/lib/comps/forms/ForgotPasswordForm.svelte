<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import MainButton from '../buttons/MainButton.svelte';

	import TextInput from '../TextInput.svelte';
	import InputLabel from '../InputLabel.svelte';

	const dispatch = createEventDispatcher();
</script>

<div>
	<h1 class="font-paralucent-demibold text-[32px]">Reset Password</h1>
	<div class="text-[#FFFFFFCC] pt-3 -desktop:text-sm">
		Enter your email and please wait to get the link for password reset
	</div>

	<div class="pt-5">
		<InputLabel forId="email">Email</InputLabel>

		<div class="mt-2">
			<TextInput id="email" placeholder="example@mail.com" />
		</div>
	</div>

	<div class="pt-[30px] -desktop:pt-5">
		<MainButton>Get the link</MainButton>
	</div>

	<div class="pt-3 -desktop:pt-5">
		<button
			on:click={() => dispatch('click-login-link')}
			class="text-primary text-center block w-full -desktop:text-xs">Return to login</button
		>
	</div>
</div>
