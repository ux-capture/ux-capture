import React from "react";

import fs from "fs";

export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
	const headComponents = getHeadComponents();

	const uxCaptureFilename = require.resolve("@meetup/ux-capture/lib/ux-capture.min.js");
	const uxCaptureJS = fs.readFileSync(uxCaptureFilename, "utf8");

	headComponents.push(
		<script key="ux-capture-library" dangerouslySetInnerHTML={{ __html: uxCaptureJS }} />
	);

	replaceHeadComponents(headComponents);
};
