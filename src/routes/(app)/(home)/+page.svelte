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
	<div class="h-full max-w-[980px] mx-auto pt-28 min-h-screen px-4">
		<div
			class="bg-[url(/background/homepage-top.png)] bg-cover min-h-screen w-screen absolute top-0 left-0 -z-10"
		></div>
		<h1 class="text-5xl text-center font-paralucent-demibold">
			<span class="bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#F3C111]">
				Calculate
			</span>{' '}
			Your Trading
		</h1>
		<h2 class="opacity-80 text-center mt-[10px] font-bold text-lg">
			Toolset for effortlessly navigating the emotional rollercoaster that is crypto.
		</h2>

		<div
			style="background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.2) 125.15%) padding-box, linear-gradient(179.91deg, rgba(255, 59, 16, 0.4) 11.58%, rgba(255, 59, 16, 0) 99.92%) border-box"
			class="bg-gradient-to-b from-black to-[#00000033] w-full h-[550px] mt-[25px] rounded-[28px] pt-[46px] flex flex-col border-2 border-transparent pb-[20px]"
		>
			<div
				class="grid grid-cols-3 pl-[50px] pr-[80px] gap-x-16 -desktop:grid-cols-1 -desktop:max-h-[100px] -desktop:overflow-scroll -desktop:snap-y -desktop:snap-mandatory"
			>
				<HomepageSmallChart
					change={$coinstats_global_data?.marketCapChange}
					value={$coinstats_global_data?.marketCap.toLocaleString()}
					title="Market Cap"
					prefix="$"
					postfix=""
				/>
				<HomepageSmallChart
					change={$coinstats_global_data?.volumeChange}
					value={$coinstats_global_data?.volume.toLocaleString()}
					title="Volume 24H"
					prefix="$"
					postfix=""
				/>
				<HomepageSmallChart
					change={$coinstats_global_data?.btcDominanceChange}
					value={$coinstats_global_data?.btcDominance.toLocaleString()}
					title="BTC Dominance"
					prefix=""
					postfix="%"
				/>
			</div>

			<div class="flex pr-[25px] flex-grow">
				<div class="flex-grow flex-shrink pt-[66px] relative overflow-hidden">
					<div
						class="desktop:w-[600px] -desktop:w-full h-full overflow-hidden pl-[30px] desktop:pr-4"
					>
						<HomepageBigChart />
					</div>

					<HomepageCoinSwitcher bind:selectedTicker={$selectedSymbol}></HomepageCoinSwitcher>
				</div>

				<div class="pt-[24px] w-[320px] relative flex-shrink-0 -desktop:hidden">
					<div class="absolute h-[430px]">
						<IndicatorCard
							percentage={$cfgi_summary?.now.value}
							prev={$cfgi_summary?.previous.value}
							average={$cfgi_summary?.average.value}
							orangeOutline
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-screen-xl mx-auto pt-[260px] min-h-[800px] relative -z-10 px-4">
		<div class="absolute top-0 -translate-y-40">
			<img
				src="/background/homepage-2.svg"
				width={1158}
				height={919}
				alt=""
				class="relative -z-10"
			/>
		</div>

		<div class="relative">
			<div class="max-w-[570px] -1120:max-w-[430px]">
				<h2 class="text-[64px] leading-[75px] font-paralucent-demibold">
					Stop Trading With <br />
					<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow">
						Emotions
					</span>
				</h2>

				<p class="font-bold text-lg pt-[25px] opacity-80">
					Fomoed provides a toolset for effortlessly navigating the emotional rollercoaster that is
					crypto.
					<br /> <br />
					Have complete access to your favorite Altcoins and get precise data-based market sentiment
					analysis
				</p>
			</div>

			<div class="w-[509px] h-[373px] absolute top-0 right-0">
				<VideoContainer thumbnail="/images/video-thumbnail.png" />
			</div>

			<div class="absolute top-0 right-0 translate-x-10 -translate-y-[70%]">
				<IndicatorGraphicsCard percentage={80} />
			</div>

			<div class="absolute left-1/2 top-0 -translate-y-[130%]">
				<SmallGreedIndicatorCard percentage={$cfgi_summary?.now.value} />
			</div>

			<div class="absolute left-1/2 bottom-0 translate-y-[105%] w-[245px] h-[144px]">
				<FloatingCard>
					<div class="px-[22px]">
						<HomepageSmallChart
							title="BTC Dominance"
							value={$coinstats_global_data?.btcDominance.toLocaleString()}
							change={$coinstats_global_data?.btcDominanceChange}
							postfix="%"
							prefix=""
						></HomepageSmallChart>
					</div>
				</FloatingCard>
			</div>
		</div>
	</div>
	<div class="h-[500px]">
		<CoinSwiper />
	</div>
	<div>
		<div>
			<h2 class="text-[36px] text-center font-paralucent-demibold">
				Get your free trial to unlock more!
			</h2>

			<div class="flex mx-auto max-w-max gap-x-[20px] pt-[9px]">
				<img src="/fomoed.svg" width={158} height={33} alt="Fomoed." />

				<PremiumBadge />
			</div>
		</div>
	</div>
	<div class="pt-[52px] flex justify-center gap-x-[14px] items-center px-4">
		<FreeCard />
		<PremiumCard />
		<DegenCard />
	</div>

	<div class="max-w-[914px] mx-auto flex items-center gap-x-[80px] pt-40 relative pb-48 px-4">
		<div class="absolute inset-x-0 -translate-y-40 translate-x-1/3 -z-10 scale-150">
			<img src="/background/homepage-3.png" width={1040} height={2352} alt="" />
		</div>

		<MemeSwiper />

		<div>
			<div class="text-[36px] leading-[45px] font-paralucent-demibold">
				Got any trouble or question?
			</div>
			<div class="pt-[15px] text-[20px] font-semibold">
				Send us your thought to{' '}
				<a href="mailto:fomoed@mail.com" class="text-primary underline"> fomoed@mail.com </a>
			</div>
		</div>
	</div>

	<footer
		class="bg-[#201F1FB2] backdrop-blur-xl h-[125px] pt-[40px] flex flex-col items-center gap-y-[20px] opacity-60 pb-[25px]"
	>
		<img src="/fomoed-white.svg" width={108} height={22} alt="Fomoed logo." />

		<div class="text-xs">© All Copyright Reserved Fomoed 2024</div>
	</footer>
</main>
