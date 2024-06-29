<script>
	export let id = '';
	export let hidden = false;
	export let placeholder = '';
</script>

<input
	{id}
	name={id}
	type={hidden ? 'password' : 'text'}
	{placeholder}
	class={`${
		hidden && 'tracking-widest'
	} placeholder-[#FFFFFF66] border-white border-opacity-15 hover:border-opacity-30 focus:bg-[#FFFFFF1A] border rounded-[14px] bg-transparent h-[54px] px-4 w-full outline-none`}
/>
