<script>
	import ProfileDropdown from './ProfileDropdown.svelte';

	let expanded = false;
</script>

<button
	class="{expanded
		? 'bg-[#201E1E]'
		: 'bg-[#13100F]'} max-w-max w-full gap-x-4 font-paralucent-demibold flex items-center justify-center text-[#FFFFFFCC] hover:border-[#42403F] text-sm duration-150 p-[5px] rounded-[11px] bg-opacity-80 border-[#FFFFFF1A] border pr-5"
	on:click={() => (expanded = !expanded)}
>
	<div
		class="{expanded
			? 'bg-[#373534]'
			: 'bg-[#221F1D]'} rounded-[8px] w-[40px] h-[40px] flex-shrink-0 grid place-items-center duration-150"
	>
		<img src="/images/profile-image.png" width={17} height={13} alt="Arrow right" />
	</div>

	<div class="uppercase">Username</div>
</button>

{#if expanded}
	<div class="absolute top-16 right-0">
		<ProfileDropdown></ProfileDropdown>
	</div>
{/if}
