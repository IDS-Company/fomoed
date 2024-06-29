<script>
	export let disabled = false;
</script>

<button
	{disabled}
	class="h-full flex items-center font-paralucent-demibold justify-center text-white text-opacity-80 text-sm duration-100 max-h-[45px] px-4 py-2 rounded-[10px] bg-white bg-opacity-15 enabled:hover:bg-opacity-20 border-white active:border-primary border-opacity-10 enabled:hover:border-opacity-40 border-[0.5px] shadow-[0px_0px_0px_5px_#F5F5F51A] w-full"
	class:opacity-60={disabled}
	on:click
>
	<slot />
</button>
