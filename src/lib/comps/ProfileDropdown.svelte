<script>
	import SecondaryButton from './buttons/SecondaryButton.svelte';
	import SignOutPopup from './popups/SignOutPopup.svelte';

	let displaLogoutPopup = false;
</script>

{#if displaLogoutPopup}
	<SignOutPopup
		on:sign-out={() => (displaLogoutPopup = false)}
		on:cancel={() => (displaLogoutPopup = false)}
	></SignOutPopup>
{/if}

<div
	class="w-[200px] h-[260px] bg-[#0F0D0DE5] border-[#FFFFFF1A] rounded-[10px] pt-[17px] flex flex-col items-center absolute right-0 top-0 border backdrop-blur-lg"
>
	<div
		class="bg-[#221F1D] w-[62px] aspect-square grid place-items-center rounded-[10px] overflow-hidden"
	>
		<img src="/images/profile-image.png" width={40} height={57} alt="Arrow right" />
	</div>

	<div class="pt-[6px] text-[18px] font-paralucent-demibold">LNK1234</div>
	<div class="text-[#FFFFFF99] text-xs">lnk@idscompany.com</div>

	<div class="pt-4">
		<div class="h-[40px]">
			<SecondaryButton>
				<span class="text-xs">Select Plan</span>
			</SecondaryButton>
		</div>
	</div>

	<div class="pt-[9px] text-[10px] text-[#FFFFFF99] mt-1">Renew on May 21, 2024 (TODO)</div>

	<div class="flex-grow"></div>

	<button
		on:click={() => (displaLogoutPopup = true)}
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
