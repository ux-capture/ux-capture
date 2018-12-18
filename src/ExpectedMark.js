// private map of { name: mark } for all expected marks
let _expectedMarks = {};

/**
 * Class describes expected marks
 * These marks that have to be recorded before zone is considered complete
 */
function ExpectedMark(props) {
	this.props = props;
	// list of zone callbacks to call on completion
	this.onMarkListeners = [];
	// 'state' of the mark that indicates whether it has been recorded
	this.marked = false;
	this.record = this.record.bind(this);
}

ExpectedMark.get = function(name) {
	return _expectedMarks[name];
};
/**
 * Checks if mark already exists in the list of expected marks
 * Otherwise, creates a new one and adds it to the list
 *
 * @param {string} name
 */
ExpectedMark.create = function(name) {
	// create new mark only if one does not exist
	if (!_expectedMarks[name]) {
		_expectedMarks[name] = new ExpectedMark({ name });
	}
	return _expectedMarks[name];
};

ExpectedMark.clearExpectedMarksMap = function() {
	_expectedMarks = {};
};

// registers zone callback
ExpectedMark.prototype.onComplete = function(onMark) {
	this.onMarkListeners.push(onMark);
};

/**
 * This method tries to approximate full rendering lifecycle in the browser
 * rather than just measuring JS execution like render() method does.
 *
 * See Nolan Lawson's article describing the issue and proposing this method:
 * https://nolanlawson.com/2018/09/25/accurately-measuring-layout-on-the-web/
 */
ExpectedMark.prototype.waitForNextPaintAndRecord = function() {
	// In development mode, include DEBUG timestamps to show when
	// original calls were fired to see the impact
	if (
		process.env.NODE_ENV !== 'production' &&
		typeof window.console !== 'undefined' &&
		typeof window.console.timeStamp !== 'undefined'
	) {
		window.console.timeStamp(`[DEBUG] original call for ${this.props.name}`);
	}

	window.requestAnimationFrame(() => setTimeout(this.record));
};

ExpectedMark.prototype.record = function() {
	if (
		typeof window.performance !== 'undefined' &&
		typeof window.performance.mark !== 'undefined'
	) {
		// record the mark using W3C User Timing API
		window.performance.mark(this.props.name);
	}

	/**
	 * Report same mark on Chrome/Firefox timeline
	 *
	 * keep in mind, these timestamps are counted from timeline recording start
	 * while UserTiming marks are counted from navigationStart event
	 * however visually, they all will be offset by the same amount of time and align vertically on the charts
	 *
	 * (we'd provide a helper to highlight discrepancy, but unfortunately,
	 * there is no way to know when in timeline did navigationStart event occured)
	 */
	if (
		typeof window.console !== 'undefined' &&
		typeof window.console.timeStamp !== 'undefined'
	) {
		window.console.timeStamp(this.props.name);
	}
	this.marked = true;

	// call all registered zone callbacks
	this.onMarkListeners.forEach(listener => listener(this));
};

export default ExpectedMark;
