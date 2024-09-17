<script>
	export let disablePadding = false;
</script>

<div
	class="{!disablePadding &&
		'px-[30px] py-[22px]'} bg-[#0F0D0D] rounded-[26px] border border-white border-opacity-10 grid place-items-center w-full h-full -desktop:snap-center overflow-hidden"
>
	<slot />
</div>
