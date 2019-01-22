import React from 'react';
import Inline from './marks/Inline';
import Page from './Page';

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
			<h1 className="text--pageTitle">Foo Title</h1>
			<Inline mark="ux-text-foo-title" />
		</div>
		<div className="chunk">
			<p>
				Primary content paragraph. All content in this view is loaded
				synchronously - the measures correspond to the client-side app
				rendering time
			</p>
			<Inline mark="ux-text-foo-primary" />
		</div>
		<div className="chunk">
			<button>Primary action button</button>
			<Inline mark="ux-button-foo-primary" />
		</div>
		<div className="chunk">
			<p>Secondary content paragraph</p>
			<Inline mark="ux-text-foo-secondary" />
		</div>
	</Page>
);

export default Foo;
