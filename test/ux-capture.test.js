// UserTiming polyfill to override broken jsdom performance API
window.performance = require("usertiming");

// set up global UX object
const UX = require("../js/ux-capture")(window);

describe("UX Capture", function() {
  it("should be available as UX global variable", () => {
    expect(UX);
  });
});
