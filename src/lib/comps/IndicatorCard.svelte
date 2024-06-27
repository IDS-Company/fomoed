<script>
	import TintedSecondaryButton from './TintedSecondaryButton.svelte';

	export let orangeOutline = false;
	export let prev = 0;
	export let percentage = 0;
	export let average = 0;

	const color = '#47A663';

	$: background = orangeOutline
		? `linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.3) 135.93%) padding-box, linear-gradient(180deg, rgba(255, 59, 16, 0.4) -4.26%, rgba(255, 59, 16, 0) 100%) border-box`
		: 'rgba(15, 13, 13, 1)';
</script>

<div
	style:background
	class="w-full h-full rounded-[30px] backdrop-blur-xl flex flex-col {orangeOutline &&
		'border-2 border-transparent'} {!orangeOutline && 'border border-[#FFFFFF1A]'}"
>
	<div class="relative max-h-[220px] -translate-y-6">
		<div class="inset-x-0 grid place-items-center">
			<img src="/placeholders/indicator.svg" alt="" width={332} height={332} />
		</div>

		<div class="inset-x-0 absolute top-0 flex justify-center h-[332px] items-center">
			<img src="/images/indicator-meme-5.png" alt="" width={92} height={124} />
		</div>
	</div>

	<div class="grid grid-cols-3 justify-between px-[28px]">
		<div>
			<div class="text-xs opacity-60">Prev</div>
			<div class="opacity-80 font-paralucent font-medium">{prev}</div>
		</div>

		<div class="text-center">
			<div class="text-[40px] leading-[40px] font-paralucent font-medium" style:color>
				{percentage}
			</div>
			<div class="text-lg opacity-80 font-paralucent font-medium">Greed</div>
		</div>

		<div class="text-right">
			<div class="text-xs opacity-60">Average</div>
			<div class="opacity-80 font-paralucent font-medium">{average}</div>
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
