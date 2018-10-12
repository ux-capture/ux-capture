// UserTiming polyfill to override broken jsdom performance API
window.performance = require("usertiming");

// faking navigation timing API's navigationStart (not polyfilled by UserTiming polyfill)
window.performance.timing = {
  navigationStart: window.performance.now()
};

// set up global UX object
const UXCapture = require("../js/src/ux-capture");
const UX = new UXCapture();

const MOCK_MEASURE_1 = "ux-mock-measure_1";
const MOCK_MARK_1_1 = "ux-mock-mark_1_1";

const MOCK_MEASURE_2_LABEL = "ux-mock-measure_2_label";
const MOCK_MEASURE_2_NAME = "ux-mock-measure_2_name";
const MOCK_MARK_2_1 = "ux-mock-mark_2_1";

console.warn = jest.fn();

describe("UX.expect() legacy support until version 3.0.0", () => {
  it("must work with legacy `label` key instead of new `name` key", () => {
    UX.expect([
      {
        label: MOCK_MEASURE_1,
        marks: [MOCK_MARK_1_1]
      }
    ]);

    // this effectively removes asynchronicity from UX.mark() which
    // uses rAF->setTimeout->mark.record() chain
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => cb());
    jest.spyOn(window, "setTimeout").mockImplementation(cb => cb());

    UX.mark(MOCK_MARK_1_1);

    expect(
      window.performance
        .getEntriesByType("mark")
        .find(mark => mark.name === MOCK_MARK_1_1)
    ).toBeTruthy();
  });

  it("must throw a warning when `label` is used", () => {
    console.warn.mockClear();

    UX.expect([
      {
        label: MOCK_MEASURE_1,
        marks: [MOCK_MARK_1_1]
      }
    ]);

    // this effectively removes asynchronicity from UX.mark() which
    // uses rAF->setTimeout->mark.record() chain
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => cb());
    jest.spyOn(window, "setTimeout").mockImplementation(cb => cb());

    UX.mark(MOCK_MARK_1_1);

    expect(
      window.performance
        .getEntriesByType("mark")
        .find(mark => mark.name === MOCK_MARK_1_1)
    ).toBeTruthy();

    expect(console.warn).toHaveBeenCalled();
  });

  it("must not override `name` key if legacy `label` key is used", () => {
    UX.expect([
      {
        label: MOCK_MEASURE_2_LABEL,
        name: MOCK_MEASURE_2_NAME,
        marks: [MOCK_MARK_2_1]
      }
    ]);

    // this effectively removes asynchronicity from UX.mark() which
    // uses rAF->setTimeout->mark.record() chain
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => cb());
    jest.spyOn(window, "setTimeout").mockImplementation(cb => cb());

    UX.mark(MOCK_MARK_2_1);

    expect(
      window.performance
        .getEntriesByType("mark")
        .find(mark => mark.name === MOCK_MARK_2_1)
    ).toBeTruthy();

    expect(
      window.performance
        .getEntriesByType("measure")
        .find(mark => mark.name === MOCK_MEASURE_2_NAME)
    ).toBeTruthy();

    expect(
      window.performance
        .getEntriesByType("measure")
        .find(mark => mark.name === MOCK_MEASURE_2_LABEL)
    ).not.toBeTruthy();
  });
});
