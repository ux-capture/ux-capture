const getUXCaptureInlineCode = () => {
	const fs = require('fs');
	const uxCaptureFilename = require.resolve(
		'@ux-capture/ux-capture/lib/ux-capture.min.js'
	);
	return fs.readFileSync(uxCaptureFilename, 'utf8');
};

module.exports = {
	serverRuntimeConfig: {
		// Will only be available on the server side
		uxCaptureLibraryCode: getUXCaptureInlineCode(),
	},
};
