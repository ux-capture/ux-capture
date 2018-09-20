import ExpectedMark from "./ExpectedMark";
import Zone from "./Zone";

let _instance = null;

export default class UXCapture {
  static attachTo(window) {
    // allow running in Node.js environment
    if (typeof window === "undefined") {
      window = {};
    }

    // already have UX Capture object defined, reuse it
    if (typeof window.UX !== "undefined") {
      return window.UX;
    }

    // assign singleton instance to window object
    window.UX = new UXCapture(window);

    _instance = window.UX;

    return window.UX;
  }

  static isUserTimingSupported() {
    return (
      typeof _instance.window.performance !== "undefined" &&
      typeof _instance.window.performance.mark !== "undefined" &&
      typeof _instance.window.performance.measure !== "undefined"
    );
  }

  static isConsoleTimeStampSupported() {
    return (
      typeof _instance.window.console !== "undefined" &&
      typeof _instance.window.console.timeStamp !== "undefined"
    );
  }

  constructor(window) {
    this.window = window;

    this.onMark = null;
    this.onMeasure = null;
  }

  static recordMeasure(zone, lastMark) {
    if (UXCapture.isUserTimingSupported()) {
      // record a measure using W3C User Timing API
      _instance.window.performance.measure(
        zone.getLabel(),
        "navigationStart",
        lastMark.getLabel()
      );
    }

    // if callback is specified, call it with zone label
    if (_instance.onMeasure) {
      _instance.onMeasure(zone.getLabel());
    }
  }

  static recordMark(mark) {
    if (UXCapture.isUserTimingSupported()) {
      // record the mark using W3C User Timing API
      _instance.window.performance.mark(mark.label);
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
    if (UXCapture.isConsoleTimeStampSupported()) {
      _instance.window.console.timeStamp(mark.getLabel());
    }

    // if callback is specified, call it with mark label
    if (_instance.onMark) {
      _instance.onMark(mark.getLabel());
    }
  }

  /**
   * Sets expected marks and corresponding zones for current view
   *
   * @TODO re-evaluate if we should allow multiple executions of this method
   */
  expect(zones) {
    if (typeof zones === "undefined" || !Array.isArray(zones)) {
      return false;
    }

    Zone.setExpectedZones(zones);
  }

  mark(label) {
    const mark = ExpectedMark.get(label);

    if (mark) {
      mark.record();
    }
  }

  config(configuration) {
    if (!configuration || typeof configuration !== "object") {
      return;
    }

    if (typeof configuration.onMark === "function") {
      this.onMark = configuration.onMark;
    } else {
      this.onMark = null;
    }

    if (typeof configuration.onMeasure === "function") {
      this.onMeasure = configuration.onMeasure;
    } else {
      this.onMeasure = null;
    }
  }
}
