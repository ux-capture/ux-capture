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

const MOCK_MEASURE_2 = "ux-mock-measure_2";
const MOCK_MARK_2_1 = "ux-mock-mark_2_1";

const MOCK_MEASURE_3 = "ux-mock-measure_3";
const MOCK_MARK_3_1 = "ux-mock-mark_3_1";

const MOCK_MEASURE_4 = "ux-mock-measure_4";
const MOCK_MARK_4_1 = "ux-mock-mark_4_1";

const MOCK_MEASURE_5 = "ux-mock-measure_5";
const MOCK_MARK_5_1 = "ux-mock-mark_5_1";

describe("UX.config()", () => {
  UX.expect([
    {
      name: MOCK_MEASURE_1,
      marks: [MOCK_MARK_1_1, MOCK_MARK_1_2]
    },
    {
      name: MOCK_MEASURE_2,
      marks: [MOCK_MARK_2_1]
    },
    {
      name: MOCK_MEASURE_3,
      marks: [MOCK_MARK_3_1]
    },
    {
      name: MOCK_MEASURE_4,
      marks: [MOCK_MARK_4_1]
    },
    {
      name: MOCK_MEASURE_5,
      marks: [MOCK_MARK_5_1]
    }
  ]);

  const mockOnMarkCallback = jest.fn();
  const mockOnMeasureCallback = jest.fn();

  it("Should not break if non-object is passed", () => {
    expect(() => {
      UX.config();
    }).not.toThrow();

    expect(() => {
      UX.config("");
    }).not.toThrow();
  });

  it("Should be able to configure onMark handler", () => {
    mockOnMarkCallback.mockClear();

    UX.config({ onMark: mockOnMarkCallback });

    UX.mark(MOCK_MARK_1_1);

    expect(mockOnMarkCallback).toHaveBeenCalledWith(MOCK_MARK_1_1);
  });

  it("Should be able to configure onMeasure handler", done => {
    mockOnMeasureCallback.mockClear();

    UX.config({ onMeasure: mockOnMeasureCallback });

    UX.mark(MOCK_MARK_2_1);

    // use setTimeout to release thread for Promise.all() to fire for measures.
    setTimeout(() => {
      expect(mockOnMeasureCallback).toHaveBeenCalledWith(MOCK_MEASURE_2);
      done();
    }, 0);
  });

  it("Should remove custom onMark callback if it's not defined on configuration object", () => {
    // configure onMark callback
    UX.config({ onMark: mockOnMarkCallback });

    // remove onMark callback
    UX.config({});

    mockOnMarkCallback.mockClear();

    UX.mark(MOCK_MARK_3_1);

    expect(mockOnMarkCallback).not.toHaveBeenCalledWith(MOCK_MARK_3_1);
  });

  it("Should remove custom onMeasure callback if it's not defined on configuration object", done => {
    // configured onMeasure callback
    UX.config({ onMeasure: mockOnMeasureCallback });

    // remove onMeasure callback
    UX.config({ onMark: mockOnMarkCallback });

    mockOnMarkCallback.mockClear();
    mockOnMeasureCallback.mockClear();

    UX.mark(MOCK_MARK_4_1);

    expect(mockOnMarkCallback).toHaveBeenCalledWith(MOCK_MARK_4_1);

    // use setTimeout to release thread for Promise.all() to fire for measures.
    setTimeout(() => {
      expect(mockOnMeasureCallback).not.toHaveBeenCalledWith(MOCK_MEASURE_4);
      done();
    }, 0);
  });
});
