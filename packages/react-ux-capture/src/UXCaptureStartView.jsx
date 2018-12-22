// @flow
import React from 'react';

type Props = {|
	destinationVerified?: Array<string>,
	primaryContentDisplayed?: Array<string>,
	primaryActionAvailable?: Array<string>,
	secondaryContentDisplayed?: Array<string>,
|};

const makeZones = (props: Props) =>
	[
		{
			name: 'ux-destination-verified',
			marks: props.destinationVerified,
		},
		{
			name: 'ux-primary-content-displayed',
			marks: props.primaryContentDisplayed,
		},
		{
			name: 'ux-primary-action-available',
			marks: props.primaryActionAvailable,
		},
		{
			name: 'ux-secondary-content-displayed',
			marks: props.secondaryContentDisplayed,
		},
	].filter(({ marks }) => marks && marks.length > 0);

export default class UXCaptureStartView extends React.Component<Props> {
	zones = makeZones(this.props);
	componentDidUpdate(prev: Props) {
		// updated on client - if mark name has changed, clear old mark and trigger new
		if (
			prev.destinationVerified !== this.props.destinationVerified &&
			prev.primaryContentDisplayed !== this.props.primaryContentDisplayed &&
			prev.primaryActionAvailable !== this.props.primaryActionAvailable &&
			prev.secondaryContentDisplayed !== this.props.secondaryContentDisplayed &&
			window.UXCapture
		) {
			window.UXCapture.startView(this.zones);
		}
	}
	componentDidMount() {
		if (window.UXCapture) {
			if (window.UXCapture.ignoreNextViewMount) {
				// view already started by server rendered markup - do not call startView
				// again
				// Also, set ignoreNextViewMount to false so that future view instances can
				// call startView
				window.UXCapture.ignoreNextViewMount = false;
				return;
			}
			window.UXCapture.startView(this.zones);
		}
	}
	render() {
		// Don't add UX.expect() to page is no zones specified
		if (!this.zones.length) {
			return null;
		}

		const uxCaptureJS = `
		<script>
			if(window.UXCapture) {
				window.UXCapture.startView(${JSON.stringify(this.zones)});
				window.UXCapture.ignoreNextViewMount = true;
			}
		</script>
	`;

		return (
			<div dangerouslySetInnerHTML={{ __html: uxCaptureJS }} /> // eslint-disable-line react/no-danger
		);
	}
}
