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

    // array of mark names that were recorded so far
    this.recordedMarkNames = [];

    this.startMarkName = config.startMarkName || "navigationStart";

    // look up existing mark object or create a new one

    // now just string names for UserTiming marks
    // in the future, different types of events, e.g. ImageElement("logo"), PaintTimer("first-paint")
    this.marks = config.marks.map(markName => {
      const mark = ExpectedMark.get(markName) || new ExpectedMark(markName);

      mark.onComplete(mark => this.checkCompletion(mark));

      return mark;
    });
  }

  /**
   * Callback to be called by each mark in the zone upon recording
   *
   * @param {Mark} recordedMark latest mark recorded
   */
  checkCompletion(recordedMark) {
    this.recordedMarkNames[recordedMark.name] = true;

    // if callback is specified, call it with mark name
    if (this.onMark) {
      this.onMark(recordedMark.name);
    }

    // check if all marks for the zone were completed
    const isComplete = this.marks.every(
      mark => this.recordedMarkNames[mark.name]
    );

    if (isComplete) {
      if (
        typeof window.performance !== "undefined" &&
        typeof window.performance.measure !== "undefined"
      ) {
        window.performance.measure(
          this.measureName,
          this.startMarkName,
          recordedMark.name
        );
      }

      // if callback is specified, call it with zone name
      if (this.onMeasure) {
        this.onMeasure(this.measureName);
      }
    }
  }
}
