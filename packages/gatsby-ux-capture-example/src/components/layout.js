import React from "react";

import UXCaptureInlineMark from "@meetup/react-ux-capture/lib/UXCaptureInlineMark";
import UXCaptureCreate from "@meetup/react-ux-capture/lib/UXCaptureCreate";

import { Link } from "gatsby";

import MarkLog from "./reports/MarkLog";
import ZoneReport from "./reports/ZoneReport";

import { getBoxStyle } from "./reports/ZoneHelper";

import "./layout.css";

import Logo from "./Logo";

import Zones from "../Zones";

class Layout extends React.Component {
	constructor(props) {
		super(props);

		// records in the Marks and Measures table
		this.state = {
			views: [],
			currentView: null,
			latestStartMark: null
		};
	}

	onMeasure(name) {
		console.log(name);

		// there can be multiple entries with the same name, get the latest
		const measure = performance
			.getEntriesByType("measure")
			.filter(entry => entry.name === name)
			.pop();

		if (measure) {
			// new measure available - record it. In a real app, you might send this
			// info to an external logger/monitor
			this.setState(state => ({
				currentView: Object.assign(state.currentView, {
					measures: [measure].concat(state.currentView.measures)
				})
			}));
		}
	}

	onMark(name) {
		console.log(name);

		const mark = performance
			.getEntriesByType("mark")
			.filter(entry => entry.name === name)
			.pop();

		this.setState(state => ({
			currentView: Object.assign(state.currentView, {
				marks: [mark].concat(state.currentView.marks)
			})
		}));
	}

	recordRouteChange(path, startMark) {
		const newViewRecord = {
			path,
			startMark,
			zones: Zones[path],
			marks: [],
			measures: []
		};

		this.setState(state => ({
			views: [newViewRecord].concat(state.views),
			currentView: newViewRecord,
			latestStartMark: startMark
		}));
	}

	componentWillUnmount() {
		// window.UXCapture.destroy();
	}

	render() {
		let { children } = this.props;

		const navClass = "flex-item flex-item--shrink padding--all";

		return (
			<div className="flex flex--column atLarge_flex--row">
				<UXCaptureCreate onMeasure={this.onMeasure} onMark={this.onMark} />

				<div className="flex flex-item flex--column">
					<div className="flex flex-item">
						<div
							className="flex-item valign-middle destinationVerified"
							style={{
								...getBoxStyle("ux-destination-verified"),
								paddingTop: 0
							}}
						>
							<Logo />
							<UXCaptureInlineMark mark="ux-image-inline-logo" />
						</div>
						<b className={navClass}>UX Capture Example: React SPA</b>
						<Link className={navClass} to="/">
							Basic
						</Link>
						<Link className={navClass} to="/progressive">
							Progressive
						</Link>
						<Link className={navClass} to="/minimal">
							Minimal
						</Link>
					</div>
					<div className="flex flex-item">{children}</div>
				</div>
				<div className="flex flex-item flex--column atLarge_flex--row">
					<MarkLog views={this.state.views} />

					<ZoneReport views={this.state.views} />
				</div>
			</div>
		);
	}
}
export default Layout;
