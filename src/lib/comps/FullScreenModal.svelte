<script lang="ts">
	import CancelIcon from '$lib/icons/CancelIcon.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="fixed inset-0 p-4 z-50">
	<div
		class="
		px-[30px] py-[22px] bg-[#0f0d0d] rounded-[26px] border border-white border-opacity-10 grid place-items-center w-full h-full overflow-scroll relative"
	>
		<div class="aspect-square absolute top-4 right-4">
			<button
				class="w-8 h-8 p-1 active:brightness-50 duration-100 active:scale-90"
				on:click={() => dispatch('close')}
			>
				<CancelIcon />
			</button>
		</div>

		<slot />
	</div>
</div>
