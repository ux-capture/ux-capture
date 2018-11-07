import ExpectedMark from './ExpectedMark';
import View from './View';

const NOOP = () => {};

let _onMark;
let _onMeasure;
let _view;

const UXCapture = {
	/**
	 * Sets `onMark` and `onMeasure` callbacks on UXCapture singleton
	 *
	 * @param {object} config
	 */
	create: (config) => {
		_onMark = config.onMark || NOOP;
		_onMeasure = config.onMeasure || NOOP;
	},

	/**
	 * Creates a new View instance.
	 *
	 * @param {object} zoneConfigs
	 */
	startView: (zoneConfigs) => {
		_view = new View({
			onMark: _onMark,
			onMeasure: _onMeasure,
			zoneConfigs,
		});
	},

	/**
	 * Updates current view instance with new zones & marks
	 *
	 * @param {object} zoneConfigs
	 */
	updateView: (zoneConfigs) => {
		if (!_view) {
			window.console.error(
				'[Error] No view to update. Call UXCapture.startView() before UXCapture.updateView()'
			);
			return;
		}

		_view.update(zoneConfigs);
	},

	// TODO: SPA support in subsequent ticket
	startTransition: () => {},

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
	mark: (name, waitForNextPaint = true) => {
		const mark = ExpectedMark.get(name);

		if (mark) {
			if (waitForNextPaint) {
				mark.waitForNextPaintAndRecord();
			} else {
				mark.record();
			}
		}
	}
};

export default UXCapture;
