import { Point } from "common/drawing/GraphLib/Point";
import * as PointerEvent from "common/utility/PointerEvent";
import { Main } from "..";
import { MouseInfo } from "../Core/Global";
import { Brush } from "../Core/Logic/Brush";
import { MainDraw } from "../Core/Logic/MainDraw";
import { Rubber } from "../Core/Logic/Rubber";
import { TemplateBase } from "../Core/Model/TemplateBase";
import { ModleState } from "./ToolBox";
import { UndoRedo } from "./UndoRedo";
import { HashTable } from "common/utility/DataStructure";
import { ImageTemplate } from "../Core/Model/ImageTemplate";
import { WordTemplate } from "../Core/Model/WordTemplate";
import { RegionConfig, RenderStyle } from "common/drawing/GraphLib/OptionConfig";
import { PenLine } from "common/drawing/GraphLib/PenLineForNotes";
import {templateConfig,bgColorConfig} from '../TemplateConfig';
import { FangGe } from "common/drawing/GraphLib/FangGe";
export class MainLogic {
    brush: Brush;//画笔
    rubber: Rubber;//橡皮
    mainDraw: MainDraw;//绘图层
    mouseDownPoint: Point;

    // 事件状态管理
    isDragTextScale: boolean = false;
    upper_main: Main;
    currentTemplate: TemplateBase;
    templates: HashTable<TemplateBase>;
    templateConfig: any;

    constructor(main: Main) {

        this.templateConfig = templateConfig;
        this.mainDraw = new MainDraw("canvasBox");
        this.upper_main = main;
      
        this.brush = new Brush(this);
        this.rubber = new Rubber(this);
        // this.template=new TemplateBase();
        this.templates = new HashTable<TemplateBase>();
        this.initTemplates();
        this.initBgColor()
    }
    //根据配置文件templateConfig.json配置内容初始化模板集合，将第一个置为当前模板
    initTemplates() {

        this.templateConfig.forEach(templateConfig => {
            if (!templateConfig.isShow)
                return;
            let template;
            if (templateConfig.type == "image") {
                template = new ImageTemplate(templateConfig.name, templateConfig.image, this.mainDraw.canvasSize);
            } else {
                template = new WordTemplate(templateConfig.name, this.mainDraw.canvasSize);
            }
            this.templates.set(templateConfig.name, template);
        });
        this.changeTemplate("Default");
    }
    async initBgColor(){
        let that=this;
        let bgsStr = [];
        let bgColorUl= <HTMLUListElement>document.getElementById("drawingContainer").querySelector("#bdColor_ul");
        //获取小画板用户设置的背景色
        let setColorName='gray';
        //获取背景颜色 请求接口
        // let res=await getDrawingTheme({userId:that.userId,token:that.token})
        // let data=res.data;
        // if(data.bgTheme)
        //     setColorName=data.bgTheme;
        
        bgColorConfig.forEach((item: any) => {
            if(setColorName==item.name){
                bgsStr.push(`<li data-name="${item.name}" data-color="${item.color}" style="background-color:${item.color}" class="active"></li>`);
            }else{
                bgsStr.push(`<li data-name="${item.name}" data-color="${item.color}" style="background-color:${item.color}"></li>`);
            }
        });
        that.changeTheme(setColorName);

        //初始化背景颜色块 并设置点击事件
        bgColorUl.innerHTML = bgsStr.join('');
        $(bgColorUl).on('click', 'li', (e) => {
            let activeLi= bgColorUl.querySelector(".active");
            activeLi&&activeLi.removeAttribute("class")
            $(e.currentTarget).addClass('active');
            let seletedBdcolorName=(<HTMLElement>e.currentTarget).dataset['name'];
            that.changeTheme(seletedBdcolorName)
            //设置背景颜色 请求接口
            // if (that.upper_main.vm.$store.state && !that.upper_main.vm.$store.state.isTrial) {//如果不是试用模式
            //     setDrawingTheme({userId:that.userId,bgTheme:seletedBdcolorName},that.token);
            // }
            that.mainDraw.mainStageDraw();
        })
    }

