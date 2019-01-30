import React from 'react';

import TimeLabel from './TimeLabel';

const DurationLabel = props => {
	const { time } = props;

	return <TimeLabel time={Math.round(time)} label="Time duration" emoji="🕒" />;
};

export default DurationLabel;
