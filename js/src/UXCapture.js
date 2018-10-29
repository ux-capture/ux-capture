import ExpectedMark from './ExpectedMark';
import View from './View';

const NOOP = () => {};

class UXCapture {
	/**
	 * Creates a UXCapture instance
	 *
	 * @constructor
	 */
	constructor() {
		// TODO: Why do we have this? Can we remove?
		// window.UX = this;

		// Store reference to instance so that we never create more than one
		if (!UXCapture._instance) {
			UXCapture._onMark = NOOP;
			UXCapture._onMeasure = NOOP;
			UXCapture._view = null;
			UXCapture._instance = this;
		}

		return UXCapture._instance;
	}

	/**
	 * Sets `onMark` and `onMeasure` callbacks on UXCapture singleton
	 *
	 * @param {object} config
	 */
	create(config) {
		const { onMark = NOOP, onMeasure = NOOP } = config;

		UXCapture._onMark = onMark;
		UXCapture._onMeasure = onMeasure;
	}

	/**
	 * Creates a new View instance.
	 *
	 * @param {object} zoneConfigs
	 */
	startView(zoneConfigs) {
		UXCapture._view = new View({
			onMark: UXCapture._onMark,
			onMeasure: UXCapture._onMeasure,
			zoneConfigs,
		});
	}

	/**
	 * Updates current view instance with new zones & marks
	 *
	 * @param {object} zoneConfigs
	 */
	updateView(zoneConfigs) {
		if (!UXCapture._view) {
			window.console.error(
				'[Error] No view to update. Call UXCapture.startView() before UXCapture.updateView()'
			);
			return;
		}

		UXCapture._view.update(zoneConfigs);
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

// UXCapture is a singleton
// Freeze object so it's immutable
const uxCaptureInstance = new UXCapture();
Object.freeze(uxCaptureInstance);

export default uxCaptureInstance;
