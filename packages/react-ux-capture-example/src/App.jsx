import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import UXCapture from '@meetup/ux-capture/src/UXCapture';
import Logo from './Logo';
import PerfContext from './marks/PerfContext';
import Home from './Home';
import Bar from './Bar';
import Foo from './Foo';
import './App.css';

/**
 * Component that manages navigation transitions by calling UXCapture.startTransition,
 * firing an optional callback, and logging activity. Non-rendering
 */
class TransitionManager extends React.Component {
	componentDidUpdate(prevProps) {
		if (prevProps.path !== this.props.path) {
			console.log('transition to', this.props.path);
			window.UXCapture.startTransition();

			this.props.onTransition(
				window.performance.getEntriesByName('transitionStart').pop()
			);
		}
	}
	render() {
		return null;
	}
}

/**
 * Root-level app container
 * - activate UXCapture and assign event callbacks
 * - keep track of all recorded `marks` and `measures` in component state
 * - pass `marks` and `measures` into `PerfContext`
 *
 * State: {
 *   measures: Array<PerformanceMeasure>, https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMeasure
 *   marks: Array<PerformanceMark>, https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMark
 * }
 */
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

				if (measure) {
					// new measure available - record it. In a real app, you might send this
					// info to an external logger/monitor
					this.setState(state => ({
						measures: [measure].concat(state.measures),
					}));
				}
			},
			onMark: name => {
				const mark = performance
					.getEntriesByType('mark')
					.filter(entry => entry.name === name)
					.pop();

				this.setState(state => ({ marks: [mark].concat(state.marks) }));
			},
		});
		this.state = { measures: [], marks: [] };
	}
	recordTransition(transitionMark) {
		this.setState(state => ({
			// measures: [transitionMark].concat(state.measures),
			marks: [transitionMark].concat(state.marks),
		}));
	}
	componentWillUnmount() {
		window.UXCapture.destroy();
	}
	render() {
		const menuLinkClass = 'flex-item flex-item--shrink padding--all';
		return (
			<Router>
				<PerfContext.Provider value={this.state}>
					<div className="flex flex-item">
						<div className="flex-item valign-middle">
							<Logo />
						</div>
						<Link className={menuLinkClass} to="/">
							Home
						</Link>
						<Link className={menuLinkClass} to="/foo">
							Foo
						</Link>
						<Link className={menuLinkClass} to="/bar">
							Bar
						</Link>
					</div>
					<div className="flex flex--column atLarge_flex--row">
						<div
							className="stripe inverted flex-item"
							style={{ backgroundColor: '#444', maxWidth: '480px' }}
						>
							<div className="section inverted">
								<div className="bounds chunk">
									<div className="chunk">
										<h3>Recent marks:</h3>
										{this.state.marks
											.slice(0, 8)
											.map((mark, key) => (
												<div
													key={key}
													className="flex text--secondary text--small border--top border--bottom"
												>
													<div
														className="flex-item"
														style={
															mark.name ===
															'transitionStart'
																? {
																		fontWeight:
																			'bold',
																		color:
																			'white',
																  }
																: {}
														}
													>
														{mark.name}
													</div>
													<div className="flex-item">
														<span
															role="img"
															aria-label="Moment in time icon"
														>
															🕒
														</span>{' '}
														{Math.round(
															mark.startTime * 10
														) / 10}
														ms
													</div>
												</div>
											))}
									</div>
									<div className="chunk">
										<h3>Recent measures:</h3>
										{this.state.measures
											.slice(0, 8)
											.map((measure, key) => (
												<div
													key={key}
													className="flex text--secondary text--small border--top border--bottom"
												>
													<div
														className="flex-item"
														style={
															measure.name ===
															'transitionStart'
																? {
																		fontWeight:
																			'bold',
																		color:
																			'white',
																  }
																: {}
														}
													>
														{measure.name}
													</div>
													{measure.name !==
														'transitionStart' && (
														<div
															className="flex-item"
															style={
																measure.duration < 0
																	? { color: 'red' }
																	: {}
															}
														>
															<span
																role="img"
																aria-label="Time duration icon"
															>
																⌛
															</span>{' '}
															{Math.round(
																measure.duration * 10
															) / 10}
															ms
														</div>
													)}
												</div>
											))}
									</div>
								</div>
							</div>
						</div>
						<Route
							children={({ location }) => (
								<div className="stripe flex-item">
									<TransitionManager
										path={location.pathname}
										onTransition={mark => {
											this.recordTransition(mark);
										}}
									/>
									<Route exact path="/" component={Home} />
									<Route exact path="/foo" component={Foo} />
									<Route exact path="/bar" component={Bar} />
								</div>
							)}
						/>
					</div>
				</PerfContext.Provider>
			</Router>
		);
	}
}

export default App;
