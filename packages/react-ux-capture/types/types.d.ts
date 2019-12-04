declare interface UXCaptureZones extends UXCaptureGenericZones{
	destinationVerified: UXCaptureZone,
	primaryContentDisplayed: UXCaptureZone,
	primaryActionAvailable: UXCaptureZone,
	secondaryContentDisplayed: UXCaptureZone
}

declare type UXCaptureZone = string[];

declare interface UXCaptureGenericZones {
	[x: string]: UXCaptureZone
}

declare type UXCapture = (UXCaptureGenericZones) => React.ReactElement
declare type callbackType = (label: string) => void;

declare type UXCaptureCreateProps = {
	onMark?: callbackType,
	onMeasure?: callbackType,
	};

declare type UXCaptureCreate = (UXCaptureCreateProps) => React.ReactElement

declare type UXCaptureFontProps = {
	fontFamily: string,
	mark: string,
};

declare type UXCaptureFont = (UXCaptureFontProps) => React.ReactElement

declare type UXCaptureImageLoadProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { mark: string };

declare type UXCaptureImageLoad = (UXCaptureImageLoadProps) => React.ReactElement
