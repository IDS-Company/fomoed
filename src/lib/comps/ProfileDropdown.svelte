<script lang="ts">
	import { getContext } from 'svelte';
	import SecondaryButton from './buttons/SecondaryButton.svelte';
	import SignOutPopup from './popups/SignOutPopup.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { goto } from '$app/navigation';
	import { auth_email, auth_user } from '$lib/stores/user';
	import Time from 'svelte-time/Time.svelte';
	import { active_sub } from '$lib/stores/subs';

	let displaLogoutPopup = false;

	const supabase = getContext<SupabaseClient>('supabase');

	async function signOut() {
		displaLogoutPopup = false;

		const { error } = await supabase.auth.signOut();
		error && console.log('Auth Action Error: ', error);
	}

	$: premium = $auth_user?.has_valid_sub;
</script>

{#if displaLogoutPopup}
	<SignOutPopup on:sign-out={() => signOut()} on:cancel={() => (displaLogoutPopup = false)} />
{/if}

<div
	class="w-[200px] h-[260px] bg-[#0F0D0DE5] border-[#FFFFFF1A] rounded-[10px] pt-[17px] flex flex-col items-center absolute right-0 top-0 border backdrop-blur-lg"
>
	<div
		id="profile-img-container"
		class:premium
		class="bg-[#221F1D] w-[62px] aspect-square grid place-items-center rounded-[10px] overflow-hidden border border-transparent"
	>
		<img src="/images/profile-image.png" width={40} height={57} alt="Arrow right" />
	</div>

	<div class="pt-[6px] text-[18px] font-paralucent-demibold">{$auth_user?.username}</div>
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

<style>
	#profile-img-container {
		@apply relative;
	}

	#profile-img-container.premium {
		background:
			linear-gradient(#201e1e, #201e1e) padding-box,
			linear-gradient(90deg, #ff3b10 0%, #f3c111 71.5%) border-box;
	}

	#profile-img-container.premium::after {
		@apply absolute left-0 bottom-0 scale-50 origin-bottom-left rounded-tr-[10px] pr-1 pt-1 translate-y-0.5 pl-0.5;
		content: url('/icons/star.svg');
		background: linear-gradient(90deg, #ff3b10 0%, #f3c111 71.5%);
	}
</style>
