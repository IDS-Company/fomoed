import { Chart, type ChartEvent } from 'chart.js';
import { color } from 'chart.js/helpers';
import type { StringToNumber } from 'type-fest/source/internal';

interface LabelingOptions {
	scaleId: string;
	label: string;
	widthComputeString?: string;

	// Chart JS somehow automatically calls the function when the plugin option is a function,
	// That is why these are functions returning functions.

	getTextColor?: () => (val: any) => string;
	getText: () => (val: number) => string;
}

export interface CrosshairPluginConfig {
	labels: LabelingOptions[];
	crosshairEnableDelay?: number;
}

interface CrosshairCache {
	crosshairEnabled: boolean;
	datasetCache: any[];
	opts: CrosshairPluginConfig;
	coords: {
		x: number;
		y: number;
	} | null;
	lastToucheventCoords: {
		x: number;
		y: number;
	};
	totalLastTouchSeqDelta: {
		x: number;
		y: number;
	};
	crosshairEnabledInLastTouchSeq: boolean;
	// panEnableBeforeTouchSeq: boolean;
}

type Chart_ = Chart & { _crosshairCache: CrosshairCache };

function interpretOpts(opts: LabelingOptions, val: number): { text: string; color: string } {
	return {
		text: (opts.getText as any)(val) as unknown as string,
		color: (opts.getTextColor as any)?.(val) ?? 'white'
	};
}

function renderXCrosshairLabel(chart: Chart, xCenterPixel: number, opts: LabelingOptions) {
	const { ctx, chartArea } = chart;

	const xVal = chart.scales[opts.scaleId].getValueForPixel(xCenterPixel) as number;
	const { text, color } = interpretOpts(opts, xVal);

	ctx.save();
	ctx.fillStyle = '#272626';
	ctx.font = '14px Paralucent';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';

	const textWidth = ctx.measureText(text).width;
	const textHeight = 12;
	const padding = 5;
	const boxWidth = textWidth + padding * 2;
	const boxHeight = textHeight + padding * 2;
	const boxX = xCenterPixel - boxWidth / 2;
	const boxY = chartArea.bottom + padding - chart.scales.x.height;

	ctx.beginPath();

	ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 3);
	ctx.fill();

	ctx.fillStyle = color;
	ctx.fillText(text, xCenterPixel, boxY + padding);
	ctx.restore();
}

function renderYCrosshairLabel(chart: Chart, yCenterPixel: number, opts: LabelingOptions) {
	const { ctx } = chart;

	const scale = chart.scales[opts.scaleId];
	const yVal = scale.getValueForPixel(yCenterPixel) as number;

	const { text, color } = interpretOpts(opts, yVal);

	ctx.save();
	ctx.fillStyle = '#272626';
	ctx.font = '14px Paralucent';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	const textWidth = ctx.measureText(text).width;
	const textHeight = 12;
	const padding = 5;
	const boxWidth = textWidth + padding * 2;
	const boxHeight = textHeight + padding * 2;
	const boxX = scale.left;
	const boxY = yCenterPixel - boxHeight / 2;

	ctx.beginPath();

	ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 3);
	ctx.fill();

	ctx.fillStyle = color;
	ctx.fillText(text, boxX + boxWidth / 2, yCenterPixel);
	ctx.restore();
}

