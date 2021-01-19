import { Stage } from "common/drawing/GraphLib/Stage";
import { Layer } from "common/drawing/GraphLib/Layer";
import { Point } from "common/drawing/GraphLib/Point";
import { XlMath } from "common/drawing/GraphLib/XlMath";
import { MouseInfo, XYRange } from "../Global";
import { RegionConfig } from "common/drawing/GraphLib/OptionConfig";
/*
主要负责画布绘制
*/
export class MainDraw {
    static screenRangeXY: XYRange;// xy范围的最大最小值

    static canvasRangeXY: XYRange;// xy范围的最大最小值

    maxScale: number = 5;// 太大圆无法填充成实心圆，太小文字绘制字号有问题

    minScale: number = 1;// 太大圆无法填充成实心圆，太小文字绘制字号有问题

    mainStage: Stage;// 包含所有绘图层

    mainLayer: Layer;// 主要绘图背景

    BrushLayer: Layer;// 绘制笔迹

    drawingLayer: Layer;// 正在画线时使用这个layer绘制当前绘制线条

    savedCenter: any;

    savedScale: number;

    canvasSize: RegionConfig;

    containerId: string;

    constructor(containerId: string) {
        this.containerId = containerId;
        // 其他应用使用的screen的宽高，能使最大化后依然整个显示区域能画，现在因为底部黑色区域是透明的 画布又能够移动缩放，所以不能使用最大尺寸的画布了，否则底部黑色区域能看到线条
        // this.mainStage = new Stage(containerId, window.screen.width, window.screen.height)

        this.mainStage = new Stage(containerId, window.innerWidth, window.innerHeight - 64)
        this.mainLayer = new Layer("main");
        this.drawingLayer = new Layer("drawing");
        this.BrushLayer = new Layer("brush");

        this.mainStage.add(this.mainLayer);
        this.mainStage.add(this.BrushLayer);
        this.mainStage.add(this.drawingLayer);

        this.setCanvasSize(window.innerWidth, window.innerHeight - 64, 1);

        setTimeout(() => { // 等待坐标系计算初始化完成
            this.mainStageDraw();
        }, 0);
    }

    setCanvasSize(w, h, scale) {
        (<HTMLElement>document.getElementById("drawingContainer").querySelector("#" + this.containerId)).style.height = h + "px";
        this.canvasSize = new RegionConfig(0, 0, w, h, scale);
        MainDraw.screenRangeXY = this.getScreenRange();// 维护屏幕尺寸范围
        MainDraw.canvasRangeXY = this.getLimits();// 画布极限值
    }

    mainStageDraw() {
        this.mainStage.draw();
    }

    mainLayerDraw() {
        this.mainLayer.draw();
    }

    drawingLayerDraw() {
        this.drawingLayer.draw();
    }

    BrushLayerDraw() {
        this.BrushLayer.draw();
    }

    translateCanvas(container: any, diffX: number, diffY: number) {
        container.translateCanvas(diffX, diffY)
    }

    drawingLayerToMainLayer() {
        const childobj = this.drawingLayer.getChildren(function (child: any) {
            return true
        })
        childobj.forEach((child) => {
            child.moveToContainer(this.mainLayer)
        })
    }

