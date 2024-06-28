<script lang="ts">
	import { get_data_color, get_data_index, get_data_label } from '$lib/utils';
	import { onMount } from 'svelte';
	import IndicatorHigh from './indicator/IndicatorHigh.svelte';
	import IndicatorHighest from './indicator/IndicatorHighest.svelte';
	import IndicatorLow from './indicator/IndicatorLow.svelte';
	import IndicatorMedium from './indicator/IndicatorMedium.svelte';
	import TintedSecondaryButton from './TintedSecondaryButton.svelte';

	export let orangeOutline = false;
	export let prev = 0;
	export let percentage = 0;
	export let average = 0;

	$: background = orangeOutline
		? `linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.3) 135.93%) padding-box, linear-gradient(180deg, rgba(255, 59, 16, 0.4) -4.26%, rgba(255, 59, 16, 0) 100%) border-box`
		: 'rgba(15, 13, 13, 1)';

	$: marketSentiment = get_data_label(percentage);
	$: color = get_data_color(percentage);

	$: iconIdx = get_data_index(percentage);

	const icons = [
		[IndicatorLow, 'indicator-meme-4.png'],
		[IndicatorMedium, 'indicator-meme-3.png'],
		[IndicatorHigh, 'indicator-meme-2.png'],
		[IndicatorHighest, 'indicator-meme-1.png'],
	]

</script>

<div
	style:background
	class="w-full h-full rounded-[30px] backdrop-blur-xl flex flex-col {orangeOutline &&
		'border-2 border-transparent'} {!orangeOutline && 'border border-[#FFFFFF1A]'}"
>
	<div class="relative max-h-[220px] w-full">
		<div class="inset-x-0 grid place-items-center">
			<div class="-translate-y-14">
				<svelte:component this={icons[iconIdx][0]} />
			</div>
		</div>

		<div class="inset-x-0 absolute bottom-4 flex justify-center items-center">
			<img src='/images/{icons[iconIdx][1]}' alt="" class="max-w-[92px] max-h-[124px]" />
		</div>
	</div>

	<div class="grid grid-cols-[1fr_2fr_1fr] justify-between px-[28px]">
		<div>
			<div class="text-xs opacity-60">Prev</div>
			<div class="opacity-80 font-paralucent font-medium text-[18px]">{prev}</div>
		</div>

		<div class="text-center">
			<div class="text-[40px] leading-[40px] font-paralucent font-medium" style:color>
				{percentage}
			</div>
			<div class="text-lg opacity-80 font-paralucent font-medium">{marketSentiment}</div>
		</div>

		<div class="text-right">
			<div class="text-xs opacity-60">Average</div>
			<div class="opacity-80 font-paralucent font-medium text-[18px]">{average}</div>
		</div>
	</div>

	<div class="px-[12px]">
		<div class="h-[1px] bg-white opacity-10 mt-[20px]"></div>
	</div>

	<div class="flex-grow flex flex-col mb-4 justify-evenly">
		<div class="font-medium text-sm text-center mt-[20px] opacity-80">
			How do you feel about the market today?
		</div>

		<div class="flex gap-x-[10px] justify-center mt-4 relative z-10">
			<TintedSecondaryButton color="red">Bearish</TintedSecondaryButton>
			<TintedSecondaryButton color="green">Bullish</TintedSecondaryButton>
		</div>
	</div>
</div>
