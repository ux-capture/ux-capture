// global marks
export const LOGO_INLINE = 'ux-image-inline-logo';
export const LOGO_ONLOAD = 'ux-image-onload-logo';

// basic view marks and zones
export const BASIC_KITTEN_INLINE = 'ux-image-inline-basic-kitten';
export const BASIC_KITTEN_ONLOAD = 'ux-image-onload-basic-kitten';
export const BASIC_PRIMARY_PARAGRAPH = 'ux-text-basic-primary';
export const BASIC_PRIMARY_BUTTON_DISPLAYED = 'ux-text-basic-button';
export const BASIC_PRIMARY_BUTTON_INTERACTIVE = 'ux-handler-basic-button';
export const BASIC_SECONDARY_TEXT = 'ux-text-basic-secondary';

export const basicZones = {
	destinationVerified: [LOGO_INLINE, LOGO_ONLOAD],
	primaryContentDisplayed: [
		BASIC_PRIMARY_PARAGRAPH,
		BASIC_KITTEN_INLINE,
		BASIC_KITTEN_ONLOAD,
	],
	primaryActionAvailable: [
		BASIC_PRIMARY_BUTTON_DISPLAYED,
		BASIC_PRIMARY_BUTTON_INTERACTIVE,
	],
	secondaryContentDisplayed: [BASIC_SECONDARY_TEXT],
};

// progrssive view marks and zones
export const PROGRESSIVE_TITLE = 'ux-text-progressive-title';
export const PROGRESSIVE_PRIMARY_PARAGRAPH = 'ux-text-progressive-primary';
export const PROGRESSIVE_SECONDARY_TEXT = 'ux-text-progressive-secondary';
export const PROGRESSIVE_KITTEN_INLINE = 'ux-image-inline-progressive-kitten';
export const PROGRESSIVE_KITTEN_ONLOAD = 'ux-image-onload-progressive-kitten';
export const PROGRESSIVE_PRIMARY_BUTTON_DISPLAYED = 'ux-text-progressive-button';
export const PROGRESSIVE_PRIMARY_BUTTON_INTERACTIVE = 'ux-handler-progressive-button';

export const progressiveZones = {
	destinationVerified: [PROGRESSIVE_TITLE, LOGO_INLINE, LOGO_ONLOAD],
	primaryContentDisplayed: [PROGRESSIVE_PRIMARY_PARAGRAPH],
	primaryActionAvailable: [
		PROGRESSIVE_SECONDARY_TEXT,
		PROGRESSIVE_KITTEN_INLINE,
		PROGRESSIVE_KITTEN_ONLOAD,
	],
	secondaryContentDisplayed: [
		PROGRESSIVE_PRIMARY_BUTTON_DISPLAYED,
		PROGRESSIVE_PRIMARY_BUTTON_INTERACTIVE,
	],
};

// minimal view marks and zones
export const MINIMAL_TITLE = 'ux-text-minimal-title';
export const MINIMAL_LAZY = 'ux-text-minimal-lazy';

export const minimalZones = {
	destinationVerified: [MINIMAL_TITLE, LOGO_INLINE, LOGO_ONLOAD],
	primaryContentDisplayed: [MINIMAL_LAZY],
};

export default {
	'/': basicZones,
	'/progressive': progressiveZones,
	'/minimal': minimalZones,
};
