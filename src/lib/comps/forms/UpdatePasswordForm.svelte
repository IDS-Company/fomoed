<script lang="ts">
	import MainButton from '../buttons/MainButton.svelte';
	import TextInput from '../TextInput.svelte';
</script>

<div>
	<h1 class="font-paralucent-demibold text-[32px]">Change Password</h1>
	<div class="text-[#FFFFFFCC] pt-[12px]">
		Your new password must be different from you previous password
	</div>

	<div class="pt-5">
		<div class="flex text-[#FFFFFF99] mt-3">
			<label for="password" class="font-satoshi font-medium flex-grow mb-2"> New Password </label>
		</div>
		<TextInput id="password" placeholder="••••••••" hidden />

		<div class="flex text-[#FFFFFF99] mt-3">
			<label for="confirm-password" class="font-satoshi font-medium flex-grow mb-2">
				Confirm Password
			</label>
		</div>
		<TextInput id="confirm-password" placeholder="••••••••" hidden />
	</div>

	<div class="pt-[30px]">
		<MainButton>Confirm new password</MainButton>
	</div>
</div>
