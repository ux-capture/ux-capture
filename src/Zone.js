import ExpectedMark from './ExpectedMark';
import UXBase from './UXBase';

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
	marks = this.props.marks.map(markName => {
		const mark = ExpectedMark.create(markName);

		const listener = completeMark => {
			// pass the event upstream
			this.props.onMark(markName);
			if (this.marks.every(({ marked }) => mark.marked)) {
				this.measure(markName);
			}
		};
		mark.addOnMarkListener(listener);

		return { mark, listener };
	});

	// 'state' of the measure that indicates whether it has been recorded
	measured = false;

	/**
	 * Records measure on Performance Timeline and calls onMeasure callback
	 *
	 * @param {ExpectedMark} lastMark last mark that triggered completion
	 */
	measure(endMarkName) {
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
			const endMark = window.performance.getEntriesByName(endMarkName, 'mark');
			const startMark = window.performance.getEntriesByName(startMarkName, 'mark');
			if (endMark.startTime < startMark.startTime) {
				endMarkName = startMarkName;
			}
			window.performance.measure(name, startMarkName, endMarkName);
		}

		this.measured = true;
		onMeasure(name);
	}
	destroy() {
		if (
			typeof window.performance !== 'undefined' &&
			typeof window.performance.measure !== 'undefined'
		) {
			window.performance.clearMeasures(this.props.name);
		}
		// don't destroy the ExpectedMarks, because they may outlive a View/Zone, just remove reference
		this.marks.forEach(({ mark, listener }) => mark.removeOnMarkListener(listener));
		this.marks = null;
	}
}
