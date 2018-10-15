import Zone from "./Zone";

/**
 * A `View` is a collection of zones representing a single
 * page view or interactive view.
 *
 * Refer to ux-capture README glossary for view definitions.
 * @see: https://github.com/meetup/ux-capture#glossary
 */
export default class View {
  constructor({ onMark, onMeasure, zoneConfigs }) {
    this.expectedZones = zoneConfigs.map(zoneConfig => {
      // Create a new zone only if configuration contains marks
      if (zoneConfig.marks && zoneConfig.marks.length > 0) {
        return new Zone({
          onMark,
          onMeasure,
          ...zoneConfig
        });
      }
    });
  }
}
