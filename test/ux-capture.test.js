(function(window) {
  //
  // Run in either Mocha, Karma or Browser environments
  //
  if (typeof window === "undefined") {
    window = {};
  }

  // UserTiming polyfill
  window.performance = window.performance
    ? window.performance
    : require("usertiming");

  // set up global UX object
  const UX = window.UX ? window.UX : require("../js/ux-capture.min.js");

  // assertion library
  const expect = global.expect ? global.expect : require("expect");

  describe("UX Capture", function() {
    it("should be available as UX global variable", function() {
      expect(UX);
    });
  });
})(typeof window !== "undefined" ? window : undefined);
