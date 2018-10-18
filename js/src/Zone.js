import ExpectedMark from "./ExpectedMark";
import UXBase from "./UXBase";

/**
 * A `Zone` is a collection of elements on a page that corresponds
 * to a given phase of page load. (i.e. all elements in `ux-destination-verfied`)
 *
 * Example props:
 *
 * {
 *  name: "ux-destination-verified",
 *  marks: ["ux-image-online-logo", "ux-image-inline-logo"]
 *  onMeasure: measureName => {}
 *  onMark: markName => {}
 * }
 */
export default class Zone extends UXBase {
  /**
   * Creates a Zone
   * @param {object} props
   */
  constructor(props) {
    super(props);

    // Handle deprecated "label" keys
    if (this.props.label) {
      console.warn(
        "[ux-capture] Deprecation Warning: `label` keys on configuration object were renamed to `name` as of verision v2.0.0",
        "Will be removed in v3.0.0"
      );
    }
  }

  // Name used for UserTiming measures
  measureName = this.props.name || this.props.label;

  // Callback to execute when Zone is complete (all marks recorded)
  onMeasure = this.props.onMeasure;

  // Callback for marks to call when they are complete (recorded)
  onMark = this.props.onMark;

  startMark = "navigationStart";

  // Create a new `ExpectedMark` for each mark
  marks = this.props.marks.map(markName => {
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
        this.startMark,
        lastMark.name
      );
    }

    this.onMeasure(this.measureName);
  }
}
