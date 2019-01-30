import React from 'react';

import TimeLabel from './TimeLabel';

const TimeOffsetLabel = props => {
	const { time, origin } = props;

	return (
		<TimeLabel
			time={time < origin ? 0 : Math.round(time - origin)}
			label="Time offset"
		/>
	);
};

export default TimeOffsetLabel;
