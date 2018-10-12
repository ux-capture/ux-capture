// set up global UX object without a window
const UXCapture = require("../js/src/ux-capture");
const UX = new UXCapture();

const MOCK_MEASURE_1 = "ux-mock-measure_1";
const MOCK_MARK_1_1 = "ux-mock-mark_1_1";
const MOCK_MARK_1_2 = "ux-mock-mark_1_2";

describe("Compatibility", () => {
  UX.expect([
    {
      name: MOCK_MEASURE_1,
      marks: [MOCK_MARK_1_1, MOCK_MARK_1_2]
    }
  ]);

  // this effectively removes asynchronicity from UX.mark() which
  // uses rAF->setTimeout->mark.record() chain
  jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => cb());
  jest.spyOn(window, "setTimeout").mockImplementation(cb => cb());

  it("UX.mark() must not throw an error if UserTiming API is not available", () => {
    expect(() => {
      UX.mark(MOCK_MARK_1_1);
    }).not.toThrow();
  });

  it("Should not throw an error when window.UX is already defined", () => {
    expect(() => {
      require("../js/src/ux-capture");
      require("../js/src/ux-capture");
    }).not.toThrow();
  });
});
