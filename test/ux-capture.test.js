// UserTiming polyfill to override broken jsdom performance API
window.performance = require("usertiming");

// faking navigation timing API's navigationStart (not polyfilled by UserTiming polyfill)
window.performance.timing = {
  navigationStart: window.performance.now()
};

// using console.timeStamp for testing only
console.timeStamp = jest.fn();

// set up global UX object
const UX = require("../js/ux-capture")(window);

const MOCK_MEASURE_1 = "ux-mock-measure_1";
const MOCK_MARK_1_1 = "ux-mock-mark_1_1";
const MOCK_MARK_1_2 = "ux-mock-mark_1_2";

const MOCK_MEASURE_2 = "ux-mock-measure_2";
const MOCK_MARK_2_1 = "ux-mock-mark_2_1";

describe("UX Capture", () => {
  it("should be available as UX global variable", () => {
    expect(UX);
  });

  UX.expect([
    {
      label: MOCK_MEASURE_1,
      marks: [MOCK_MARK_1_1, MOCK_MARK_1_2]
    },
    {
      label: MOCK_MEASURE_2,
      marks: [MOCK_MARK_2_1]
    }
  ]);

  describe("UX.mark()", () => {
    it("must mark user timing api timeline", () => {
      UX.mark(MOCK_MARK_1_1);

      expect(
        window.performance
          .getEntriesByType("mark")
          .find(mark => mark.name === MOCK_MARK_1_1)
      ).toBeTruthy();
    });

    it("should trigger recording of a measure if last mark in chain", done => {
      UX.mark(MOCK_MARK_1_2);

      // use setTimeout to release thread for Promise.all() to fire for measures.
      setTimeout(() => {
        expect(
          window.performance
            .getEntriesByType("measure")
            .find(mark => mark.name === MOCK_MEASURE_1)
        ).toBeTruthy();
        done();
      }, 0);
    });

    it("should fire a console.timeStamp it is available", () => {
      console.timeStamp.mockClear();

      UX.mark(MOCK_MARK_1_1);

      expect(console.timeStamp).toHaveBeenCalledWith(MOCK_MARK_1_1);
    });

    it("should call a custom mark callback when provided", () => {
      const mockOnMarkCallback = jest.fn();

      UX.config({ onMark: mockOnMarkCallback });

      UX.mark(MOCK_MARK_1_1);

      expect(mockOnMarkCallback).toHaveBeenCalledWith(MOCK_MARK_1_1);
    });

    // it("should not fire native mark if UserTiming api is not available", () => {});
  });

  describe("Measures", () => {
    // it("Must wait for all marks declared", () => {});
    // it("must end with the latest mark and start with 0", () => {});
  });

  // ???????????
  // Must fire a native mark even if it is not expected? (Should this be supported? Should we use it for technical marking? Not sure)
  // ??? Should fire custom callbacks even if UserTiming api is not supported? Is that true? How will it measure time? Should be available though a polyfill instead?
});
