import React from 'react';

import UXCaptureImageLoad from '@meetup/react-ux-capture/lib/UXCaptureImageLoad';

import Inline from './marks/Inline';
import Page from './Page';

import MarkInfo from './marks/MarkInfo';

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
		<div className="chunk">
			<UXCaptureImageLoad
				mark="ux-image-onload-kitten250"
				src="http://placekitten.com/250/250"
				alt="kitten"
				width="250"
				height="250"
			/>
			<MarkInfo mark="ux-image-onload-kitten250" />
			<Inline mark="ux-image-inline-kitten250" />
		</div>
		<div className="chunk">
			<p>
				Primary content paragraph. All content in this view is loaded
				synchronously - the measures correspond to the client-side app
				rendering time
			</p>
			<Inline mark="ux-text-home-copy" />
		</div>
		<div className="chunk">
			<button>Primary action button</button>
			<Inline mark="ux-handler-home-button" />
		</div>
		<div className="chunk">
			<p>Secondary content paragraph</p>
			<Inline mark="ux-text-home-secondary" />
		</div>
	</Page>
);

export default Home;
