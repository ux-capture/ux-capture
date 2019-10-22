import React from "react";
import UXCaptureImageLoad from "@meetup/react-ux-capture/lib/UXCaptureImageLoad";

import logo from "../ux-capture-logo-up.svg";

import { LOGO_ONLOAD } from "../Zones";

export default () => {
	return <UXCaptureImageLoad mark={LOGO_ONLOAD} src={logo} alt="logo" height="50px" />;
};
