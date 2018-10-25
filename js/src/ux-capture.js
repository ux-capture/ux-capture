import UXCapture from './UXCapture';

(function() {
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		// Node.js
		module.exports = UXCapture;
	} else {
		// Browser
		new UXCapture();
	}
})();
