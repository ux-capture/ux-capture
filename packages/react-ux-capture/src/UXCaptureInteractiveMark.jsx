// @flow
import * as React from 'react';

type InteractiveMarkProps = {
	mark: string,
	children: React$Node,
};

// inject interactive UXCapture.mark() call that only triggers in browser and not in in server-side render
// This component should _only_ be used on components where basic rendering is
// not sufficient for the element to be 'interactive', e.g. buttons that require
// the client application to be running in order to correctly handle click callbacks
// @see https://github.com/meetup/ux-capture#event-handler-attachment
class UXCaptureInteractiveMark extends React.Component<InteractiveMarkProps> {
	componentDidUpdate(prevProps: Props) {
		// updated on client - if mark name has changed, clear old mark and trigger new
		const { mark } = this.props;
		if (prevProps.mark !== mark && window.UXCapture) {
			window.UXCapture.clearMarks(prevProps.mark);
			window.UXCapture.mark(mark);
		}
	}
	componentWillUnmount() {
		// clear associated mark
		if (window.UXCapture) {
			window.UXCapture.clearMarks(this.props.mark);
		}
	}
	componentDidMount() {
		if (window.UXCapture) {
			window.UXCapture.mark(this.props.mark);
		}
	}
	render() {
		return this.props.children;
	}
}

export default UXCaptureInteractiveMark;
