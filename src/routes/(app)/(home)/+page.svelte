<script lang="ts">
	import HomepageCoinSwitcher from '$lib/comps/homepage/HomepageCoinSwitcher.svelte';
	import SymbolInfo from '$lib/comps/widgets/SymbolInfo.svelte';
	import CFGIGaugeChart from '$lib/comps/widgets/CFGIGaugeChart.svelte';
	import CFGITrendChart from '$lib/comps/widgets/CFGITrendChart.svelte';
	import { onMount } from 'svelte';
	import { fetch_token_data, get_data_label, type CFGIEnum } from '$lib/utils/index.js';
	import {
		cfgi_chart_loading,
		cfgi_period,
		cfgi_summary,
		coin_data,
		coinstats_coin_list,
		coinstats_global_data,
		coinstats_selected_coin,
		trend_chart_loading
	} from '$lib/stores';
	import type { ICoinCfgiPriceData, TCoinStatsCoin } from '$lib';
	import { CFGI_SUPPORTED_PERIODS_ENUM } from '$lib/utils/cfgi_data';
	import { meanBy } from 'lodash-es';
	import { memoizeDebounce } from '$lib/utils/memoizeDebounce';
	import Sentiment from '$lib/comps/widgets/Sentiment.svelte';
	import SocialSharePopup from '$lib/comps/SocialSharePopup.svelte';
	import HomepageSmallChart from '$lib/comps/HomepageSmallChart.svelte';
	import IndicatorCard from '$lib/comps/IndicatorCard.svelte';
	import VideoContainer from '$lib/comps/VideoContainer.svelte';
	import IndicatorGraphicsCard from '$lib/comps/IndicatorGraphicsCard.svelte';
	import SmallGreedIndicatorCard from '$lib/comps/SmallGreedIndicatorCard.svelte';
	import FloatingCard from '$lib/comps/FloatingCard.svelte';
	import CoinSwiper from '$lib/comps/CoinSwiper.svelte';
	import PremiumBadge from '$lib/comps/decorations/PremiumBadge.svelte';
	import FreeCard from '$lib/comps/plan-cards/FreeCard.svelte';
	import PremiumCard from '$lib/comps/plan-cards/PremiumCard.svelte';
	import DegenCard from '$lib/comps/plan-cards/DegenCard.svelte';
	import MemeSwiper from '$lib/comps/MemeSwiper.svelte';
	import HomepageBigChart from '$lib/comps/HomepageBigChart.svelte';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import SmallCharts from '$lib/comps/SmallCharts.svelte';
	import HomepageBtcDominanceFloating from '$lib/comps/homepage/HomepageBtcDominanceFloating.svelte';
	import Footer from '$lib/comps/Footer.svelte';

	// const memoizedTokens = memoizeDebounce(refresh_coinstats_coin_list, 1000, { maxWait: 2000 });

	// function get_tokens() {
	// 	memoizedTokens();
	// }

	const selectedSymbol = writable<string>('BTC');

	selectedSymbol.subscribe((symbol) => {
		if (!$coinstats_coin_list) return;

		const coin = $coinstats_coin_list.find((c) => c.symbol === symbol);

		if (coin) {
			coinstats_selected_coin.set(coin);
		}
	});
</script>

<!-- <section class="max-w-4xl mx-auto mt-16 fear_index">
	<div class="flex flex-col items-center justify-center w-full text-center top">
		<h1 class="w-full text-3xl font-extrabold">Fear and Greed Index</h1>
		<div class="px-6 pt-4 opacity-50 descriptio text-whiten">
			Crypto Fear and Greed Index if based on volatility, social media sentiments, surveys, market
			momentum, and more.
		</div>
	</div>
</section>

