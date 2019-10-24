import React from 'react';

import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';
import UXCaptureInteractiveMark from '@meetup/react-ux-capture/lib/UXCaptureInteractiveMark';

import View from '../components/View';
import Lazy from '../components/Lazy';
import { getBoxStyle } from '../components/ZoneHelper';

import Layout from '../components/layout';

import { minimalZones, MINIMAL_TITLE, MINIMAL_LAZY } from '../components/Zones';

const Minimal = () => (
	<Layout>
		<View {...minimalZones}>
			<div className="chunk">
				<h1
					className="text--pageTitle"
					style={getBoxStyle('ux-destination-verified')}
				>
					Minimal View
				</h1>
				<UXCaptureInlineMark mark={MINIMAL_TITLE} />
			</div>
			<div className="chunk">
				This view only defines two zones and cuptures corresponding measures:{' '}
				<code>ux-destination-verified</code> and{' '}
				<code>ux-primary-content-displayed</code>.
			</div>
			<div className="chunk">
				Primary content in this view loads lazily below.
			</div>
			<div className="chunk">
				<Lazy delay={2000}>
					<UXCaptureInteractiveMark mark={MINIMAL_LAZY}>
						<div style={getBoxStyle('ux-primary-content-displayed')}>
							Primary content paragraph was loaded lazily in 2000ms
						</div>
					</UXCaptureInteractiveMark>
				</Lazy>
			</div>
		</View>
	</Layout>
);

export default Minimal;
