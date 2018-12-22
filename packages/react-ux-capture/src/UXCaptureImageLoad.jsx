// @flow
import * as React from 'react';

type Props = React$ElementConfig<typeof HTMLImageElement> & { mark: string };

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

export const getPropsAsHTMLAttrs = (
	props: React$ElementConfig<typeof HTMLImageElement>
): string => {
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

			return `${attribute}="${props[prop]}"`;
		})
		.join(' ');
};

/**
 * Creates an image tag with provide props
 * and a UXCapture `onLoad` handler
 *
 * @see example https://github.com/meetup/ux-capture#image-elements
 */
const UXCaptureImageLoad = (props: Props) => {
	const { mark, src, ...other } = props;

	const onload = getOnLoadJS(mark);
	const otherImgAttrs = getPropsAsHTMLAttrs(other);

	return (
		<div
			dangerouslySetInnerHTML={{
				__html: `
				<img id="ux-capture-${mark}" src="${src}" onload="${onload}" ${otherImgAttrs} />
			`,
			}}
		/>
	);
};

export default UXCaptureImageLoad;
