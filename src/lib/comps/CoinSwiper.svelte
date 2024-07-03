<div class="relative h-[500px] -sm:h-[250px] flex items-center">
	<!-- Glow -->
	<div class="absolute w-screen grid place-items-center h-full transitionColor">
		<svg
			class=""
			width="100%"
			height="100%"
			viewBox="0 0 638 593"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g opacity="0.5" filter="url(#filter0_f_6_1395)">
				<ellipse cx="319" cy="296.5" rx="134" ry="111.5" fill="currentColor" />
			</g>
			<defs>
				<filter
					id="filter0_f_6_1395"
					x="0.5"
					y="0.5"
					width="637"
					height="592"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundimgFix" />
					<feBlend mode="normal" in="SourceGraphic" in2="BackgroundimgFix" result="shape" />
					<feGaussianBlur stdDeviation="92.25" result="effect1_foregroundBlur_6_1395" />
				</filter>
			</defs>
		</svg>
	</div>

	<!-- Coins -->
	<div class="h-full flex items-center">
		<div class="overflow-hidden max-w-[100vw] relative h-full items-center flex">
			<div class="movingContent">
				<img src="/images/carousel/btc.svg" width={235} height={235} alt="Bitcoin." />
				<img src="/images/carousel/ether.svg" width={235} height={235} alt="Ethereum." />
				<img src="/images/carousel/tether.svg" width={235} height={235} alt="Tether." />
				<img src="/images/carousel/bnc.svg" width={235} height={235} alt="Binance." />
				<img src="/images/carousel/map.svg" width={235} height={235} alt="TODO coin." />
				<img src="/images/carousel/btc.svg" width={235} height={235} alt="Bitcoin." />
				<img src="/images/carousel/ether.svg" width={235} height={235} alt="Ethereum." />
				<img src="/images/carousel/tether.svg" width={235} height={235} alt="Tether." />
				<img src="/images/carousel/bnc.svg" width={235} height={235} alt="Binance." />
				<img src="/images/carousel/map.svg" width={235} height={235} alt="TODO coin." />
			</div>

			<div
				class="h-full bg-gradient-to-r from-black to-transparent w-[50%] absolute -left-1 top-0 z-10"
			></div>
			<div
				class="h-full bg-gradient-to-l from-black to-transparent w-[50%] absolute -right-1 top-0 z-10"
			></div>
		</div>
	</div>
</div>

<style>
	.movingContent {
		@apply flex;
		display: flex;
		animation: moveLinear 15s linear infinite;
	}

	.movingContent > img {
		@apply -sm:w-[33.33vw] w-[20vw] flex-shrink-0 p-2;
	}

	@media (max-width: 639px) {
		.transitionColor {
			animation: transitionColor 18s linear infinite;
		}

		@keyframes moveLinear {
			0% {
				transform: translateX(0);
			}
			100% {
				transform: translateX(-166%);
			}
		}
	}

	@media (min-width: 640px) {
		.transitionColor {
			animation: transitionColor 15s linear infinite;
		}

		@keyframes moveLinear {
			0% {
				transform: translateX(0);
			}
			100% {
				transform: translateX(-100%);
			}
		}
	}

	@keyframes transitionColor {
		0% {
			color: #27a17b;
		}

		20% {
			color: #f0b90b;
		}

		40% {
			color: #c44fe2;
		}

		60% {
			color: #f9aa4b;
		}

		80% {
			color: #627eea;
		}
	}
</style>
