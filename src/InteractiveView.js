import View from './View';

const INTERACTIVE_NAVIGATION_START_MARK_NAME = 'transitionStart';

export default class InteractiveView extends View {
	startMark = null;

	startTransition() {
		window.performance.mark(INTERACTIVE_NAVIGATION_START_MARK_NAME);

		const allStartMarks = window.performance.getEntriesByName(
			INTERACTIVE_NAVIGATION_START_MARK_NAME
		);

		// last one is the one we just created above, keep it
		this.startMark = allStartMarks[allStartMarks.length - 1];
	}
}
