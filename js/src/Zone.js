import ExpectedMark from "./ExpectedMark";
import UXCapture from "./UXCapture";

/**
 * Zone represents collection of elements groupped together and corresponding phase of page load
 *
 * Only one set of zones can be tracked for the same view at one point in time
 */
export default class Zone {
  // constructs individual zone object
  constructor(config) {
    // {
    //   name: "ux-destination-verified",
    //   marks: ["ux-image-online-logo", "ux-image-inline-logo"]
    //   selectors: ["img.logo"],
    //   startMark: "navigationStart",
    //   onMeasure: measureName => {}
    //   onMark: markName => {}
    // }

    // name to be used for UserTiming measures
    this.measureName = config.name;

    // callback to execute when Zone is complete
    this.onMeasure = config.onMeasure;

    // callback for marks to call when they are complete
    this.onMark = config.onMark;

    this.startMarkName = config.startMarkName || "navigationStart";

    // look up existing mark object or create a new one

    // now just string names for UserTiming marks
    // in the future, different types of events, e.g. ImageElement("logo"), PaintTimer("first-paint")
    this.marks = config.marks.map(markName => {
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
        this.startMarkName,
        lastMark.name
      );
    }

    // if callback is specified, call it with zone name
    if (this.onMeasure) {
      this.onMeasure(this.measureName);
    }
  }
}
