
require("./index.less");
require("./assets/js/jquery-3.2.1.js");
import { Point } from "common/drawing/GraphLib/Point";
import { DomEventType, EventManger } from 'common/utility/EventManger';
import * as PointerEvent from "common/utility/PointerEvent";
import { StateManger } from 'common/utility/StateManger';
import { TemplateBase } from './Core/Model/TemplateBase';
import { WordTemplate } from './Core/Model/WordTemplate';
import { MainLogic } from './View/MainLogic';
import { ToolBox } from './View/ToolBox';
import { UndoRedo } from "./View/UndoRedo";
import { ModleState } from "./View/ToolBox";

import shangxiadrag from './images/shangxiadrag.png';
import pencilShort from './assets/svg/pencil-short.svg';
import delNone from './images/del-none.png';
import delRed from './images/del-red.png';

import smallDrawing01 from './images/small-drawing_01.png';
import smallDrawing02 from './images/small-drawing_02.png';
import smallDrawing03 from './images/small-drawing_03.png';
import smallDrawing04 from './images/small-drawing_04.png';
import smallDrawing08 from './images/small-drawing_08.png';
import smallDrawing09 from './images/small-drawing_09.png';
import smallDrawing10 from './images/small-drawing_10.png';
import smallDrawing11 from './images/small-drawing_11.png';
import './assets/font/iconfont.css';
// var vConsole = require("vconsole");
// new vConsole();
export class Main {

    /**
     * 全局状态管理
     */
    stateManger: StateManger;
    /**
     * 全局事件处理代理
     */
    eventManger: EventManger;

    mainLogic: MainLogic;
    toolBox: ToolBox;
    UndoRedo: UndoRedo;//撤销回退

    isDragBottom: boolean = false;//是否是拖拽底部上下改变高度
    isDragSliderBtn: boolean = false;//是否是拖拽缩放滑块条
    preModleState: ModleState = null;
    isSmallScreen:boolean=false;
    iframeBottom:number=null;//小画板iframe设置的bottom值
    constructor() {
        this.stateManger = new StateManger();//初始化全局数据管理
        this.eventManger =new EventManger();//初始化全局事件管理器
        this.UndoRedo = new UndoRedo(this.stateManger, this.eventManger, 'drawing');
        this.toolBox = new ToolBox();
        this.mainLogic = new MainLogic(this);


        (<any>document.getElementById("drawingContainer").oncontextmenu) = new Function("event.returnValue=false;");
        ((<any>document.getElementById("drawingContainer")).onselectstart) = new Function("event.returnValue=false;");
        if(window.screen.width<1280){
            this.isSmallScreen = true;
            $("#drawingContainer #process-btn").css("margin-left", 'calc(24% - '+24+'px)');
            document.getElementById("drawingContainer").getElementsByClassName("drawing-footer")[0].classList.add("small");
        }
        this.initAllEvent();
    }

    /**
         * 初始化事件
         */
    initAllEvent() {
        this.initMousedown();//初始化按下
        this.initDrag();//初始化移动
        this.initMouseup();//初始化松开
        this.initDragup();//初始化拖拽松开
        this.initMousemove();
        this.initfiveFingerMove();//初始化两指事件
        this.initmoreMoveEnd();//初始化两指缩放移动结束事件
        this.initmoreFingerDown();
        this.initWheelEvent();
        this.initUndo();
        this.processDrag();

        // window.addEventListener("visibilitychange", () => {//解决在pad上切换到其他webView后 再切换回来 canvas内容清空的问题
        //     this.mainLogic.mainDraw.mainStageDraw();
        // });
        // window.addEventListener('pageshow', () => {
        //     this.mainLogic.mainDraw.mainStageDraw();
        // });
        window.addEventListener('resize', () => {
            //如果是拖拽底部条改变高度，需要有黑板推上去拉下来的效果
            if (this.isDragBottom) {
                //本身高度仍然大于显示区域，不需重新计算。否则为了把画布撑满还是需要重新计算
                if (this.mainLogic.mainDraw.canvasSize.height >= window.innerHeight - 64)
                    return;
            }
            this.mainLogic.mainDraw.setCanvasSize(window.innerWidth, window.innerHeight - 64, this.mainLogic.mainDraw.canvasSize.initedScale);
            this.mainLogic.mainDraw.mainStage.changeStageSize(window.innerWidth, window.innerHeight - 64);
            this.mainLogic.mainDraw.ensureTranslateLimit();//纠正坐标，维护画布大小
            //每个模板的坐标值纠正
            this.mainLogic.templates.foreach((key, template: TemplateBase) => {
                if (template.className == "WordTemplate")
                    (<WordTemplate>template).resetLianXiGeSize(this.mainLogic.mainDraw.canvasSize);
            })
            this.mainLogic.mainDraw.mainStageDraw();
        });
    }

