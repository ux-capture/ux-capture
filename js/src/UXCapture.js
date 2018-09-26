import ExpectedMark from "./ExpectedMark";
import View from "./View";

export default class UXCapture {
  static attachTo(window) {
    // allow running in Node.js environment
    if (typeof window === "undefined") {
      throw new Error("Must provide a valid window object");
    }

    // already have UX Capture object defined, reuse it
    if (typeof window.UX !== "undefined") {
      return window.UX;
    }

    // assign singleton instance to window object
    window.UX = new UXCapture(window);

    return window.UX;
  }

  constructor() {
    this.onMark = null;
    this.onMeasure = null;
  }

  /**
   * Sets expected marks and corresponding zones for current view
   *
   * @TODO re-evaluate if we should allow multiple executions of this method
   */
  expect(zoneConfigs) {
    if (typeof zoneConfigs === "undefined" || !Array.isArray(zoneConfigs)) {
      return false;
    }

    // create a view object for initial, server-side rendered page view
    const pageView = new View({
      onMark: mark => {
        if (this.onMark) {
          this.onMark(mark);
        }
      },
      onMeasure: measure => {
        if (this.onMeasure) {
          this.onMeasure(measure);
        }
      },
      zoneConfigs
    });
  }

  mark(name) {
    const mark = ExpectedMark.get(name);

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
