import ExpectedMark from './ExpectedMark';
import View from './View';

const NOOP = () => {};

class UXCapture {
	_onMark = NOOP;
	_onMeasure = NOOP;
	_view = null;

	/**
	 * Sets `onMark` and `onMeasure` callbacks on UXCapture singleton
	 *
	 * @param {object} config
	 */
	create(config) {
		const { onMark = NOOP, onMeasure = NOOP } = config;

		this._onMark = onMark;
		this._onMeasure = onMeasure;
	}

	/**
	 * Creates a new View instance.
	 *
	 * @param {object} zoneConfigs
	 */
	startView(zoneConfigs) {
		this._view = new View({
			onMark: this._onMark,
			onMeasure: this._onMeasure,
			zoneConfigs,
		});
	}

	/**
	 * Updates current view instance with new zones & marks
	 *
	 * @param {object} zoneConfigs
	 */
	updateView(zoneConfigs) {
		if (!this._view) {
			window.console.error(
				'[Error] No view to update. Call UXCapture.startView() before UXCapture.updateView()'
			);
			return;
		}

		this._view.update(zoneConfigs);
	}

	// TODO: SPA support in subsequent ticket
	startTransition() {}

	/**
	 * Creates marks on UserTiming timeline.
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
}

export default new UXCapture();
