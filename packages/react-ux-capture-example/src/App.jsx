import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import UXCapture from '@meetup/ux-capture/src/UXCapture';
import Logo from './Logo';
import PerfContext from './marks/PerfContext';
import Home from './Home';
import Bar from './Bar';
import Foo from './Foo';
import './App.css';

const fakeNavigationStartMark = { startTime: 0 };

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
	recordTransition(transitionMark) {
		this.setState(state => ({
			measures: [
				{
					measure: transitionMark,
					transitionStart: transitionMark,
				},
			].concat(state.measures),
			marks: [{ mark: transitionMark, transitionStart: transitionMark }].concat(
				state.marks
			),
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
						<div
							className="stripe inverted flex-item"
							style={{ backgroundColor: '#444', maxWidth: '480px' }}
						>
							<div className="section inverted">
								<div className="bounds chunk">
									<div className="chunk">
										<h3>Marks:</h3>
										{this.state.marks.map(
											({ mark, transitionStart }, key) => (
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
														ms{' '}
														{mark.name !==
															'transitionStart' &&
															mark.name !==
																'navigationStart' && (
																<span>
																	=>
																	<span
																		role="img"
																		aria-label="Moment in time measured from latest transition start"
																	>
																		⏳
																	</span>
																	{mark.startTime <
																	transitionStart.startTime
																		? 0
																		: Math.round(
																				(mark.startTime -
																					transitionStart.startTime) *
																					10
																		  ) / 10}
																	ms
																</span>
															)}
													</div>
												</div>
											)
										)}
									</div>
								</div>
							</div>
						</div>
						<div
							className="stripe inverted flex-item"
							style={{ backgroundColor: '#444', maxWidth: '480px' }}
						>
							<div className="section inverted">
								<div className="bounds chunk">
									<div className="chunk">
										<h3>Measures:</h3>
										{this.state.measures.map((record, key) => (
											<div
												key={key}
												className="flex text--secondary text--small border--top border--bottom"
											>
												<div
													className="flex-item"
													style={
														record.measure.name ===
															'transitionStart' ||
														record.measure.name ===
															'navigationStart'
															? {
																	fontWeight:
																		'bold',
																	color: 'white',
															  }
															: {}
													}
												>
													{record.measure.name}
												</div>
												{record.measure.name !==
													'transitionStart' &&
													record.measure.name !==
														'navigationStart' && (
														<div
															className="flex-item"
															style={
																record.measure
																	.duration < 0
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
																record.measure
																	.duration * 10
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
					</div>
				</PerfContext.Provider>
			</Router>
		);
	}
}

export default App;
