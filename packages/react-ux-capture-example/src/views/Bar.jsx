import React, { Component } from 'react';

import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';
import UXCaptureInteractiveMark from '@meetup/react-ux-capture/lib/UXCaptureInteractiveMark';

import Lazy from './shared/Lazy';
import Page from './shared/Page';
import { getBoxStyle } from '../reports/ZoneHelper';

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
						Lazy Bar Title
					</h1>
					<UXCaptureInlineMark mark="ux-text-bar-title" />
				</div>
				<div className="chunk">
					This view only defines two zones and cuptures corresponding
					measures: <code>ux-destination-verified</code> and{' '}
					<code>ux-primary-content-displayed</code>.
				</div>
				<div className="chunk">
					Primary content in this view loads lazily below.
				</div>
				<div className="chunk">
					<Lazy delay={2000}>
						<UXCaptureInteractiveMark mark={'ux-text-lazy'}>
							<div style={getBoxStyle('ux-primary-content-displayed')}>
								Primary content paragraph was loaded lazily in 2000ms
							</div>
						</UXCaptureInteractiveMark>
					</Lazy>
				</div>
			</Page>
		);
	}
}

export default Bar;
