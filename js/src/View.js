import Zone from "./Zone";

export default class View {
  constructor({ onMark, onMeasure, zoneConfigs }) {
    this.expectedZones = zoneConfigs.map(zoneConfig => {
      // only create zones if configuration contains marks, otherwise just ignore it
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
