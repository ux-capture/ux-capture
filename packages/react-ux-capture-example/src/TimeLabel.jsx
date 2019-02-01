import React from 'react';

const TimeLabel = props => {
	const { time, title, icon, units = 'ms' } = props;

	return (
		<div
			className="flex-item"
			style={{
				whiteSpace: 'nowrap',
			}}
			title={title}
		>
			{icon && (
				<span
					style={{
						marginRight: '0.2em',
					}}
					role="img"
					aria-label={`Icon for ${title}`}
				>
					{icon}
				</span>
			)}
			{time}
			{units}
		</div>
	);
};

export default TimeLabel;
