import React from 'react';
import UXCaptureImageLoad from '@meetup/react-ux-capture/lib/UXCaptureImageLoad';

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
