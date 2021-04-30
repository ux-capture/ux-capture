import React from "react";

import UXCaptureStartView from "@ux-capture/react-ux-capture/lib/UXCaptureStartView";

import UXCaptureImageLoad from "@ux-capture/react-ux-capture/lib/UXCaptureImageLoad";
import UXCaptureInlineMark from "@ux-capture/react-ux-capture/lib/UXCaptureInlineMark";
import UXCaptureInteractiveMark from "@ux-capture/react-ux-capture/lib/UXCaptureInteractiveMark";

import Lazy from "../components/Lazy";
import { getBoxStyle } from "../components/reports/ZoneHelper";

import Layout from "../components/layout";

import {
	basicZones,
	BASIC_KITTEN_INLINE,
	BASIC_KITTEN_ONLOAD,
	BASIC_PRIMARY_PARAGRAPH,
	BASIC_PRIMARY_BUTTON_DISPLAYED,
	BASIC_PRIMARY_BUTTON_INTERACTIVE,
	BASIC_SECONDARY_TEXT
} from "../ux-capture-zones";

const Basic = () => (
	<Layout>
		<UXCaptureStartView {...basicZones} />
		<div className="chunk" style={getBoxStyle("ux-primary-content-displayed")}>
			<UXCaptureImageLoad
				mark={BASIC_KITTEN_ONLOAD}
				src="http://placekitten.com/1250/1250"
				alt="kitten"
				width="250"
				height="250"
				style={{ backgroundColor: "blue", marginTop: "10px" }}
			/>
			<UXCaptureInlineMark mark={BASIC_KITTEN_INLINE} />
		</div>
		<div className="chunk">
			<div style={getBoxStyle("ux-primary-content-displayed")}>
				<p>Primary content paragraph.</p>{" "}
				<p>
					All content in this view is loaded synchronously, but click action for the
					button still takes time to attach.
				</p>
				<p>
					This view also has no title so transitioning here from another view immediately
					satisfies <code>ux-destination-verified</code> zone because logo is always
					there, recording a UserTiming with <code>0ms</code> duration.
				</p>
			</div>
			<UXCaptureInlineMark mark={BASIC_PRIMARY_PARAGRAPH} />
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
						<UXCaptureInlineMark mark={BASIC_PRIMARY_BUTTON_DISPLAYED} />
					</React.Fragment>
				}
			>
				<UXCaptureInteractiveMark mark={BASIC_PRIMARY_BUTTON_INTERACTIVE}>
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
			<UXCaptureInlineMark mark={BASIC_SECONDARY_TEXT} />
		</div>

		<div className="chunk">
			<p>
				The Restum ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
				nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
				aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
				nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
				officia deserunt mollit anim id est laborum.
			</p>
		</div>
	</Layout>
);

export default Basic;
