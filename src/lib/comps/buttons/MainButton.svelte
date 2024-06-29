<script>
	export let disabled = false;
</script>

<button
	{disabled}
	class="w-full active:brightness-[0.7] font-paralucent-demibold flex items-center justify-center text-white shadow-primary-button enabled:hover:bg-primary text-sm duration-150 h-[45px] px-4 py-2 rounded-[11px] bg-black bg-opacity-80 border-primary border"
	class:opacity-60={disabled}
	on:click
>
	<slot />
</button>
