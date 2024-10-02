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
	import { isDesktop } from '$lib/stores/ui';
	import { get_data_color } from '$lib/utils';
	import { onDestroy, tick } from 'svelte';

	let cfgi_trend_chart: Chart;
	let ctx: CanvasRenderingContext2D;

	function chart_init() {
		if (!$coin_data?.length || !trend_chart_canvas) {
			return;
		}

		const formatted_data = $coin_data.filter((d) => d.price && d.cfgi);

		const prices_data = formatted_data.map((d) => d.price);
		const cfgi_data = formatted_data.map((c) => c.cfgi);

		if (cfgi_trend_chart) {
			cfgi_trend_chart.destroy();
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
			order: 1
		};

		const chart_line_data: ChartDataset<'line'> = {
			type: 'line',
			data: prices_data,
			backgroundColor: '#2c56ff',
			yAxisID: 'left-y-axis',
			label: 'Price',
			order: 2,
			spanGaps: true,
			tension: 0.4,
			pointRadius: 0,
			borderColor: '#2c56ff'
		};

		const chart_data = {
			labels: formatted_data.map((d) => dayjs(d.date).format('DD MMM YYYY')),
			datasets: [chart_bar_data, chart_line_data]
		};

		const max_price = Math.max(...(prices_data.filter((d) => d) as number[]));
		const max_y_index = +`${+max_price.toString()[0] + 1}${max_price.toString().slice(1)}`;

		const options: _DeepPartialObject<
			CoreChartOptions<'bar'> &
				ElementChartOptions<'bar'> &
				PluginChartOptions<'bar'> &
				DatasetChartOptions<'bar'> &
				ScaleChartOptions<'bar'> &
				LineControllerChartOptions
		> = {
			resizeDelay: 500,
			interaction: {
				mode: 'nearest',
				intersect: false
			},
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				'left-y-axis': {
					beginAtZero: false,
					ticks: {
						font: { family: 'Manrope', size: 10 },
						callback: (value: number) => {
							return `$${value}`;
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
						}
					},
					max: 100,
					position: 'right'
				},
				x: {
					ticks: {
						font: { family: 'Manrope', size: 8 },
						autoSkip: true
						// color: '#aaa'
					}
					// To append last tick
					// beforeFit: function (axis: any) {
					// 	var l = axis.getLabels();
					// 	axis.ticks.push({ value: axis.max, label: l[axis.max] });
					// }
				}
			},
			plugins: {
				legend: {
					display: false
				}
			}
		};

		if (trend_chart_canvas) {
			cfgi_trend_chart = new Chart(trend_chart_canvas, {
				type: 'bar',
				// @ts-expect-error
				data: chart_data,
				options: options
			});
		}
	}

	let trend_chart_canvas: HTMLCanvasElement;

	trend_chart_loading.subscribe(async (loading) => {
		await tick();

		if (!loading && trend_chart_canvas) {
			ctx = trend_chart_canvas.getContext('2d')!;
			chart_init();
		}
	});

	const resizeUnsub = isDesktop.subscribe((desktop) => {
		if (cfgi_trend_chart) {
			// @ts-ignore
			cfgi_trend_chart.options.scales.y.display = desktop;
			cfgi_trend_chart.update();
		}
	});

	onDestroy(() => {
		resizeUnsub();
	});
</script>

<div class="relative h-full">
	{#if $trend_chart_loading}
		<div out:fade class="absolute inset-0">
			<LoadingAnim />
		</div>
	{/if}

	<canvas
		class:opacity-0={$trend_chart_loading}
		bind:this={trend_chart_canvas}
		width="400"
		class="h-[150px] -desktop:h-[300px]"
	/>
</div>
