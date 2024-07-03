<script>
	export let selectedTicker = 'BTC';
</script>

<div class="absolute top-0 flex justify-center w-full items-end h-full">
	<div
		style="background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)) padding-box, linear-gradient(180deg, rgba(255, 59, 16, 0.3) -4.26%, rgba(255, 59, 16, 0) 100%) border-box"
		class="-desktop:mx-4 bg-black/50 rounded-[20px] border-transparent border-2 w-[400px] h-[90px] backdrop-blur-xl -sm:px-6 sm:px-[65px] py-[27px] flex justify-between"
	>
		<button on:click={() => (selectedTicker = 'BTC')}>
			<img src={'/icons/btc.svg'} width={35} height={35} alt="Bitcoin." />
		</button>

		<button on:click={() => (selectedTicker = 'ETH')}>
			<img src={'/icons/eth.svg'} width={35} height={35} alt="Ethereum." />
		</button>

		<img src={'/icons/tether.svg'} width={35} height={35} alt="Tether." />
		<img src={'/icons/bnc.svg'} width={35} height={35} alt="Binance Coin." />
		<img src={'/icons/map.svg'} width={35} height={35} alt="Don't know Coin." />
	</div>
</div>

<style>
	button {
		@apply hover:brightness-150 duration-100 active:brightness-90;
	}
</style>
