import React from 'react';

import UXCaptureImageLoad from '@meetup/react-ux-capture/lib/UXCaptureImageLoad';

import Page from './Page';

// import MarkInfo from './marks/MarkInfo';
import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';
import { getBoxStyle } from './ZoneHelper';

const destinationVerified = ['ux-image-inline-logo', 'ux-image-onload-logo'];
const primaryContentDisplayed = [
	'ux-text-home-copy',
	'ux-image-inline-kitten250',
	'ux-image-onload-kitten250',
];
const primaryActionAvailable = ['ux-handler-home-button'];
const secondaryContentDisplayed = ['ux-text-home-secondary'];

export const Zones = {
	'ux-destination-verified': destinationVerified,
	'ux-primary-content-displayed': primaryContentDisplayed,
	'ux-primary-action-available': primaryActionAvailable,
	'ux-secondary-content-displayed': secondaryContentDisplayed,
};

const Home = () => (
	<Page
		destinationVerified={destinationVerified}
		primaryContentDisplayed={primaryContentDisplayed}
		secondaryContentDisplayed={secondaryContentDisplayed}
		primaryActionAvailable={primaryActionAvailable}
	>
		<div className="chunk" style={getBoxStyle('ux-primary-content-displayed')}>
			<UXCaptureImageLoad
				mark="ux-image-onload-kitten250"
				src="http://placekitten.com/1250/1250"
				alt="kitten"
				width="250"
				height="250"
			/>
			{/* <MarkInfo mark="ux-image-onload-kitten250" /> */}
			<UXCaptureInlineMark mark="ux-image-inline-kitten250" />
		</div>
		<div className="chunk">
			<p style={getBoxStyle('ux-primary-content-displayed')}>
				Primary content paragraph. All content in this view is loaded
				synchronously - the measures correspond to the client-side app
				rendering time
			</p>
			<UXCaptureInlineMark mark="ux-text-home-copy" />
		</div>
		<div className="chunk">
			<button
				className="button"
				style={getBoxStyle('ux-primary-action-available')}
			>
				Primary action button
			</button>
			<UXCaptureInlineMark mark="ux-handler-home-button" />
		</div>
		<div className="chunk">
			<p style={getBoxStyle('ux-secondary-content-displayed')}>
				Secondary content paragraph
			</p>
			<UXCaptureInlineMark mark="ux-text-home-secondary" />
		</div>

		<div className="chunk">
			<p>
				The Restum ipsum dolor sit amet, consectetur adipiscing elit, sed do
				eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
				minim veniam, quis nostrud exercitation ullamco laboris nisi ut
				aliquip ex ea commodo consequat. Duis aute irure dolor in
				reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
				pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
				culpa qui officia deserunt mollit anim id est laborum.
			</p>
		</div>
	</Page>
);

export default Home;
