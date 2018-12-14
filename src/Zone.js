import ExpectedMark from './ExpectedMark';
import UXBase from './UXBase';

import { INTERACTIVE_TRANSITION_START_MARK_NAME } from './UXCapture';

/**
 * A `Zone` is a collection of DOM elements on a page that correspond
 * to a given phase of page load. (e.g. all elements in `ux-destination-verfied`)
 *
 * Example props:
 *
 * {
 *  name: "ux-destination-verified",
 *  marks: ["ux-image-online-logo", "ux-image-inline-logo"]
 *  onMeasure: measureName => {},
 *  onMark: markName => {}
 * }
 */
export default class Zone extends UXBase {
	// Name used for UserTiming measures
	measureName = this.props.name;

	constructor(props) {
		super(props);

		// Create a new `ExpectedMark` for each mark
		const configuredMarkNames = this.props.elements
			? // new elements array on zone object
			  this.props.elements.map(element => element.marks).flat()
			: // legacy with direct marks array on zone object
			  this.props.marks;

		// mark names for elements already on the page
		let alreadyOnThePage = [];

		if (this.props.startMarkName === INTERACTIVE_TRANSITION_START_MARK_NAME) {
			// if mark selector is configured, use it to find marks to record
			if (props.markSelector) {
				alreadyOnThePage.concat(
					configuredMarkNames.filter(
						markName => props.markSelector(markName).length > 0
					)
				);
			}

			// if elements have selectors defined or global element selector is configured,
			// use them to find marks to record
			props.elements.forEach(element => {
				let elementFound = false;

				if (element.elementSelector) {
					if (typeof element.elementSelector === 'function') {
						elementFound = element.elementSelector().length > 0;
					} else {
						elementFound =
							document.querySelectorAll(element.elementSelector).length > 0;
					}
				} else if (this.props.elementSelector) {
					elementFound = this.props.elementSelector(element).length > 0;
				}

				if (elementFound) {
					alreadyOnThePage = alreadyOnThePage.concat(element.marks);
				}
			});
		}

		// do not create marks for elements that are already on the page
		const markNamesToExpect = configuredMarkNames.filter(
			markName =>
				!alreadyOnThePage.find(existingMarkName => existingMarkName === markName)
		);

		this.marks = markNamesToExpect.map(markName => {
			const mark = ExpectedMark.create(markName);

			mark.onComplete(completeMark => {
				// pass the event upstream
				this.props.onMark(markName);
				if (this.marks.every(m => m.marked)) {
					this.measure(markName);
				}
			});

			return mark;
		});

		// if expected some marks, but all are already on the page,
		// create zero-length measure
		if (configuredMarkNames.length > 0 && markNamesToExpect.length === 0) {
			this.measure(this.props.startMarkName);
		}
	}

	/**
	 * Records measure on Performance Timeline and calls onMeasure callback
	 *
	 * @param {ExpectedMark} lastMark last mark that triggered completion
	 */
	measure(endMarkName) {
		if (
			typeof window.performance !== 'undefined' &&
			typeof window.performance.measure !== 'undefined'
		) {
			window.performance.measure(
				this.measureName,
				this.props.startMarkName,
				endMarkName
			);
		}

		this.props.onMeasure(this.measureName);
	}
}
