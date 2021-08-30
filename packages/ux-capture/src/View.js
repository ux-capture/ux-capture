import Zone from './Zone';

/**
 * A `View` is a collection of zones representing a single
 * page view or interactive view.
 *
 * Refer to ux-capture README glossary for view definitions.
 * @see: https://github.com/ux-capture/ux-capture#glossary
 */
function View(props) {
	this.props = props;
	this.expectedZones = this.setZones(this.props.zoneConfigs);
}

// TODO: determine if we need to support appending new marks
// to exisiting zones or new zones or both
View.prototype.update = function (zoneConfigs) {
	// Append new zones to existing config
	this.expectedZones.push.apply(this.expectedZones, this.setZones(zoneConfigs));
};

View.prototype.setZones = function (zoneConfigs) {
	return zoneConfigs.map(zoneConfig => this.createZone(zoneConfig));
};

View.prototype.destroy = function () {
	this.expectedZones.forEach(z => z.destroy());
	this.expectedZones = null;
};

View.prototype.createZone = function (zoneConfig) {
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
};

export default View;
