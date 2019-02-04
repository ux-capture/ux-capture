import React from 'react';
import { shallow } from 'enzyme';
import UXCaptureStartView from './UXCaptureStartView';

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
	shallow(<UXCaptureStartView {...props} />);

describe('UXCaptureStartView', () => {
	it('renders correct markup when all props are defined', () => {
		expect(renderComponent()).toMatchSnapshot();
	});

	it('does not render markup when no zones are defined', () => {
		expect(renderComponent({})).toMatchSnapshot();
	});

	describe('secondaryContentDisplay', () => {
		it('renders correct markup when `secondaryContentDisplayed` not supplied', () => {
			const props = { ...MOCK_PROPS };
			delete props.secondaryContentDisplayed;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `secondaryContentDisplayed` is null', () => {
			const props = { ...MOCK_PROPS };
			props.secondaryContentDisplayed = null;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `secondaryContentDisplayed` is undefined', () => {
			const props = { ...MOCK_PROPS };
			props.secondaryContentDisplayed = undefined;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `secondaryContentDisplayed` is an empty array', () => {
			const props = { ...MOCK_PROPS };
			props.secondaryContentDisplayed = [];

			expect(renderComponent(props)).toMatchSnapshot();
		});
	});

	describe('primaryActionAvailable', () => {
		it('renders correct markup when `primaryActionAvailable` not supplied', () => {
			const props = { ...MOCK_PROPS };
			delete props.primaryActionAvailable;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `primaryActionAvailable` is null', () => {
			const props = { ...MOCK_PROPS };
			props.primaryActionAvailable = null;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `primaryActionAvailable` is undefined', () => {
			const props = { ...MOCK_PROPS };
			props.primaryActionAvailable = undefined;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `primaryActionAvailable` is an empty array', () => {
			const props = { ...MOCK_PROPS };
			props.primaryActionAvailable = [];

			expect(renderComponent(props)).toMatchSnapshot();
		});
	});

	describe('primaryContentDisplayed', () => {
		it('renders correct markup when `primaryContentDisplayed` not supplied', () => {
			const props = { ...MOCK_PROPS };
			delete props.primaryContentDisplayed;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `primaryContentDisplayed` is null', () => {
			const props = { ...MOCK_PROPS };
			props.primaryContentDisplayed = null;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `primaryContentDisplayed` is undefined', () => {
			const props = { ...MOCK_PROPS };
			props.primaryContentDisplayed = undefined;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `primaryContentDisplayed` is an empty array', () => {
			const props = { ...MOCK_PROPS };
			props.primaryContentDisplayed = [];

			expect(renderComponent(props)).toMatchSnapshot();
		});
	});

	describe('destinationVerified', () => {
		it('renders correct markup when `destinationVerified` not supplied', () => {
			const props = { ...MOCK_PROPS };
			delete props.destinationVerfied;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `destinationVerified` is null', () => {
			const props = { ...MOCK_PROPS };
			props.destinationVerfied = null;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `destinationVerified` is undefined', () => {
			const props = { ...MOCK_PROPS };
			props.destinationVerfied = undefined;

			expect(renderComponent(props)).toMatchSnapshot();
		});

		it('renders correct markup when `destinationVerified` is an empty array', () => {
			const props = { ...MOCK_PROPS };
			props.destinationVerfied = [];

			expect(renderComponent(props)).toMatchSnapshot();
		});
	});
});
