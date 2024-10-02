<script lang="ts">
	import LoadingAnim from '$lib/comps/animations/LoadingAnim.svelte';
	import { fade } from 'svelte/transition';
	import { Chart } from 'chart.js/auto';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import annotationPlugin from 'chartjs-plugin-annotation';
	import type { LiqMapData } from '../chartUtils';
	import { failure } from '$lib/utils';

	Chart.register(annotationPlugin);

	export let currentPrice: number = 0;
	export let fetchLiqMapData: () => Promise<LiqMapData>;
	export let isLoading;

	let refreshId = 0;

	export async function refreshData() {
		const localRefreshId = ++refreshId;

		if (chart) {
			chart.destroy();
		}

		const data = await fetchLiqMapData();

		if (!data) {
			failure('No data.');
			return;
		}

		if (refreshId !== localRefreshId) {
			console.log('refreshData: stale data');
			return;
		}

		currentPrice = data.currentPrice;

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

		if (chart) {
			chart.destroy();
		}

		if (!trend_chart_canvas) {
			return;
		}

		chart = new Chart(trend_chart_canvas, {
			data: {
				datasets: [
					{
						type: 'bar',
						data: data.liqBars,
						barThickness: 0.1,
						order: 20,
						backgroundColor: (data: any) => data.raw.color
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
				spanGaps: true, // for better performance
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
			}
		});
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
