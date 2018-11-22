import View from './View';

export default class PageView extends View {
	/**
	 * Special type of mark that is going to be looked up in
	 * performance.navigation.timing.navigationStart instead of PerformanceTimeline
	 *
	 * See: https://github.com/w3c/user-timing/issues/22
	 */
	startMarkName = 'navigationStart';
}
