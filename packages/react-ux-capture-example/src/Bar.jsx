import React, { Component } from 'react';
import Lazy from './Lazy';

import Page from './Page';
import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';
import { getBoxStyle } from './ZoneHelper';

const destinationVerified = [
	'ux-text-bar-title',
	'ux-image-inline-logo',
	'ux-image-onload-logo',
];
const primaryContentDisplayed = ['ux-text-lazy'];

export const Zones = {
	'ux-destination-verified': destinationVerified,
	'ux-primary-content-displayed': primaryContentDisplayed,
};

class Bar extends Component {
	render() {
		return (
			<Page
				destinationVerified={destinationVerified}
				primaryContentDisplayed={primaryContentDisplayed}
			>
				<div className="chunk">
					<h1
						className="text--pageTitle"
						style={getBoxStyle('ux-destination-verified')}
					>
						Bar Lazy Title
					</h1>
					<UXCaptureInlineMark mark="ux-text-bar-title" />
				</div>
				<div className="chunk">
					<Lazy
						mark="ux-text-lazy"
						zone="ux-primary-content-displayed"
						delay={2000}
					/>
				</div>
			</Page>
		);
	}
}

export default Bar;
