import ExpectedMark from "./ExpectedMark";
import UXCapture from "./UXCapture";

/**
 * A `Zone` is a collection of elements on a page that corresponds
 * to a given phase of page load. (i.e. all elements in `ux-destination-verfied`)
 *
 * Example config object:
 *
 * {
 *  name: "ux-destination-verified",
 *  marks: ["ux-image-online-logo", "ux-image-inline-logo"]
 *  selectors: ["img.logo"],      // TODO: not yet implemented
 *  startMark: "navigationStart",
 *  onMeasure: measureName => {}
 *  onMark: markName => {}
 * }
 */
export default class Zone {
  /**
   * Creates a Zone.
   * @param {object} config
   */
  constructor(config) {
    // Name used for UserTiming measures
    this.measureName = config.name;

    // Handle deprecated "label" keys
    if (config.label) {
      if (console) {
        console.warn(
          "[ux-capture] Deprecation Warning: `label` keys on configuration object were renamed to `name` as of verision v2.0.0",
          "Will be removed in v3.0.0"
        );
      }

      if (!config.name) {
        this.measureName = config.label;
      }
    }

    // Callback to execute when Zone is complete (all marks triggered)
    this.onMeasure = config.onMeasure;

    // Callback for marks to call when they are complete
    this.onMark = config.onMark;

    // Mark used as starting point for subsequent UserTiming mesaures
    // For Page View (initial page loads), this will be "navigationStart"
    // For Interactive Views, this will be "interactionStart"
    this.startMark = config.startMark;

    // Create a new `ExpectedMark` for each mark
    // supplied in `config.marks`
    this.marks = config.marks.map(markName => {
      const mark = ExpectedMark.create(markName);

      mark.onComplete(mark => {
        // Call Zone's `onMark` callback
        this.onMark(mark.name);

        if (this.checkCompletion()) {
          this.complete(mark);
        }
      });

      return mark;
    });
  }

  /**
   * Check if all marks for the zone have already been recorded
   */
  checkCompletion() {
    if (
      typeof window.performance === "undefined" ||
      typeof window.performance.getEntriesByType === "undefined"
    ) {
      return false;
    }

    const recordedMarks = window.performance.getEntriesByType("mark");

    // check if all marks for the zone were already recorded
    return this.marks.every(mark =>
      recordedMarks.find(recordedMark => recordedMark.name === mark.name)
    );
  }

  /**
   * Records measure on Performance Timeline and calls onMeasure callback
   *
   * @param {ExpectedMark} lastMark last mark that triggered completion
   */
  complete(lastMark) {
    if (
      typeof window.performance !== "undefined" &&
      typeof window.performance.measure !== "undefined"
    ) {
      window.performance.measure(
        this.measureName,
        this.startMarkName,
        lastMark.name
      );
    }

    // Call Zone's `onMeasure` callback
    this.onMeasure(this.measureName);
  }
}
