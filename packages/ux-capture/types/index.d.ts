type SelectorFunction = (element?: ZoneElement) => HTMLElement | NodeListOf<HTMLElement>;
type ClearMarksFunction = (name: string) => void;
type CreateFunction = (config: ZoneConfig) => void;
type StartViewFunction = (zoneConfigs: ZoneConfig[]) => void;
type UpdateViewFunction = (zoneConfigs: ZoneConfig[]) => void;
type GetViewConfigFunction = () => View | ZoneConfig[];
type GenericCallbackType = () => void;
type ExpectedMarkRecordFunction = (name: string, waitForNextPaint: boolean, recordTimestamps: any) => void;
type OnMarkFunction = (markName?: string) => void;
type OnMeasureFunction = (measureName?: string) => void;

interface UXCaptureCommonProps {
    startMarkName: string;
    recordTimestamps: any;
    onMark?: OnMarkFunction;
    onMeasure?: OnMeasureFunction;
}

export declare interface UXCapture {
    clearMarks: ClearMarksFunction;
    create: CreateFunction;
    destroy: GenericCallbackType;
    startView: StartViewFunction;
    updateView: UpdateViewFunction;
    getViewConfig: GetViewConfigFunction;
    startTransition: GenericCallbackType;
    mark: ExpectedMarkRecordFunction;
}

export declare interface ZoneProps extends UXCaptureCommonProps {
    elements?: ZoneElement[];
    marks?: string[];
}

export declare interface ViewProps extends UXCaptureCommonProps {
    zoneConfigs: ZoneConfig[];
}

export declare interface ExpectedMarkProps extends UXCaptureCommonProps {
    name: string;
}

export declare interface ZoneElement {
    label: string;
    selector: SelectorFunction | string;
    marks: string[];
}

export declare interface ZoneConfig {
    name: string;
    esitmated_latency: number;
    elements: ZoneElement[];
}

export declare type ExpectedMarkType = (props: ExpectedMarkProps) => void;
export declare type ViewType = (props: ViewProps) => void;
export declare type ZoneType = (props: ZoneProps) => void;