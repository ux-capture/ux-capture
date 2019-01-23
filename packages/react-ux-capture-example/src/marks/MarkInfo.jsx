import React from 'react';

import TimeOffsetLabel from '../TimeOffsetLabel';
import MomentInTimeLabel from '../MomentInTimeLabel';

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

	const startMark =
		performance.getEntriesByName('transitionStart').pop() ||
		fakeNavigationStartMark;

	return (
		<div
			style={{ maxWidth: '600px' }}
			className="flex text--secondary text--small border--top border--bottom"
		>
			<div className="flex-item">{mark.name}</div>
			<MomentInTimeLabel time={mark.startTime} />
			<TimeOffsetLabel time={mark.startTime} origin={startMark.startTime} />
		</div>
	);
};

export default MarkInfo;
