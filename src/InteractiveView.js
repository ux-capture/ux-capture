import View from './View';

const INTERACTIVE_NAVIGATION_START_MARK_NAME = 'transitionStart';

export default class InteractiveView extends View {
	startMarkName = null;

	startTransition() {
		window.performance.mark(INTERACTIVE_NAVIGATION_START_MARK_NAME);

		// last one is the one we just created above, keep it
		this.startMarkName = INTERACTIVE_NAVIGATION_START_MARK_NAME;
	}
}
