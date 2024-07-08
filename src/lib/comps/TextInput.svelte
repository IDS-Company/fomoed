<script>
	// @ts-nocheck

	export let id = '';
	export let hidden = false;
	export let placeholder = '';

	export let value = '';
</script>

{#if hidden}
	<input type="password" class="tracking-widest" {id} name={id} placeholder="••••••••" bind:value />
{:else}
	<input {id} name={id} {placeholder} bind:value />
{/if}

<style>
	input {
		@apply placeholder-[#FFFFFF66] border-white border-opacity-15 hover:border-opacity-30 focus:bg-[#FFFFFF1A] border rounded-[14px] bg-transparent h-[54px] px-4 w-full outline-none;
	}
</style>
