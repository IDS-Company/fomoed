<script lang="ts">
	import SecondaryButton from './buttons/SecondaryButton.svelte';
	import { goto } from '$app/navigation';
	import { auth_email, auth_user } from '$lib/stores/user';
	import Time from 'svelte-time/Time.svelte';
	import { active_sub } from '$lib/stores/subs';
	import BorderedProfileImage from './BorderedProfileImage.svelte';
	import { displayLogoutPopup } from '$lib/stores/ui';
</script>

<div
	class="w-[200px] h-[260px] bg-[#0F0D0DE5] border-[#FFFFFF1A] rounded-[10px] pt-[17px] flex flex-col items-center absolute right-0 top-0 border backdrop-blur-lg z-40"
>
	<div class="w-[62px]">
		<BorderedProfileImage />
	</div>

	<div class="pt-[6px] text-[18px] font-paralucent-demibold">
		{$auth_user?.username || $auth_email?.substring(0, 8) + '...'}
	</div>
	<div class="text-[#FFFFFF99] text-xs">{$auth_email}</div>

	<div class="pt-4">
		<div class="h-[40px]">
			<SecondaryButton on:click={() => goto('/plans')}>
				<span class="text-xs">Select Plan</span>
			</SecondaryButton>
		</div>
	</div>

	<div class="pt-[9px] text-[10px] text-[#FFFFFF99] mt-1">
		Renew on
		<Time timestamp={$active_sub?.end_timestamp} format="MMM DD, YYYY" />
	</div>

	<div class="flex-grow"></div>

	<button
		on:click={() => displayLogoutPopup.set(true)}
		class="flex gap-x-3 text-start w-full py-3 px-[15px] hover:bg-[#FFFFFF0D] group"
	>
		<img
			src="/icons/logout.svg"
			width={17}
			height={17}
			alt="Log out."
			class="group-active:opacity-40"
		/>

		<div class="text-xs font-switzer font-medium group-active:text-[#FFFFFF66]">Log out</div>
	</button>
</div>
