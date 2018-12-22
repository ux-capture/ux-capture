import React from 'react';
import UXCaptureImageLoad from 'mwp-app-render/lib/components/uxcapture/UXCaptureImageLoad';

import logo from './logo.svg';

export default () => {
	return (
		<UXCaptureImageLoad
			mark="ux-image-onload-script-logo"
			src={logo}
			alt="logo"
			height="44px"
		/>
	);
};
