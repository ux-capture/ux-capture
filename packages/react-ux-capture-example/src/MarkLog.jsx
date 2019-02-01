import React from 'react';

import MomentInTimeLabel from './MomentInTimeLabel';
import TimeOriginLabel from './TimeOriginLabel';
import TimeOffsetLabel from './TimeOffsetLabel';

const MarkLog = ({ views }) => (
	<div className="flex flex-item" style={{ backgroundColor: '#555' }}>
		<div className="flex-item section inverted">
			<div key="tab1" className="bounds chunk">
				<div className="chunk text--small">
					<h3 key="header">Marks</h3>
					<div key="table-header" className="flex">
						<div className="flex-item" />
						<div className="flex-item">
							<div className="flex text--secondary">
								<div
									className="flex-item"
									style={{
										whiteSpace: 'nowrap',
									}}
								>
									Timestamp
								</div>
								<div
									className="flex-item"
									style={{
										whiteSpace: 'nowrap',
									}}
								>
									Offset
								</div>
							</div>
						</div>
					</div>
					{views.map(view => (
						<React.Fragment key="marks-table">
							{view.marks.map(mark => (
								<div
									key={mark.name}
									className="flex text--secondary border--top"
								>
									<div
										className="flex-item"
										style={{
											whiteSpace: 'nowrap',
										}}
									>
										{mark.name}
									</div>
									<div className="flex-item">
										<div className="flex text--secondary">
											<MomentInTimeLabel
												time={mark.startTime}
											/>
											<TimeOffsetLabel
												time={mark.startTime}
												origin={view.startMark.startTime}
											/>
										</div>
									</div>
								</div>
							))}
							<div
								key="viewStart"
								className="flex text--secondary border--top"
							>
								<div
									className="flex flex-item"
									style={{
										fontWeight: 'bold',
										color: 'white',
										whiteSpace: 'nowrap',
									}}
								>
									{view.startMark.name} &rarr; {view.path}
								</div>
								<div className="flex flex-item">
									<div className="flex flex-item">
										<TimeOriginLabel
											time={view.startMark.startTime}
										/>
									</div>
									<div className="flex flex-item" />
								</div>
							</div>
						</React.Fragment>
					))}
				</div>
			</div>
		</div>
	</div>
);

export default MarkLog;
