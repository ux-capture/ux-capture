type SelectorFunction = (element?: ZoneElement) => HTMLElement | NodeListOf<HTMLElement>;
type SelectDOMNodesFunction = (element: ZoneElement) => HTMLElement | NodeListOf<HTMLElement> | null;
type MesasureFunction = (triggerName: string) => void;
type DestroyFunction = () => void;
type Listener = (listener: any) => void;
type UpdateFunction = (zoneConfigs: ZoneConfig[]) => void;
type SetZonesFunction = (zoneConfigs: ZoneConfig[]) => ZoneObject[];
type createZoneFunction = (zoneConfig: ZoneConfig) => ZoneObject;
type getZoneConfigsFunction = () => ZoneConfig[];
type MarkFunction = () => void;
type addOnMarkListenerFunction = (listener: Listener) => void;
type removeOnMarkListenerFunction = (listenerToRemove: Listener) => void;

interface UXCaptureCommonProps {
    startMarkName: string;
    recordTimestamps: any;
    onMark: (markName?: string) => void;
    onMeasure: (measureName?: string) => void;
}

interface ZoneObject extends ZoneProps {
    destroy: DestroyFunction;
    measure: MesasureFunction;
    selectDOMNodes: SelectDOMNodesFunction;
}

interface ViewObject extends ViewProps {
    update: UpdateFunction;
    setZones: SetZonesFunction;
    destroy: DestroyFunction;
    createZone: createZoneFunction;
    getZoneConfigs: getZoneConfigsFunction;
}

interface ExpectedMarkObject extends ExpectedMarkProps {
    _mark: MarkFunction;
    addOnMarkListener: addOnMarkListenerFunction;
    removeOnMarkListener: removeOnMarkListenerFunction;
}

interface ExpectedMarkProps {
    name: string;
    recordTimestamps: any;
}

interface ViewProps extends UXCaptureCommonProps {
    zoneConfigs: ZoneConfig[];
}

interface ZoneProps extends UXCaptureCommonProps {
    elements?: ZoneElement[];
    marks?: string[];
}

interface ZoneElement {
    label: string;
    selector: SelectorFunction | string;
    marks: string[];
}

interface ZoneConfig {
    name: string;
    esitmated_latency: number;
    elements: ZoneElement[];
}

export {
    UXCaptureCommonProps,
    ViewProps,
    ZoneProps,
    ZoneElement,
    ZoneConfig,
    ZoneObject,
    Listener,
    ExpectedMarkObject,
    ExpectedMarkProps
}