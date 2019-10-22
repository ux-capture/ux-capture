exports.onPreRouteUpdate = ({ location, prevLocation }) => {
	if (window.UXCapture && prevLocation && location.pathname !== prevLocation.pathname) {
		window.UXCapture.startTransition();
	}
};
