import { ScatterController } from 'chart.js';

export class LiqMapController extends ScatterController {
	draw() {
		// Call bubble controller method to draw all the points
		super.draw(arguments);

		// Now we can do some custom drawing for this dataset. Here we'll draw a red box around the first point in each dataset
		const meta = this.getMeta();
		const pt0 = meta.data[0];

		const { x, y } = pt0.getProps(['x', 'y']);
		const { radius } = pt0.options;

		const ctx = this.chart.ctx;
		ctx.save();
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 1;
		ctx.strokeRect(x - radius, y - radius, 2 * radius, 2 * radius);
		ctx.restore();
	}
}
LiqMapController.id = 'liqMap';
LiqMapController.defaults = ScatterController.defaults;
