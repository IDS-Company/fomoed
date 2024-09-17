<script lang="ts">
	import { sleep, type ICoinCfgiPriceData } from '$lib';
	import LoadingAnim from '$lib/comps/animations/LoadingAnim.svelte';
	import { isDesktop } from '$lib/stores/ui';
	import {
		Chart,
		type ChartDataset,
		type CoreChartOptions,
		type DatasetChartOptions,
		type ElementChartOptions,
		type LineControllerChartOptions,
		type PluginChartOptions,
		type ScaleChartOptions
	} from 'chart.js';
	import { dayjs } from 'svelte-time';
	import { fade } from 'svelte/transition';
	import type { _DeepPartialObject } from 'chart.js/dist/types/utils';
	import { fetchCfgi } from '../chartUtils';
	import { onMount } from 'svelte';
	import { coinstats_selected_coin } from '$lib/stores';
	import { auth_email, logged_in } from '$lib/stores/user';

	export let daysBack: number;

	const color = '#47A663';

	let cfgi_trend_chart: Chart;
	let ctx: CanvasRenderingContext2D;

	function chart_init(data: ICoinCfgiPriceData[]) {
		const formatted_data = data.filter((d) => d.price && d.cfgi);
		const cfgi_data = formatted_data.map((c) => c.cfgi);

		if (cfgi_trend_chart) {
			cfgi_trend_chart.destroy();
		}

		const gradient = ctx.createLinearGradient(0, 0, 0, 400);
		gradient.addColorStop(0, 'rgba(71, 166, 99, 0.4)');
		gradient.addColorStop(1, 'rgba(71, 166, 99, 0)');

		const cfgiData: ChartDataset<'line'> = {
			type: 'line',
			data: cfgi_data,
			backgroundColor: gradient,
			label: 'Fear and Greed Index',
			order: 1,
			fill: true,
			borderColor: color,
			borderWidth: 1,
			pointRadius: 0
		};

		const chart_data = {
			labels: formatted_data.map((d) => dayjs(d.date).format('DD MMM YYYY')),
			datasets: [cfgiData]
		};

		const options: _DeepPartialObject<
			CoreChartOptions<'bar'> &
				ElementChartOptions<'bar'> &
				PluginChartOptions<'bar'> &
				DatasetChartOptions<'bar'> &
				ScaleChartOptions<'bar'> &
				LineControllerChartOptions
		> = {
			animation: {
				duration: 0
			},
			responsive: true,
			resizeDelay: 500,
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: true,
					grid: {
						display: true,
						color: '#272525',
						offset: false
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
						display: true,
						color: '#272525',
						offset: false
					},
					ticks: {
						maxRotation: 90,
						autoSkipPadding: 10
					},
					border: {
						display: false
					},
					beforeFit: function (axis: any) {
						var l = axis.getLabels();
						axis.ticks.push({ value: axis.max, label: l[axis.max] });
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

	async function refreshData() {
		loading = true;

		let data: ICoinCfgiPriceData[];

		try {
			data = await fetchCfgi(daysBack);
		} finally {
			loading = false;
		}

		ctx = trend_chart_canvas.getContext('2d')!;
		chart_init(data);
	}

	$: if ($coinstats_selected_coin && daysBack && $logged_in !== null) {
		refreshData();
	}

	let loading = true;
	let trend_chart_canvas: HTMLCanvasElement;
</script>

<div class="relative h-full">
	{#if loading}
		<div out:fade class="absolute inset-0 grid place-items-center">
			<LoadingAnim />
		</div>
	{/if}

	<canvas class:opacity-0={loading} bind:this={trend_chart_canvas} />
</div>
