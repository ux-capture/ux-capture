import React from "react";

import UXCaptureStartView from "@meetup/react-ux-capture/lib/UXCaptureStartView";

import UXCaptureInlineMark from "@meetup/react-ux-capture/lib/UXCaptureInlineMark";
import UXCaptureImageLoad from "@meetup/react-ux-capture/lib/UXCaptureImageLoad";
import UXCaptureInteractiveMark from "@meetup/react-ux-capture/lib/UXCaptureInteractiveMark";

import Lazy from "../components/Lazy";
import { getBoxStyle } from "../components/reports/ZoneHelper";

import Layout from "../components/layout";

import {
	progressiveZones,
	PROGRESSIVE_TITLE,
	PROGRESSIVE_PRIMARY_PARAGRAPH,
	PROGRESSIVE_SECONDARY_TEXT,
	PROGRESSIVE_KITTEN_INLINE,
	PROGRESSIVE_KITTEN_ONLOAD,
	PROGRESSIVE_PRIMARY_BUTTON_DISPLAYED,
	PROGRESSIVE_PRIMARY_BUTTON_INTERACTIVE
} from "../ux-capture-zones";

const Progressive = () => (
	<Layout>
		<UXCaptureStartView {...progressiveZones} />

		<div className="chunk">
			<h1 className="text--pageTitle" style={getBoxStyle("ux-destination-verified")}>
				Progressive View
			</h1>
			<UXCaptureInlineMark mark={PROGRESSIVE_TITLE} />
		</div>
		<div className="chunk">
			<div style={getBoxStyle("ux-primary-content-displayed")}>
				<p>Primary content paragraph.</p>
				<p>
					This view uses progressive enhancement, lazy-loading all but primary content.
				</p>
				<p>Click action for the button also takes time to attach.</p>
			</div>
			<UXCaptureInlineMark mark={PROGRESSIVE_PRIMARY_PARAGRAPH} />
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
						<UXCaptureInlineMark mark={PROGRESSIVE_PRIMARY_BUTTON_DISPLAYED} />
					</React.Fragment>
				}
			>
				<UXCaptureInteractiveMark mark={PROGRESSIVE_PRIMARY_BUTTON_INTERACTIVE}>
					<button
						className="button"
						style={getBoxStyle("ux-primary-action-available")}
						onClick={() => alert("Progressive enhancement is the best!")}
					>
						Primary action button
					</button>
				</UXCaptureInteractiveMark>
			</Lazy>
		</div>
		<div className="chunk">
			<div style={getBoxStyle("ux-secondary-content-displayed")}>
				<Lazy
					delay={2000}
					fallback={
						<div
							style={{
								backgroundColor: "#F7F7F7",
								padding: "1em",
								color: "silver"
							}}
						>
							Kitten is strolling lazily onto the screen ...
						</div>
					}
				>
					<UXCaptureInteractiveMark mark={PROGRESSIVE_KITTEN_INLINE}>
						<UXCaptureImageLoad
							mark={PROGRESSIVE_KITTEN_ONLOAD}
							src="http://placekitten.com/1400/600"
							alt="kitten"
							width="100%"
						/>
					</UXCaptureInteractiveMark>
				</Lazy>
			</div>
		</div>

		<Lazy delay={1500}>
			<div className="chunk">
				<p style={getBoxStyle("ux-secondary-content-displayed")}>
					<UXCaptureInteractiveMark mark={PROGRESSIVE_SECONDARY_TEXT}>
						Secondary content paragraph
					</UXCaptureInteractiveMark>
				</p>
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
		</Lazy>
	</Layout>
);

export default Progressive;
