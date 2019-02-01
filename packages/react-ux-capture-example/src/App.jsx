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

import { MOCK_NAVIGATION_START_MARK } from './marks/MarkInfo';

import { Zones as homeZones } from './Home';
import { Zones as fooZones } from './Foo';
import { Zones as barZones } from './Bar';

import { getBoxStyle } from './ZoneHelper';

import MarkLog from './MarkLog';
import ZoneReport from './ZoneReport';

export const Zones = {
	'/': homeZones,
	'/foo': fooZones,
	'/bar': barZones,
};

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
									style={{
										...getBoxStyle('ux-destination-verified'),
										paddingTop: 0,
									}}
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
							<MarkLog views={this.state.views} />

							<ZoneReport views={this.state.views} />
						</div>
					</div>
				</PerfContext.Provider>
			</Router>
		);
	}
}

export default App;
