<script lang="ts">
	import { onMount } from 'svelte';
	import LoadingAnim from '$lib/comps/animations/LoadingAnim.svelte';
	import { fade } from 'svelte/transition';
	import { Chart } from 'chart.js/auto';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import { evaluate_cmap } from '$ts/utils/client/colormap';
	import { formatRgb } from '$ts/utils/client/colors';
	import { fetchHeatmapData } from '$lib/comps/charts/chartUtils';
	import { failure } from '$lib/utils';

	export let timeframe: string;
	export let exchange: string;
	export let symbol: string;
	export let maxLiqValue = 0;
	export let isLoading = false;
	export let error = false;

	export async function refreshData() {
		isLoading = true;
		error = false;

		if (chart) {
			chart.destroy();
		}

		const data = await fetchHeatmapData(timeframe, exchange, symbol);

		if (!data) {
			failure('Failed to fetch data');
			error = true;
			isLoading = false;
			return;
		}

		const y = data.y;
		const prices = data.prices;
		const liq = data.liq;

		const price_timestamps = prices.map((i: any) => i[0] * 1000);

		const liq_values = liq.map((i: any) => i[2]);
		const max_liq = Math.max(...liq_values);

		const n_time_points = prices.length;
		const max_volume_y_idx = Math.max(...liq.map((i: any) => i[1]));

		maxLiqValue = max_liq;

		const datasets = [
			{
				type: 'candlestick',
				data: prices.map(function (item: any) {
					return {
						x: item[0] * 1000,
						o: item[1],
						h: item[2],
						l: item[3],
						c: item[4]
					};
				}),
				borderColors: {
					up: 'rgb(26, 152, 129)', // those colors are better than defaults
					down: 'rgb(239, 57, 74)', // those colors are better than defaults
					unchanged: '#999' // those colors are better than defaults
				},
				backgroundColors: {
					up: 'rgb(26, 152, 129)',
					down: 'rgb(239, 57, 74)',
					unchanged: '#999'
				},
				order: 10,
				yAxisID: 'y',
				xAxisID: 'x'
				// barPercentage: 0.1,
				// barThickness: 6
			},
			{
				type: 'scatter',
				data: liq.map((item) => ({
					x: price_timestamps[item[0]],
					y: y[item[1]]
				})),
				backgroundColor: liq.map((item) => {
					const normalized = item[2] / max_liq;
					const [r, g, b] = evaluate_cmap(normalized, 'viridis');

					return formatRgb(r, g, b);
				}),
				// borderColor: '#fff',
				borderWidth: 1,
				hoverBorderColor: '#fff',
				order: 12,
				yAxisID: 'y',
				xAxisID: 'x',
				// pointRadius: 1,
				pointStyle: 'rect'
			}
		];

		if (trend_chart_canvas) {
			chart = new Chart(trend_chart_canvas, {
				data: {
					datasets
				},
				options: {
					resizeDelay: 500,
					parsing: false, // must be here, solves another stupid problem
					animation: false, // for better performance
					pointRadius: 0, // for better performance
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						x: {
							type: 'timeseries',
							ticks: {
								// autoSkip: false,
								maxTicksLimit: 10,
								includeBounds: true,
								autoSkipPadding: 0
							},
							grid: {
								display: false
							}
						},
						y: {
							type: 'linear',
							grid: {
								display: false
							}
						}
					},
					interaction: {
						mode: 'nearest',
						intersect: false
					},
					plugins: {
						legend: {
							display: false
						}
					},
					onResize: (chart, { width, height }) => {
						// const widthWithoutScales = width - 50;
						const pxPerTimePoint = height / n_time_points;

						chart.data.datasets[1].pointRadius = pxPerTimePoint;
					}
				}
			});
		}

		isLoading = false;
	}

	onMount(async () => {
		const { CandlestickController, CandlestickElement } = await import('chartjs-chart-financial');
		Chart.register(CandlestickElement, CandlestickController);
	});

	let trend_chart_canvas: HTMLCanvasElement;
	let chart: Chart;
</script>

<div class="relative w-full h-full">
	{#if isLoading}
		<div out:fade class="absolute inset-0 grid place-items-center">
			<LoadingAnim />
		</div>
	{/if}

	<canvas
		class:opacity-0={isLoading || error}
		bind:this={trend_chart_canvas}
		style="background-image: linear-gradient(#440253, #440253)"
	/>
</div>

<style>
	canvas {
		background-size: auto auto;
		background-repeat: no-repeat;
		background-position: 50px -30px;
	}
</style>
