import React from 'react';

import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';
import UXCaptureImageLoad from '@meetup/react-ux-capture/lib/UXCaptureImageLoad';
import UXCaptureInteractiveMark from '@meetup/react-ux-capture/lib/UXCaptureInteractiveMark';

import Page from './shared/Page';
import { getBoxStyle } from '../reports/ZoneHelper';
import Lazy from './shared/Lazy';

const destinationVerified = [
	'ux-text-foo-title',
	'ux-image-inline-logo',
	'ux-image-onload-logo',
];
const primaryContentDisplayed = ['ux-text-foo-primary'];
const secondaryContentDisplayed = [
	'ux-text-foo-secondary',
	'ux-image-inline-kitten',
	'ux-image-onload-kitten',
];
const primaryActionAvailable = ['ux-text-button', 'ux-handler-button'];

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
				Primary content paragraph. Click action for the button still takes
				time to attach and content for the rest of the view is lazy-loaded.
			</p>
			<UXCaptureInlineMark mark="ux-text-foo-primary" />
		</div>
		<div className="chunk">
			<Lazy
				delay={1000}
				fallback={
					<React.Fragment>
						<button
							className="button"
							disabled
							style={getBoxStyle('ux-primary-action-available')}
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
						style={getBoxStyle('ux-primary-action-available')}
						onClick={() => alert('Foo is the best!')}
					>
						Primary action button
					</button>
				</UXCaptureInteractiveMark>
			</Lazy>
		</div>
		<div className="chunk">
			<div style={getBoxStyle('ux-secondary-content-displayed')}>
				<Lazy
					delay={2000}
					fallback={
						<div
							style={{
								backgroundColor: '#F7F7F7',
								padding: '1em',
								color: 'silver',
							}}
						>
							Kitten is strolling lazily onto the screen ...
						</div>
					}
				>
					<UXCaptureInteractiveMark mark="ux-image-inline-kitten">
						<UXCaptureImageLoad
							mark="ux-image-onload-kitten"
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
				<p style={getBoxStyle('ux-secondary-content-displayed')}>
					<UXCaptureInteractiveMark mark="ux-text-foo-secondary">
						Secondary content paragraph
					</UXCaptureInteractiveMark>
				</p>
			</div>

			<div className="chunk">
				<p>
					The Restum ipsum dolor sit amet, consectetur adipiscing elit, sed
					do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
					enim ad minim veniam, quis nostrud exercitation ullamco laboris
					nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat
					nulla pariatur. Excepteur sint occaecat cupidatat non proident,
					sunt in culpa qui officia deserunt mollit anim id est laborum.
				</p>
			</div>
		</Lazy>
	</Page>
);

export default Foo;
