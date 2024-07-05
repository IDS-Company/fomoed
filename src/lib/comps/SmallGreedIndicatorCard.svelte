<script>
	import { get_data_color } from '$lib/utils';
	import Gauge from './indicator/Gauge.svelte';

	export let percentage = 0;
</script>

<div
	class="w-[245px] h-[144px] bg-gradient-to-b from-[#FFFFFF24] to-[#FFFFFF0A] p-px rounded-[20px] relative"
>
	<div class="bg-[#0F0F0F99] grid place-items-center h-full rounded-[18.5px] backdrop-blur-xl">
		<div class="pt-8">
			<div
				style="color: {get_data_color(percentage)}"
				class="text-center text-[40px] font-paralucent font-medium leading-6"
			>
				{percentage}
			</div>
			<div class="text-white opacity-80 text-lg font-paralucent font-medium">Greed</div>
		</div>
	</div>

	<div class="absolute inset-0 px-6 pt-2">
		<Gauge {percentage} />
	</div>
</div>
