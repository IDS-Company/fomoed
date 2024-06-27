<script lang="ts">
	import SymbolInfo from '$lib/comps/widgets/SymbolInfo.svelte';
	import CFGIGaugeChart from '$lib/comps/widgets/CFGIGaugeChart.svelte';
	import CFGITrendChart from '$lib/comps/widgets/CFGITrendChart.svelte';
	import { onMount } from 'svelte';
	import { get_data_label, type CFGIEnum } from '$lib/utils/index.js';
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

	async function get_tokens_func() {
		const coins = await fetch('https://api.coin-stats.com/v4/coins?skip=0&limit=2500')
			.then((res) => res.json())
			.then((res) => (res?.coins as TCoinStatsCoin[]) || [])
			.catch((err) => {
				console.error(err);

				return [];
			});

		coinstats_coin_list.set(
			coins.map((coin) => {
				return {
					price: coin.pu,
					icon: coin.ic,
					symbol: coin.s,
					name: coin.n,
					color: coin.c,
					slug: coin.i,
					is_free: coin.i === 'bitcoin' || coin.i === 'ethereum'
				};
			})
		);
	}

	const memoizedTokens = memoizeDebounce(get_tokens_func, 1000, { maxWait: 2000 });

	function get_tokens() {
		memoizedTokens();
	}

	const get_token_data_func = async (
		token_symbol: string,
		token_slug: string,
		period: CFGI_SUPPORTED_PERIODS_ENUM,
		token_name: string
	) => {
		cfgi_chart_loading.set(true);
		trend_chart_loading.set(true);
		const data = await fetch(`/api/cfgi`, {
			method: 'POST',
			body: JSON.stringify({
				token_symbol,
				token_name,
				token_slug,
				period
			})
		})
			.then((res) => res.json())
			.then((res) => res.data as ICoinCfgiPriceData[])
			.catch((err) => {
				console.error(err);

				return [];
			});
		trend_chart_loading.set(false);

		if (data?.length > 0) {
			coin_data.set(data);
			fear_and_greed_index_summary(data);
		}
	};

	const memoizedTokenData = memoizeDebounce(get_token_data_func, 1000, { maxWait: 2000 });

	async function get_token_data(
		token_symbol: string,
		token_slug: string,
		period: CFGI_SUPPORTED_PERIODS_ENUM,
		token_name: string
	) {
		memoizedTokenData(token_symbol, token_slug, period, token_name);
	}

	async function fear_and_greed_index_summary(data: ICoinCfgiPriceData[]) {
		if (!data?.length) return;

		let now: {
			value: number;
			value_classification: CFGIEnum;
			timestamp: number;
			// time_until_update: number;
		} | null = null;

		let previous: {
			value: number;
			value_classification: CFGIEnum;
			timestamp: number;
			// time_until_update: number;
		} | null = null;

		// Recent
		const last_element = data[data.length - 1];
		const previous_element = data[data.length - 2];

		if (!last_element || !previous_element) {
			cfgi_summary.set(null);
			return;
		}

		if (last_element) {
			now = {
				value: last_element.cfgi,
				value_classification: get_data_label(last_element.cfgi),
				timestamp: last_element.date
				// time_until_update: 0
			};
		}

		if (previous_element) {
			previous = {
				value: last_element.cfgi,
				value_classification: get_data_label(last_element.cfgi),
				timestamp: last_element.date
				// time_until_update: 0
			};
		}

		const average_cfgi = parseInt(meanBy(data, 'cfgi').toFixed(0));

		const average_element = isFinite(average_cfgi)
			? {
					value: average_cfgi,
					value_classification: get_data_label(average_cfgi),
					timestamp: Date.now()
					// time_until_update: 0
				}
			: null;

		if (now && previous && average_element)
			cfgi_summary.set({ now, previous, average: average_element });
	}

	async function fetch_global_data() {
		const global_data = await fetch('https://api.coin-stats.com/v2/markets/global')
			.then((res) => res.json())
			.then(
				(res) =>
					res as {
						globalData: {
							marketCap: number;
							volume: number;
							btcDominance: number;
							marketCapChange: number;
							volumeChange: number;
							btcDominanceChange: number;
						};
					}
			)
			.catch(() => null);

		if (global_data?.globalData) coinstats_global_data.set(global_data?.globalData);

		return global_data;
	}

	onMount(() => {
		get_tokens();
		fetch_global_data();
	});

	coinstats_coin_list.subscribe((coins) => {
		if (coins?.length) {
			coinstats_selected_coin.set(coins[0]);
		}
	});

	coinstats_selected_coin.subscribe(async (coin) => {
		if (coin) {
			if ($coin_data && $coin_data[0].symbol === coin.symbol) {
				return;
			}

			await get_token_data(
				coin.symbol,
				coin.slug,
				+$cfgi_period || CFGI_SUPPORTED_PERIODS_ENUM.MIN15,
				coin.name
			);
		}
	});

	cfgi_period.subscribe(async (period) => {
		if (+period) {
			if (($coin_data && $coin_data[0].period === period) || !$coinstats_selected_coin) {
				return;
			}

			await get_token_data(
				$coinstats_selected_coin.symbol,
				$coinstats_selected_coin.slug,
				period,
				$coinstats_selected_coin.name
			);
		}
	});
</script>

<section class="max-w-4xl mx-auto mt-16 fear_index">
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

<SocialSharePopup />
