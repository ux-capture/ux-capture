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

import TimeLabel from './TimeLabel';

import { fakeNavigationStartMark } from './marks/MarkInfo';

import { Zones as homeZones } from './Home';
import { Zones as fooZones } from './Foo';
import { Zones as barZones } from './Bar';

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
			// onMeasure: name => {
			// 	// there can be multiple entries with the same name, get the latest
			// 	const measure = performance
			// 		.getEntriesByType('measure')
			// 		.filter(entry => entry.name === name)
			// 		.pop();

			// 	const transitionStart =
			// 		performance.getEntriesByName('transitionStart').pop() ||
			// 		fakeNavigationStartMark;

			// 	if (measure) {
			// 		// in real world you might be sending this to your custom monitoring solution
			// 		// (because it does not support W3C UserTiming API natively)
			// 		this.setState(state => ({
			// 			measures: [
			// 				{ measure, transitionStart: transitionStart },
			// 			].concat(state.measures),
			// 		}));
			// 	}
			// },
			onMark: name => {
				const mark = performance
					.getEntriesByType('mark')
					.filter(entry => entry.name === name)
					.pop();

				this.setState(state => ({
					currentView: Object.assign(state.currentView, {
						marks: [{ mark }].concat(state.currentView.marks),
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
								<div className="flex-item valign-middle">
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
								style={{ backgroundColor: '#444' }}
							>
								<div className="flex-item section inverted">
									<div className="bounds chunk">
										<div className="chunk">
											<h3>Marks:</h3>
											{this.state.views.map(view => [
												view.marks.map(
													(
														{
															mark,
															path,
															transitionStart,
														},
														key
													) => (
														<div
															key={key}
															className="flex text--secondary text--small border--top border--bottom"
														>
															<div
																className="flex-item"
																style={{
																	whiteSpace:
																		'nowrap',
																}}
															>
																{mark.name}{' '}
																{path && (
																	<span>
																		&rarr; {path}
																	</span>
																)}
															</div>
															<div className="flex-item">
																<div
																	key={key}
																	className="flex text--secondary text--small"
																>
																	<TimeLabel
																		time={
																			Math.round(
																				mark.startTime *
																					10
																			) / 10
																		}
																		label="Moment in time icon"
																		emoji="🕒"
																	/>
																	<TimeLabel
																		time={
																			mark.startTime <
																			view
																				.startMark
																				.startTime
																				? 0
																				: Math.round(
																						(mark.startTime -
																							view
																								.startMark
																								.startTime) *
																							10
																				  ) /
																				  10
																		}
																		label="Moment in time measured from latest transition start icon"
																		emoji="⏳"
																	/>
																</div>
															</div>
														</div>
													)
												),
												<div className="flex text--secondary text--small border--top border--bottom">
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
															<TimeLabel
																time={
																	Math.round(
																		view.startMark
																			.startTime *
																			10
																	) / 10
																}
																label="Moment in time icon"
																emoji="🕒"
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
							{/* <div
								className="flex  flex-item  "
								style={{ backgroundColor: '#444' }}
							>
								<div className="flex-item section inverted">
									<div className="bounds chunk">
										<div className="chunk">
											<h3>Measures:</h3>
											{this.state.measures.map(
												({ measure, path }, key) => (
													<div
														key={key}
														className="flex text--secondary text--small border--top border--bottom"
													>
														<div
															className="flex-item"
															style={
																measure.name ===
																	'transitionStart' ||
																measure.name ===
																	'navigationStart'
																	? {
																			fontWeight:
																				'bold',
																			color:
																				'white',
																	  }
																	: {}
															}
														>
															{measure.name}{' '}
															{path && (
																<span>
																	(to {path})
																</span>
															)}
														</div>
														{measure.name !==
															'transitionStart' &&
															measure.name !==
																'navigationStart' && (
																<TimeLabel
																	time={
																		Math.round(
																			measure.duration *
																				10
																		) / 10
																	}
																	label="Time duration icon"
																	emoji="⌛"
																/>
															)}
													</div>
												)
											)}
										</div>
									</div>
								</div>
							</div> */}
							<div
								className="flex flex-item inverted"
								style={{ backgroundColor: '#444' }}
							>
								<div className="flex-item section inverted">
									<div className="bounds chunk">
										<div className="chunk">
											<h3>Views, Zones &amp; Measures:</h3>

											{this.state.views.map(view => [
												<div className="flex text--secondary text--small border--top border--bottom">
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

													<div className="flex flex-item align--right">
														<TimeLabel
															time={
																Math.round(
																	view.startMark
																		.startTime *
																		10
																) / 10
															}
															label="Time duration icon"
															emoji="⌛"
														/>
													</div>
												</div>,

												Object.keys(view.zones).map(
													measure => [
														<div
															key={measure}
															className="flex text--secondary text--small border--top border--bottom padding--halfLeft"
														>
															<div
																className="flex flex-item"
																style={{
																	whiteSpace:
																		'nowrap',
																}}
															>
																{measure}
															</div>

															<div className="flex flex-item align--right">
																{/* <TimeLabel
																	time={
																		Math.round(
																			view
																				.startMark
																				.startTime *
																				10
																		) / 10
																	}
																	label="Time duration icon"
																	emoji="⌛"
																/> */}
															</div>
														</div>,
														Zones[view.path][measure].map(
															mark => (
																<div
																	key={mark}
																	className="flex text--secondary text--small border--top border--bottom padding--left"
																>
																	<div
																		className="flex flex-item"
																		style={{
																			whiteSpace:
																				'nowrap',
																		}}
																	>
																		{mark}
																	</div>

																	<div className="flex flex-item align--right">
																		{/* <TimeLabel
																			time={
																				Math.round(
																					view
																						.startMark
																						.startTime *
																						10
																				) / 10
																			}
																			label="Time duration icon"
																			emoji="⌛"
																		/> */}
																	</div>
																</div>
															)
														),
													]
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
