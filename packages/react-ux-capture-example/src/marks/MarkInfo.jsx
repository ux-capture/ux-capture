import React from 'react';

const getTime = name => {
	const mark = window.performance.getEntriesByName(name).pop();
	return mark ? mark.startTime.toString().substr(0, 10) : null;
};

export default props => {
	const time = getTime(props.mark);
	return (
		<div
			style={{ maxWidth: '600px' }}
			className="flex text--secondary text--small border--top border--bottom"
		>
			<div className="flex-item">{props.mark}</div>
			<div className="flex-item">🕒 {time}</div>
		</div>
	);
};
