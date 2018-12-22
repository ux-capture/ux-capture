import React from 'react';

import Inline from './marks/Inline';
import Page from './Page';

const destinationVerified = [
	'ux-text-home-title',
	'ux-image-onload-script-logo',
];
const primaryContentDisplayed = ['ux-text-home-primary'];
const secondaryContentDisplayed = ['ux-text-home-secondary'];
const primaryActionAvailable = ['ux-button-home-primary'];
const Home = () => (
	<Page
		destinationVerified={destinationVerified}
		primaryContentDisplayed={primaryContentDisplayed}
		secondaryContentDisplayed={secondaryContentDisplayed}
		primaryActionAvailable={primaryActionAvailable}
	>
		<div className="chunk">
			<h1 className="text--pageTitle">Home Title</h1>
			<Inline mark="ux-text-home-title" />
		</div>
		<div className="chunk">
			<p>
				Primary content paragraph. All content in this view is loaded
				synchronously - the measures correspond to the client-side app rendering
				time
			</p>
			<Inline mark="ux-text-home-primary" />
		</div>
		<div className="chunk">
			<button>Primary action button</button>
			<Inline mark="ux-button-home-primary" />
		</div>
		<div className="chunk">
			<p>Secondary content paragraph</p>
			<Inline mark="ux-text-home-secondary" />
		</div>
	</Page>
);

export default Home;
