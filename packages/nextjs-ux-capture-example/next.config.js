const getUXCaptureInlineCode = () => {
	const fs = require('fs');
	const uxCaptureFilename = require.resolve(
		'@meetup/ux-capture/lib/ux-capture.min.js'
	);
	return fs.readFileSync(uxCaptureFilename, 'utf8');
};

module.exports = {
	webpack: (config, { isServer }) => {
		// solution found here: https://github.com/zeit/next.js/issues/7755
		// Fixes npm packages that depend on `fs` module
		if (!isServer) {
			config.node = {
				fs: 'empty',
			};
		}

		return config;
	},
	serverRuntimeConfig: {
		// Will only be available on the server side
		uxCaptureLibraryCode: getUXCaptureInlineCode(),
	},
};
