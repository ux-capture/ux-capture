import React, { Component } from 'react';
import Inline from './marks/Inline';
import Lazy from './Lazy';

import Page from './Page';

const destinationVerified = [
	'ux-text-bar-title',
	'ux-image-inline-logo',
	'ux-image-onload-logo',
];
const primaryContentDisplayed = ['ux-text-lazy'];
class Bar extends Component {
	render() {
		return (
			<Page
				destinationVerified={destinationVerified}
				primaryContentDisplayed={primaryContentDisplayed}
			>
				<div className="chunk">
					<h1 className="text--pageTitle">Bar Lazy Title</h1>
					<Inline mark="ux-text-bar-title" />
				</div>
				<div className="chunk">
					<Lazy mark="ux-text-lazy" delay={2000} />
				</div>
			</Page>
		);
	}
}

export default Bar;
