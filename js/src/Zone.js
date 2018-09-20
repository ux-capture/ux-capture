import ExpectedMark from "./ExpectedMark";
import UXCapture from "./UXCapture";

// array holding current, global set of expected zones
let expectedZones = [];

/**
 * Zone represents collection of elements groupped together and corresponding phase of page load
 *
 * Only one set of zones can be tracked for the same view at one point in time
 */
export default class Zone {
  static setExpectedZones(zones) {
    expectedZones = zones.map(zone => {
      // only create promises if zone contains any marks, otherwise just ignore it
      if (zone.marks && zone.marks.length > 0) {
        const expectedZone = new Zone(zone.label, zone.marks);

        return expectedZone;
      }
    });
  }

  // constructs individual zone object
  constructor(label, marks, elements = []) {
    this.label = label;

    const promises = [];

    // look up existing mark object or create a new one
    this.marks = marks.map(markLabel => {
      const mark = ExpectedMark.get(markLabel) || new ExpectedMark(markLabel);

      mark.requiredForZone(this);

      const promise = mark.getPromise();

      // remember last recorded mark
      promise.then(() => {
        this.lastMark = mark;
      });

      promises.push(promise);

      return mark;
    });

    // only if all marks were recorded (and promises resolved), go ahead and record the measure ending with last recorded mark
    Promise.all(promises).then(() => {
      UXCapture.recordMeasure(this, this.lastMark);
    });
  }

  getLabel() {
    return this.label;
  }
}
