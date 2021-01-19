//通过这个组件，田字格，三线格，文字，拼音都可以显示出来，把words中内容，加到container中,
// option配置格式，线条颜色，宽度，长度，间距等，可先配置一套默认的


import { ChineseWord } from "./ChineseWord";
import { ChineseWordOption, TinWordFormatOption, LineSpectrumOption } from "./Interface";
import { Util } from "../utility/util";
const hanzi = require('hanzi-writer');
window.HanziWriter = hanzi;
const chineseHasAudio = require("./images/chineseHasAudio.png");
const chineseNoAudio = require("./images/chineseNoAudio.png");
const pinyinSwitch = require("./images/pinyinSwitch.png");
const $ = window.$;
class FormatChinese {
    container: HTMLElement;
    word: ChineseWord;
    option: ChineseWordOption;
    strokeStep: number = -1;//记录分步的当前步数；
    allStepCount: number = 0;//记录所有步数
    isStokeAnimate: boolean = false;//记录正在进行分步动画 的状态，禁止连续点击分步；
    editCursorInterId: any = 0;
    isAudioCanPlay: boolean = false;
    isAnimating: boolean = false;//是否正在执行动画；
    handler: any = {};

    private hanziWriter: any;

    constructor(container: HTMLElement, word?: ChineseWord, option?: ChineseWordOption) {
        this.container = container;
        this.word = word;
        this.initOption();
        this.formateWord(this.container, this.word, option);
        this.initEvent();
    }
    initOption() {
        this.option = {
            tinWordFormatOption: {
                border: {
                    length: 100,
                    weight: 2,
                    color: "#BDBDBD",
                    dasharray: [0]
                },
                crossLine: [{
                    length: 100,
                    weight: 2,
                    color: "#E3E3E3",
                    dasharray: [8, 6],
                },
                {
                    length: 100,
                    weight: 2,
                    color: "#E3E3E3",
                    dasharray: [8, 6],
                }],
                backgroundColor: "rgba(0,0,0,0)"
            },
            lineSpectrumOption: {
                lineStyles: [
                    {
                        length: 80,
                        weight: 2,
                        color: "#E3E3E3",
                        dasharray: [0]
                    },
                    {
                        length: 100,
                        weight: 2,
                        color: "#E3E3E3",
                        dasharray: [0]
                    },
                    {
                        length: 100,
                        weight: 2,
                        color: "#E3E3E3",
                        dasharray: [0]
                    },
                    {
                        length: 100,
                        weight: 2,
                        color: "#E3E3E3",
                        dasharray: [0]
                    },
                ],
                lineGap: 12,
                isShow: true,
                isNeedAudio: true,
                isNeedAudioListSwitch: true,
                pinyinSelectHeight: 38
            },
            tinGapFromSpectrum: 4,
            hanziWriterOption: {
                padding: 13
            }
        }
    }
    formateWord(container: HTMLElement, word?: ChineseWord, option?: ChineseWordOption) {
        /**
         * 在此将dom元素添加进fragment；
         *
         */
        option = this.option = deepAssign({}, this.option, option);
        let linePositionY = option.lineSpectrumOption.lineStyles[0].weight / 2;
        const width = Math.max(...option.lineSpectrumOption.lineStyles.map(linestyle => linestyle.length));
        const height = linePositionY + option.lineSpectrumOption.lineGap * (option.lineSpectrumOption.lineStyles.length - 1) + option.lineSpectrumOption.lineStyles[option.lineSpectrumOption.lineStyles.length - 1].weight / 2;
        let $wordDom = $(`
                <div class="pinyinBox" style="width: ${width}px; height: ${height}px;line-height: ${height - option.lineSpectrumOption.lineGap / 6 * 2}px;position: relative;z-index:2;margin:0 auto;">
                    ${option.lineSpectrumOption.isShow ?
                `<div class="pinyinText" style="cursor:pointer;font-size:${option.lineSpectrumOption.lineGap * 2 - 2}px; width: 100%;height: 100%;text-align: center;font-family: pinyin,'Microsoft YaHei', Arial, Helvetica, sans-serif;color: #212121;background:url(${this.lineSpectrumBase64(option.lineSpectrumOption)}) no-repeat center/contain">${word && word.pinyin.fullPhonetic || ""}</div>`
                : ""
            }
                    ${ option.lineSpectrumOption.isShow && option.lineSpectrumOption.isNeedAudio ?
                `<span class="pinyinHorn" style="cursor:default; width: 20px;height: 20px;background: url(${"oncanplay" in Audio.prototype ? chineseNoAudio : chineseHasAudio}) no-repeat right center/14px 14px;position: absolute;right: 0;top: -9px;"></span>
                        `
                : ""}
                    ${option.lineSpectrumOption.isShow && option.lineSpectrumOption.isNeedAudioListSwitch && word && word.pinyins.length > 1 ?
                `<span class="audioListSwitch" style="cursor:pointer; width: 20px; height: 20px; background: url(${pinyinSwitch}) no-repeat right bottom/12px 12px;position: absolute;right: 0;bottom: 0;display:block"></span>
                    <ul class="pinyinList diyScrollBar" style="display: none;width:100%;max-height:${option.lineSpectrumOption.pinyinSelectHeight * 4}px">
                        ${
                word && word.pinyins.map((pinyin, index) => {
                    const className = pinyin === word.pinyin ? "active" : "";
                    return `<li class="pinyin ${className}" style="width:100%;height:${option.lineSpectrumOption.pinyinSelectHeight}px">${pinyin.fullPhonetic}</li>`
                }).join("")
                }
                    </ul>
                    `: ""}
                    ${option.lineSpectrumOption.isShow && this.option.definedAudioUrl && word ? `<audio crossOrigin="anonymous" src="${this.option.definedAudioUrl + word.pinyin.phonetic}.mp3?t=${new Date(this.word.pinyin.phoneticUpdateTime).getTime()}" class="pinyinAudio"></audio>` : ""}
                </div>
            <div class="tinWordBox" style="width: ${option.tinWordFormatOption.border.length}px;height: ${option.tinWordFormatOption.border.length}px;margin: ${option.tinGapFromSpectrum}px auto 0;position:relative;">
                ${this.tinWordFormatSvgString(option.tinWordFormatOption)}
                <div class="mask" style="width: ${option.tinWordFormatOption.border.length}px;height: ${option.tinWordFormatOption.border.length}px;position: absolute;top: 0;display: none;"></div>
            </div>
        `)


        if (word) {
            this.hanziWriter = window.HanziWriter.create($wordDom.children(".tinWordBox .tianWord")[0], word.word, {
                width: option.tinWordFormatOption.border.length,
                height: option.tinWordFormatOption.border.length,
                ...option.hanziWriterOption,
                charDataLoader:(char, onComplete) => {
                    $.getJSON(option.definedStrokeUrl + Util.ch2Unicode(char) + ".json?t="+new Date(word.characterUpdateTime).getTime(), function(charData) {
                        onComplete(charData);
                    });
                },
                onLoadCharDataSuccess: (data) => {
                    this.allStepCount = data.strokes.length;
                }
            });
        }

        $(this.container).append($wordDom);
    }

