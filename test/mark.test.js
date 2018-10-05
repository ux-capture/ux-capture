// UserTiming polyfill to override broken jsdom performance API
window.performance = require("usertiming");

// faking navigation timing API's navigationStart (not polyfilled by UserTiming polyfill)
window.performance.timing = {
  navigationStart: window.performance.now()
};

// using console.timeStamp for testing only
console.timeStamp = jest.fn();

// set up global UX object
const UX = require("../js/src/ux-capture")(window);

const MOCK_MEASURE_1 = "ux-mock-measure_1";
const MOCK_MARK_1_1 = "ux-mock-mark_1_1";
const MOCK_MARK_1_2 = "ux-mock-mark_1_2";

const MOCK_UNEXPECTED_MARK = "ux-unexpected-mark";

const MOCK_MEASURE_2 = "ux-mock-measure_2";
const MOCK_MEASURE_3 = "ux-mock-measure_3";
const MOCK_MARK_MULTIPLE = "ux-mock-mark_multiple";

describe("UX.mark()", () => {
  const mockOnMarkCallback = jest.fn();

  UX.expect([
    {
      name: MOCK_MEASURE_1,
      marks: [MOCK_MARK_1_1, MOCK_MARK_1_2]
    },
    {
      name: MOCK_MEASURE_2,
      marks: [MOCK_MARK_MULTIPLE]
    },
    {
      name: MOCK_MEASURE_3,
      marks: [MOCK_MARK_MULTIPLE]
    }
  ]);

  it("must mark user timing api timeline", () => {
    UX.mark(MOCK_MARK_1_1);

    expect(
      window.performance
        .getEntriesByType("mark")
        .find(mark => mark.name === MOCK_MARK_1_1)
    ).toBeTruthy();
  });

  it("should trigger recording of a measure if last mark in chain", () => {
    UX.mark(MOCK_MARK_1_2);

    expect(
      window.performance
        .getEntriesByType("measure")
        .find(measure => measure.name === MOCK_MEASURE_1)
    ).toBeTruthy();
  });

  it("should fire a console.timeStamp it is available", () => {
    console.timeStamp.mockClear();

    UX.mark(MOCK_MARK_1_1);

    expect(console.timeStamp).toHaveBeenCalledWith(MOCK_MARK_1_1);
  });

  it("should call a custom mark callback when provided", () => {
    mockOnMarkCallback.mockClear();

    UX.config({ onMark: mockOnMarkCallback });

    UX.mark(MOCK_MARK_1_1);

    expect(mockOnMarkCallback).toHaveBeenCalledWith(MOCK_MARK_1_1);
  });

  it("should not record a mark that is not expected", () => {
    mockOnMarkCallback.mockClear();

    UX.mark(MOCK_UNEXPECTED_MARK);

    expect(
      window.performance
        .getEntriesByType("mark")
        .find(mark => mark.name === MOCK_UNEXPECTED_MARK)
    ).not.toBeTruthy();
  });

  it("should contribute to multiple measures if same mark is defined for multiple zones", () => {
    UX.mark(MOCK_MARK_MULTIPLE);

    expect(
      window.performance
        .getEntriesByType("measure")
        .find(measure => measure.name === MOCK_MEASURE_2)
    ).toBeTruthy();
    expect(
      window.performance
        .getEntriesByType("measure")
        .find(measure => measure.name === MOCK_MEASURE_3)
    ).toBeTruthy();
  });
});
