import React from 'react';

import TimeLabel from './TimeLabel';

const DurationLabel = props => {
	const { time } = props;

	return (
		<TimeLabel
			time={Math.round(time)}
			title="UserTiming measure that
	is recorded representing UX metric"
			icon="🕒"
		/>
	);
};

export default DurationLabel;
