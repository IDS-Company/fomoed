import { browser } from '$app/environment';
import { Chart } from 'chart.js';

export async function registerChartPluginZoomInBrowser() {
	if (!browser) return;

	const pluginZoom = await import('chartjs-plugin-zoom');

	Chart.register(pluginZoom.default);
}
