import React from 'react';

import TimeLabel from './TimeLabel';

const MomentInTimeLabel = props => {
	const { time } = props;

	return (
		<TimeLabel
			time={Math.round(time)}
			label="Icon for moment in time"
			emoji="🔔"
		/>
	);
};

export default MomentInTimeLabel;
