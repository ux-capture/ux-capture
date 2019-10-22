import React from "react";

import UXCaptureInlineMark from "@meetup/react-ux-capture/lib/UXCaptureInlineMark";

import { Link } from "gatsby";

import { getBoxStyle } from "./reports/ZoneHelper";

import "./layout.css";

import Logo from "./Logo";

class Layout extends React.Component {
	render() {
		let { children } = this.props;

		const navClass = "flex-item flex-item--shrink padding--all";

		return (
			<div className="flex flex--column atLarge_flex--row">
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
			</div>
		);
	}
}
export default Layout;
