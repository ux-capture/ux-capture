import UXCapture from "./UXCapture";

const expectedMarks = [];
const onMarkEventListener = null;

/**
 * Class describes expected marks
 * These marks that have to be recorded before zone is considered complete
 */
export default class ExpectedMark {
  static get(label) {
    const mark = expectedMarks.find(mark => mark.label === label);

    return mark;
  }

  static setOnMarkEventListener(callback) {
    onMarkEventListener = callback;
  }

  constructor(markLabel) {
    this.label = markLabel;
    this.zones = [];

    this.done = null;

    this.promise = new Promise((resolve, reject) => {
      this.done = () => {
        UXCapture.recordMark(this);

        resolve(this);
      };
    });

    this.promise.then(() => {});

    if (!ExpectedMark.get(markLabel)) {
      expectedMarks.push(this);
    }
  }

  getLabel() {
    return this.label;
  }

  getPromise() {
    return this.promise;
  }

  requiredForZone(zone) {
    this.zones.push(zone);
  }

  record() {
    this.done(this.label);
  }
}
