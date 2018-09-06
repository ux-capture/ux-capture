// UserTiming polyfill to override broken jsdom performance API
window.performance = require("usertiming");

// faking navigation timing API's navigationStart (not polyfilled by UserTiming polyfill)
window.performance.timing = {
  navigationStart: window.performance.now()
};

// set up global UX object
const UX = require("../js/ux-capture")(window);

const MOCK_MARK_LABEL = "ux-mock-mark";
const MOCK_MEASURE_LABEL = "ux-mock-measure";

describe("UX Capture", () => {
  it("should be available as UX global variable", () => {
    expect(UX);
  });

  UX.expect([
    {
      label: MOCK_MEASURE_LABEL,
      marks: [MOCK_MARK_LABEL]
    }
  ]);

  describe("UX.mark()", () => {
    it("must mark user timing api timeline", () => {
      UX.mark(MOCK_MARK_LABEL);

      expect(
        window.performance
          .getEntriesByType("mark")
          .filter(mark => mark.name === MOCK_MARK_LABEL).length
      ).toBe(1);
    });
  });
});
