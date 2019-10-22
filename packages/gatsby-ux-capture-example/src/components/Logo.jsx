import React from "react";
import UXCaptureImageLoad from "@meetup/react-ux-capture/lib/UXCaptureImageLoad";

import logo from "../ux-capture-logo-up.svg";

export default () => {
	return (
		<UXCaptureImageLoad mark="ux-image-onload-logo" src={logo} alt="logo" height="50px" />
	);
};
