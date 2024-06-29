<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Chart from 'chart.js/auto';
	import { dayjs } from 'svelte-time';
	import type { _DeepPartialObject } from 'chart.js/dist/types/utils';
	import { coin_data } from '$lib/stores';
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
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	const color = '#47A663';

	let cfgi_trend_chart: Chart;
	let ctx: CanvasRenderingContext2D;

	function chart_init() {
		if (!$coin_data?.length || !trend_chart_canvas) {
			return;
		}

		const formatted_data = $coin_data.filter((d) => d.price && d.cfgi);

		console.log(formatted_data);

		const prices_data = formatted_data.map((d) => d.price);
		const cfgi_data = formatted_data.map((c) => c.cfgi);

		if (cfgi_trend_chart) {
			cfgi_trend_chart.destroy();
		}

		const gradient = ctx.createLinearGradient(0, 0, 0, 300);
		gradient.addColorStop(0, 'rgba(71, 166, 99, 0.25)');
		gradient.addColorStop(1, 'rgba(71, 166, 99, 0)');

		const cfgiData: ChartDataset<'line'> = {
			type: 'line',
			data: cfgi_data,
			backgroundColor: gradient,
			label: 'Fear and Greed Index',
			order: 1,
			fill: true,
			borderColor: color,
			borderWidth: 2,
			pointRadius: 0
		};

		const chart_data = {
			labels: formatted_data.map((d) => dayjs(d.date).format('DD MMM YYYY')),
			datasets: [cfgiData]
		};

		console.log(chart_data);

		const options: _DeepPartialObject<
			CoreChartOptions<'bar'> &
				ElementChartOptions<'bar'> &
				PluginChartOptions<'bar'> &
				DatasetChartOptions<'bar'> &
				ScaleChartOptions<'bar'> &
				LineControllerChartOptions
		> = {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: true,
					grid: {
						display: false // Remove background grid
					},
					ticks: {
						display: true
					},
					border: {
						display: false
					},
					min: 0,
					max: 100,
					step: 20,
					color: '#FFFFFF'
				},
				x: {
					beginAtZero: true,
					grid: {
						display: false // Remove background grid
					},
					ticks: {
						display: false
					},
					border: {
						display: false
					}
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
				data: chart_data,
				options: options
			});
		}
	}

	const loading = writable(true);
	const displayChart = writable(false);

	coin_data.subscribe((coin_cfgi) => {
		if (coin_cfgi?.length) {
			loading.set(false);
		}
	});

	displayChart.subscribe(async ($displayChart) => {
		await tick();

		if ($displayChart) {
			ctx = trend_chart_canvas.getContext('2d')!;
			chart_init();
		}
	});

	let trend_chart_canvas: HTMLCanvasElement;
</script>

{#if $loading}
	<div out:fade on:outroend={() => displayChart.set(true)}>
		<LoadingAnim />
	</div>
{:else if $displayChart}
	<canvas bind:this={trend_chart_canvas} width="400" height="150" in:fade />
{/if}
