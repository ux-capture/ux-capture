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

class TransitionManager extends React.Component {
	componentDidUpdate(prevProps) {
		if (prevProps.path !== this.props.path) {
			window.UXCapture.startTransition();

			this.props.onTransition(
				this.props.path,
				window.performance.getEntriesByName('transitionStart').pop()
			);
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

				const transitionStart =
					performance.getEntriesByName('transitionStart').pop() ||
					fakeNavigationStartMark;

				if (measure) {
					// in real world you might be sending this to your custom monitoring solution
					// (because it does not support W3C UserTiming API natively)
					this.setState(state => ({
						measures: [
							{ measure, transitionStart: transitionStart },
						].concat(state.measures),
					}));
				}
			},
			onMark: name => {
				const mark = performance
					.getEntriesByType('mark')
					.filter(entry => entry.name === name)
					.pop();

				const transitionStart =
					performance.getEntriesByName('transitionStart').pop() ||
					fakeNavigationStartMark;

				this.setState(state => ({
					marks: [{ mark, transitionStart: transitionStart }].concat(
						state.marks
					),
				}));
			},
		});

		// records in the Marks and Measures table
		this.state = {
			measures: [{ measure: { name: 'navigationStart', startTime: 0 } }],
			marks: [{ mark: { name: 'navigationStart', startTime: 0 } }],
		};
	}
	recordTransition(path, transitionMark) {
		this.setState(state => ({
			measures: [
				{
					measure: transitionMark,
					path,
					transitionStart: transitionMark,
				},
			].concat(state.measures),
			marks: [
				{ mark: transitionMark, path, transitionStart: transitionMark },
			].concat(state.marks),
		}));
	}
	componentWillUnmount() {
		window.UXCapture.destroy();
	}
	render() {
		const navClass = 'flex-item flex-item--shrink padding--all';

		return (
			<Router>
				<PerfContext.Provider value={this.state}>
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
												onTransition={(path, mark) => {
													this.recordTransition(path, mark);
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
											{this.state.marks.map(
												(
													{ mark, path, transitionStart },
													key
												) => (
													<div
														key={key}
														className="flex text--secondary text--small border--top border--bottom"
													>
														<div
															className="flex-item"
															style={
																mark.name ===
																	'transitionStart' ||
																mark.name ===
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
															{mark.name}{' '}
															{path && (
																<span>
																	(to {path})
																</span>
															)}
														</div>
														<div className="flex-item">
															<div
																key={key}
																className="flex text--secondary text--small border--top border--bottom"
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
																{mark.name !==
																	'transitionStart' &&
																mark.name !==
																	'navigationStart' ? (
																	<TimeLabel
																		time={
																			mark.startTime <
																			transitionStart.startTime
																				? 0
																				: Math.round(
																						(mark.startTime -
																							transitionStart.startTime) *
																							10
																				  ) /
																				  10
																		}
																		label="Moment in time measured from latest transition start icon"
																		emoji="⏳"
																	/>
																) : (
																	<div className="flex-item" />
																)}
															</div>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								</div>
							</div>
							<div
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
							</div>
						</div>
					</div>{' '}
				</PerfContext.Provider>
			</Router>
		);
	}
}

export default App;
