import ExpectedMark from './ExpectedMark';

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
export default class Zone {
	constructor(props) {
		this.props = props;
		// Name used for UserTiming measures
		this.measureName = this.props.name;

		// Create a new `ExpectedMark` for each mark
		this.marks = this.props.marks.map(markName => {
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
