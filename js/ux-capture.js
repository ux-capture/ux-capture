(function(window) {
  const initUXCapture = function(window) {
    // allow running in Node.js environment
    if (typeof window === "undefined") {
      window = {};
    }

    // prepare base UX Capture object
    if (typeof window.UX === "undefined") {
      window.UX = {};
    } else {
      return window.UX;
    }

    const isUserTimingSupported =
      typeof window.performance !== "undefined" &&
      typeof window.performance.mark !== "undefined" &&
      typeof window.performance.measure !== "undefined";

    const isConsoleTimeStampSupported =
      typeof window.console !== "undefined" &&
      typeof window.console.timeStamp !== "undefined";

    let expectedZones = [];

    let getMark = markLabel =>
      expectedZones.reduce((expectedMark, expectedZone) => {
        // already found in previous zone, no need to be iterating over current zone's marks
        return expectedMark
          ? expectedMark
          : expectedZone.marks.find(
              expectedMark => expectedMark.label === markLabel
            );
      }, null);

    let onMark;
    let onMeasure;

    /**
     * Sets expected marks and corresponding zones for current view
     *
     * @TODO re-evaluate if we should allow multiple executions of this method
     */
    window.UX.expect = function(zones) {
      if (typeof zones === "undefined" || !Array.isArray(zones)) {
        return false;
      }

      expectedZones = zones.map(zone => {
        // only create promises if zone contains any marks, otherwise just ignore it
        if (zone.marks && zone.marks.length > 0) {
          // wrap each string in the array into an object so we can attach record() methods to them
          zone.marks = zone.marks.map(label => ({ label }));

          // create a promise for each expected mark
          const promises = zone.marks.map(
            mark =>
              new Promise((resolve, reject) => {
                mark.record = () => {
                  if (isUserTimingSupported) {
                    // record the mark using W3C User Timing API
                    window.performance.mark(mark.label);

                    // if callback is specified, call it with mark label
                    if (onMark) {
                      onMark(mark.label);
                    }
                  }

                  /**
                   * Report same mark on Chrome/Firefox timeline
                   *
                   * keep in mind, these timestamps are counted from timeline recording start
                   * while UserTiming marks are counted from navigationStart event
                   * however visually, they all will be offset by the same amount of time and align vertically on the charts
                   *
                   * (we'd provide a helper to highlight discrepancy, but unfortunately,
                   * there is no way to know when in timeline did navigationStart event occured)
                   */
                  if (isConsoleTimeStampSupported) {
                    console.timeStamp(mark.label);
                  }

                  // remember last mark that was recorded within a zone, overriding previous one
                  zone.lastMarkLabel = mark.label;

                  resolve(mark.label);
                };
              })
          );

          if (isUserTimingSupported) {
            // only if all marks were recorded (and promises resolved), go ahead and record the measure ending with last recorded mark
            Promise.all(promises).then(() => {
              // record a measure using W3C User Timing API
              window.performance.measure(
                zone.label,
                "navigationStart",
                zone.lastMarkLabel
              );

              // if callback is specified, call it with zone label
              if (onMeasure) {
                onMeasure(zone.label);
              }
            });
          }

          return zone;
        }
      });
    };

    window.UX.mark = function(markLabel) {
      const mark = getMark(markLabel);

      if (mark) {
        mark.record();
      }
    };

    window.UX.config = function(configuration) {
      if (!configuration || typeof configuration !== "object") {
        return;
      }

      if (typeof configuration.onMark === "function") {
        onMark = configuration.onMark;
      } else {
        onMark = null;
      }

      if (typeof configuration.onMeasure === "function") {
        onMeasure = configuration.onMeasure;
      } else {
        onMeasure = null;
      }
    };

    return window.UX;
  };

  // Export initializer function for UX Capture to the appropriate location.
  if (typeof define === "function" && define.amd) {
    // AMD / RequireJS
    define([], function() {
      return initUXCapture;
    });
  } else if (
    typeof module !== "undefined" &&
    typeof module.exports !== "undefined"
  ) {
    // Node.js
    module.exports = initUXCapture;
  } else {
    // When included directly via a script tag in the browser,
    // run initialization function with window object.
    initUXCapture(window);
  }
})(typeof window !== "undefined" ? window : undefined);
