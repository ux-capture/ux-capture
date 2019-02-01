import React from 'react';

const TimeLabel = props => {
	const { time, label, icon } = props;

	return (
		<div
			className="flex-item"
			style={{
				whiteSpace: 'nowrap',
			}}
			title={label}
		>
			{icon && (
				<span
					style={{
						marginRight: '0.2em',
					}}
					role="img"
					aria-label={label}
				>
					{icon}
				</span>
			)}
			{time}
			ms
		</div>
	);
};

export default TimeLabel;
