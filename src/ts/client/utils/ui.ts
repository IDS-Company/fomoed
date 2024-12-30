import { browser } from '$app/environment';
import { Chart } from 'chart.js';

// TODO move this to utils/client
export async function registerChartPluginZoomInBrowser() {
	if (!browser) return;

	const pluginZoom = await import('chartjs-plugin-zoom');

	Chart.register(pluginZoom.default);
}
