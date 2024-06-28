<script lang="ts">
	import AppNav from '$lib/comps/AppNav.svelte';
	import DashboardCard from '$lib/comps/DashboardCard.svelte';
	import DurationSwitcher from '$lib/comps/DurationSwitcher.svelte';
	import HomepageBigChart from '$lib/comps/HomepageBigChart.svelte';
	import HomepageSmallChart from '$lib/comps/HomepageSmallChart.svelte';
	import IndicatorCard from '$lib/comps/IndicatorCard.svelte';
</script>

<div
	style="background-image: url(/background/dashboard.svg)"
	class="absolute inset-0 overflow-hidden bg-cover flex flex-col"
>
	<AppNav showCurrencyDropdown />

	<div class="flex-grow grid place-items-center pb-24">
		<div
			style="grid-template-rows: 1fr 3fr"
			class="grid grid-cols-3 gap-[7px] mx-auto h-full pb-6 w-full max-w-[1050px] max-h-[700px]"
		>
			<DashboardCard>
				<HomepageSmallChart title="Market cap" value={1234} change={1.23} prefix="$" />
			</DashboardCard>

			<DashboardCard>
				<HomepageSmallChart title="Volume 24H" value={1234} change={1.23} prefix="$" />
			</DashboardCard>

			<DashboardCard>
				<HomepageSmallChart title="BTC Dominance" value={1234} change={1.23} prefix="$" />
			</DashboardCard>

			<div class="col-span-2 h-full">
				<DashboardCard>
					<div class="w-full h-full flex flex-col">
						<div class="flex items-center w-full">
							<div>
								<div class="text-[20px] font-paralucent-heavy">BITCOIN</div>
								<div class="text-[#FFFFFFCC] text-lg font-paralucent font-medium">
									Crypto Fear and Greed Chart
								</div>
							</div>

							<div class="flex-grow"></div>

							<DurationSwitcher></DurationSwitcher>
						</div>

						<div class="pt-[70px] flex-grow">
							<HomepageBigChart></HomepageBigChart>
						</div>
					</div>
				</DashboardCard>
			</div>

			<div class="max-h-[500px]">
				<IndicatorCard percentage={0} prev={0} average={0} />
			</div>
		</div>
	</div>
</div>
