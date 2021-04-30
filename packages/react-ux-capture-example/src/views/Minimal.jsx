import React from 'react';

import UXCaptureInlineMark from '@ux-capture/react-ux-capture/lib/UXCaptureInlineMark';
import UXCaptureInteractiveMark from '@ux-capture/react-ux-capture/lib/UXCaptureInteractiveMark';

import View from './shared/View';
import Lazy from './shared/Lazy';
import { getBoxStyle } from '../reports/ZoneHelper';

const destinationVerified = [
	'ux-text-title',
	'ux-image-inline-logo',
	'ux-image-onload-logo',
];
const primaryContentDisplayed = ['ux-text-lazy'];

export const Zones = {
	'ux-destination-verified': destinationVerified,
	'ux-primary-content-displayed': primaryContentDisplayed,
};

const Minimal = () => (
	<View
		destinationVerified={destinationVerified}
		primaryContentDisplayed={primaryContentDisplayed}
	>
		<div className="chunk">
			<h1
				className="text--pageTitle"
				style={getBoxStyle('ux-destination-verified')}
			>
				Minimal View
			</h1>
			<UXCaptureInlineMark mark="ux-text-title" />
		</div>
		<div className="chunk">
			This view only defines two zones and cuptures corresponding measures:{' '}
			<code>ux-destination-verified</code> and{' '}
			<code>ux-primary-content-displayed</code>.
		</div>
		<div className="chunk">Primary content in this view loads lazily below.</div>
		<div className="chunk">
			<Lazy delay={2000}>
				<UXCaptureInteractiveMark mark={'ux-text-lazy'}>
					<div style={getBoxStyle('ux-primary-content-displayed')}>
						Primary content paragraph was loaded lazily in 2000ms
					</div>
				</UXCaptureInteractiveMark>
			</Lazy>
		</div>
	</View>
);

export default Minimal;
