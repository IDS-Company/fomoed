<script lang="ts">
	import { Chart } from 'chart.js/auto';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import annotationPlugin from 'chartjs-plugin-annotation';
	import type { LiqMapData } from '../chartUtils';
	import { failure } from '$lib/utils';
	import { registerChartPluginZoomInBrowser } from '$ts/client/utils/ui';
	import type { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';

	Chart.register(annotationPlugin);
	registerChartPluginZoomInBrowser();

	export let chart: Chart;
	export let currentPrice: number = 0;
	export let fetchLiqMapData: () => Promise<LiqMapData>;

	let refreshId = 0;

	export async function refreshData() {
		if (!canvas) return;

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

		const ctx = canvas.getContext('2d');

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

		const zoomPluginOptions: ZoomPluginOptions = {
			zoom: {
				wheel: {
					enabled: true
				},
				pinch: {
					enabled: true
				},
				mode: 'x',
				scaleMode: 'y'
			},
			pan: {
				enabled: true,
				mode: 'xy',
				threshold: 0
			},
			limits: {
				x: { minRange: 100 },
				y: { min: 0 },
				cumulative: { min: 0 }
			}
		};

		chart = new Chart(canvas, {
			data: {
				datasets: [
					{
						type: 'bar',
						data: data.liqBars,
						barThickness: 0.5,
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
				spanGaps: true, // for better performance
				animation: false, // for better performance
				responsive: false,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'linear',
						ticks: {
							callback: (val: any) => {
								return Math.round(val / 1000) + 'K';
							}
						},
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
						min: 0,
						ticks: {
							callback: (val: any) => `${Math.round(val / 1000000)}M`
						}
					},
					cumulative: {
						type: 'linear',
						grid: {
							color: '#fff2'
						},
						position: 'right',
						max: data.maxCumulativeValue * 1.15,
						min: 0,
						border: {
							dash: [8, 4]
						},
						ticks: {
							callback: (val: any) => `${Math.round(val / 1000000)}M`
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
					tooltip: {
						position: 'nearest',
						callbacks: {
							title: (ctx: any) => {
								return `Price: ${Math.round(ctx[0].parsed.x)} USD`;
							},
							label: (ctx) => {
								if (ctx.datasetIndex === 0) {
									return ` Leverage: ${ctx.parsed.y}`;
								} else if (ctx.datasetIndex === 1 || ctx.datasetIndex === 2) {
									return ` Cumulative: ${ctx.parsed.y}`;
								}
							},
							labelColor: (ctx: any) => {
								const color = ctx.dataset.borderColor || ctx.raw.color;

								return {
									borderColor: color,
									backgroundColor: color,
									borderWidth: 2,
									borderRadius: 2
								};
							}
						}
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
					},
					zoom: zoomPluginOptions
				}
			}
		});

		chart.resize();
	}

	let canvas: HTMLCanvasElement;
</script>

<div class="relative w-full h-full">
	<canvas bind:this={canvas}></canvas>
</div>
