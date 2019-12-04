export declare interface UXCaptureZones extends UXCaptureGenericZones{
	destinationVerified: UXCaptureZone,
	primaryContentDisplayed: UXCaptureZone,
	primaryActionAvailable: UXCaptureZone,
	secondaryContentDisplayed: UXCaptureZone
}

export declare type UXCaptureZone = string[];

export declare interface UXCaptureGenericZones {
	[x: string]: UXCaptureZone
}

export declare type UXCapture = (UXCaptureGenericZones) => React.ReactElement
export declare type callbackType = (label: string) => void;

export declare type UXCaptureCreateProps = {
	onMark?: callbackType,
	onMeasure?: callbackType,
	};

export declare type UXCaptureCreate = (UXCaptureCreateProps) => React.ReactElement

export declare type UXCaptureFontProps = {
	fontFamily: string,
	mark: string,
};

export declare type UXCaptureFont = (UXCaptureFontProps) => React.ReactElement

export declare type UXCaptureImageLoadProps = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & { mark: string };

export declare type UXCaptureImageLoad = (UXCaptureImageLoadProps) => React.ReactElement
