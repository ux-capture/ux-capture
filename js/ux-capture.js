window.UX = (function() {
  let expectedZones = [];

  let getZoneByMark = function(markLabel) {
    return expectedZones.find(expectedZone => {
      return expectedZone.marks.find(
        expectedMarkLabel => expectedMarkLabel === markLabel
      );
    });
  };

  return {
    expect: function(zones) {
      zones.forEach(zone => {
        expectedZones.push(zone);
      });
    },
    mark: function(markLabel) {
      // record the mark using W3C User Timing API
      performance.mark(markLabel);

      // report same mark on Chrome/Firefox timeline
      console.timeStamp(markLabel);

      // find the zone this mark belongs to
      let zone = getZoneByMark(markLabel);

      // if zone is found, record the mark against the zone
      if (zone) {
        // record a measure using W3C User Timing API
        // @TODO replace with proper promise-based waiting
        performance.measure(zone.label, "navigationStart", markLabel);

        // set zone label as console message prefix
        consoleTimeStampPrefix = zone.label;
      }
    }
  };
})();
