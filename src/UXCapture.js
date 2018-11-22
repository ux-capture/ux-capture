import ExpectedMark from './ExpectedMark';
import PageView from './PageView';
import InteractiveView from './InteractiveView';

const NOOP = () => {};

let _onMark;
let _onMeasure;
let _view;

const UXCapture = {
	_clearMarksAndMeasures: () => {
		window.performance.clearMarks();
		window.performance.clearMeasures();
	},

	/**
	 * Sets `onMark` and `onMeasure` callbacks on UXCapture singleton
	 * Also resets the view (supposed to be called once per page anyway)
	 *
	 * @param {object} config
	 */
	create: config => {
		_onMark = config.onMark || NOOP;
		_onMeasure = config.onMeasure || NOOP;
		_view = null;
	},

	/**
	 * Creates a new View instance.
	 *
	 * @param {object} zoneConfigs
	 */
	startView: zoneConfigs => {
		const viewProps = {
			onMark: _onMark,
			onMeasure: _onMeasure,
			zoneConfigs,
		};

		// if we never had views before, it means we are in page view mode
		if (_view) {
			_view = new InteractiveView(viewProps);
		} else {
			_view = new PageView(viewProps);
		}
	},

	/**
	 * Updates current view instance with new zones & marks
	 *
	 * @param {object} zoneConfigs
	 */
	updateView: zoneConfigs => {
		if (!_view) {
			window.console.error(
				'[Error] No view to update. Call UXCapture.startView() before UXCapture.updateView()'
			);
			return;
		}

		_view.update(zoneConfigs);
	},

	startTransition: () => {
		UXCapture._clearMarksAndMeasures();

		_view.startTransition();
	},

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
	},
};

export default UXCapture;
