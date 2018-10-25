import ExpectedMark from './ExpectedMark';
import View from './View';

const NOOP = () => {};

export default class UXCapture {
	onMark = NOOP;
	onMeasure = NOOP;

	/**
	 * Creates a UXCapture instance
	 * @constructor
	 */
	constructor() {
		window.UX = this;
	}

	/**
	 * Creates a new View instance and supplies expected marks and
	 * corresponding zones to the View.
	 *
	 * TODO: re-evaluate if we should allow multiple executions of this method
	 *
	 * @param {object} zoneConfigs
	 */
	expect(zoneConfigs) {
		// View object for initial page view
		new View({
			// `onMark` and `onMeasure` call `this.onMark` and `this.onMeasure`
			// to handle cases where `UX.config()` comes after `UX.expect()`
			onMark: mark => {
				// console.log(this.onMark);
				this.onMark(mark);
			},
			onMeasure: measure => {
				// console.log(this.onMeasure);
				this.onMeasure(measure);
			},
			zoneConfigs,
		});
	}

	/**
	 * Creates marks on UserTiming timeline. Also creates UserTiming
	 * measures for each zone when last mark is recorded.
	 *
	 * `waitForNextPaint` should be set to false if your code is not
	 * expected to change any visual elements and trigger repaints.
	 *
	 * Example: click event handlers on elements are necessary
	 * for them to be interactive but don't affect the element's appearance.
	 *
	 * @param {string} name
	 * @param {boolean} waitForNextPaint
	 */
	mark(name, waitForNextPaint = true) {
		const mark = ExpectedMark.get(name);

		if (mark) {
			if (waitForNextPaint) {
				mark.waitForNextPaintAndRecord();
			} else {
				mark.record();
			}
		}
	}

	/**
	 * Assigns user-specified `onMark` and `onMeasure` callbacks
	 * to UXCapture instance.
	 *
	 * @param {object} configuration
	 */
	config(configuration) {
		const { onMark = NOOP, onMeasure = NOOP } = configuration;
		Object.assign(this, { onMark, onMeasure });
	}
}
