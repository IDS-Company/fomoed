<script>
	export let disabled = false;
</script>

<button
	{disabled}
	on:click
	class="bg-[#FBFBFB1A] border-[#FFFFFF1A] border rounded-[11px] grid place-items-center h-full aspect-square active:brightness-75 disabled:opacity-50"
>
	<slot />
</button>
