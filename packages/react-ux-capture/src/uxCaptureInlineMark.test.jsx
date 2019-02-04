import React from 'react';
import { shallow } from 'enzyme';
import UXCaptureInlineMark from './UXCaptureInlineMark';

const MOCK_PROPS = {
	mark: 'foo',
};

const renderComponent = (props = MOCK_PROPS) =>
	shallow(<UXCaptureInlineMark {...props} />);

describe('UXCaptureInlineMark', () => {
	it('renders component markup', () => {
		expect(renderComponent()).toMatchSnapshot();
	});
});
