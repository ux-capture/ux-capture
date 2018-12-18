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
function Zone(props) {
	this.props = props;
	// Name used for UserTiming measures
	this.measureName = this.props.name;

	// Create a new `ExpectedMark` for each mark
	this.marks = this.props.marks.map(markName => {
		// 'state' of the measure that indicates whether it has been recorded
		this.measured = false;
		const mark = ExpectedMark.create(markName);

		const listener = completeMark => {
			// pass the event upstream
			this.props.onMark(markName);
			if (this.marks.every(({ mark }) => mark.marked)) {
				this.measure(markName);
			}
		};
		mark.addOnMarkListener(listener);

		return { mark, listener };
	});
}

/**
 * Records measure on Performance Timeline and calls onMeasure callback
 *
 * @param {ExpectedMark} lastMark last mark that triggered completion
 */
Zone.prototype.measure = function(triggerName) {
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
		const triggerMark = window.performance.getEntriesByName(triggerName, 'mark');
		const startMark = window.performance.getEntriesByName(startMarkName, 'mark');
		const endMarkName =
			triggerMark.startTime < startMark.startTime ? startMark : triggerName;
		window.performance.measure(name, startMarkName, endMarkName);
	}

	this.measured = true;
	onMeasure(name);
};

Zone.prototype.destroy = function() {
	if (
		typeof window.performance !== 'undefined' &&
		typeof window.performance.measure !== 'undefined'
	) {
		window.performance.clearMeasures(this.props.name);
	}
	// don't destroy the ExpectedMarks, because they may outlive a View/Zone, just remove reference
	this.marks.forEach(({ mark, listener }) => mark.removeOnMarkListener(listener));
	this.marks = null;
};

export default Zone;
