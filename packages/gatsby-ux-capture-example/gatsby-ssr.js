import fs from "fs";

exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
	const headComponents = getHeadComponents();

	const uxCaptureFilename = require.resolve("@meetup/ux-capture/lib/ux-capture.min.js");
	const uxCaptureJS = fs.readFileSync(uxCaptureFilename, "utf8");

	headComponents.push(<script dangerouslySetInnerHTML={{ __html: uxCaptureJS }} />);
	replaceHeadComponents(headComponents);
};
