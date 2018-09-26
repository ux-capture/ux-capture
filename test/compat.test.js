// set up global UX object without a window
const UX = require("../js/src/ux-capture")();

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

  it("UX.mark() must not throw an error if UserTiming API is not available", () => {
    expect(() => {
      UX.mark(MOCK_MARK_1_1);
    }).not.toThrow();
  });

  it("Should not throw an error when window.UX is already defined", () => {
    expect(() => {
      require("../js/src/ux-capture")(window);
      require("../js/src/ux-capture")(window);
    }).not.toThrow();
  });
});
