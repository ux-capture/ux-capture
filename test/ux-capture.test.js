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

describe("UX Capture", () => {
  it("should be available as UX global variable", () => {
    expect(UX);
  });

  describe("Measures", () => {
    // it("Must wait for all marks declared", () => {});
    // it("must end with the latest mark and start with 0", () => {});
  });

  // ???????????
  // Must fire a native mark even if it is not expected? (Should this be supported? Should we use it for technical marking? Not sure)
  // ??? Should fire custom callbacks even if UserTiming api is not supported? Is that true? How will it measure time? Should be available though a polyfill instead?
});