function drawIntersections(
	chart: Chart,
	opts: {
		labelOptions: LabelingOptions[];
		drawLabels?: boolean;
		drawPoints?: boolean;
		xVal: number;
		xPixel: number;
	}
) {
	const { drawLabels = true, drawPoints = true, xVal, xPixel, labelOptions } = opts;

	const { ctx } = chart;
	const { chartArea } = chart;

	let leftAcc = 0;

	ctx.save();

	if (drawLabels) {
		ctx.font = '14px Paralucent';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle';
	}

	for (const datasetMeta of chart.getSortedVisibleDatasetMetas()) {
		const yAxisID = datasetMeta.yAxisID as string;

		const datasetYScaleOpts = labelOptions.find((i) => i.scaleId === yAxisID);
		const datapoint = datasetMeta._parsed.find((i: any) => i.x === xVal) as any;

		if (!datapoint) return;

		const { text, color } = interpretOpts(datasetYScaleOpts!, datapoint.y);

		if (drawLabels) {
			const textWithLabel = `${datasetYScaleOpts!.label}: ${text}`;

			ctx.fillStyle = color;
			ctx.fillText(textWithLabel, chartArea.left + leftAcc, chartArea.top);

			leftAcc += ctx.measureText(textWithLabel).width + 10;
		}

		if (drawPoints) {
			const yPixel = chart.scales[yAxisID].getPixelForValue(datapoint.y);

			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(xPixel, yPixel, 5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}

	ctx.restore();
}

const defaultOptions: CrosshairPluginConfig = {
	labels: [],
	crosshairEnableDelay: 500
};

const CrosshairPlugin = {
	id: 'crosshair',
	beforeInit(chart: Chart) {
		// Register listening for pointerdown and pointerup events
		chart.options.events = chart.options.events || [];

		// if (!chart.options.events.includes('pointerdown')) {
		// 	chart.options.events.push('pointerdown');
		// }

		// if (!chart.options.events.includes('pointerup')) {
		// 	chart.options.events.push('pointerup');
		// }
	},
	afterInit: (chart: Chart_) => {
		const userOpts = (chart.options.plugins as any)['crosshair'] as CrosshairPluginConfig;
		const opts = Object.assign({}, defaultOptions, userOpts);

		chart._crosshairCache = {
			crosshairEnabled: false,
			datasetCache: [],
			opts,
			coords: null,
			lastToucheventCoords: {
				x: 0,
				y: 0
			},
			totalLastTouchSeqDelta: {
				x: 0,
				y: 0
			}

			// It is safer to have the original pan enabled
			// panEnableBeforeTouchSeq: true
		};

		chart.canvas.addEventListener('touchmove', (e) => {
			const deltaX = e.touches[0].clientX - chart._crosshairCache.lastToucheventCoords.x;
			const deltaY = e.touches[0].clientY - chart._crosshairCache.lastToucheventCoords.y;

			chart._crosshairCache.totalLastTouchSeqDelta.x += deltaX;
			chart._crosshairCache.totalLastTouchSeqDelta.y += deltaY;

			chart._crosshairCache.lastToucheventCoords = {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY
			};

			chart._crosshairCache.coords = {
				x: chart._crosshairCache.coords!.x + deltaX,
				y: chart._crosshairCache.coords!.y + deltaY
			};

			chart.render();
		});

		chart.canvas.addEventListener('touchstart', (e) => {
			const crossEnabled = chart._crosshairCache.crosshairEnabled;

			// Remember crosshair coords
			if (!crossEnabled) {
				const touch = e.changedTouches[0];
				const rect = chart.canvas.getBoundingClientRect();

				const touchX = touch.clientX - rect.left;
				const touchY = touch.clientY - rect.top;

				chart._crosshairCache.coords = {
					x: touchX,
					y: touchY
				};
			}

			chart._crosshairCache.lastToucheventCoords = {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY
			};

			chart._crosshairCache.totalLastTouchSeqDelta = {
				x: 0,
				y: 0
			};

			if (crossEnabled) {
				chart._crosshairCache.crosshairEnabledInLastTouchSeq = false;
			}

			const timeout = setTimeout(() => {
				// If the finger has moved too much, it means
				// the user wanted to pan or zoom, don't do
				// anything in that case
				const totalDelta =
					Math.abs(chart._crosshairCache.totalLastTouchSeqDelta.x) +
					Math.abs(chart._crosshairCache.totalLastTouchSeqDelta.y);

				if (totalDelta > 10) {
					return;
				}

				chart._crosshairCache.crosshairEnabled = true;
				chart._crosshairCache.crosshairEnabledInLastTouchSeq = true;

				// In crosshair mode, disable panning
				// @ts-ignore
				chart.options.plugins.zoom.pan.enabled = false;

				chart.render();
			}, chart._crosshairCache.opts.crosshairEnableDelay);

			// If the user lifts the finger before the mode is enabled, clear the timeout
			chart.canvas.addEventListener(
				'touchend',
				() => {
					clearTimeout(timeout);
				},
				{ once: true }
			);
		});

		chart.canvas.addEventListener('touchend', (e) => {
			if (
				!chart._crosshairCache.crosshairEnabledInLastTouchSeq &&
				chart._crosshairCache.totalLastTouchSeqDelta.x === 0 &&
				chart._crosshairCache.totalLastTouchSeqDelta.y === 0
			) {
				chart._crosshairCache.crosshairEnabled = false;

				// @ts-ignore
				console.log('enabling pan');
				chart.options.plugins.zoom.pan.enabled = true;
				chart.pan(0);

				chart.render();
			}
		});
	},
	afterEvent: (chart: Chart_, args: { event: ChartEvent }) => {
		const { event } = args;
		const { canvas, ctx } = chart;

		const crosshairEnabled = chart._crosshairCache.crosshairEnabled;

		if (event.type === 'mousemove') {
			// if (!crosshairEnabled) return;
			// chart._crosshairCache.coords = {
			// 	x: event.x || 0,
			// 	y: event.y || 0
			// };
		} else if (event.type === 'mouseout') {
			chart._crosshairCache.coords = null;
		}
	},
	afterDraw: (chart: Chart_) => {
		const { ctx } = chart;
		const coords = chart._crosshairCache.coords;

		if (!coords || !chart._crosshairCache.crosshairEnabled) return;

		const { x, y } = coords;

		// Get nearest value from x axis
		const xDataset = chart.data.datasets[0];
		const xScale = chart.scales[(xDataset as any).xAxisID as string];

		const xVal = xScale.getValueForPixel(x) as number;

		const largerXData = xDataset.data.find((i: any) => i.x > xVal) as any;
		const smallerXData = xDataset.data.findLast((i: any) => i.x < xVal) as any;

		let nearestXVal = null;

		if (largerXData && smallerXData) {
			nearestXVal =
				Math.abs(largerXData.x - x) < Math.abs(smallerXData.x - x) ? largerXData.x : smallerXData.x;
		}

		const nearestXPixel = xScale.getPixelForValue(nearestXVal);

		const chartArea = chart.chartArea;

		ctx.save();
		ctx.lineWidth = 1;
		ctx.setLineDash([5, 5]); // Dashed line
		ctx.strokeStyle = 'white';

		// Draw vertical line
		ctx.beginPath();
		ctx.moveTo(nearestXPixel, chartArea.top);
		ctx.lineTo(nearestXPixel, chartArea.bottom);
		ctx.stroke();

		// Draw horizontal line
		ctx.beginPath();
		ctx.moveTo(chartArea.left, y);
		ctx.lineTo(chartArea.right, y);
		ctx.stroke();

		ctx.restore();

		const options = chart._crosshairCache.opts;

		for (const labelOpts of options.labels) {
			const { scaleId } = labelOpts;
			const scale = chart.scales[scaleId];

			if (scale.axis === 'x') {
				renderXCrosshairLabel(chart, nearestXPixel, labelOpts);
			} else {
				renderYCrosshairLabel(chart, y, labelOpts);
			}
		}

		const yScales = options.labels.filter((i) => chart.scales[i.scaleId].axis === 'y');

		drawIntersections(chart, { xVal: nearestXVal, xPixel: nearestXPixel, labelOptions: yScales });
	}
};

Chart.register(CrosshairPlugin);
