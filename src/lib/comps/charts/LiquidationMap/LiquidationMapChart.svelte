<script lang="ts">
	import { fetchHeatmapData, fetchLiqMapData, type LiquidationBar } from '../chartUtils';
	import LoadingAnim from '$lib/comps/animations/LoadingAnim.svelte';
	import { fade } from 'svelte/transition';
	import { Chart } from 'chart.js/auto';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import annotationPlugin from 'chartjs-plugin-annotation';

	Chart.register(annotationPlugin);

	export let timeframe: string;
	export let exchange: string;
	export let baseAsset: string;
	export let quoteAsset: string;
	export let isLoading = false;
	export let error = false;
	export let currentPrice: number = 0;

	export async function refreshData() {
		isLoading = true;

		if (chart) {
			chart.destroy();
		}

		const data = await fetchLiqMapData(timeframe, exchange, baseAsset, quoteAsset);

		if (!data) {
			error = true;
			isLoading = false;
			return;
		}

		currentPrice = data.currentPrice;

		console.log(data.cumulativeLongLiqLeverage);

		const ctx = trend_chart_canvas.getContext('2d');

		if (!ctx) {
			return;
		}

		const gradientLong = ctx.createLinearGradient(0, 0, 0, 400);
		gradientLong.addColorStop(0, '#22AB9422');
		gradientLong.addColorStop(1, '#22AB9400');

		const gradientShort = ctx.createLinearGradient(0, 0, 0, 400);
		gradientShort.addColorStop(0, '#FF3B1022');
		gradientShort.addColorStop(1, '#FF3B1000');

		chart = new Chart(trend_chart_canvas, {
			data: {
				datasets: [
					{
						type: 'bar',
						data: data.liqBars.map((i) => ({ x: i.price, y: i.liqLevel, ...i })),
						barThickness: 0.1,
						order: 20,
						backgroundColor: (data: any) => {
							if (data.raw.levRatio === 100) {
								return '#FF8300';
							}

							if (data.raw.levRatio === 50) {
								return '#FFC403';
							}

							if (data.raw.levRatio === 25) {
								return '#73D8DA';
							}

							if (data.raw.levRatio === 10) {
								return '#6EC2F0';
							}

							return '#0000';
						}
					},
					{
						type: 'line',
						data: data.cumulativeLongLiqLeverage,
						borderColor: '#22AB94',
						spanGaps: true,
						pointRadius: 0,
						yAxisID: 'cumulative',
						borderWidth: 2,
						order: 10,
						backgroundColor: gradientLong,
						fill: true
					},
					{
						type: 'line',
						data: data.cumulativeShortLiqLeverage,
						borderColor: '#FF3B10',
						spanGaps: true,
						pointRadius: 0,
						yAxisID: 'cumulative',
						borderWidth: 2,
						order: 10,
						backgroundColor: gradientShort,
						fill: true
					}
				]
			},
			options: {
				resizeDelay: 500,
				// parsing: false, // must be here, solves another stupid problem
				// spanGaps: true, // for better performance
				animation: false, // for better performance
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'linear',
						// ticks: {
						// 	// autoSkip: false,
						// 	maxTicksLimit: 10,
						// 	includeBounds: true,
						// 	autoSkipPadding: 0
						// },
						grid: {
							display: false
						},
						min: data.minPrice,
						max: data.maxPrice,
						offset: false
					},
					y: {
						type: 'linear',
						grid: {
							color: '#fff2'
						},
						border: {
							dash: [8, 4]
						},
						min: 0
					},
					cumulative: {
						type: 'linear',
						grid: {
							color: '#fff2'
						},
						position: 'right',
						max: data.maxCumulativeValue * 1.15,
						border: {
							dash: [8, 4]
						}
					}
				},
				interaction: {
					mode: 'nearest',
					intersect: false,
					axis: 'x'
				},
				plugins: {
					legend: {
						display: false
					},
					annotation: {
						annotations: {
							currentPriceLine: {
								type: 'line',
								yMin: 0,
								yMax: data.maxCumulativeValue * 1.15,
								yScaleID: 'cumulative',
								borderColor: 'red',
								borderWidth: 2,
								xMin: data.currentPrice,
								xMax: data.currentPrice,
								borderDash: [8, 4],
								arrowHeads: {
									end: {
										backgroundColor: 'red',
										display: true,
										fill: true,
										borderDash: [0, 0]
									}
								}
							}
						}
					}
				}
				// onResize: (chart, { width, height }) => {
				// 	const widthWithoutScales = width - 50;
				// 	const pxPerTimePoint = widthWithoutScales / n_time_points;

				// 	chart.data.datasets[1].pointRadius = pxPerTimePoint;
				// }
			}
		});

		isLoading = false;
	}

	let trend_chart_canvas: HTMLCanvasElement;
	let chart: Chart;
</script>

<div class="relative w-full h-full">
	{#if isLoading}
		<div out:fade class="absolute inset-0 grid place-items-center">
			<LoadingAnim />
		</div>
	{/if}

	<canvas class:opacity-0={isLoading} bind:this={trend_chart_canvas} />
</div>
