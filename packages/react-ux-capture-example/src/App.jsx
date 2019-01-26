import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import UXCapture from '@meetup/ux-capture/src/UXCapture';
import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';

import Logo from './Logo';
import PerfContext from './marks/PerfContext';
import Home from './Home';
import Bar from './Bar';
import Foo from './Foo';
import './App.css';

import MomentInTimeLabel from './MomentInTimeLabel';
import TimeOriginLabel from './TimeOriginLabel';
import TimeOffsetLabel from './TimeOffsetLabel';
import DurationLabel from './DurationLabel';

import { fakeNavigationStartMark } from './marks/MarkInfo';

import { Zones as homeZones } from './Home';
import { Zones as fooZones } from './Foo';
import { Zones as barZones } from './Bar';
import { getZoneColor, getBoxStyle } from './ZoneHelper';

const Zones = {
	'/': homeZones,
	'/foo': fooZones,
	'/bar': barZones,
};

class TransitionManager extends React.Component {
	componentDidMount() {
		this.props.onRouteChange(this.props.path, fakeNavigationStartMark);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.path !== this.props.path) {
			window.UXCapture.startTransition();

			const transitionStart = window.performance
				.getEntriesByName('transitionStart')
				.pop();

			this.props.onRouteChange(this.props.path, transitionStart);
		}
	}
	render() {
		return null;
	}
}
class App extends Component {
	constructor(props) {
		super(props);
		window.UXCapture = UXCapture;
		window.UXCapture.create({
			onMeasure: name => {
				// there can be multiple entries with the same name, get the latest
				const measure = performance
					.getEntriesByType('measure')
					.filter(entry => entry.name === name)
					.pop();

				this.setState(state => ({
					currentView: Object.assign(state.currentView, {
						measures: [measure].concat(state.currentView.measures),
					}),
				}));
			},
			onMark: name => {
				const mark = performance
					.getEntriesByType('mark')
					.filter(entry => entry.name === name)
					.pop();

				this.setState(state => ({
					currentView: Object.assign(state.currentView, {
						marks: [mark].concat(state.currentView.marks),
					}),
				}));
			},
		});

		// records in the Marks and Measures table
		this.state = {
			views: [],
			currentView: null,
			latestStartMark: null,
		};
	}
	recordRouteChange(path, startMark) {
		const newViewRecord = {
			path,
			startMark,
			zones: Zones[path],
			marks: [],
			measures: [],
		};

		this.setState(state => ({
			views: [newViewRecord].concat(state.views),
			currentView: newViewRecord,
			latestStartMark: startMark,
		}));
	}
	componentWillUnmount() {
		window.UXCapture.destroy();
	}
	render() {
		const navClass = 'flex-item flex-item--shrink padding--all';

		return (
			<Router>
				<PerfContext.Provider value={this.state.currentView}>
					<div className="flex flex--column atLarge_flex--row">
						<div className="flex flex-item flex--column">
							<div className="flex flex-item">
								<div
									className="flex-item valign-middle destinationVerified"
									style={getBoxStyle('ux-destination-verified')}
								>
									<Logo />
									<UXCaptureInlineMark mark="ux-image-inline-logo" />
								</div>
								<b className={navClass}>
									UX Capture Example: React SPA
								</b>
								<Link className={navClass} to="/">
									Home
								</Link>
								<Link className={navClass} to="/foo">
									Foo
								</Link>
								<Link className={navClass} to="/bar">
									Bar
								</Link>
							</div>
							<div className="flex flex-item">
								<Route
									children={({ location }) => (
										<div className="stripe flex-item">
											<TransitionManager
												path={location.pathname}
												onRouteChange={(path, startMark) => {
													this.recordRouteChange(
														path,
														startMark
													);
												}}
											/>
											<Route exact path="/" component={Home} />
											<Route
												exact
												path="/foo"
												component={Foo}
											/>
											<Route
												exact
												path="/bar"
												component={Bar}
											/>
										</div>
									)}
								/>
							</div>
						</div>
						<div className="flex flex-item flex--column atLarge_flex--row">
							<div
								className="flex flex-item"
								style={{ backgroundColor: '#555' }}
							>
								<div className="flex-item section inverted">
									<div key="tab1" className="bounds chunk">
										<div className="chunk">
											<div key="tab1" className="flex">
												<div className="flex-item">
													<h3>Marks</h3>
												</div>
											</div>
											<div className="flex">
												<div className="flex-item" />
												<div className="flex-item">
													<div className="flex text--secondary text--small">
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
											{this.state.views.map(view => [
												view.marks.map((mark, key) => (
													<div
														key={key}
														className="flex text--secondary text--small border--top"
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
															<div
																key={key}
																className="flex text--secondary text--small"
															>
																<MomentInTimeLabel
																	time={
																		mark.startTime
																	}
																/>
																<TimeOffsetLabel
																	time={
																		mark.startTime
																	}
																	origin={
																		view.startMark
																			.startTime
																	}
																/>
															</div>
														</div>
													</div>
												)),
												<div className="flex text--secondary text--small border--top">
													<div
														className="flex flex-item"
														style={{
															fontWeight: 'bold',
															color: 'white',
															whiteSpace: 'nowrap',
														}}
													>
														{view.startMark.name} &rarr;{' '}
														{view.path}
													</div>
													<div className="flex  flex-item">
														<div className="flex flex-item">
															<TimeOriginLabel
																time={
																	view.startMark
																		.startTime
																}
															/>
														</div>
														<div className="flex flex-item" />
													</div>
												</div>,
											])}
										</div>
									</div>
								</div>
							</div>

							<div
								className="flex flex-item inverted"
								style={{ backgroundColor: '#444' }}
							>
								<div className="flex-item section inverted">
									<div className="bounds chunk">
										<div className="chunk">
											<h3 className="margin--bottom">
												Current View
											</h3>

											{this.state.views
												.slice(0, 1)
												.map(view => [
													<div className="flex text--secondary text--small margin--top">
														<div
															className="flex flex-item"
															style={{
																fontWeight: 'bold',
																color: 'white',
																whiteSpace: 'nowrap',
															}}
														>
															{view.startMark.name}{' '}
															&rarr; {view.path}
														</div>

														<div className="flex flex-item align--right">
															<TimeOriginLabel
																time={
																	view.startMark
																		.startTime
																}
															/>
														</div>
													</div>,

													Object.keys(view.zones).map(
														expectedMeasureName => {
															const measure = view.measures.find(
																measure =>
																	measure.name ===
																	expectedMeasureName
															);

															const color = getZoneColor(
																expectedMeasureName
															);

															return [
																<div
																	key={
																		expectedMeasureName
																	}
																	className="flex text--secondary text--small border--top margin--halfTop padding--halfTop"
																>
																	<div
																		className="padding--halfLeft padding--halfRight"
																		style={{
																			whiteSpace:
																				'nowrap',
																			border: `1px solid ${color}`,
																			borderLeft: `5px solid ${color}`,
																		}}
																	>
																		{
																			expectedMeasureName
																		}
																	</div>

																	<div className="flex flex-item align--right">
																		{measure && (
																			<DurationLabel
																				time={
																					measure.duration
																				}
																			/>
																		)}
																	</div>
																</div>,
																Zones[view.path][
																	expectedMeasureName
																].map(
																	expectedMarkName => {
																		const mark = view.marks.find(
																			mark =>
																				mark.name ===
																				expectedMarkName
																		);
																		return (
																			<div
																				key={
																					expectedMarkName
																				}
																				className="flex text--secondary text--small padding--left"
																			>
																				<div
																					className="flex flex-item"
																					style={{
																						whiteSpace:
																							'nowrap',
																					}}
																				>
																					{
																						expectedMarkName
																					}
																				</div>

																				<div className="flex flex-item align--right">
																					{mark && (
																						<TimeOffsetLabel
																							time={
																								mark.startTime
																							}
																							origin={
																								view
																									.startMark
																									.startTime
																							}
																						/>
																					)}
																				</div>
																			</div>
																		);
																	}
																),
															];
														}
													),
												])}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</PerfContext.Provider>
			</Router>
		);
	}
}

export default App;
