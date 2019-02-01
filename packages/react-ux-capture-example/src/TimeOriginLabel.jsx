import React from 'react';

import TimeLabel from './TimeLabel';

const TimeOriginLabel = props => {
	const { time } = props;

	return (
		<TimeLabel
			time={Math.round(time)}
			label="Moment of navigationStart in page view or intractive transitionStart in SPA"
			icon="🎬"
		/>
	);
};

export default TimeOriginLabel;
