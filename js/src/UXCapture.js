import ExpectedMark from "./ExpectedMark";
import View from "./View";

const NOOP = () => {};

export default class UXCapture {
  constructor() {
    this.onMark = NOOP;
    this.onMeasure = NOOP;

    window.UX = this;
  }

  /**
   * Sets expected marks and corresponding zones for current view
   *
   * @TODO re-evaluate if we should allow multiple executions of this method
   */
  expect(zoneConfigs) {
    if (typeof zoneConfigs === "undefined" || !Array.isArray(zoneConfigs)) {
      throw new Error("Must provide an array of zone configuration objects");
    }

    // create a view object for initial, server-side rendered page view
    const pageView = new View({
      // calling currently configured onMark & onMeasure handlers inside View's callbacks
      // allows making UX.config() call after UX.expect() call
      onMark: mark => {
        // console.log(this.onMark);
        this.onMark(mark);
      },
      onMeasure: measure => {
        // console.log(this.onMeasure);
        this.onMeasure(measure);
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
    const { onMark = NOOP, onMeasure = NOOP } = configuration;
    Object.assign(this, { onMark, onMeasure });
  }
}
