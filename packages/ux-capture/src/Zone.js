import ExpectedMark from './ExpectedMark';
import { INTERACTIVE_TRANSITION_START_MARK_NAME } from './UXCapture';

/**
 * A `Zone` is a collection of DOM elements on a page that correspond
 * to a given phase of page load. (e.g. all elements in `ux-destination-verfied`)
 *
 * Example props:
 *
 * // New, selector configuration syntax:
 * {
 *   name: "ux-destination-verified",
 *   elements: [
 *     {
 *       label: "Global nav with the logo",
 *       selector: `#logo`,
 *       marks: [
 *         'ux-image-logo-inline',
 *         'ux-image-logo-onload'
 *       ]
 *     }
 *   ],
 *   onMeasure: measureName => {},
 *   onMark: markName => {}
 * }
 *
 * // Legacy (just mark strings)
 * {
 *   name: "ux-destination-verified",
 *   marks: ["ux-image-inline-logo", "ux-image-onload-logo"]
 *   onMeasure: measureName => {},
 *   onMark: markName => {}
 * }
 */
function Zone(props) {
	this.props = props;
	// Name used for UserTiming measures
	this.measureName = this.props.name;

	const configuredMarkNames = this.props.elements
		? // new elements array on zone object
		this.props.elements.map(element => element.marks).flat()
		: // legacy with direct marks array on zone object
		this.props.marks;

	// mark names for elements already on the page after interactive transition
	let elementsAlreadyOnThePage = [];

	if (this.props.startMarkName === INTERACTIVE_TRANSITION_START_MARK_NAME &&
		this.props.elements
	) {
		elementsAlreadyOnThePage = this.props.elements.filter(element => {
			const nodes = this.selectDOMNodes(element);

			// if array or element list is returned, check if it has one or more entries
			return (nodes && (typeof nodes.length === 'undefined' || nodes.length > 0));
		});
	}

	const existingMarkNames = new Set(elementsAlreadyOnThePage.map(element => element.marks).flat());

	// do not create marks for elements that are already on the page
	const markNamesToExpect = configuredMarkNames.filter(
		configuredMarkName => !existingMarkNames.has(configuredMarkName)
	);

	// Create a new `ExpectedMark` for each mark
	this.marks = markNamesToExpect.map(markName => {
		// 'state' of the measure that indicates whether it has been recorded
		this.measured = false;

		const markListener = completeMark => {
			// pass the event upstream
			this.props.onMark(markName);
		};

		const mark = ExpectedMark.create(
			markName,
			markListener,
			this.props.recordTimestamps
		);

		const measureListener = completeMark => {
			if (this.marks.every(({ mark }) => mark.marked)) {
				this.measure(markName);
			}
		};

		return { mark, measureListener };
	});
	this.marks.forEach(({ mark, measureListener }) => {
		mark.addOnMarkListener(measureListener);
	});

	// if expected some marks, but all are already on the page,
	// create zero-length measure
	if (configuredMarkNames.length > 0 && markNamesToExpect.length === 0) {
		this.measure(this.props.startMarkName);
	}
}

/**
 * Returns DOM nodes collection / array or individual DOM Node based on selector configuration
 *
 * @param {Object} element - individual element configuration object
 * @returns {Node|Node[]|null}
 */
Zone.prototype.selectDOMNodes = function (element) {
	// if elements have selectors defined or global element selector is configured,
	// use them to find marks to record
	if (element.selector) {
		if (typeof element.selector === 'function') {
			return element.selector();
		} else {
			// if not a function, treat it as CSS selector argument
			return document.querySelectorAll(element.selector);
		}
	} else if (this.props.selector) {
		return this.props.selector(element);
	} else {
		return null;
	}
};

/**
 * Records measure on Performance Timeline and calls onMeasure callback
 *
 * @param {ExpectedMark} lastMark last mark that triggered completion
 */
Zone.prototype.measure = function (triggerName) {
	if (this.measured) {
		// only need to respond to first call of zone.measure - subsequent calls allowed but ignored
		return;
	}

	const { name, startMarkName, onMeasure } = this.props;
	if (
		typeof window.performance !== 'undefined' &&
		typeof window.performance.measure !== 'undefined'
	) {
		// check if 'end mark' was recorded before start mark - if so, end should
		// be same as start (measured time is 0)
		const triggerMark = window.performance
			.getEntriesByName(triggerName, 'mark')
			.pop();
		const startMark = window.performance
			.getEntriesByName(startMarkName, 'mark')
			.pop();

		// "navigationStart" string is not a UserTiming mark, but a record in NavTiming API
		// It is not found with getEntries*() calls, but has special treatment and works as an argument in
		// window.performance.measure() call
		const endMarkName =
			startMark && triggerMark.startTime < startMark.startTime
				? startMarkName
				: triggerName;

		// do not to attempt recording measure without a valid start point
		if (startMarkName === 'navigationStart' || startMark) {
			window.performance.measure(name, startMarkName, endMarkName);
		}
	}

	this.measured = true;
	onMeasure(name);
};

Zone.prototype.destroy = function () {
	if (
		typeof window.performance !== 'undefined' &&
		typeof window.performance.measure !== 'undefined'
	) {
		window.performance.clearMeasures(this.props.name);
	}
	// don't destroy the ExpectedMarks, because they may outlive a View/Zone, just remove reference
	this.marks.forEach(({ mark, measureListener }) =>
		mark.removeOnMarkListener(measureListener)
	);
	this.marks = null;
};

export default Zone;
