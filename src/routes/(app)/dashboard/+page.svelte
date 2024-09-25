<script lang="ts">
	import AppNav from '$lib/comps/AppNav.svelte';
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import DurationSwitcher from '$lib/comps/DurationSwitcher.svelte';
	import HomepageBigChart from '$lib/comps/HomepageBigChart.svelte';
	import HomepageSmallChart from '$lib/comps/HomepageSmallChart.svelte';
	import IndicatorCard from '$lib/comps/IndicatorCard.svelte';
	import { coinstats_global_data, coinstats_selected_coin } from '$lib/stores';
	import ScrollerDots from '$lib/comps/ScrollerDots.svelte';
	import Footer from '$lib/comps/Footer.svelte';
	import GetFreeTrialOverlay from '$lib/comps/overlays/GetFreeTrialOverlay.svelte';
	import DashboardCarousel from '$lib/comps/dashboard/DashboardCarousel.svelte';

	let smallChartsCointainer: HTMLElement;

	let displaySubscriptionRequired = false;
</script>

<div
	style="background-image: url(/background/dashboard.svg)"
	class="desktop:absolute desktop:inset-0 desktop:overflow-scroll bg-cover desktop:flex desktop:flex-col -desktop:bg-[50%_50%]"
>
	<AppNav showCurrencyDropdown />

	<div class="flex-grow grid place-items-center desktop:pb-24 desktop:mx-4">
		<div
			class="grid grid-cols-6 gap-[7px] mx-auto h-full pb-6 w-full max-w-[1050px] desktop:max-h-[700px] desktop:grid-rows-[1fr_3fr]"
		>
			<div
				bind:this={smallChartsCointainer}
				class="-desktop:flex -desktop:gap-x-2 -desktop:h-[148px] -desktop:overflow-x-scroll desktop:grid grid-cols-subgrid col-span-6 no-scrollbar -desktop:snap-x -desktop:snap-mandatory -desktop:px-3"
			>
				<div class="-desktop:flex-shrink-0 -desktop:w-5/6 desktop:col-span-2">
					<DashboardCard>
						<HomepageSmallChart
							change={$coinstats_global_data?.marketCapChange}
							value={$coinstats_selected_coin?.marketCap.toLocaleString()}
							title="{$coinstats_selected_coin?.symbol} Market Cap"
							prefix="$"
							postfix=""
							hideChange
						/>
					</DashboardCard>
				</div>

				<div class="-desktop:flex-shrink-0 -desktop:w-5/6 desktop:col-span-2">
					<DashboardCard>
						<HomepageSmallChart
							value={$coinstats_selected_coin?.volume.toLocaleString()}
							title="{$coinstats_selected_coin?.symbol} Volume 24H"
							prefix="$"
							postfix=""
							hideChange
						/>
					</DashboardCard>
				</div>

				<div class="-desktop:flex-shrink-0 -desktop:w-5/6">
					<DashboardCard>
						<HomepageSmallChart
							change={$coinstats_global_data?.btcDominanceChange}
							value={$coinstats_global_data?.btcDominance.toLocaleString()}
							title="BTC Dominance"
							prefix=""
							postfix="%"
						/>
					</DashboardCard>
				</div>

				<div class="-desktop:flex-shrink-0 -desktop:w-5/6">
					<DashboardCard>
						<HomepageSmallChart
							change={$coinstats_selected_coin?.priceChange}
							value={$coinstats_selected_coin?.price.toLocaleString()}
							title="{$coinstats_selected_coin?.symbol} Price"
							prefix="$"
							postfix=""
						/>
					</DashboardCard>
				</div>
			</div>

			<div class="col-span-6 mb-6 mt-2 desktop:hidden">
				<ScrollerDots pages={4} container={smallChartsCointainer}></ScrollerDots>
			</div>

			<div class="col-span-4 -desktop:col-span-6 h-full -desktop:mx-3 flex-grow relative">
				<DashboardCarousel />
			</div>

			<div
				class="max-h-[500px] col-span-2 -desktop:col-span-6 -desktop:pb-2 -desktop:mx-3 -desktop:mt-1"
			>
				<IndicatorCard />
			</div>

			<!-- <div class="col-span-6 px-3">
				<LiquidationMapChartCard
					getTitle={(s) =>
						`${s.value.exchange} ${s.value.baseAsset} ${s.value.quoteAsset} Liquidation Map`}
					getInstrumentOptions={getSupportedLiqMapInstrumentOptions}
					fetchLiqMapData={(timeframe, selAssetOption) =>
						fetchLiqMapData(timeframe, [selAssetOption.value])}
					defaultAssetOption={{
						label: 'Binance BTC/USDT',
						value: defaultSelectedInstrument
					}}
				>
					<Legend
						slot="legend"
						legends={[
							{ color: '#21AA94', label: 'Cumulative Short Liquidation Leverage' },
							{ color: '#F23645', label: 'Cumulative Long Liquidation Leverage' },
							{ color: '#FF8300', label: '100x Leverage' },
							{ color: '#FFC403', label: '50x Leverage' },
							{ color: '#73D8DA', label: '25x Leverage' },
							{ color: '#6EC2F0', label: '10x Leverage' }
						]}
					></Legend>
				</LiquidationMapChartCard>
			</div>

			<div class="col-span-6 px-3">
				<LiquidationMapChartCard
					getTitle={(s) => `${s.value} Exchange Liquidation Map`}
					getInstrumentOptions={getSupportedExchangeLiqMapBaseAssets}
					fetchLiqMapData={(timeframe, selAssetOption) =>
						fetchLiqMapDataMerged(timeframe, selAssetOption.value)}
					defaultAssetOption={{ label: 'BTC', value: 'BTC' }}
				>
					<Legend
						slot="legend"
						legends={[
							{ color: '#21AA94', label: 'Cumulative Short Liquidation Leverage' },
							{ color: '#F23645', label: 'Cumulative Long Liquidation Leverage' },
							{ color: '#FF8300', label: 'Binance' },
							{ color: '#FFC403', label: 'OKX' },
							{ color: '#73D8DA', label: 'Bybit' }
						]}
					></Legend>
				</LiquidationMapChartCard>
			</div> -->
		</div>
	</div>

	<div class="desktop:hidden">
		<Footer></Footer>
	</div>
</div>
