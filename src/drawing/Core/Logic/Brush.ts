

import { RenderStyle } from "common/drawing/GraphLib/OptionConfig";
import { PenLine } from "common/drawing/GraphLib/PenLineForNotes";
import { Point } from "common/drawing/GraphLib/Point";
import { MainLogic } from "../../View/MainLogic";
//画笔绘制相关逻辑
export class Brush {
    public currentPenLine: PenLine;//当前绘制的线条对象
    mainLogic: MainLogic;
    constructor(mainLogic: MainLogic) {
        this.mainLogic = mainLogic;
    }
    public mouseDown(mouseinfo: any) {
        var that = this;
        var p: Point = new Point(mouseinfo.convertMouseInfo.curX, mouseinfo.convertMouseInfo.curY);

        if (!document.getElementById("drawingContainer").querySelector("#canvasBox").classList.contains("cur-pen")) {
            // setTimeout(() => {
            document.getElementById("drawingContainer").querySelector("#canvasBox").classList.add("cur-pen");
            // }, 100)
        }

        that.currentPenLine = new PenLine(new RenderStyle(true, false, this.mainLogic.upper_main.toolBox.penTool.currentLineColor, this.mainLogic.upper_main.toolBox.penTool.currentLineColor, this.mainLogic.upper_main.toolBox.penTool.currentLineWidth, false, [], "round", "round"));
        that.currentPenLine.addPoint(p);
        that.mainLogic.mainDraw.BrushLayer.add(that.currentPenLine);
        that.mainLogic.currentTemplate.penLineHashTable.set(that.currentPenLine.colorKey, that.currentPenLine);
        // this.layer.draw();
    }
    public dragMove(mouseinfo: any) {
        var that = this;
        var p: Point = new Point(mouseinfo.convertMouseInfo.curX, mouseinfo.convertMouseInfo.curY);

        if (!that.currentPenLine)
            return;
        that.currentPenLine.addPoint(p, true);
        this.currentPenLine.renderStyle.isStroke = true;
        this.currentPenLine.renderStyle.isFill = false;
        // this.layer.draw();
        // let currentPointIndex = this.currentPenLine.getPoints().length - 1;
        this.currentPenLine.drawAddPoint(this.mainLogic.mainDraw.drawingLayer.canvasContext, false);//笔锋
    }
    public dragUp(mouseinfo: any) {
        var that = this;
        var p: Point = new Point(mouseinfo.convertMouseInfo.curX, mouseinfo.convertMouseInfo.curY);

        if (!that.currentPenLine) {
            return;
        } else {
            this.currentPenLine.addPoint(p, true);
            this.currentPenLine.drawAddPoint(this.mainLogic.mainDraw.drawingLayer.canvasContext, true);//笔锋
            this.mainLogic.mainDraw.drawingLayer.clearContext();
            // this.layer.draw();

            this.mainLogic.pushData();

        }
        that.currentPenLine = null;
    }
    public mouseUp(mouseinfo: any) {
        if (this.currentPenLine) {
            var p: Point = new Point(mouseinfo.convertMouseInfo.curX, mouseinfo.convertMouseInfo.curY);
            this.currentPenLine.addPoint(p);
            this.mainLogic.mainDraw.BrushLayer.draw();
            this.currentPenLine = null;

            this.mainLogic.pushData();
        }
    }
    public deleteFirstDownPoint() {
        let that = this;
        if (that.currentPenLine) {
            that.currentPenLine.removeSelf();
            that.mainLogic.currentTemplate.penLineHashTable.del(that.currentPenLine.colorKey);
            that.currentPenLine=null;
        }
    }
}