    initEvent() {
        let that = this;
        $(this.container).off();
        this.initMediaEvent();
        $(this.container).on("mousedown touchstart pointerdown", ".pinyinList", function (event) {//http://jira.xuelebj.net/browse/CLASSROOM-6909 http://jira.xuelebj.net/browse/CLASSROOM-7567
            event.stopPropagation();
        });
        $(this.container).on("click", ".audioListSwitch", function () {
            $(this).siblings(".pinyinList").addClass("show");
        });
        $(this.container).on("click", ".pinyinHorn", function () {
            that.playAudio();
        })
        $(this.container).on("click", ".pinyinText", function () {
            that.playAudio();
        })
        $(this.container).on("click", ".pinyin", function () {
            $(this).parent(".pinyinList").removeClass("show");
            let index = $(this).index();
            that.changePinyin(index);
        })

    }
    playAudio() {
        if (this.isAudioCanPlay) {
            $(this.container).find(".pinyinAudio")[0].play();
        }
    }
    on(eventName: string, func) {
        this.handler[eventName] = this.handler[eventName] || [];
        this.handler[eventName].push(func);
    }
    initMediaEvent() {
        const that = this;
        const $audioDom = $(this.container).find(".pinyinAudio")
        $audioDom.on("canplay", function () {
            that.isAudioCanPlay = true;
            $(this).siblings(".pinyinHorn").css({ "background": `url(${chineseHasAudio}) no-repeat right center/14px 14px`, "cursor": "pointer" });
            that.handler["audioCanplay"] && that.handler["audioCanplay"].length && that.handler["audioCanplay"].forEach(func => func());

        })
        $audioDom.on("playing", function () {
            // 添加播放动画gif
            that.handler["audioPlaying"] && that.handler["audioPlaying"].length && that.handler["audioPlaying"].forEach(func => func());

        });
        $audioDom.on("ended", function () {
            // 添加播放结束；
            $(this).siblings(".pinyinHorn").css({ "background": `url(${chineseHasAudio}) no-repeat right center/14px 14px`, "cursor": "pointer" });
            that.handler["audioEnd"] && that.handler["audioEnd"].length && that.handler["audioEnd"].forEach(func => func());
        });

    }
    changePinyin(index) {
        this.handler["changePinyin"] && this.handler["changePinyin"].length && this.handler["changePinyin"].forEach(func => func(index));
        this.word.pinyin = this.word.pinyins[index];
        const $audioDom = $(this.container).find(".pinyinAudio");
        $audioDom.attr("src", `${this.option.definedAudioUrl + this.word.pinyin.phonetic}.mp3?t=${new Date(this.word.pinyin.phoneticUpdateTime).getTime()}`);
        $audioDom.attr("autoplay", "true");
        $(this.container).find(".pinyinText").text(this.word.pinyin.fullPhonetic);
        const $hornDom = $(this.container).find(".pinyinHorn");
        $(this.container).find(".pinyin").eq(index).addClass("active").siblings(".pinyin").removeClass("active");

        if ("oncanplay" in Audio.prototype) {
            this.isAudioCanPlay = false;
            $hornDom.css({ "background": `url(${chineseNoAudio}) no-repeat right center/14px 14px`, cursor: "default" });
        } else {
            this.isAudioCanPlay = true;
            $hornDom.css({ "background": `url(${chineseHasAudio}) no-repeat right center/14px 14px`, cursor: "pointer" });
        }

    }
    quiz(params?) {
        this.hanziWriter.quiz(params)
    }
    cancelQuiz() {
        this.hanziWriter.cancelQuiz()
    }
    animateCharacter() {
        this.hanziWriter.hideCharacter();
        this.strokeStep = -1;
        this.isStokeAnimate = false;
        this.isAnimating = true;
        this.hanziWriter.animateCharacter({onComplete:() => {
            this.isAnimating = false;
            console.log("动画执行结束",this.isAnimating);
        }});
    }
    animateStrokeNext() {
        if (this.isStokeAnimate) return;
        this.isStokeAnimate = true;
        let step = this.strokeStep + 1;
        if (step >= this.allStepCount) {
            step = 0;
        }
        this.strokeStep = step;
        if (this.strokeStep === 0) {
            this.hanziWriter.hideCharacter();
        }
        const that = this;
        this.hanziWriter.animateStroke(this.strokeStep, {
            onComplete() {
                that.isStokeAnimate = false;
            }
        });
    }
    resetAnimate(){
        this.hanziWriter.hideCharacter();
    }
    animateStrokePre() {
        if (this.isStokeAnimate) return;
        this.isStokeAnimate = true;

        let step = this.strokeStep - 1;
        if (step <= 0) {
            this.hanziWriter.hideCharacter();
            step = 0;
        }
        this.strokeStep = step;
        const that = this;
        this.hanziWriter.animateStroke(this.strokeStep, {
            onComplete() {
                that.isStokeAnimate = false;
            }
        });
    }
    animateSpecialStroke(step: number) {
        if (this.isStokeAnimate) return;
        this.isStokeAnimate = true;
        if (step <= 0) {
            this.hanziWriter.hideCharacter();
            step = 0;
        } else if (step >= this.allStepCount) {
            this.hanziWriter.hideCharacter();
            step = 0;
        }
        this.strokeStep = step;
        const that = this;
        this.hanziWriter.animateStroke(this.strokeStep, {
            onComplete() {
                that.isStokeAnimate = false;
            }
        });
    }
    adjustStep(step) {
        if (this.allStepCount) {
            if (step >= this.allStepCount) {
                return 0;
            }
            if (step < 0) {
                return 0
            }
            return step;
        }
        return -1;
    }
    /**
     * 设置遮罩是否显示
     * @param isShow
     */
    setMask(isShow: boolean) {
        // debugger
        let mask = $(this.container).find('.mask');
        isShow ? mask.show() : mask.hide()
    }
    setWord(word: ChineseWord) {
        this.word = word;
        if (this.option.lineSpectrumOption.isShow) {
            $(this.container).find(".pinyinText").text(this.word && this.word.pinyin && this.word.pinyin.fullPhonetic || "");
        }
        if (this.option.lineSpectrumOption.isShow && this.option.lineSpectrumOption.isNeedAudio) {
            const url = chineseNoAudio;
            $(this.container).find(".pinyinHorn").css("background", `url(${url}) no-repeat right center/14px 14px`);
            this.isAudioCanPlay = false;
        }
        if (this.option.lineSpectrumOption.isShow && this.word) {
            $(this.container).find(".pinyinBox").append(`<audio crossOrigin="anonymous" src="${this.option.definedAudioUrl + word.pinyin.phonetic}.mp3?t=${new Date(this.word.pinyin.phoneticUpdateTime).getTime()}" class="pinyinAudio"></audio>`)
        } else {
            $(this.container).find(".pinyinBox .pinyinAudio").remove();
        }

        if (this.option.lineSpectrumOption.isShow && this.option.lineSpectrumOption.isNeedAudioListSwitch) {
            if (this.word && this.word.pinyins.length > 1) {
                $(this.container).find(".pinyinBox").append(`
                <span class="audioListSwitch" style="cursor:pointer; width: 20px; height: 20px; background: url(${pinyinSwitch}) no-repeat right bottom/12px 12px;position: absolute;right: 0;bottom: 0;display:block"></span>
                <ul class="pinyinList" style="display: none;width:100%;max-height:${this.option.lineSpectrumOption.pinyinSelectHeight * 4}px">
                    ${
                    word && word.pinyins.map((pinyin, index) => {
                        const className = pinyin === word.pinyin ? "active" : "";
                        return `<li class="pinyin ${className}" style="width:100%;height:${this.option.lineSpectrumOption.pinyinSelectHeight}px">${pinyin.fullPhonetic}</li>`
                    }).join("")
                    }
                </ul>

                `)
            } else {
                $(this.container).find(".pinyinBox").find(".audioListSwitch,.pinyinList").remove();
            }
        }
        if (this.hanziWriter) {
            if (this.word) {
                this.hanziWriter.setCharacter(this.word.word);
                this.hanziWriter.showCharacter();
            } else {
                this.hanziWriter.hideCharacter({ duration: 0 });
                this.hanziWriter.hideOutline({ duration: 0 })
            }
        } else {
            this.hanziWriter = window.HanziWriter.create($(this.container).find(".tinWordBox .tianWord")[0], word.word, {
                width: this.option.tinWordFormatOption.border.length,
                height: this.option.tinWordFormatOption.border.length,
                ...this.option.hanziWriterOption,
                charDataLoader:(char, onComplete) => {
                    $.getJSON(this.option.definedStrokeUrl + Util.ch2Unicode(char) + ".json?t="+new Date(word.characterUpdateTime).getTime(), function(charData) {
                        onComplete(charData);
                    });
                },//配置请求笔顺文件地址
                showCharacter: Boolean(this.word)
            });
        }

        this.initEvent();
    }
    /**
 *
 * @param option
 * border为田字格边框配置；
 * crossLine为4条交叉线的配置，数组形式，0-横线，1-竖线，2-右斜线，3-左斜线;
 * backgroundColor为田字格背景色；
 */
    /**
     * 整合田字格配置；
     * @param option
     */
    tinWordFormatSvgString(option?: TinWordFormatOption): string {
        let svghtml = `<svg xmlns="http://www.w3.org/2000/svg" width="${option.border.length}" height="${option.border.length}" class="tianWord">
                        ${option.crossLine[0] ? `<line x1="0" y1="${option.border.length / 2}" x2="${option.border.length}" y2="${option.border.length / 2}" stroke="${option.crossLine[0].color}" stroke-width="${option.crossLine[0].weight}" stroke-dasharray="${option.crossLine[0].dasharray}"/>` : ``}
                        ${option.crossLine[1] ? `<line x1="${option.border.length / 2}" y1="0" x2="${option.border.length / 2}" y2="${option.border.length}" stroke="${option.crossLine[1].color}" stroke-width="${option.crossLine[1].weight}" stroke-dasharray="${option.crossLine[1].dasharray}"/>` : ``}
                        ${option.crossLine[2] ? `<line x1="0" y1="0" x2="${option.border.length}" y2="${option.border.length}" stroke="${option.crossLine[2].color}" stroke-width="${option.crossLine[2].weight}" stroke-dasharray="${option.crossLine[2].dasharray}"/>` : ``}
                        ${option.crossLine[3] ? `<line x1="${option.border.length}" y1="0" x2="0" y2="${option.border.length}" stroke="${option.crossLine[3].color}" stroke-width="${option.crossLine[3].weight}" stroke-dasharray="${option.crossLine[3].dasharray}"/>` : ``}
                        <rect x="${option.border.weight / 2}" y="${option.border.weight / 2}" width="${option.border.length - option.border.weight}" height="${option.border.length - option.border.weight}" stroke-width="${option.border.weight}" stroke="${option.border.color}" fill="${option.backgroundColor}" stroke-dasharray="${option.border.dasharray.toString()}"/>
                    </svg>
                    `
        return svghtml;
    }
    /**
     * 田字格svg node
     * @param option
     */
    tinWordFormatSvgNode(option?: TinWordFormatOption): Element {
        const svgString = this.tinWordFormatSvgString(option);
        return this.getSvgNode(svgString);
    }
    /**
     * 田字格base64
     * @param option
     */
    tinWordFormatBase64(option?: TinWordFormatOption): string {
        let svghtml = this.tinWordFormatSvgString(option);
        let base64 = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svghtml)))}`;
        return base64;
    }
    /**
     * 整合四线谱配置；
     * @param option
     */
    lineSpectrumSvgString(option?: LineSpectrumOption): string {
        let linePositionY = option.lineStyles && option.lineStyles[0] && option.lineStyles[0].weight / 2;
        const width = Math.max(...option.lineStyles.map(linestyle => linestyle.length));
        const height = linePositionY + option.lineGap * (option.lineStyles.length - 1) + option.lineStyles[option.lineStyles.length - 1].weight / 2;
        let svghtml = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                    ${
            option.lineStyles.map(lineStyle => {
                let line = `<line x1="0" y1="${linePositionY}" x2="${0 + lineStyle.length}" y2="${linePositionY}" stroke="${lineStyle.color}" stroke-width="${lineStyle.weight}" stroke-dasharray="${lineStyle.dasharray}"/>`;
                linePositionY += option.lineGap;
                return line;
            }).join("")
            }
                    </svg>`
        return svghtml;
    }
    /**
     * 四线谱 svg node对象；
     * @param option
     */
    lineSpectrumSvgNode(option?: LineSpectrumOption): Element {
        const svgString = this.lineSpectrumSvgString(option);
        return this.getSvgNode(svgString);
    }
    /**
     * 四线谱 base64;
     * @param option
     */
    lineSpectrumBase64(option?: LineSpectrumOption): string {
        let svghtml = this.lineSpectrumSvgString(option);
        let base64 = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svghtml)))}`;
        return base64;
    }

    /**
     * 字符串转为node对象；
     * @param svgString
     */
    getSvgNode(svgString: string): Element {
        const box = document.createElement("div");
        box.innerHTML = svgString;
        return box.children[0];
    }
    dispose() {
        $(this.container).remove();
        this.hanziWriter = null;
    }
}


/**
  * 深度合并
  * @param target
  * @param from
  */
function deepAssign(target, ...from) {
    target = toObject(target);

    for (var s = 0; s < from.length; s++) {
        assign(target, from[s]);
    }

    return target;
};

function isObj(x) {
    var type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
    if (val === null || val === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
    }

    return Object(val);
}

function assignKey(to, from, key) {
    var val = from[key];

    if (val === undefined || val === null) {
        return;
    }

    if (hasOwnProperty.call(to, key)) {
        if (to[key] === undefined || to[key] === null) {
            throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
        }
    }

    if (!hasOwnProperty.call(to, key) || !isObj(val)) {
        to[key] = val;
    } else {
        to[key] = assign(Object(to[key]), from[key]);
    }
}

function assign(to, from) {
    if (to === from) {
        return to;
    }

    from = Object(from);

    for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
            assignKey(to, from, key);
        }
    }

    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(from);

        for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
                assignKey(to, from, symbols[i]);
            }
        }
    }

    return to;
}


export { FormatChinese };