    // 检测当前画布是否在控制的范围内，否则予以调整
    ensureTranslateLimit() {
        const that = this;
        // var maxmin = this.getLimits();
        const winInfo = { width: this.canvasSize.width,
height: this.canvasSize.height };
        let leftTop = this.mainLayer.canvasContext.transformPoint(0, 0);
        let rightTop = this.mainLayer.canvasContext.transformPoint(winInfo.width, 0);
        let rightBottom = this.mainLayer.canvasContext.transformPoint(winInfo.width, winInfo.height);
        let leftBottom = this.mainLayer.canvasContext.transformPoint(0, winInfo.height);
        MainDraw.screenRangeXY.set(leftTop.x, leftTop.y, rightBottom.x, rightBottom.y);// 维护屏幕尺寸范围
        var x = 0;
        var y = 0;

        const resetState = function () {
            that.mainStage.translateCanvas(x, y);

            leftTop = that.mainLayer.canvasContext.transformPoint(0, 0);
            rightTop = that.mainLayer.canvasContext.transformPoint(winInfo.width, 0);
            rightBottom = that.mainLayer.canvasContext.transformPoint(winInfo.width, winInfo.height);
            leftBottom = that.mainLayer.canvasContext.transformPoint(0, winInfo.height);
            x = 0;
            y = 0;
        }
        // 判断左上角的点是否在边界内
        if (leftTop.x < MainDraw.canvasRangeXY.startX) {
            x = leftTop.x - MainDraw.canvasRangeXY.startX;
        }
        if (leftTop.y < MainDraw.canvasRangeXY.startY) {
            y = leftTop.y - MainDraw.canvasRangeXY.startY;
        }
        if (leftTop.x > MainDraw.canvasRangeXY.endX) {
            x = leftTop.x - MainDraw.canvasRangeXY.endX;
        }
        if (leftTop.y > MainDraw.canvasRangeXY.endY) {
            y = leftTop.y - MainDraw.canvasRangeXY.endY;
        }
        if (x != 0 || y != 0) {
            resetState();
        }

        // 判断右上角的点是否在边界内
        var x = 0;
        var y = 0;
        if (rightTop.x < MainDraw.canvasRangeXY.startX) {
            x = rightTop.x - MainDraw.canvasRangeXY.startX;
        }
        if (rightTop.y < MainDraw.canvasRangeXY.startY) {
            y = rightTop.y - MainDraw.canvasRangeXY.startY;
        }
        if (rightTop.x > MainDraw.canvasRangeXY.endX) {
            x = rightTop.x - MainDraw.canvasRangeXY.endX;
        }
        if (rightTop.y > MainDraw.canvasRangeXY.endY) {
            y = rightTop.y - MainDraw.canvasRangeXY.endY;
        }
        if (x != 0 || y != 0) {
            resetState();
        }
        // 判断右下角的点是否在边界内
        var x = 0;
        var y = 0;
        if (rightBottom.x < MainDraw.canvasRangeXY.startX) {
            x = rightBottom.x - MainDraw.canvasRangeXY.startX;
        }
        if (rightBottom.y < MainDraw.canvasRangeXY.startY) {
            y = rightBottom.y - MainDraw.canvasRangeXY.startY;
        }
        if (rightBottom.x > MainDraw.canvasRangeXY.endX) {
            x = rightBottom.x - MainDraw.canvasRangeXY.endX;
        }
        if (rightBottom.y > MainDraw.canvasRangeXY.endY) {
            y = rightBottom.y - MainDraw.canvasRangeXY.endY;
        }
        if (x != 0 || y != 0) {
            resetState();
        }
        // 判断左下角的点是否在边界内
        var x = 0;
        var y = 0;
        if (leftBottom.x < MainDraw.canvasRangeXY.startX) {
            x = leftBottom.x - MainDraw.canvasRangeXY.startX;
        }
        if (leftBottom.y < MainDraw.canvasRangeXY.startY) {
            y = leftBottom.y - MainDraw.canvasRangeXY.startY;
        }
        if (leftBottom.x > MainDraw.canvasRangeXY.endX) {
            x = leftBottom.x - MainDraw.canvasRangeXY.endX;
        }
        if (leftBottom.y > MainDraw.canvasRangeXY.endY) {
            y = leftBottom.y - MainDraw.canvasRangeXY.endY;
        }
        if (x != 0 || y != 0) {
            resetState();
        }
    }

    getScreenRange() {
        const winInfo = { width: this.canvasSize.width,
height: this.canvasSize.height };
        const leftTop = this.mainLayer.canvasContext.transformPoint(0, 0);
        const rightBottom = this.mainLayer.canvasContext.transformPoint(winInfo.width, winInfo.height);
        const range = new XYRange();
        range.set(leftTop.x, leftTop.y, rightBottom.x, rightBottom.y);
        return range;
    }

    // 获取边界值xy的最大最小值
    getLimits() {
        // 除以Math.pow(1.05, 10)是为了缩放到最后  还可以稍微有一定的移动范围
        // var winInfo = { width: screen.width, height: screen.height };
        const winInfo = { width: this.canvasSize.width,
height: this.canvasSize.height };
        const leftTopX = 0;
        const leftTopY = 0;

        const rightBottomX = winInfo.width / (this.minScale);
        const rightBottomY = winInfo.height / (this.minScale);

        const range = new XYRange();
        range.set(leftTopX, leftTopY, rightBottomX, rightBottomY);
        return range;
    }

    convertMouseInfo(mouseInfo: MouseInfo) {
        if (mouseInfo.isCanvas == false) {
            const mouseInfoCur = this.mainLayer.canvasContext.transformPoint(mouseInfo.curX, mouseInfo.curY + ((this.canvasSize.height + 64) - document.getElementById("drawingContainer").clientHeight));
            const mouseInfoLast = this.mainLayer.canvasContext.transformPoint(mouseInfo.lastX, mouseInfo.lastY + ((this.canvasSize.height + 64) - document.getElementById("drawingContainer").clientHeight));
            mouseInfo = new MouseInfo(XlMath.toDecimal(mouseInfoCur.x), XlMath.toDecimal(mouseInfoCur.y), XlMath.toDecimal(mouseInfoLast.x), XlMath.toDecimal(mouseInfoLast.y), true);
        }
        return mouseInfo;
    }

    getSelectOnStage(p: Point) {
        const shape = this.mainStage.getSelected(p);
        return shape;
    }

    getSelectOnMainlayer(p: Point) {
        const shape = this.mainLayer.getSelected(p);
        return shape;
    }

    getSelectOnDrawinglayer(p: Point) {
        const shape = this.drawingLayer.getSelected(p);
        return shape;
    }

    getSelectOnBrushlayer(p: Point) {
        const shape = this.BrushLayer.getSelected(p);
        return shape;
    }
}
