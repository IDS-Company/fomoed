<script lang="ts">
	import Chart from 'chart.js/auto';
	import { dayjs } from 'svelte-time';
	import type { _DeepPartialObject } from 'chart.js/dist/types/utils';
	import { coin_data, trend_chart_loading } from '$lib/stores';
	import type {
		ChartDataset,
		CoreChartOptions,
		DatasetChartOptions,
		ElementChartOptions,
		LineControllerChartOptions,
		PluginChartOptions,
		ScaleChartOptions
	} from 'chart.js/auto';
	import LoadingAnim from './animations/LoadingAnim.svelte';
	import { fade } from 'svelte/transition';
	import { get_data_color } from '$lib/utils';
	import { onMount, tick } from 'svelte';
	import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
	import type { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';

	export let showLoadingAnim = false;
	export let loading = false;
	export let chart: Chart | null = null;

	$: loading = $trend_chart_loading;

	let ctx: CanvasRenderingContext2D;

	function chart_init() {
		console.log('chart_init');

		if (!$coin_data?.length || !trend_chart_canvas) {
			return;
		}

		const formatted_data = $coin_data.filter((d) => d.price && d.cfgi);

		const prices_data = formatted_data.map((d) => Math.round(d.price));
		const cfgi_data = formatted_data.map((c) => c.cfgi);

		console.log('prices_data', prices_data);
		console.log('cfgi_data', cfgi_data);

		if (chart) {
			chart.destroy();
		}

		const gradient = ctx.createLinearGradient(0, 0, 0, 200);
		gradient.addColorStop(0, 'rgba(71, 166, 99, 0.4)');
		gradient.addColorStop(1, 'rgba(71, 166, 99, 0)');

		const chart_bar_data: ChartDataset<'bar'> = {
			type: 'bar',
			data: cfgi_data,
			backgroundColor: cfgi_data.map((c) => (c ? get_data_color(c) : '#0d0d0d')),
			yAxisID: 'right-y-axis',
			label: 'Fear and Greed Index',
			order: 2
		};

		const chart_line_data: ChartDataset<'line'> = {
			type: 'line',
			data: prices_data,
			backgroundColor: '#2c56ff',
			yAxisID: 'left-y-axis',
			label: 'Price',
			order: 1,
			spanGaps: true,
			pointRadius: 0,
			borderColor: '#2c56ff'
		};

		const labels = formatted_data.map((d) => dayjs(d.date).format('DD MMM YYYY'));

		const chart_data = {
			labels,
			datasets: [chart_bar_data, chart_line_data]
		};

		const max_price = Math.max(...(prices_data.filter((d) => d) as number[]));
		const max_y_index = +`${+max_price.toString()[0] + 1}${max_price.toString().slice(1)}`;

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
				x: { minRange: 1000 * 60 * 60 * 24 * 7 }
			}
		};

		const options: _DeepPartialObject<
			CoreChartOptions<'bar'> &
				ElementChartOptions<'bar'> &
				PluginChartOptions<'bar'> &
				DatasetChartOptions<'bar'> &
				ScaleChartOptions<'bar'> &
				LineControllerChartOptions
		> = {
			// resizeDelay: 500,
			interaction: {
				mode: 'nearest',
				intersect: false
			},
			responsive: false,
			maintainAspectRatio: false,
			scales: {
				'left-y-axis': {
					beginAtZero: false,
					ticks: {
						font: { family: 'Manrope', size: 10 },
						callback: (value: number) => {
							if (value < 0) {
								return '';
							}

							return `$${Math.round(value / 1000)}k`;
						}
					},
					min: Math.floor(Math.min(...(prices_data.filter((d) => d) as number[]))),
					max: Math.ceil(max_y_index),
					position: 'left'
				},
				'right-y-axis': {
					beginAtZero: true,
					grid: {
						display: true,
						drawOnChartArea: true,
						color: function (value: any, data: any) {
							return value.tick.value === 0
								? 'rgba(255, 255, 255, 0.3)'
								: get_data_color(value.tick.value);
						},
						lineWidth: 0.1,
						drawTicks: true
					},
					ticks: {
						font: { family: 'Manrope', size: 10 },
						stepSize: 25,
						color: function (value: any, data: any) {
							return value.tick.value === 0
								? 'rgba(255, 255, 255, 0.3)'
								: get_data_color(value.tick.value);
						},
						display: false
					},
					max: 100,
					position: 'right'
				},
				x: {
					ticks: {
						minRotation: 0,
						maxRotation: 0,
						sampleSize: 2
					},
					type: 'time',
					time: {
						unit: 'day',
						displayFormats: {
							day: 'DD MMM YY'
						},
						min: labels[0],
						max: labels[labels.length - 1]
					},
					adapters: {
						// date: adapter
					}
				}
			},
			plugins: {
				legend: {
					display: false
				},
				zoom: zoomPluginOptions,
				tooltip: {
					enabled: false
				}
			},
			transitions: {
				zoom: {
					animation: {
						duration: 0
					}
				}
			},
			animation: {
				duration: 0
			}
		};

		if (trend_chart_canvas) {
			chart = new Chart(trend_chart_canvas, {
				type: 'bar',
				// @ts-expect-error
				data: chart_data,
				options: options
			});
		}

		chart.resize();
	}

	let trend_chart_canvas: HTMLCanvasElement;

	trend_chart_loading.subscribe(async (loading) => {
		await tick();

		if (!loading && trend_chart_canvas) {
			ctx = trend_chart_canvas.getContext('2d')!;
			await registerZoom();
			chart_init();
		}
	});

	async function registerZoom() {
		const pluginZoom = await import('chartjs-plugin-zoom');
		Chart.register(pluginZoom.default);
	}

	onMount(() => {
		registerZoom();
	});
</script>

<div class="relative h-full">
	{#if $trend_chart_loading && showLoadingAnim}
		<div out:fade class="absolute inset-0">
			<LoadingAnim />
		</div>
	{/if}

	<canvas
		class="duration-150 transition-opacity ease-linear"
		class:opacity-0={$trend_chart_loading && showLoadingAnim}
		bind:this={trend_chart_canvas}
		width="400"
	></canvas>
</div>
