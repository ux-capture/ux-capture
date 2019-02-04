// @flow
import React from 'react';

type callbackType = (label: string) => void;
type Props = {|
	onMark?: callbackType,
	onMeasure?: callbackType,
|};

// This component should be rendered in server markup - it will not work if only
// rendered client-side
export default ({ onMark, onMeasure }: Props) => {
	const uxCaptureConfigJS = `
		<script>
			if(window.UXCapture) {
				window.UXCapture.create({
					${onMark ? `"onMark": ${onMark.toString()},` : ''}
					${onMeasure ? `"onMeasure": ${onMeasure.toString()},` : ''}
				});
			}
		</script>
	`;

	return (
		<div dangerouslySetInnerHTML={{ __html: uxCaptureConfigJS }} /> // eslint-disable-line react/no-danger
	);
};
