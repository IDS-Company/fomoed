<div class="relative h-[500px] -sm:h-[250px] flex items-center">
	<!-- Glow -->
	<div class="absolute w-screen grid place-items-center h-full">
		<div class="w-full h-[400px] transitionColor overflow-hidden -z-10">
			<div
				class="h-full transitionColor"
				style="background: radial-gradient(#0009, black 75%);"
			></div>
		</div>
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
			background-color: #27a17b;
		}

		20% {
			background-color: #f0b90b;
		}

		40% {
			background-color: #c44fe2;
		}

		60% {
			background-color: #f9aa4b;
		}

		80% {
			background-color: #627eea;
		}
	}
</style>