    changeTheme(setColorName){
        let that=this;
        let seletedBdcolor=bgColorConfig.filter((item)=>{return item.name==setColorName})[0];
        //设置练习格线条颜色
        that.templates.foreach((index,item:WordTemplate)=>{
            if(item.lianXiGe){
                (<FangGe>item.lianXiGe).lianXiGeConfig.dashLineColor=seletedBdcolor.gridColor;
                (<FangGe>item.lianXiGe).renderStyle.strokeColor=(<FangGe>item.lianXiGe).lianXiGeConfig.lineColor=seletedBdcolor.gridColor;
            }
        })
        //设置背景色
        let canvasBox=<HTMLDivElement>document.getElementById("drawingContainer").querySelector("#canvasBox")
        canvasBox.style.background=seletedBdcolor.color;

        //设置画笔颜色
        if(seletedBdcolor.penColor.indexOf(that.upper_main.toolBox.penTool.getCurrentLineColor())<0){
            that.upper_main.toolBox.setActivePenColor(seletedBdcolor.penColorName[0],seletedBdcolor.penColor[0]);
        }
    }
    //点击切换背景，根据传来的key取值template，赋值到this.template,将背景内容添加到mainLayer，笔迹添加到brushLayer
    //undo步骤列表清空 重新算起
    changeTemplate(templateName: string) {
        let that = this;
        if (!this.currentTemplate || templateName != this.currentTemplate.templateName) {
            this.currentTemplate = this.templates.get(templateName);
            this.currentTemplate.initPromise.then(() => {
                that.mainDraw.mainLayer.destroyChildren();
                that.mainDraw.BrushLayer.destroyChildren();

                that.currentTemplate.changeLayer(that.mainDraw.mainLayer, that.mainDraw.BrushLayer);
                that.mainDraw.mainStageDraw();
            })

            this.upper_main.UndoRedo.clearStep();
            this.upper_main.UndoRedo.addStep(this.getSaveData());
        }
    }
    mouseDown(event: PointerEvent.PointerEventInfo) {

        var mouseInfo = new MouseInfo(event.pageX, event.pageY, event.lastX, event.lastY);
        // 坐标转换
        var mouseInfo = new MouseInfo(event.pageX, event.pageY, event.lastX, event.lastY);
        var convertMouseInfo = this.mainDraw.convertMouseInfo(mouseInfo);
        event.contextX = convertMouseInfo.curX;
        event.conttextY = convertMouseInfo.curY;
        event.lastContextX = convertMouseInfo.lastX;
        event.lastContextY = convertMouseInfo.lastY;

        if (this.upper_main.toolBox.modleState == ModleState.pointer) {

        } else if (this.upper_main.toolBox.modleState == ModleState.pen) {
            if (this.upper_main.toolBox.penTool.isEraser == false) {
                this.brush.mouseDown({ mouseInfo: mouseInfo, convertMouseInfo: convertMouseInfo });
            } else {
                this.rubber.mouseDown({ mouseInfo: mouseInfo, convertMouseInfo: convertMouseInfo });
            }
        }

    }
    mouseUp(event: PointerEvent.PointerEventInfo) {
        // 坐标转换
        var mouseInfo = new MouseInfo(event.pageX, event.pageY, event.lastX, event.lastY);
        var convertMouseInfo = this.mainDraw.convertMouseInfo(mouseInfo);
        event.contextX = convertMouseInfo.curX;
        event.conttextY = convertMouseInfo.curY;
        event.lastContextX = convertMouseInfo.lastX;
        event.lastContextY = convertMouseInfo.lastY;
        // 坐标转换完
        if (this.upper_main.toolBox.modleState == ModleState.pointer) {

        } else if (this.upper_main.toolBox.modleState == ModleState.pen) {
            if (this.upper_main.toolBox.penTool.isEraser == false) {
                this.brush.mouseUp({ mouseInfo: mouseInfo, convertMouseInfo: convertMouseInfo });
            } else {
                this.rubber.mouseUp({ mouseInfo: mouseInfo, convertMouseInfo: convertMouseInfo });
            }
            this.mainDraw.BrushLayerDraw();
        }
    }
    mouseMove(event: PointerEvent.PointerEventInfo) {
        // 坐标转换

    }
    dragUp(event: PointerEvent.PointerEventInfo) {
        // 坐标转换
        var mouseInfo = new MouseInfo(event.pageX, event.pageY, event.lastX, event.lastY);
        var convertMouseInfo = this.mainDraw.convertMouseInfo(mouseInfo);
        event.contextX = convertMouseInfo.curX;
        event.conttextY = convertMouseInfo.curY;
        event.lastContextX = convertMouseInfo.lastX;
        event.lastContextY = convertMouseInfo.lastY;

        if (this.upper_main.toolBox.modleState == ModleState.pointer) {

        } else if (this.upper_main.toolBox.modleState == ModleState.pen) {
            if (this.upper_main.toolBox.penTool.isEraser == false) {
                this.brush.dragUp({ mouseInfo: mouseInfo, convertMouseInfo: convertMouseInfo });
            } else {
                this.rubber.dragUp({ mouseInfo: mouseInfo, convertMouseInfo: convertMouseInfo });
            }
            this.mainDraw.BrushLayerDraw();
        }
    }
    dragMove(event: PointerEvent.PointerEventInfo) {
        // 坐标转换
        var mouseInfo = new MouseInfo(event.pageX, event.pageY, event.lastX, event.lastY);
        var convertMouseInfo = this.mainDraw.convertMouseInfo(mouseInfo);
        event.contextX = convertMouseInfo.curX;
        event.conttextY = convertMouseInfo.curY;
        event.lastContextX = convertMouseInfo.lastX;
        event.lastContextY = convertMouseInfo.lastY;
        if (this.upper_main.toolBox.modleState == ModleState.pointer) {
            this.mainDraw.translateCanvas(this.mainDraw.mainStage, convertMouseInfo.curX - convertMouseInfo.lastX, convertMouseInfo.curY - convertMouseInfo.lastY);
            this.mainDraw.ensureTranslateLimit();
            this.mainDraw.mainStageDraw();
        } else if (this.upper_main.toolBox.modleState == ModleState.pen) {
            if (this.upper_main.toolBox.penTool.isEraser == false) {
                this.brush.dragMove({ mouseInfo: mouseInfo, convertMouseInfo: convertMouseInfo });
            } else {
                this.rubber.dragMove({ mouseInfo: mouseInfo, convertMouseInfo: convertMouseInfo });
            }
        }
    }
    wheel(event: PointerEvent.PointerEventInfo) {
        if ((<any>event).delta > 0) {
            var scaleDiff = 1.05;
        } else {
            var scaleDiff = 1 / 1.05;
        }
        let scale = this.mainDraw.canvasSize.initedScale * scaleDiff;
        if (scale < 1)
            scale = 1;
        else if (scale > 5)
            scale = 5;

        this.scale(scale, new Point(event.evt.pageX, event.evt.pageY));
        this.upper_main.changeScaleSlider(scale);
    }
    /**
    * 缩放画布
    * @param scale 缩放目标值
    * @param scalePoint 缩放中心点
    * @returns
    */
    scale(scale: number, scalePoint: Point = null) {
        if (!scalePoint) {
            scalePoint=new Point(this.mainDraw.canvasSize.width / 2, this.mainDraw.canvasSize.height / 2);
        }
        var convertMouseInfo = this.mainDraw.convertMouseInfo(new MouseInfo(scalePoint.x, scalePoint.y, 0, 0));
        this.mainDraw.mainStage.scaleCanvas(scale / this.mainDraw.canvasSize.initedScale, new Point(convertMouseInfo.curX, convertMouseInfo.curY));
        this.mainDraw.ensureTranslateLimit();
        this.mainDraw.mainStageDraw();
        this.mainDraw.canvasSize.initedScale = scale;
    }

