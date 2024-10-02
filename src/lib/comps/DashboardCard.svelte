<script>
	export let isChartCard = false;
	export let hideCard = false;
</script>

{#if hideCard}
	<slot />
{:else}
	<div
		class:isChartCard
		class="{!isChartCard &&
			'px-[30px] py-[22px]'} bg-[#0F0D0D] rounded-[26px] border border-white border-opacity-10 grid place-items-center w-full h-full -desktop:snap-center overflow-hidden"
	>
		<slot />
	</div>
{/if}

<style>
	.isChartCard {
		@apply desktop:py-[22px] -desktop:py-3;
	}
</style>
