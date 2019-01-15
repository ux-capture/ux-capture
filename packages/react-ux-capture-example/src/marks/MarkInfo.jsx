import React from 'react';

const getMark = name => {
	const mark = window.performance.getEntriesByName(name).pop();

	return {
		name: name,
		startTime: mark ? Math.round(mark.startTime * 10) / 10 : null,
	};
};

export default props => {
	const mark = getMark(props.mark);

	return (
		<div
			style={{ maxWidth: '600px' }}
			className="flex text--secondary text--small border--top border--bottom"
		>
			<div className="flex-item">{mark.name}</div>
			<div className="flex-item">
				<span role="img" aria-label="Moment in time icon">
					🕒
				</span>{' '}
				{mark.startTime}ms
			</div>
		</div>
	);
};
