import React from 'react';
import UXCaptureInteractiveMark from './UXCaptureInteractiveMark';

const MOCK_PROPS = {
	mark: 'bar',
};

const renderComponent = (props = MOCK_PROPS) =>
	<UXCaptureInteractiveMark {...props}>
		<b>Bold Child</b>
	</UXCaptureInteractiveMark>;

describe('UXCaptureInteractiveMark', () => {
	it('renders children markup', () => {
		expect(renderComponent()).toMatchSnapshot();
	});
});
