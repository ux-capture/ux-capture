import React from 'react';

import TimeLabel from './TimeLabel';

const MomentInTimeLabel = props => {
	const { time } = props;

	return (
		<TimeLabel
			time={Math.round(time)}
			title="Moment in time recorded as UserTiming mark"
		/>
	);
};

export default MomentInTimeLabel;
