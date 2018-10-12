import UXCapture from "./UXCapture";

// all marks expected so far
const _expectedMarks = [];

/**
 * Class describes expected marks
 * These marks that have to be recorded before zone is considered complete
 */
export default class ExpectedMark {
  static get(name) {
    return _expectedMarks.find(mark => mark.name === name);
  }

  /**
   * Checks if mark already exists in the list of expected marks
   * Otherwise, creates a new one and adds it to the list
   *
   * @param {string} name
   */
  static create(name) {
    let mark = ExpectedMark.get(name);

    if (!mark) {
      mark = new ExpectedMark(name);
      _expectedMarks.push(mark);
    }

    return mark;
  }

  constructor(name) {
    this.name = name;

    // list of zone callbacks to call on completion
    this.onMarkListeners = [];
  }

  // registers zone callback
  onComplete(onMark) {
    this.onMarkListeners.push(onMark);
  }

  /**
   * This method tries to approximate full rendering lifecycle in the browser
   * rather than just measuring JS execution like render() method does.
   *
   * See Nolan Lawson's article describing the issue and proposing this method:
   * https://nolanlawson.com/2018/09/25/accurately-measuring-layout-on-the-web/
   */
  waitForNextPaintAndRecord() {
    if (
      typeof window.console !== "undefined" &&
      typeof window.console.timeStamp !== "undefined"
    ) {
      window.console.timeStamp("original call for " + this.name);
    }

    window.requestAnimationFrame(() => setTimeout(() => this.record()));
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
    this.onMarkListeners.forEach(onCompleteListener =>
      onCompleteListener(this)
    );
  }
}
