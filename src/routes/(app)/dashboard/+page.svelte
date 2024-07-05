<script lang="ts">
	import AppNav from '$lib/comps/AppNav.svelte';
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import DurationSwitcher from '$lib/comps/DurationSwitcher.svelte';
	import HomepageBigChart from '$lib/comps/HomepageBigChart.svelte';
	import HomepageSmallChart from '$lib/comps/HomepageSmallChart.svelte';
	import IndicatorCard from '$lib/comps/IndicatorCard.svelte';
	import { coinstats_global_data, coinstats_selected_coin } from '$lib/stores';
	import ScrollerDots from '$lib/comps/ScrollerDots.svelte';

	let smallChartsCointainer: HTMLElement;
</script>

<div
	style="background-image: url(/background/dashboard.svg)"
	class="desktop:absolute desktop:inset-0 desktop:overflow-hidden bg-cover flex flex-col"
>
	<AppNav showCurrencyDropdown />

	<div class="flex-grow grid place-items-center pb-24 desktop:mx-4">
		<div
			style="grid-template-rows: 1fr 3fr"
			class="grid grid-cols-3 gap-[7px] mx-auto h-full pb-6 w-full max-w-[1050px] max-h-[700px]"
		>
			<div
				bind:this={smallChartsCointainer}
				class="-desktop:flex -desktop:gap-x-2 -desktop:h-[148px] -desktop:overflow-x-scroll desktop:grid grid-cols-subgrid col-span-3 no-scrollbar -desktop:snap-x -desktop:snap-mandatory -desktop:px-3"
			>
				<div class="-desktop:flex-shrink-0 -desktop:w-5/6">
					<DashboardCard>
						<!-- svelte-ignore missing-declaration -->
						<HomepageSmallChart
							title="Market cap"
							change={$coinstats_global_data?.marketCapChange}
							value={$coinstats_global_data?.marketCap.toLocaleString()}
							prefix="$"
						/>
					</DashboardCard>
				</div>

				<div class="-desktop:flex-shrink-0 -desktop:w-5/6">
					<DashboardCard>
						<HomepageSmallChart
							title="Volume 24H"
							change={$coinstats_global_data?.volumeChange}
							value={$coinstats_global_data?.volume.toLocaleString()}
							prefix="$"
						/>
					</DashboardCard>
				</div>

				<div class="-desktop:flex-shrink-0 -desktop:w-5/6">
					<DashboardCard>
						<HomepageSmallChart
							title="BTC Dominance"
							change={$coinstats_global_data?.btcDominanceChange}
							value={$coinstats_global_data?.btcDominance.toLocaleString()}
							prefix="$"
						/>
					</DashboardCard>
				</div>
			</div>

			<div class="col-span-3 mb-6 mt-2 desktop:hidden">
				<ScrollerDots container={smallChartsCointainer}></ScrollerDots>
			</div>

			<div class="col-span-2 h-full -desktop:col-span-3 -desktop:mx-3">
				<DashboardCard disablePadding>
					<div
						class="w-full h-full flex flex-col overflow-hidden -desktop:px-4 -desktop:py-5 desktop:px-[30px] desktop:py-[22px]"
					>
						<div class="desktop:flex items-center w-full">
							<div>
								<div class="text-[20px] font-paralucent-heavy uppercase -desktop:text-sm">
									{$coinstats_selected_coin?.name || 'Bitcoin'}
								</div>

								<div class="text-[#FFFFFFCC] text-lg font-paralucent font-medium -desktop:text-xs">
									Crypto Fear and Greed Chart
								</div>
							</div>

							<div class="flex-grow"></div>

							<div class="-desktop:mt-4">
								<DurationSwitcher></DurationSwitcher>
							</div>
						</div>

						<div class="pt-[70px] flex-grow">
							<HomepageBigChart></HomepageBigChart>
						</div>
					</div>
				</DashboardCard>
			</div>

			<div class="max-h-[500px] -desktop:col-span-3 -desktop:pb-2 -desktop:mx-3">
				<IndicatorCard />
			</div>
		</div>
	</div>
</div>
