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
	this._mark = this._mark.bind(this);
}

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

ExpectedMark.record = function(name, waitForNextPaint = true) {
	const mark = ExpectedMark.create(name);
	if (waitForNextPaint) {
		// in many cases, we intend to record a mark when an element paints, not
		// at the moment the mark.record() call is made in in JS
		// see https://nolanlawson.com/2018/09/25/accurately-measuring-layout-on-the-web/
		window.requestAnimationFrame(() => setTimeout(mark._mark));
		return;
	}
	mark._mark();
};

ExpectedMark.destroy = function(name) {
	if (typeof window.performance !== 'undefined') {
		window.performance.clearMarks(name);
	}
	if (name) {
		delete _expectedMarks[name];
		return;
	}
	_expectedMarks = {};
};

ExpectedMark.prototype._mark = function() {
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
	 * These timestamps are counted from timeline recording start
	 * while UserTiming marks are counted from navigationStart event.
	 * In perf visualizations, they all will be offset by the same amount of time
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

// registers mark callback
ExpectedMark.prototype.addOnMarkListener = function(listener) {
	if (this.marked) {
		// call immediately if already marked - still need to keep track in `onMarkListeners`
		// for correct cleanup in `removeOnMarkListener`
		listener(this);
	}
	this.onMarkListeners.push(listener);
};

// unregisters mark callback
ExpectedMark.prototype.removeOnMarkListener = function(listenerToRemove) {
	this.onMarkListeners = this.onMarkListeners.filter(
		listener => listener !== listenerToRemove
	);
};

export default ExpectedMark;
