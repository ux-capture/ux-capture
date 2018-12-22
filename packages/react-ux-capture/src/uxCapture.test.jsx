import React from 'react';
import { shallow } from 'enzyme';
import UXCapture from './UXCapture';

const MOCK_PROPS = {
	destinationVerfied: ['ux-destination-verified'],
	primaryContentDisplayed: ['ux-primary-content-1', 'ux-primary-content-2'],
	primaryActionAvailable: ['ux-primary-action-available'],
	secondaryContentDisplayed: [
		'ux-secondary-content-1',
		'ux-secondary-content-2',
		'ux-secondary-content-3',
	],
};

const renderComponent = (props = MOCK_PROPS) =>
	shallow(<UXCapture {...props} />);

describe('UXCapture', () => {
	it('renders correct markup when all props are defined', () => {
		expect(renderComponent()).toMatchSnapshot();
	});
});
