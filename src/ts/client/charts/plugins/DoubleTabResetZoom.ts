import { Chart } from 'chart.js';

const doubleTapResetZoomPlugin = {
	id: 'doubleTapResetZoom',
	beforeInit(chart: Chart) {
		let lastTap = 0;

		const canvas = chart.canvas;

		canvas.addEventListener('touchstart', (event) => {
			if (event.touches.length > 1) {
				return;
			}

			const currentTime = new Date().getTime();
			const tapInterval = currentTime - lastTap;

			if (tapInterval < 200 && tapInterval > 0) {
				const originalAnimations = chart.options.animations;

				chart.options.animations = {
					duration: 100,
					easing: 'easeOutQuad'
				};

				if (chart.resetZoom) {
					chart.resetZoom();
				}

				// Restore the original animation settings after the reset
				setTimeout(() => {
					chart.options.animations = originalAnimations;
				}, 0);
			}

			lastTap = currentTime;
		});
	}
};

Chart.register(doubleTapResetZoomPlugin);
