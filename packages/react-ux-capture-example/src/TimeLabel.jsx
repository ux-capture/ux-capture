import React from 'react';

const TimeLabel = props => {
	const { time, label, emoji } = props;

	return (
		<div
			className="flex-item"
			style={{
				whiteSpace: 'nowrap',
			}}
			title={label}
		>
			{emoji && (
				<span
					style={{
						marginRight: '0.2em',
					}}
					role="img"
					aria-label={label}
				>
					{emoji}
				</span>
			)}
			{time}
			ms
		</div>
	);
};

export default TimeLabel;
