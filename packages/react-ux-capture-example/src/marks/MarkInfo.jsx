import React from 'react';

import TimeLabel from './../TimeLabel';

export const fakeNavigationStartMark = { name: 'navigationStart', startTime: 0 };

const getMark = name => {
	const mark = window.performance.getEntriesByName(name).pop();

	return {
		name: name,
		startTime: mark ? Math.round(mark.startTime * 10) / 10 : null,
	};
};

const MarkInfo = props => {
	const mark = getMark(props.mark);

	const transitionStart =
		performance.getEntriesByName('transitionStart').pop() ||
		fakeNavigationStartMark;

	return (
		<div
			style={{ maxWidth: '600px' }}
			className="flex text--secondary text--small border--top border--bottom"
		>
			<div className="flex-item">{mark.name}</div>
			<TimeLabel
				time={Math.round(mark.startTime * 10) / 10}
				label="Moment in time icon"
				emoji="🕒"
			/>
			<TimeLabel
				time={
					mark.startTime < transitionStart.startTime
						? 0
						: Math.round(
								(mark.startTime - transitionStart.startTime) * 10
						  ) / 10
				}
				label="Moment in time measured from latest transition start icon"
				emoji="⏳"
			/>
		</div>
	);
};

export default MarkInfo;
