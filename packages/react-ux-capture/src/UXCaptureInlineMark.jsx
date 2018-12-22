// @flow
import React from 'react';
import UXCaptureInteractiveMark from './UXCaptureInteractiveMark';

type Props = {
	mark: string,
};

// inject inline UXCapture.mark() call into rendered markup, in addition to
// UXCaptureInteractiveMark behavior
// @see https://github.com/meetup/ux-capture#text-without-custom-font
const UXCaptureInlineMark = ({ mark }: Props) =>
	<UXCaptureInteractiveMark mark={mark}>
		<div
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{
				__html: `<script>
					if(window.UXCapture) {
						window.UXCapture.mark("${mark}");
					}
				</script>`,
			}}
		/>
	</UXCaptureInteractiveMark>;

export default UXCaptureInlineMark;
