import ExpectedMark from './ExpectedMark';
import { UXCaptureCommonProps, ZoneConfig } from './UXCaptureTypes';
import View from './View';

const NOOP = () => {};
/**
 * In page view mode, use special type of mark that is going to be looked up in
 * performance.navigation.timing.navigationStart instead of PerformanceTimeline
 *
 * See: https://github.com/w3c/user-timing/issues/22
 */
export const NAVIGATION_START_MARK_NAME = 'navigationStart';
/**
 * Used to mark start of interactive view
 */
export const INTERACTIVE_TRANSITION_START_MARK_NAME = 'transitionStart';

export const VIEW_OVERRIDE_ERROR_MESSAGE =
	'[UX Capture] Application should call UXCapture.startTransition() before starting new view';

let _onMark = NOOP;
let _onMeasure = NOOP;
let _view;
let _startMarkName = NAVIGATION_START_MARK_NAME;
let _recordTimestamps = false;

const UXCapture = {
	/**
	 * Client interface to imperatively clear marks that have been previously
	 * created. This should be used when the client determines that a mark is
	 * no longer needed. For marks associated with DOM elements, this should be called
	 * when the element is removed from the DOM or otherwise invalidated.
	 *
	 * @param {String} optional name for individual mark to clear
	 *                 (follows window.performance.clearMarks interface)
	 */
	clearMarks: (name?: string) => {
		ExpectedMark.destroy(name);
	},

	/**
	 * Sets `onMark` and `onMeasure` callbacks on UXCapture singleton
	 * and sets start mark name for page view mode
	 *
	 * @param {object} config
	 */
	create: (config: UXCaptureCommonProps) => {
		_onMark = config.onMark || NOOP;
		_onMeasure = config.onMeasure || NOOP;
		_startMarkName = NAVIGATION_START_MARK_NAME;
		_recordTimestamps = config.recordTimestamps || false;
	},

	/**
	 * General cleanup function - generally won't be needed, but useful for managing
	 * memory
	 */
	destroy: () => {
		_onMark = undefined;
		_onMeasure = undefined;
		_startMarkName = undefined;
		UXCapture.clearMarks();
		if (_view) {
			_view.destroy;
		}
		_view = undefined;
	},

	/**
	 * Creates a new View instance.
	 *
	 * @param {object} zoneConfigs
	 */
	startView: (zoneConfigs: ZoneConfig[]) => {
		if (_view) {
			window.console.error(VIEW_OVERRIDE_ERROR_MESSAGE);
			return;
		}

		_view = new View({
			onMark: _onMark,
			onMeasure: _onMeasure,
			startMarkName: _startMarkName,
			recordTimestamps: _recordTimestamps,
			zoneConfigs,
		});
	},

	/**
	 * Updates current view instance with new zones & marks
	 *
	 * @param {object} zoneConfigs
	 */
	updateView: (zoneConfigs: ZoneConfig[]) => {
		if (!_view) {
			window.console.error(
				'[Error] No view to update. Call UXCapture.startView() before UXCapture.updateView()'
			);
			return;
		}

		_view.update(zoneConfigs);
	},

	/**
	 * Returns view configuration object or null if there is no current view
	 *
	 * @returns {object}|null
	 */
	getViewConfig: (): ZoneConfig[]|null => { 
		return _view ? _view.getZoneConfigs() : null;
	},

	/*
	 * Start view transition will end/destroy current View and set a new 'start mark'
	 * Existing marks are _not_ removed automatically (they may outlive the view).
	 * If required by the client, existing marks must be removed declaratively with
	 * `UXCapture.clearMarks(name)`
	 */
	startTransition: () => {
		// reset the view until it's defined again using startView();
		if (_view) {
			_view.destroy();
			_view = undefined;
		}
		if (
			typeof window.performance !== 'undefined' &&
			typeof window.performance.mark !== 'undefined'
		) {
			window.performance.mark(INTERACTIVE_TRANSITION_START_MARK_NAME);
		}
		_startMarkName = INTERACTIVE_TRANSITION_START_MARK_NAME;
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
	mark: ExpectedMark.record,
};

export default UXCapture;
