/* eslint-disable no-undef */

import UXCapture from './UXCapture';

(function() {
	// Export initializer function for UX Capture to the appropriate location.
	if (typeof define === 'function' && define.amd) {
		// AMD / RequireJS
		define([], function() {
			return UXCapture;
		});
	} else if (
		typeof module !== 'undefined' &&
		typeof module.exports !== 'undefined'
	) {
		// Node.js
		module.exports = UXCapture;
	} else {
		// Browser
		window.UXCapture = UXCapture;
	}
})();
