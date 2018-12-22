// @flow
import * as React from 'react';
import UXCaptureCreate from './UXCaptureCreate';
import UXCaptureStartView from './UXCaptureStartView';

type Props = {|
	destinationVerified?: Array<string>,
	primaryContentDisplayed?: Array<string>,
	primaryActionAvailable?: Array<string>,
	secondaryContentDisplayed?: Array<string>,
|};

export const onMark = (mark: string) => {
	if (!(window.newrelic && window.performance)) {
		return;
	}

	const performanceMark = window.performance
		.getEntriesByType('mark')
		.find(entry => entry.name === mark);

	// Set a marker in the trace details
	window.newrelic.addToTrace({
		name: mark,
		start:
			window.performance.timing.navigationStart + performanceMark.startTime, // this is an epoch ms timestamp
		type: 'UX Capture mark',
	});
};

export const onMeasure = (measure: string) => {
	if (!(window.newrelic && window.performance)) {
		return;
	}

	const performanceMeasure = window.performance
		.getEntriesByType('measure')
		.find(entry => entry.name === measure);

	//  Add a custom attribute to the PageView & BrowserInteraction events in Insights
	window.newrelic.setCustomAttribute(measure, performanceMeasure.duration);
};

export default ({
	destinationVerified,
	primaryContentDisplayed,
	primaryActionAvailable,
	secondaryContentDisplayed,
}: Props) =>
	<React.Fragment>
		<UXCaptureCreate onMark={onMark} onMeasure={onMeasure} />
		<UXCaptureStartView
			destinationVerified={destinationVerified}
			primaryContentDisplayed={primaryContentDisplayed}
			primaryActionAvailable={primaryActionAvailable}
			secondaryContentDisplayed={secondaryContentDisplayed}
		/>
	</React.Fragment>;
