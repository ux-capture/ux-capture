import Zone from "./Zone";
import UXBase from "./UXBase";

/**
 * View is a collection of zones representing one page view or interactive view
 */
export default class View extends UXBase {
  expectedZones = this.props.zoneConfigs.map(zoneConfig => {
    // only create zones if configuration contains marks, otherwise just ignore it
    if (zoneConfig.marks && zoneConfig.marks.length > 0) {
      return new Zone({
        onMark: this.props.onMark,
        onMeasure: this.props.onMeasure,
        ...zoneConfig
      });
    }
  });
}