{#if $coinstats_global_data}
	<section class="max-w-4xl mx-auto mt-16 symbol_info">
		<SymbolInfo
			data={{
				market_cap: {
					value: `$${$coinstats_global_data?.marketCap.toLocaleString()}`,
					change: $coinstats_global_data?.marketCapChange
				},
				volume_24h: {
					value: `$${$coinstats_global_data?.volume.toLocaleString()}`,
					change: $coinstats_global_data?.volumeChange
				},
				btc_dominance: {
					value: `${$coinstats_global_data?.btcDominance}%`,
					change: $coinstats_global_data?.btcDominanceChange
				}
			}}
		/>
	</section>
{/if}

<section
	class="flex flex-col-reverse items-center justify-between max-w-5xl mx-auto mt-16 md:flex-row cfgi"
>
	<div class="w-full gauge_chart">
		<CFGIGaugeChart />
	</div>

	<div class="w-full sentiment_wrapper">
		<Sentiment />
	</div>
</section>

<section class="max-w-5xl px-4 mx-auto mt-16 cfgi_trend sm:px-0">
	<CFGITrendChart />
</section>

<div class="w-full h-20 sm:h-10 spacer"></div>

<SocialSharePopup /> -->

<main class="w-full relative overflow-hidden">
	<!-- Mobile top bg image -->
	<div
		class="desktop:hidden absolute w-full bg-bottom -z-20 bg-[url(/background/mobile/homepage-top.png)] bg-no-repeat bg-cover h-[120vh]"
	></div>

	<!-- Mobile top glow -->
	<div
		class="desktop:hidden absolute -z-10 bg-[url(/background/mobile/homepage-top-gradient.svg)] w-full h-[500px] bg-no-repeat bg-center -translate-y-20"
	></div>

	<!-- Mobile bnb coin -->
	<div
		class="desktop:hidden bg-[url(/images/mobile/bnb-coin-bg.svg)] w-[94px] aspect-square absolute left-0 top-20"
	></div>

	<!-- Mobile ether coin -->
	<div
		class="desktop:hidden bg-[url(/images/mobile/eth-coin-bg.svg)] w-[94px] aspect-square absolute -right-6 top-[600px] -z-10"
	></div>

	<div class="h-full max-w-[980px] mx-auto desktop:min-h-screen px-4 flex flex-col justify-center">
		<div
			class="desktop:bg-[url(/background/homepage-1.webp)] bg-cover bg-center min-h-screen w-screen absolute top-0 left-0 -z-10"
		></div>

		<h1 class="text-5xl text-center font-paralucent-demibold -sm:text-[36px] mx-10 -desktop:mt-24">
			<span class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#F3C111]">
				Calculate
			</span>{' '}
			Your&nbsp;Trading
		</h1>

		<h2 class="opacity-80 text-center mt-[10px] font-bold text-lg -sm:text-sm mx-10">
			Toolset for effortlessly navigating the emotional rollercoaster that is crypto.
		</h2>

		<div
			style="background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.2) 125.15%) padding-box, linear-gradient(179.91deg, rgba(255, 59, 16, 0.4) 11.58%, rgba(255, 59, 16, 0) 99.92%) border-box"
			class="relative bg-gradient-to-b from-black to-[#00000033] w-full desktop:h-[550px] mt-[25px] rounded-[28px] pt-[46px] flex flex-col border-2 border-transparent pb-[20px]"
		>
			<!-- Mobile btc coin -->
			<div
				class="desktop:hidden bg-[url(/images/mobile/btc-coin.svg)] w-[94px] aspect-square absolute -right-6 -top-10"
			></div>

			<!-- Mobile sol coin -->
			<div
				class="desktop:hidden bg-[url(/images/mobile/sol-coin.svg)] w-[94px] aspect-square absolute -left-4 bottom-20"
			></div>

			<SmallCharts />

			<div class="flex desktop:pr-[25px] flex-grow">
				<div class="flex-grow flex-shrink pt-[66px] relative overflow-hidden">
					<div
						class="desktop:w-[600px] -desktop:pb-24 -desktop:w-full h-full overflow-hidden pl-[30px] desktop:pr-4 -desktop:px-2"
					>
						<HomepageBigChart />
					</div>

					<HomepageCoinSwitcher bind:selectedTicker={$selectedSymbol}></HomepageCoinSwitcher>
				</div>

				<div class="pt-[24px] w-[320px] relative flex-shrink-0 -desktop:hidden">
					<div class="absolute h-[430px]">
						<IndicatorCard onHomepage />
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="desktop:hidden px-4 mt-4">
		<IndicatorCard />
	</div>

	<div
		class="max-w-screen-xl mx-auto desktop:pt-[260px] -desktop:pt-[50px] min-h-[800px] relative -z-10 px-4"
	>
		<div class="absolute top-0 -translate-y-40 -desktop:scale-[2.5] -desktop:translate-y-[200px]">
			<img
				src="/background/homepage-2.svg"
				width={1158}
				height={919}
				alt=""
				class="relative -z-10"
			/>
		</div>

		<div class="relative z-0">
			<div class="-desktop:text-center desktop:max-w-[570px] -1120:max-w-[430px] -desktop:mx-auto">
				<h2
					class="text-[64px] -desktop:text-[36px] -desktop:leading-[42px] leading-[75px] font-paralucent-demibold"
				>
					Stop Trading With <br />
					<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow">
						Emotions
					</span>
				</h2>

				<p class="font-bold text-lg pt-[25px] opacity-80 -desktop:text-sm">
					Fomoed provides a toolset for effortlessly navigating the emotional rollercoaster that is
					crypto.
					<br /> <br />
					Have complete access to your favorite Altcoins and get precise data-based market sentiment
					analysis
				</p>
			</div>

			<!-- Mobile cards -->
			<div class="desktop:hidden mt-4">
				<div class="flex flex-col">
					<div class="translate-x-6 flex justify-end scale-75">
						<SmallGreedIndicatorCard percentage={$cfgi_summary?.now.value} />
					</div>
					<div><VideoContainer thumbnail="/images/video-thumbnail.png" /></div>

					<div class="flex mt-3 h-[120px]">
						<div class="w-1/2 -translate-x-2"><HomepageBtcDominanceFloating /></div>
						<div class="flex-grow"></div>
						<div class="scale-[0.6] origin-top-right -translate-y-12 translate-x-2">
							<IndicatorGraphicsCard percentage={80} />
						</div>
					</div>
				</div>
			</div>

			<!-- Desktop cards -->
			<div class="-desktop:hidden w-[509px] h-[373px] absolute top-0 right-0">
				<VideoContainer thumbnail="/images/video-thumbnail.png" />
			</div>

			<div class="-desktop:hidden absolute top-0 right-0 translate-x-10 -translate-y-[70%]">
				<IndicatorGraphicsCard percentage={80} />
			</div>

			<div class="-desktop:hidden absolute left-1/2 top-0 -translate-y-[130%]">
				<SmallGreedIndicatorCard percentage={$cfgi_summary?.now.value} />
			</div>

			<div
				class="-desktop:hidden absolute left-1/2 bottom-0 translate-y-[105%] w-[245px] h-[144px]"
			>
				<HomepageBtcDominanceFloating />
			</div>
		</div>
	</div>

	<CoinSwiper />

	<div>
		<div>
			<h2 class="text-[36px] text-center font-paralucent-demibold -desktop:text-[22px]">
				Get your free trial to unlock more!
			</h2>

			<div class="flex mx-auto max-w-max gap-x-[20px] pt-[9px]">
				<img src="/fomoed.svg" class="-desktop:w-[125px]" width={158} height={33} alt="Fomoed." />

				<PremiumBadge />
			</div>
		</div>
	</div>
	<div
		class="pt-[52px] -desktop:pt-8 flex justify-center gap-x-[14px] items-center px-4 -desktop:flex-col gap-y-4"
	>
		<FreeCard />
		<PremiumCard
			on:click-free-trial={() => goto('/plans')}
			on:click-subscribe={() => goto('/plans')}
		/>
		<DegenCard
			on:click-subscribe={() => goto('/plans')}
			on:click-unsubscribe={() => goto('/plans')}
		/>
	</div>

	<div
		class="max-w-[914px] mx-auto flex -desktop:flex-col items-center gap-x-[80px] pt-40 -desktop:pt-8 relative -desktop:pb-16 pb-48 px-4 -desktop:scale-90"
	>
		<div
			class="absolute inset-x-0 -desktop:bottom-0 desktop:-translate-y-40 translate-x-1/3 -z-10 scale-150 -desktop:scale-[2]"
		>
			<img src="/background/homepage-3.svg" width={1040} height={2352} alt="" />
		</div>

		<MemeSwiper />

		<div class="-desktop mt-32">
			<div
				class="text-[36px] -desktop:text-[24px] leading-[45px] font-paralucent-demibold -desktop:text-center"
			>
				Got any trouble or question?
			</div>
			<div class="pt-[15px] text-[20px] -desktop:text-sm font-semibold">
				Send us your thought to{' '}
				<a id="contact" href="mailto:fomoed@mail.com" class="text-primary underline">
					fomoed@mail.com
				</a>
			</div>
		</div>
	</div>

	<Footer />
</main>
