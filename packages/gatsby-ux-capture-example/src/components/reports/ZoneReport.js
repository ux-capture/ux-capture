import React from "react";

import TimeOriginLabel from "./TimeOriginLabel";
import TimeOffsetLabel from "./TimeOffsetLabel";
import DurationLabel from "./DurationLabel";

import { getZoneColor } from "./ZoneHelper";

import Zones from "../../Zones.jsx";

const ZoneReport = ({ views }) => (
	<div className="flex flex-item inverted" style={{ backgroundColor: "#444" }}>
		<div className="flex-item section inverted">
			<div className="bounds chunk text--small">
				<div className="chunk">
					<h3>Current View</h3>

					{views.slice(0, 1).map((view, index) => (
						<React.Fragment key={`view_${index}`}>
							<div key="startMark" className="flex text--secondary margin--halfTop">
								<div
									className="flex flex-item"
									style={{
										fontWeight: "bold",
										color: "white",
										whiteSpace: "nowrap"
									}}
								>
									{view.startMark.name} &rarr; {view.path}
								</div>

								<div className="flex flex-item align--right">
									<TimeOriginLabel time={view.startMark.startTime} />
								</div>
							</div>

							{Object.keys(view.zones).map(expectedMeasureName => {
								const measure = view.measures.find(
									measure => measure.name === expectedMeasureName
								);

								const color = getZoneColor(expectedMeasureName);

								return (
									<React.Fragment key={expectedMeasureName}>
										<div
											key={expectedMeasureName}
											style={{
												border: `1px solid ${color}`,
												borderLeft: `5px solid ${color}`
											}}
											className="flex text--secondary margin--halfTop"
										>
											<div
												className="padding--halfLeft padding--halfRight"
												style={{
													whiteSpace: "nowrap"
												}}
											>
												{expectedMeasureName}
											</div>

											<div className="flex flex-item align--right">
												{measure && <DurationLabel time={measure.duration} />}
											</div>
										</div>
										{Zones[view.path][expectedMeasureName].map(expectedMarkName => {
											const mark = view.marks.find(
												mark => mark.name === expectedMarkName
											);
											return (
												<div
													key={expectedMarkName}
													className="flex text--secondary text-- padding--left"
												>
													<div
														className="flex flex-item"
														style={{
															whiteSpace: "nowrap"
														}}
													>
														{expectedMarkName}
													</div>

													<div className="flex flex-item align--right">
														{mark && (
															<TimeOffsetLabel
																time={mark.startTime}
																origin={view.startMark.startTime}
															/>
														)}
													</div>
												</div>
											);
										})}
									</React.Fragment>
								);
							})}
						</React.Fragment>
					))}
				</div>
			</div>
		</div>
	</div>
);

export default ZoneReport;
