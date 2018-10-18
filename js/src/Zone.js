import ExpectedMark from "./ExpectedMark";
import UXBase from "./UXBase";

/**
 * Zone represents collection of elements groupped together and corresponding phase of page load
 *
 * Only one set of zones can be tracked for the same view at one point in time
 *
 * Example props:
 * {
 *    name: "ux-destination-verified",
 *    marks: ["ux-image-online-logo", "ux-image-inline-logo"]
 *    selectors: ["img.logo"],
 *    onMeasure: measureName => {}
 *    onMark: markName => {}
 * }
 *
 */
export default class Zone extends UXBase {
  // constructs individual zone object
  constructor(props) {
    super(props);

    // handling deprecated "label" keys in backwards-compatible way
    if (this.props.label) {
      console.warn(
        "[ux-capture] Deprecation Warning: `label` keys on configuration object were renamed to `name` as of verision v2.0.0",
        "Will be removed in v3.0.0"
      );
    }
  }

  // name to be used for UserTiming measures
  measureName = this.props.name || this.props.label;

  // callback to execute when Zone is complete
  onMeasure = this.props.onMeasure;

  // callback for marks to call when they are complete
  onMark = this.props.onMark;

  startMark = "navigationStart";

  marks = this.props.marks.map(markName => {
    const mark = ExpectedMark.create(markName);

    mark.onComplete(mark => {
      // if Zone's onMark callback is specified, call it with mark name
      if (this.onMark) {
        this.onMark(mark.name);
      }

      if (this.checkCompletion()) {
        this.complete(mark);
      }
    });

    return mark;
  });

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
   * Records measure on Performance Timeline and calls onMeasure callback if specified
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
        this.startMark,
        lastMark.name
      );
    }

    // if callback is specified, call it with zone name
    if (this.onMeasure) {
      this.onMeasure(this.measureName);
    }
  }
}
