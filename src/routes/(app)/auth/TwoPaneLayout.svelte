<script>
	import LogoContainer from '$lib/comps/LogoContainer.svelte';
	import MemeSwiper from '$lib/comps/MemeSwiper.svelte';

	// style={{
	//     backgroundImage: "url(/background/login/background.svg), url(/background/noise.svg)",
	//     backgroundRepeat: "no-repeat, repeat",
	//     backgroundSize: "cover, 100px",
	//     backgroundBlendMode: "multiply",
	// }}
</script>

<div
	style="background-image: url(/background/login/background.svg)"
	class="bg-no-repeat bg-cover absolute inset-0 grid place-items-center"
>
	<div class="max-w-screen-xl w-full mx-auto grid place-items-center grid-cols-2">
		<div class="z-20 max-w-[386px] w-full">
			<slot></slot>
		</div>

		<MemeSwiper></MemeSwiper>
	</div>
</div>

<!-- Left blur rectangle -->
<div class="bg-[#171514] bg-opacity-50 absolute inset-y-0 w-1/2 z-10 flex justify-end items-center">
	<!-- Glow in the middle -->
	<svg
		width="355"
		height="832"
		viewBox="0 0 355 832"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g opacity="0.15" filter="url(#filter0_f_16_297)">
			<circle cx="495.5" cy="416.5" r="249.5" fill="#FF3B10" />
		</g>
		<defs>
			<filter
				id="filter0_f_16_297"
				x="0.199997"
				y="-78.8"
				width="990.6"
				height="990.6"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
				<feGaussianBlur stdDeviation="122.9" result="effect1_foregroundBlur_16_297" />
			</filter>
		</defs>
	</svg>
</div>

<LogoContainer></LogoContainer>
