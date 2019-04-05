import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import UXCapture from '@meetup/ux-capture/src/UXCapture';
import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';

import Logo from './Logo';

import './App.css';

import Basic, { Zones as basicZones } from './views/Basic';
import Progressive, { Zones as progressiveZones } from './views/Progressive';
import Minimal, { Zones as minimalZones } from './views/Minimal';

import { getBoxStyle } from './reports/ZoneHelper';

import MarkLog from './reports/MarkLog';
import ZoneReport from './reports/ZoneReport';

export const Zones = {
	'/': basicZones,
	'/pro': progressiveZones,
	'/min': minimalZones,
};

const MOCK_NAVIGATION_START_MARK = { name: 'navigationStart', startTime: 0 };

/**
 * Component that manages navigation transitions by calling UXCapture.startTransition,
 * firing an optional callback, and logging activity. Non-rendering
 */
class TransitionManager extends React.Component {
	componentDidMount() {
		this.props.onRouteChange(this.props.path, MOCK_NAVIGATION_START_MARK);
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
						currentView: Object.assign(state.currentView, {
							measures: [measure].concat(state.currentView.measures),
						}),
					}));
				}
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
				<div className="flex flex--column atLarge_flex--row">
					<div className="flex flex-item flex--column">
						<div className="flex flex-item">
							<div
								className="flex-item valign-middle destinationVerified"
								style={{
									...getBoxStyle('ux-destination-verified'),
									paddingTop: 0,
								}}
							>
								<Logo />
								<UXCaptureInlineMark mark="ux-image-inline-logo" />
							</div>
							<b className={navClass}>UX Capture Example: React SPA</b>
							<Link className={navClass} to="/">
								Basic
							</Link>
							<Link className={navClass} to="/pro">
								Progressive
							</Link>
							<Link className={navClass} to="/min">
								Minimal
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
										<Route exact path="/" component={Basic} />
										<Route
											exact
											path="/pro"
											component={Progressive}
										/>
										<Route
											exact
											path="/min"
											component={Minimal}
										/>
									</div>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-item flex--column atLarge_flex--row">
						<MarkLog views={this.state.views} />

						<ZoneReport views={this.state.views} />
					</div>
				</div>
			</Router>
		);
	}
}

export default App;
