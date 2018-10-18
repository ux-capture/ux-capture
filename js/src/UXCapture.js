import ExpectedMark from "./ExpectedMark";
import View from "./View";

const NOOP = () => {};

export default class UXCapture {
  onMark = NOOP;
  onMeasure = NOOP;

  constructor() {
    window.UX = this;
  }

  /**
   * Sets expected marks and corresponding zones for current view
   *
   * @TODO re-evaluate if we should allow multiple executions of this method
   */
  expect(zoneConfigs) {
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

  /**
   * Creates marks on UserTiming timeline.
   * It also creates UserTiming measures for each zone if mark is last one to be recorded in the zone.
   *
   * waitForNextPaint attribute can be set to false if your code is not expected to change any visual
   * elements of UI and trigger repaints. A good example is attaching click event handlers to elements
   * which is need for them to be interactive, but by itself doesn't affect element's appearance.
   *
   * @param {string} name
   * @param {boolean} waitForNextPaint
   */
  mark(name, waitForNextPaint = true) {
    const mark = ExpectedMark.get(name);

    if (mark) {
      if (waitForNextPaint) {
        mark.waitForNextPaintAndRecord();
      } else {
        mark.record();
      }
    }
  }

  config(configuration) {
    const { onMark, onMeasure } = configuration;

    if (onMark) {
      this.onMark = onMark;
    }

    if (onMeasure) {
      this.onMeasure = onMeasure;
    }
  }
}