    initMousedown() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.pointerDown, function (e: PointerEvent.PointerEventInfo) {
            if ((<HTMLElement>e.target).id == "canvasBox" || ((<HTMLElement>e.target).parentElement && (<HTMLElement>e.target).parentElement.id == "canvasBox")) {
                that.mainLogic.mouseDown(e);
            }
            //画布线条二级菜单收回
            let eventPath = (<PointerEvent>e.evt).propagationPath();
            let isDownLine = eventPath.some((t: HTMLElement) => { return t.id == 'line' || t.id == "line_list" });
            if (!isDownLine) {
                $("#drawingContainer #line_list").hide();
            }
            //橡皮二级菜单收回
            let isDownEraser = eventPath.some((t: HTMLElement) => { return t.id == 'eraser' || t.id == "eraser-totle" });
            if (!isDownEraser) {
                $("#drawingContainer #eraser-totle").hide();
            }
            //背景二级菜单收回
            let isDownBackground = eventPath.some((t: HTMLElement) => { return t.id == 'template-tool-box' || t.id == "background" });
            if (!isDownBackground) {
                that.toolBox.hideTemplateBox();
            }

            //点击到滑块条按钮
            that.isDragSliderBtn = eventPath.some((t: HTMLElement) => { return t.id == 'process-btn' });

            //是否点击到滑块条
            if (!that.isDragSliderBtn) {
                let isDownSlider = eventPath.some((t: HTMLElement) => { return t.id == 'process-box' });
                if (isDownSlider) {
                    let baifenbi = Math.max(24, Math.min(100, e.evt.offsetX / (that.isSmallScreen?100:200) * 100));
                    let marginLeft=that.isSmallScreen?24:48;
                    $("#drawingContainer #process-btn").css("margin-left", 'calc(' + baifenbi + '% - '+marginLeft+'px)');
                    $("#drawingContainer #processing-slider").css("width", baifenbi + '% ');
                    let scale = 1 + ((baifenbi - 24) / (100 - 24)) * 4;
                    that.mainLogic.scale(scale, new Point(0, 0));
                    document.getElementById("drawingContainer").querySelector("#scale-num").innerHTML = Math.round(scale * 100) + "%";
                }
            }
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('drawing', handler, document.getElementById("drawingContainer"))
    }
    initMouseup() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.pointerUp, function (e: PointerEvent.PointerEventInfo) {
            if ((<HTMLElement>e.target).id == "canvasBox" || ((<HTMLElement>e.target).parentElement && (<HTMLElement>e.target).parentElement.id == "canvasBox")) {
                that.mainLogic.mouseUp(e)
            }
            that.isDragSliderBtn = false;
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('drawing', handler, document.getElementById("drawingContainer"));
    }
    initMousemove() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.pointerMove, function (e: PointerEvent.PointerEventInfo) {
            if ((<HTMLElement>e.target).id == "canvasBox" || ((<HTMLElement>e.target).parentElement && (<HTMLElement>e.target).parentElement.id == "canvasBox")) {
                that.mainLogic.mouseMove(e)
            }
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('drawing', handler, document.getElementById("drawingContainer"));
    }
    initDrag() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.dragMove, function (e: PointerEvent.PointerEventInfo) {
            //在画布上拖拽 画线 擦除 或者移动画布
            if ((<HTMLElement>e.target).id == "canvasBox" || ((<HTMLElement>e.target).parentElement && (<HTMLElement>e.target).parentElement.id == "canvasBox")) {
                that.mainLogic.dragMove(e)
            }
            //底部黑色条 拖拽改变高度
            else if (e.target&&((<HTMLElement>e.target).id=="imgDrag" || (<HTMLElement>e.target).classList.contains("drawing-footer") || (<HTMLElement>e.target).classList.contains("drag"))) {
                that.isDragBottom = true;
                let diffY = e.noRoteDiffY;
                let curHeight = document.getElementById("drawingContainer").querySelector("#containter").clientHeight;// window.innerHeight;
                // if (diffY < 0 && curHeight + diffY < 160){
                //     return;
                // }
                // if (diffY > 0 && curHeight + diffY > window.top.innerHeight){
                //     return;
                // }
                let setHeight = Math.max(160, Math.min(window.top.innerHeight, curHeight + diffY));
                that.iframeBottom = window.top.innerHeight - setHeight;

                setTimeout(() => {
                    that.changeIframeSize({ width: null, height: 'calc(100% - 0px)' });
                    (<HTMLElement>document.getElementById("drawingContainer").querySelector("#containter")).style.height='calc(100% - ' +  that.iframeBottom + 'px)';
                }, 0);

            } else if (that.isDragSliderBtn) {
                let procesBox = document.getElementById("drawingContainer").querySelector("#process-box");
                let boundingClientRect = procesBox.getBoundingClientRect();
                if (e.pageX >= boundingClientRect.left && e.pageX <= boundingClientRect.right) {
                    let diffX = e.noRoteDiffX;
                    let oldWidth = $("#drawingContainer #processing-slider").width() / (that.isSmallScreen?100:200)  * 100;
                    let baifenbi = Math.max(24, Math.min(100, oldWidth + diffX / (that.isSmallScreen?100:200)  * 100));
                    let marginLeft=that.isSmallScreen?24:48;
                    $("#drawingContainer #process-btn").css("margin-left", 'calc(' + baifenbi + '% - '+marginLeft+'px)');
                    $("#drawingContainer #processing-slider").css("width", baifenbi + '% ');
                    let scale = 1 + ((baifenbi - 24) / (100 - 24)) * 4;
                    that.mainLogic.scale(scale, new Point(0, 0));
                    document.getElementById("drawingContainer").querySelector("#scale-num").innerHTML = Math.round(scale * 100) + "%";
                }
            }
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('drawing', handler, document.getElementById("drawingContainer"));
    }
    /**
     *
     * @param {*} widthHeightValue 更改iframe的宽高
     */
    changeIframeSize(widthHeightValue) {
      var target = document.getElementById("drawingContainer");
      if (target) {
        !widthHeightValue.width && (<HTMLElement>target).style.removeProperty("width");
        !widthHeightValue.height && (<HTMLElement>target).style.removeProperty("height");
        widthHeightValue.width && ((<HTMLElement>target).style.width = widthHeightValue.width);
        widthHeightValue.height &&
          ((<HTMLElement>target).style.height = widthHeightValue.height);
      }
    }
    initDragup() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.dragEnd, function (e: PointerEvent.PointerEventInfo) {
            if ((<HTMLElement>e.target).id == "canvasBox" || ((<HTMLElement>e.target).parentElement && (<HTMLElement>e.target).parentElement.id == "canvasBox")) {
                that.mainLogic.dragUp(e);
            }
            //加上延迟，否则鼠标款速拖拽释放鼠标后触犯resize isDragBottom=true的情况
            if(that.isDragBottom){
                setTimeout(() => {
                    that.changeIframeSize({ width: null, height: 'calc(100% - ' + that.iframeBottom + 'px)' });
                    (<HTMLElement>document.getElementById("drawingContainer").querySelector("#containter")).style.height='100%';
                }, 0);

            }
            window.setTimeout(() => {
                that.isDragBottom = false;
            }, 200)
            that.isDragSliderBtn = false;
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('drawing', handler, document.getElementById("drawingContainer"));
    }
    /**
     * 初始化控制坐标系缩放的事件
     */
    initWheelEvent() {
        let that = this;
        this.eventManger.registerDomEvent('drawing', DomEventType.mousewheel, function (e: PointerEvent.PointerEventInfo) {
            if ((<HTMLElement>e.target).id == "canvasBox" || ((<HTMLElement>e.target).parentElement && (<HTMLElement>e.target).parentElement.id == "canvasBox")) {
                that.mainLogic.wheel(e);
            }
        }, document.getElementById("drawingContainer"), this)
    }
    initfiveFingerMove() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.fiveFingerMove, function (e: PointerEvent.PointerEventInfo) {
            if ((<HTMLElement>e.target).id == "canvasBox" || ((<HTMLElement>e.target).parentElement && (<HTMLElement>e.target).parentElement.id == "canvasBox")) {
                if (!that.preModleState) {
                    that.preModleState = that.toolBox.modleState;
                    that.toolBox.modleState = ModleState.pointer;
                }
                that.mainLogic.brush.deleteFirstDownPoint();
                that.mainLogic.dragMove(e)
            }
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('drawing', handler, document.getElementById("drawingContainer"));
    }
    initmoreMoveEnd() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.moreFingerEnd, function (e: PointerEvent.PointerEventInfo) {
            if ((<HTMLElement>e.target).id == "canvasBox" || ((<HTMLElement>e.target).parentElement && (<HTMLElement>e.target).parentElement.id == "canvasBox")) {                // that.mainLogic.moreMoveEnd(e)
                if (that.preModleState)
                    that.toolBox.modleState = that.preModleState;
                that.preModleState = null;
            }
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('drawing', handler, document.getElementById("drawingContainer"));
    }
    initmoreFingerDown() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.moreFingerDown, function (e: PointerEvent.PointerEventInfo) {
            if ((<HTMLElement>e.target).id == "canvasBox" || ((<HTMLElement>e.target).parentElement && (<HTMLElement>e.target).parentElement.id == "canvasBox")) {                // that.mainLogic.moreMoveEnd(e)
                that.mainLogic.brush.deleteFirstDownPoint();
            }
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('drawing', handler, document.getElementById("drawingContainer"));
    }
    initUndo() {
        let that = this;
        //初始化就需要推送第零步
        this.UndoRedo.addStep(this.mainLogic.getSaveData());
        this.UndoRedo.registerCallback((stateId: string, stateData: any, step: number) => {

        }, (stateId: string, stateData: any, step: number) => {
            //上一步的回调
            that.mainLogic.initPenLineByConfig(stateData);
            // that.functionTool.mainLogic.dataHandler.initModleByConfig(stateData)
        })

    }
    changeScaleSlider(scale: number) {
        let baifenbi = (scale - 1) / 4 * (100 - 24) + 24;
        let marginLeft=this.isSmallScreen?24:48;
        $("#drawingContainer #process-btn").css("margin-left", 'calc(' + baifenbi + '% - '+marginLeft+'px)');
        $("#drawingContainer #processing-slider").css("width", baifenbi + '% ');
        document.getElementById("drawingContainer").querySelector("#scale-num").innerHTML = Math.round(scale * 100) + "%";
    }
    processDrag() {
        // debugger
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.dragMove, (e: PointerEvent.PointerEventInfo) => {
            this.toolBox.templateTool.dragMove(e);
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('drawing-template', handler, document.getElementById("drawingContainer").querySelector('#group-bg-box'));
    }
}


window.drawing = new Main();
