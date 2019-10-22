export const basicZones = {
	"ux-destination-verified": ["ux-image-inline-logo", "ux-image-onload-logo"],
	"ux-primary-content-displayed": [
		"ux-text-primary",
		"ux-image-inline-kitten",
		"ux-image-onload-kitten"
	],
	"ux-primary-action-available": ["ux-text-button", "ux-handler-button"],
	"ux-secondary-content-displayed": ["ux-text-secondary"]
};

export const progressiveZones = {
	"ux-destination-verified": [
		"ux-text-title",
		"ux-image-inline-logo",
		"ux-image-onload-logo"
	],
	"ux-primary-content-displayed": ["ux-text-primary"],
	"ux-primary-action-available": [
		"ux-text-secondary",
		"ux-image-inline-kitten",
		"ux-image-onload-kitten"
	],
	"ux-secondary-content-displayed": ["ux-text-button", "ux-handler-button"]
};

export const minimalZones = {
	"ux-destination-verified": [
		"ux-text-title",
		"ux-image-inline-logo",
		"ux-image-onload-logo"
	],
	"ux-primary-content-displayed": ["ux-text-lazy"]
};

export default {
	"/": basicZones,
	"/progressive": progressiveZones,
	"/minimal": minimalZones
};
