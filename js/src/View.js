import Zone from "./Zone";
import UXBase from "./UXBase";

/**
 * A `View` is a collection of zones representing a single
 * page view or interactive view.
 *
 * Refer to ux-capture README glossary for view definitions.
 * @see: https://github.com/meetup/ux-capture#glossary
 */
export default class View extends UXBase {
  expectedZones = this.props.zoneConfigs.map(zoneConfig => {
    // Create a new zone only if configuration contains marks
    if (zoneConfig.marks && zoneConfig.marks.length > 0) {
      return new Zone({
        onMark: this.props.onMark,
        onMeasure: this.props.onMeasure,
        ...zoneConfig
      });
    }
  });
}
