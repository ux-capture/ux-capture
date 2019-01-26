import React from 'react';
import Page from './Page';
import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';
import { getBoxStyle } from './ZoneHelper';

const destinationVerified = [
	'ux-text-foo-title',
	'ux-image-inline-logo',
	'ux-image-onload-logo',
];
const primaryContentDisplayed = ['ux-text-foo-primary'];
const secondaryContentDisplayed = ['ux-text-foo-secondary'];
const primaryActionAvailable = ['ux-button-foo-primary'];

export const Zones = {
	'ux-destination-verified': destinationVerified,
	'ux-primary-content-displayed': primaryContentDisplayed,
	'ux-primary-action-available': primaryActionAvailable,
	'ux-secondary-content-displayed': secondaryContentDisplayed,
};

const Foo = () => (
	<Page
		destinationVerified={destinationVerified}
		primaryContentDisplayed={primaryContentDisplayed}
		secondaryContentDisplayed={secondaryContentDisplayed}
		primaryActionAvailable={primaryActionAvailable}
	>
		<div className="chunk">
			<h1
				className="text--pageTitle"
				style={getBoxStyle('ux-destination-verified')}
			>
				Foo Title
			</h1>
			<UXCaptureInlineMark mark="ux-text-foo-title" />
		</div>
		<div className="chunk">
			<p style={getBoxStyle('ux-primary-content-displayed')}>
				Primary content paragraph. All content in this view is loaded
				synchronously - the measures correspond to the client-side app
				rendering time
			</p>
			<UXCaptureInlineMark mark="ux-text-foo-primary" />
		</div>
		<div className="chunk">
			<button
				className="button"
				style={getBoxStyle('ux-primary-action-available')}
			>
				Primary action button
			</button>
			<UXCaptureInlineMark mark="ux-button-foo-primary" />
		</div>
		<div className="chunk">
			<p style={getBoxStyle('ux-secondary-content-displayed')}>
				Secondary content paragraph
			</p>
			<UXCaptureInlineMark mark="ux-text-foo-secondary" />
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

export default Foo;
