export const basicZones = {
	destinationVerified: ["ux-image-inline-logo", "ux-image-onload-logo"],
	primaryContentDisplayed: [
		"ux-text-primary",
		"ux-image-inline-kitten",
		"ux-image-onload-kitten"
	],
	primaryActionAvailable: ["ux-text-button", "ux-handler-button"],
	secondaryContentDisplayed: ["ux-text-secondary"]
};

export const progressiveZones = {
	destinationVerified: ["ux-text-title", "ux-image-inline-logo", "ux-image-onload-logo"],
	primaryContentDisplayed: ["ux-text-primary"],
	primaryActionAvailable: [
		"ux-text-secondary",
		"ux-image-inline-kitten",
		"ux-image-onload-kitten"
	],
	secondaryContentDisplayed: ["ux-text-button", "ux-handler-button"]
};

export const minimalZones = {
	destinationVerified: ["ux-text-title", "ux-image-inline-logo", "ux-image-onload-logo"],
	primaryContentDisplayed: ["ux-text-lazy"]
};

export default {
	"/": basicZones,
	"/progressive": progressiveZones,
	"/minimal": minimalZones
};
