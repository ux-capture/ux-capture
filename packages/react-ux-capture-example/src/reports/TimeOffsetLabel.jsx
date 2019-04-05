import React from 'react';

import TimeLabel from './TimeLabel';

const TimeOffsetLabel = props => {
	const { time, origin } = props;

	return (
		<TimeLabel
			time={time < origin ? 0 : Math.round(time - origin)}
			title="Moment in time offset from latest navigationStart or transitionStart"
		/>
	);
};

export default TimeOffsetLabel;
