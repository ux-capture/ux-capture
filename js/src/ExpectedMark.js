import UXCapture from "./UXCapture";

// all marks expected so far
const expectedMarks = [];

/**
 * Class describes expected marks
 * These marks that have to be recorded before zone is considered complete
 */
export default class ExpectedMark {
  static get(name) {
    const mark = expectedMarks.find(mark => mark.name === name);

    return mark;
  }

  constructor(name, callback) {
    this.name = name;

    // list of zone callbacks to call on completion
    this.onCompleteListeners = [];

    if (!ExpectedMark.get(this.name)) {
      expectedMarks.push(this);
    }
  }

  // registers zone callback
  onComplete(callback) {
    this.onCompleteListeners.push(callback);
  }

  record() {
    if (
      typeof window.performance !== "undefined" &&
      typeof window.performance.measure !== "undefined"
    ) {
      // record the mark using W3C User Timing API
      window.performance.mark(this.name);
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
      typeof window.console !== "undefined" &&
      typeof window.console.timeStamp !== "undefined"
    ) {
      window.console.timeStamp(this.name);
    }

    // call all registered zone callbacks
    this.onCompleteListeners.forEach(onCompleteListener =>
      onCompleteListener(this)
    );
  }
}
