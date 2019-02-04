import React from 'react';
import { shallow } from 'enzyme';
import UXCaptureImageLoad, {
	getOnLoadJS,
	getPropsAsHTMLAttrs,
} from './UXCaptureImageLoad';

const MOCK_PROPS = {
	mark: 'ux-image-load-logo',
	src: '/foo.png',
	className: 'someClass',
	alt: 'altText',
	height: '50',
};

const renderComponent = (props = MOCK_PROPS) =>
	shallow(<UXCaptureImageLoad {...props} />);

describe('getOnLoadJS', () => {
	it('renders the correct javascript as a string', () => {
		expect(getOnLoadJS(MOCK_PROPS.mark)).toMatchSnapshot();
	});
});

describe('getPropsAsHTMLAttrs', () => {
	it('renders the correct javascript as a string', () => {
		const imageProps = {
			className: MOCK_PROPS.className,
			alt: MOCK_PROPS.alt,
			height: MOCK_PROPS.height,
		};

		expect(getPropsAsHTMLAttrs(imageProps)).toMatchSnapshot();
	});
});

describe('UXCaptureImageLoad', () => {
	it('renders component markup', () => {
		global.window = { UX: { mark: jest.fn() } };
		expect(renderComponent()).toMatchSnapshot();
		delete global.window;
	});
});
