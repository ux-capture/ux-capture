import ExpectedMark from "./ExpectedMark";
import View from "./View";

const NOOP = () => {};
const INTERACTION_START_MARK = "interactionStart";
const NAVIGATION_START_MARK = "navigationStart";

export default class UXCapture {
  constructor() {
    this.onMark = NOOP;
    this.onMeasure = NOOP;
    this.startMark = NAVIGATION_START_MARK;

    window.UX = this;
  }

  /**
   * Creates a new View instance and supplies expected marks and
   * corresponding zones to the View.
   *
   * TODO: re-evaluate if we should allow multiple executions of this method
   *
   * @param {object} zoneConfigs
   */
  expect(zoneConfigs) {
    // View object for initial, server-side rendered page view
    const pageView = new View({
      // `onMark` and `onMeasure` call `this.onMark` and `this.onMeasure`
      // to handle cases where `UX.config()` comes after `UX.expect()`
      onMark: mark => {
        this.onMark(mark);
      },
      onMeasure: measure => {
        this.onMeasure(measure);
      },
      startMark: this.startMark,
      zoneConfigs,
    });
  }

  /**
   * Creates marks on UserTiming timeline. Also creates UserTiming
   * measures for each zone when last mark is recorded.
   *
   * `waitForNextPaint` should be set to false if your code is not
   * expected to change any visual elements and trigger repaints.
   *
   * Example: click event handlers on elements are necessary
   * for them to be interactive but don't affect the element's appearance.
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

  /**
   * Assigns user-specified `onMark` and `onMeasure` callbacks
   * to UXCapture instance.
   *
   * @param {object} configuration
   */
  config(configuration) {
    const { onMark = NOOP, onMeasure = NOOP, interactive = false } = configuration;

    if (interactive) {
      this.startMark = INTERACTION_START_MARK;
    }

    Object.assign(this, { onMark, onMeasure, startMark });
  }

  /**
   * Updates the `transition-start` mark. `transition-start` is
   * the starting point for UserTiming measures within each subsequent
   * Interactive View.
   *
   */
  startTransition() {
    if (
      typeof window.performance !== "undefined" &&
      typeof window.performance.mark !== "undefined"
    ) {
      window.performance.mark(INTERACTION_START_MARK);
    }
  }
}
