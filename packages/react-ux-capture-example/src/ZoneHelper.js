export const getZoneColor = measureName => {
	switch (measureName) {
		case 'ux-destination-verified':
			return 'rgb(255,204,0)';
		case 'ux-primary-content-displayed':
			return 'rgb(128,0,128)';
		case 'ux-primary-action-available':
			return 'rgb(255,102,0)';
		case 'ux-secondary-content-displayed':
			return 'rgb(51,204,204)';
		default:
			return 'white';
	}
};

export const getBoxStyle = measureName => ({
	border: `1px solid ${getZoneColor(measureName)}`,
	borderLeft: `5px solid ${getZoneColor(measureName)}`,
	padding: '5px',
});
