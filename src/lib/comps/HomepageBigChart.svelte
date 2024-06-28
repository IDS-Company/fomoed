<script lang="ts">
	import { onMount } from 'svelte';
	import { getGreedData } from '$lib/utils/mockChartData';
	import Chart from 'chart.js/auto';

	let chartData = {
		labels: [],
		datasets: []
	};

	const color = '#47A663';
	const data = getGreedData();

	onMount(() => {
		const ctx = canvas.getContext('2d');
		const gradient = ctx.createLinearGradient(0, 0, 0, 300);

		gradient.addColorStop(0, 'rgba(71, 166, 99, 0.25)');
		gradient.addColorStop(1, 'rgba(71, 166, 99, 0)');

		chartData = {
			labels: data.labels,
			datasets: [
				{
					label: 'Value',
					data: data.data,
					borderColor: color,
					borderWidth: 2,
					pointRadius: 0,
					fill: true,
					backgroundColor: gradient
				}
			]
		};

		const chart = new Chart(ctx, {
			type: 'line',
			data: chartData,
			options: options
		});
	});

	const options = {
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
			},
			tooltip: {
				enabled: false
			}
		}
	};

	let canvas: HTMLCanvasElement;
</script>

<canvas bind:this={canvas} width="400" height="150" />
