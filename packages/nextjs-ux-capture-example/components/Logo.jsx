import React from 'react';
import UXCaptureImageLoad from '@meetup/react-ux-capture/lib/UXCaptureImageLoad';

import { LOGO_ONLOAD } from './Zones';

export default () => {
	return (
		<UXCaptureImageLoad
			mark={LOGO_ONLOAD}
			src="/ux-capture-logo-up.svg"
			alt="logo"
			height="50px"
		/>
	);
};
