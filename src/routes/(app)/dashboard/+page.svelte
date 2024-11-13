<script lang="ts">
	import AppNav from '$lib/comps/AppNav.svelte';
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import HomepageSmallChart from '$lib/comps/HomepageSmallChart.svelte';
	import IndicatorCard from '$lib/comps/IndicatorCard.svelte';
	import { coinstats_global_data, coinstats_selected_coin } from '$lib/stores';
	import ScrollerDots from '$lib/comps/ScrollerDots.svelte';
	import Footer from '$lib/comps/Footer.svelte';
	import DashboardCarousel from '$lib/comps/dashboard/DashboardCarousel.svelte';
	import { isDesktop } from '$lib/stores/ui';

	let smallChartsCointainer: HTMLElement;
</script>

<div
	style="background-image: url(/background/dashboard.svg)"
	class="desktop:absolute desktop:inset-0 desktop:overflow-scroll bg-cover desktop:flex desktop:flex-col -desktop:bg-[50%_50%] no-scrollbar"
>
	<AppNav showCurrencyDropdown />

	<div
		class="flex-grow grid place-items-center desktop:pb-24 desktop:mx-4 duration-200"
		class:opacity-0={$isDesktop === null}
	>
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

			<div class="col-span-6 mb-6 -desktop:mb-2 mt-2 desktop:hidden">
				<ScrollerDots pages={4} container={smallChartsCointainer}></ScrollerDots>
			</div>

			<div class="col-span-6 grid grid-cols-subgrid">
				<div class="col-span-4 -desktop:col-span-6 h-full flex-grow relative">
					<DashboardCarousel />
				</div>

				<div
					class="desktop:max-h-[500px] col-span-2 -desktop:col-span-6 -desktop:pb-2 -desktop:px-3 -desktop:order-first desktop:h-[450px] -desktop:h-[450px]"
				>
					<IndicatorCard />
				</div>
			</div>
		</div>
	</div>

	<div class="desktop:hidden">
		<Footer></Footer>
	</div>
</div>
