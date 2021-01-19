interface LineSpectrumOption {
    lineStyles: LineStyle[];
    lineGap: number;
    isShow?: boolean;
    isNeedAudio?: boolean;
    isNeedAudioListSwitch?: boolean;
    pinyinSelectHeight?: number;//单位：px
}
interface TinWordFormatOption {
    border: LineStyle;
    crossLine?: LineStyle[];
    backgroundColor?: string;
}
interface LineStyle {
    length?: number;
    weight?: number;
    color?: string;
    dasharray?: number[];
}
interface ChineseWordOption {
    tinWordFormatOption?: TinWordFormatOption;
    lineSpectrumOption?: LineSpectrumOption;
    tinGapFromSpectrum?: number;//单位：px
    hanziWriterOption?: any;
    definedStrokeUrl?: any
    definedAudioUrl?: any
}
export { LineSpectrumOption, TinWordFormatOption, LineStyle, ChineseWordOption }