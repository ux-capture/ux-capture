import React from 'react';

const getTime = name => {
	const mark = window.performance.getEntriesByName(name).pop();
	return mark ? Math.round(mark.startTime * 10) / 10 : null;
};

export default props => {
	const time = getTime(props.mark);
	return (
		<div
			style={{ maxWidth: '600px' }}
			className="flex text--secondary text--small border--top border--bottom"
		>
			<div className="flex-item">{props.mark}</div>
			<div className="flex-item">🕒 {time}ms</div>
		</div>
	);
};
