import UXCapture from "./UXCapture";

(function(window) {
  // Export initializer function for UX Capture to the appropriate location.
  if (typeof define === "function" && define.amd) {
    // AMD / RequireJS
    define([], function() {
      return UXCapture.attachTo;
    });
  } else if (
    typeof module !== "undefined" &&
    typeof module.exports !== "undefined"
  ) {
    // Node.js
    module.exports = UXCapture.attachTo;
  } else {
    // When included directly via a script tag in the browser,
    // run initialization function with window object.
    UXCapture.attachTo(window);
  }
})(typeof window !== "undefined" ? window : undefined);
