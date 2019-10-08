// @flow
import * as React from 'react';

type Props = React$ElementProps<'img'> & { mark: string };

export const getOnLoadJS = (mark: string): string => {
	const onload = `
		if (window.UXCapture && !window.UXCapture['${mark}-LOADED']) {
			window.UXCapture.mark('${mark}');
			window.UXCapture['${mark}-LOADED'] = true;
		}
	`;

	// Replace newlines and tabs with space characters
	return onload.replace(/[\n\t]+/g, ' ');
};

export const getPropsAsHTMLAttrs = (props: React$ElementProps<'img'>): string => {
	return Object.keys(props)
		.map(prop => {
			let attribute = prop;

			// convert JSX attribute names to HTML syntax
			// Any other special props needed? Add here.
			// @see: https://reactjs.org/docs/dom-elements.html
			if (prop === 'className') {
				attribute = 'class';
			}
			if (prop === 'htmlFor') {
				attribute = 'for';
			} else {
				// handles camelCased attributes like `onLoad`
				attribute = attribute.toLowerCase();
			}
			const value = props[prop];
			if (typeof value !== 'string') {
				return '';
			}

			return `${attribute}="${value}"`;
		})
		.join(' ');
};

export const getCSSTermNamesFromStyleObject = style => {
	return style
		? Object.keys(style)
				.map(s => {
					const key = s.replace(/([A-Z])/g, v => `-${v[0].toLowerCase()}`);
					return `${key}:${style[s]}`;
				})
				.join(';')
		: '';
};

/**
 * Creates an image tag with provide props
 * and a UXCapture `onLoad` handler
 *
 * @see example https://github.com/meetup/ux-capture#image-elements
 */
const UXCaptureImageLoad = (props: Props) => {
	const { mark, src, style, ...other } = props;
	const onload = getOnLoadJS(mark);
	const otherImgAttrs = getPropsAsHTMLAttrs(other);

	const inlineStyles = style
		? `style="${getCSSTermNamesFromStyleObject(style)}""`
		: '';

	return (
		<div
			dangerouslySetInnerHTML={{
				__html: `
				<img id="ux-capture-${mark}" src="${src}" onload="${onload}" ${inlineStyles} ${otherImgAttrs} />
			`,
			}}
		/>
	);
};

export default UXCaptureImageLoad;
