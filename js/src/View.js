import Zone from "./Zone";

export default class View {
  constructor({ onMark, onMeasure, zoneConfigs }) {
    this.expectedZones = zoneConfigs.map(zoneConfig => {
      // only create promises if zone contains any marks, otherwise just ignore it
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
