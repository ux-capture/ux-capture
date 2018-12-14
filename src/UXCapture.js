import ExpectedMark from './ExpectedMark';
import View from './View';

const NOOP = () => {};
/**
 * In page view mode, use special type of mark that is going to be looked up in
 * performance.navigation.timing.navigationStart instead of PerformanceTimeline
 *
 * See: https://github.com/w3c/user-timing/issues/22
 */
const NAVIGATION_START_MARK_NAME = 'navigationStart';
/**
 * Used to mark start of interactive view
 */
const INTERACTIVE_TRANSITION_START_MARK_NAME = 'transitionStart';

export const VIEW_OVERRIDE_ERROR_MESSAGE =
	'[UX Capture] Application should call UXCapture.startTransition() before starting new view';

let _onMark;
let _onMeasure;
let _view;
let _startMarkName = NAVIGATION_START_MARK_NAME;

const UXCapture = {
	_clearMarksAndMeasures: () => {
		if (
			typeof window.performance !== 'undefined' &&
			typeof window.performance.clearMarks !== 'undefined' &&
			typeof window.performance.clearMeasures !== 'undefined'
		) {
			window.performance.clearMarks();
			window.performance.clearMeasures();
		}

		ExpectedMark.clearExpectedMarksMap();
	},

	/**
	 * Sets `onMark` and `onMeasure` callbacks on UXCapture singleton
	 * and sets start mark name for page view mode
	 *
	 * @param {object} config
	 */
	create: config => {
		_onMark = config.onMark || NOOP;
		_onMeasure = config.onMeasure || NOOP;
		_startMarkName = NAVIGATION_START_MARK_NAME;
	},

	/**
	 * Creates a new View instance.
	 *
	 * @param {object} zoneConfigs
	 */
	startView: zoneConfigs => {
		if (_view) {
			throw new Error(VIEW_OVERRIDE_ERROR_MESSAGE);
		}

		_view = new View({
			onMark: _onMark,
			onMeasure: _onMeasure,
			startMarkName: _startMarkName,
			zoneConfigs,
		});
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

		if (
			typeof window.performance !== 'undefined' &&
			typeof window.performance.mark !== 'undefined'
		) {
			window.performance.mark(INTERACTIVE_TRANSITION_START_MARK_NAME);
		}
		_startMarkName = INTERACTIVE_TRANSITION_START_MARK_NAME;

		// reset the view until it's defined again using startView();
		_view = undefined;
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
		ExpectedMark.record(name, waitForNextPaint);
	},
};

export default UXCapture;
