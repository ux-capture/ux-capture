import React from "react";

import UXCaptureImageLoad from "@meetup/react-ux-capture/lib/UXCaptureImageLoad";
import UXCaptureInlineMark from "@meetup/react-ux-capture/lib/UXCaptureInlineMark";
import UXCaptureInteractiveMark from "@meetup/react-ux-capture/lib/UXCaptureInteractiveMark";

import View from "../components/View";
import Lazy from "../components/Lazy";
import { getBoxStyle } from "../components/reports/ZoneHelper";

import Layout from "../components/layout";

import { basicZones } from "../Zones";

const Basic = () => (
	<Layout>
		<View {...basicZones}>
			<div className="chunk" style={getBoxStyle("ux-primary-content-displayed")}>
				<UXCaptureImageLoad
					mark="ux-image-onload-kitten"
					src="http://placekitten.com/1250/1250"
					alt="kitten"
					width="250"
					height="250"
					style={{ backgroundColor: "blue", marginTop: "10px" }}
				/>
				<UXCaptureInlineMark mark="ux-image-inline-kitten" />
			</div>
			<div className="chunk">
				<div style={getBoxStyle("ux-primary-content-displayed")}>
					<p>Primary content paragraph.</p>{" "}
					<p>
						All content in this view is loaded synchronously, but click action for the
						button still takes time to attach.
					</p>
					<p>
						This view also has no title so transitioning here from another view
						immediately satisfies <code>ux-destination-verified</code> zone because logo
						is always there, recording a UserTiming with <code>0ms</code> duration.
					</p>
				</div>
				<UXCaptureInlineMark mark="ux-text-primary" />
			</div>
			<div className="chunk">
				<Lazy
					delay={1000}
					fallback={
						<React.Fragment>
							<button
								className="button"
								disabled
								style={getBoxStyle("ux-primary-action-available")}
							>
								Primary action button
							</button>
							<UXCaptureInlineMark mark="ux-text-button" />
						</React.Fragment>
					}
				>
					<UXCaptureInteractiveMark mark="ux-handler-button">
						<button
							className="button"
							style={getBoxStyle("ux-primary-action-available")}
							onClick={() =>
								alert("Views with synchronously loaded content are the most common")
							}
						>
							Primary action button
						</button>
					</UXCaptureInteractiveMark>
				</Lazy>
			</div>
			<div className="chunk">
				<p style={getBoxStyle("ux-secondary-content-displayed")}>
					Secondary content paragraph
				</p>
				<UXCaptureInlineMark mark="ux-text-secondary" />
			</div>

			<div className="chunk">
				<p>
					The Restum ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
					tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
					quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
					consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
					dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
					sunt in culpa qui officia deserunt mollit anim id est laborum.
				</p>
			</div>
		</View>
	</Layout>
);

export default Basic;
