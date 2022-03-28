import Zone from './Zone';
/**
 * A `View` is a collection of zones representing a single
 * page view or interactive view.
 *
 * Refer to ux-capture README glossary for view definitions.
 * @see: https://github.com/ux-capture/ux-capture#glossary
 */
class View {
	constructor(props) {
		this.props = props;
		this.expectedZones = this.setZones(this.props.zoneConfigs);
	}
	// TODO: determine if we need to support appending new marks
	// to exisiting zones or new zones or both
	update(zoneConfigs) {
		// Append configuration, same way we append the zones themselves
		this.props.zoneConfigs.push(...zoneConfigs);

		// Append new zones to existing config
		this.expectedZones.push(...this.setZones(zoneConfigs));
	}
	setZones(zoneConfigs) {
		return zoneConfigs.map((zoneConfig) => this.createZone(zoneConfig));
	}
	destroy() {
		this.expectedZones.forEach((z) => z.destroy());
		this.expectedZones = null;
	}
	createZone(zoneConfig) {
		return new Zone(
			Object.assign(
				{
					onMark: this.props.onMark,
					onMeasure: this.props.onMeasure,
					startMarkName: this.props.startMarkName,
					recordTimestamps: this.props.recordTimestamps,
				},
				zoneConfig
			)
		);
	}
	getZoneConfigs() {
		return this.props.zoneConfigs;
	}
}






export default View;
