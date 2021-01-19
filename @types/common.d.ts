// Buffer class
interface NodeBuffer {
    [index: number]: number;
    write(string: string, offset?: number, length?: number, encoding?: string): number;
    toString(encoding?: string, start?: number, end?: number): string;
    length: number;
    copy(targetBuffer: NodeBuffer, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
    slice(start?: number, end?: number): NodeBuffer;
    readUInt8(offset: number, noAsset?: boolean): number;
    readUInt16LE(offset: number, noAssert?: boolean): number;
    readUInt16BE(offset: number, noAssert?: boolean): number;
    readUInt32LE(offset: number, noAssert?: boolean): number;
    readUInt32BE(offset: number, noAssert?: boolean): number;
    readInt8(offset: number, noAssert?: boolean): number;
    readInt16LE(offset: number, noAssert?: boolean): number;
    readInt16BE(offset: number, noAssert?: boolean): number;
    readInt32LE(offset: number, noAssert?: boolean): number;
    readInt32BE(offset: number, noAssert?: boolean): number;
    readFloatLE(offset: number, noAssert?: boolean): number;
    readFloatBE(offset: number, noAssert?: boolean): number;
    readDoubleLE(offset: number, noAssert?: boolean): number;
    readDoubleBE(offset: number, noAssert?: boolean): number;
    writeUInt8(value: number, offset: number, noAssert?: boolean): void;
    writeUInt16LE(value: number, offset: number, noAssert?: boolean): void;
    writeUInt16BE(value: number, offset: number, noAssert?: boolean): void;
    writeUInt32LE(value: number, offset: number, noAssert?: boolean): void;
    writeUInt32BE(value: number, offset: number, noAssert?: boolean): void;
    writeInt8(value: number, offset: number, noAssert?: boolean): void;
    writeInt16LE(value: number, offset: number, noAssert?: boolean): void;
    writeInt16BE(value: number, offset: number, noAssert?: boolean): void;
    writeInt32LE(value: number, offset: number, noAssert?: boolean): void;
    writeInt32BE(value: number, offset: number, noAssert?: boolean): void;
    writeFloatLE(value: number, offset: number, noAssert?: boolean): void;
    writeFloatBE(value: number, offset: number, noAssert?: boolean): void;
    writeDoubleLE(value: number, offset: number, noAssert?: boolean): void;
    writeDoubleBE(value: number, offset: number, noAssert?: boolean): void;
    fill(value: any, offset?: number, end?: number): void;
}
interface JQuery{
    attr(a,b):Function
}
interface String {
    format(...replacements: string[]): string;
    replaceAll: (reallyDo:any, replaceWith:any, ignoreCase:any) => string;
}
interface PointerEvent{
    propagationPath:Function;
}
declare var MozWebSocket: {
    new(url: string, protocols?: string | string[]): any;
};
interface Window {
    rasterizeHTML:any;
    HanziWriter:any;
    drawing:any;
    ChineseFormat:any
    xl: any;
    onFileUpload: any;
    onFileUploadProgress: any;
    onFileUploadComplete: any;
    onFileReay: any,
    cancelFileUpload: any;
    xlGetXl: Function;
    onScreenSnap: Function;
    onAutoSnap: Function;
    onSilentSnap: Function;
    webkitRTCPeerConnection: any;
    RTCPeerConnection:any;
    md5(str: string, key:any, raw:any): any;
    clipPPT:Function;
    onDownloadFileDlgClose:any;
    onFileDownLoadProgress:any;
    onFileDownLoadComplete:any;
    onDownLoadingBack:any;
    startDataLessonHeartBeat:any;
    stopDataLessonHeartBeat:any;
    cp:any;
    editor:any;
    replaceScrollbar(el, f,currentTabType);
    stopAllVideoAudio();
    onSaveCourseware();
    showLoading(isShow: boolean, top: number, left: number);
    showHint(info: string);
    isJSON(str);
    onFullscreenchange(callback: Function);
    requestFullscreen(element);
    exitFullscreenElement();
    requestFullscreen(element);
    getFullscreenElement();
    getBrowserInfo();
    getUserIP(f);
    ddxa(data1);
    hasAudio: any;
    muteChange: any;
    $: any;
    note:any;
    xaToken:any;
    mozRTCPeerConnection:any;
    mathTool:any;
    bugReport:Function;
    HTMLtoImg:any;
    WebUploader:any;
    PDFJS:any;
}

interface MouseEvent{
    toElement:Function
}
interface WheelEvent extends MouseEvent {
    wheelDelta: any;
    wheelDeltaY: any;
}

interface Document {
    readonly mozFullScreenElement: Element | null;
    readonly MSFullscreenElement: Element | null;
    mozCancelFullScreen(): void;
    msExitFullscreen(): void;
    webkitCancelFullScreen;
    webkitFullscreenElement;
    fullscreenElement;
    customFullscreenElement:Element;
    customFullscreenElements:Array<Element>;
}

interface Navigator{
    connection:any;
}

interface HTMLElement{
    onmousewheel;
    animate: any;
}