    pushData() {
        let data = this.getSaveData();
        this.upper_main.UndoRedo.addStep(data);
        // document.getElementById("drawingContainer").querySelector("undo').classList.add('active");
    }
    getSaveData() {
        return { penlines: this.currentTemplate.penLineHashTable.serialize() };
    }
    initPenLineByConfig(param: any) {
        this.mainDraw.BrushLayer.destroyChildren();
        this.currentTemplate.penLineHashTable = new HashTable<PenLine>();
        param.penlines && param.penlines.itemList.forEach((penlineConfig: any) => {
            let penLineVal = penlineConfig.value;
            let penLine: PenLine, renderStyle: RenderStyle;
            renderStyle = new RenderStyle(penLineVal.renderStyle.isFill, penLineVal.renderStyle.isStroke, penLineVal.renderStyle.fillColor, penLineVal.renderStyle.strokeColor, penLineVal.renderStyle.lineWidth, penLineVal.renderStyle.isClosePath, penLineVal.renderStyle.lineDash, penLineVal.renderStyle.lineJoin, penLineVal.renderStyle.lineCap)
            penLine = new PenLine(renderStyle);
            penLine.isDraw = penLineVal.isDraw;//设置绘制信息
            penLine.isDrawHit = penLineVal.isDrawHit;
            penLineVal.points.forEach((point: any) => {
                let newPoint = new Point(point.x, point.y);
                newPoint.setLineWidth(point.lineWidth);
                (<PenLine>penLine).addPoint(newPoint);
            });
            this.currentTemplate.penLineHashTable.set(penLine.colorKey, penLine);
            this.mainDraw.BrushLayer.add(penLine);   //需要根据index排序后再加到layer上面
        })
        this.mainDraw.BrushLayer.draw();
    }
    getSelectOnStage(p: Point) {
        var shape = this.mainDraw.getSelectOnStage(p);
        return shape;
    }
    //删除笔迹元素
    delPenline(penline: PenLine) {
        penline.removeSelf();
        this.currentTemplate.delete(penline.colorKey);
    }
    addPenline(penline: PenLine) {
        this.mainDraw.BrushLayer.add(penline);
        this.currentTemplate.penLineHashTable.set(penline.colorKey, penline);
    }
    //删除所有笔迹
    clearPenLine() {
        this.mainDraw.BrushLayer.destroyChildren();
        this.currentTemplate.clearPenLine();
        this.mainDraw.BrushLayerDraw();
    }
}
