import React from 'react';

import TimeLabel from './TimeLabel';

const TimeOriginLabel = props => {
	const { time } = props;

	return <TimeLabel time={Math.round(time)} label="Time origin icon" emoji="🎬" />;
};

export default TimeOriginLabel;
