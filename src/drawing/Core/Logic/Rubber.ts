
import { PenLine } from "common/drawing/GraphLib/PenLineForNotes";
import { Layer } from "common/drawing/GraphLib/Layer";
import { Stage } from "common/drawing/GraphLib/Stage";
import { MouseInfo } from "../Global";
import { Point } from "common/drawing/GraphLib/Point";
import { RenderStyle } from "common/drawing/GraphLib/OptionConfig";
import { Shape } from "common/drawing/GraphLib/Shape";
import { MainLogic } from "../../View/MainLogic";
import { XlMath } from "common/drawing/GraphLib/XlMath";
import { MainDraw } from "./MainDraw";
export class Rubber {
    mainStage: Stage;
    rubberMode: boolean = true;//true表示点擦，false表示线擦
    brushLayer: Layer;
    mainLogic: MainLogic;
    //优化橡皮 加的两个标记
    eraserLastPoint: Point = null;//擦除上一个鼠标点
    isChangeLines: boolean = false;//是否擦除了线条加入撤销回退
    constructor(mainLogic: MainLogic) {
        this.mainLogic = mainLogic;
        this.mainStage = mainLogic.mainDraw.mainStage;

        this.brushLayer = mainLogic.mainDraw.BrushLayer;
    }

    public mouseDown(mouseInfo: any) {
        let p = new Point(mouseInfo.mouseInfo.curX, mouseInfo.mouseInfo.curY);
        this.eraser(p);
        this.eraserLastPoint = p;
        this.isChangeLines = false;
    }
    public dragMove(mouseInfo: any) {
        let that = this;
        let eraserRadius = 25;
        // this.eraser(mouseInfo)
        //橡皮优化，鼠标快的时候擦除不干净
        let p = new Point(mouseInfo.mouseInfo.curX, mouseInfo.mouseInfo.curY);
        let dis = XlMath.distance(that.eraserLastPoint, p);
        let isDraw = false;
        if (dis > eraserRadius) {
            let basePoint = that.eraserLastPoint;
            for (let i = 0; i < 1000; i++) {
                basePoint = new Point((p.x - that.eraserLastPoint.x) * eraserRadius / dis + basePoint.x, (p.y - that.eraserLastPoint.y) * eraserRadius / dis + basePoint.y);
                if ((basePoint.x - p.x) * (that.eraserLastPoint.x - p.x) < 0 || (basePoint.y - p.y) * (that.eraserLastPoint.y - p.y) < 0)
                    break;
                else {
                    let eraserReturn = that.eraser(basePoint);
                    isDraw = (isDraw || eraserReturn);
                    if (eraserReturn) {
                        that.mainStage.draw();
                    }
                }
            }
        }
        let eraserReturn = that.eraser(p);
        isDraw = (isDraw || eraserReturn);
        if (eraserReturn) {
            this.mainStage.draw();
        }
       
        this.eraserLastPoint = p;
        this.isChangeLines = this.isChangeLines || isDraw;
         //橡皮优化 end
    }
    public dragUp(mouseInfo: any) {
        let that = this;
        let eraserRadius = 25;
        //橡皮优化，鼠标快的时候擦除不干净
        let p = new Point(mouseInfo.mouseInfo.curX, mouseInfo.mouseInfo.curY);
        let dis = XlMath.distance(that.eraserLastPoint, p);
        let isDraw = false;
        if (dis > eraserRadius) {
            let basePoint = that.eraserLastPoint;
            for (let i = 0; i < 1000; i++) {
                basePoint = new Point((p.x - that.eraserLastPoint.x) * eraserRadius / dis + basePoint.x, (p.y - that.eraserLastPoint.y) * eraserRadius / dis + basePoint.y);
                if ((basePoint.x - p.x) * (that.eraserLastPoint.x - p.x) < 0 || (basePoint.y - p.y) * (that.eraserLastPoint.y - p.y) < 0)
                    break;
                else {
                    let eraserReturn = that.eraser(basePoint);
                    isDraw = (isDraw || eraserReturn);
                    if (eraserReturn) {
                        that.mainStage.draw();
                    }
                }
            }
        }
        let eraserReturn = that.eraser(p);
        isDraw = (isDraw || eraserReturn);
        if (eraserReturn) {
            this.mainStage.draw();
        }
       
        this.eraserLastPoint = p;
        this.isChangeLines = this.isChangeLines || isDraw;
        if (this.isChangeLines) {
            this.mainLogic.pushData();
        }
         //橡皮优化 end
    }
    public mouseUp(mouseInfo: any) {

    }

    eraser(eraserPoint: Point) {
        var that = this;
        let convertMouseInfo = this.mainLogic.mainDraw.convertMouseInfo(new MouseInfo(eraserPoint.x, eraserPoint.y, 0, 0, false));
        if (!document.getElementById("drawingContainer").querySelector("#canvasBox").classList.contains("cur-eraser")) {
            document.getElementById("drawingContainer").querySelector("#canvasBox").classList.add("cur-eraser");
        }
        var eraserRadius = 25 /this.mainLogic.mainDraw.canvasSize.initedScale;
        //http://jira.xuelebj.net/browse/CLASSROOM-6701,y值要进行修正
        let downObj = this.mainLogic.getSelectOnStage(new Point(eraserPoint.x,eraserPoint.y+((this.mainLogic.mainDraw.canvasSize.height+64)-document.getElementById("drawingContainer").clientHeight)));
        if (downObj) {
            if (downObj.className !== "PenLine") {
                this.mainLogic.delPenline(downObj);
                //寻找关联关系，找受影响的图形  todo
            } else {
                var points1 = new Array<Point>();
                var points2 = new Array<Point>();

                if (that.rubberMode) {//点擦除
                    //橡皮擦擦除逻辑优化适应画布缩放http://jira.xuelebj.net/browse/CLASSROOM-4261
                    let pointCount = downObj.getPoints().length;
                    let p1Index: number = null;//橡皮擦圆与线条第一个交点
                    let p2Index: number = null;//橡皮擦圆与线条第二个交点
                    let p1: Point, p2: Point;//橡皮擦圆与线条第一个交点,//橡皮擦圆与线条第二个交点
                    downObj.getPoints().forEach(function (p: Point, i: number) {
                        if (i <= pointCount - 2) {
                            //求相邻两点与圆的交点坐标
                            let interP = XlMath.LineInterCircle(p, downObj.getPoints()[i + 1], new Point(convertMouseInfo.curX, convertMouseInfo.curY), eraserRadius);
                            //将交点赋值给临时变量供后面使用
                            if (interP) {
                                if (interP.p1) {
                                    if (p1Index == null) {
                                        p1Index = i;
                                        p1 = interP.p1;
                                    } else if (p1Index != null && p2Index == null) {
                                        p2Index = i + 1;
                                        p2 = interP.p1;
                                    }
                                }
                                if (interP.p2 && p2Index == null) {
                                    p2Index = i + 1;
                                    p2 = interP.p2;
                                }
                                if (p1Index == null && p2Index != null)//http://jira.xuelebj.net/browse/CLASSROOM-5360 添加条件
                                    return false;
                            }
                        }
                    })
                    //该判断解决bug http://jira.xuelebj.net/browse/CLASSROOM-4802
                    if (p1Index != null && p2Index != null) {
                        if (p1Index >= p2Index) {
                            p1 = p2 = null;
                            p1Index = p2Index = null;
                        }
                    }
                    //初始化赋值points1，points2
                    if (p2) {
                        p2.x = XlMath.toDecimal(p2.x);
                        p2.y = XlMath.toDecimal(p2.y);
                        points2.push(p2);
                    }
                    downObj.getPoints().forEach(function (p: Point, i: number) {
                        if (p1Index != null && p1Index != undefined && i <= p1Index) {
                            points1.push(p);
                        }
                        if (p2Index != null && p2Index != undefined && i >= p2Index) {
                            if (i == p2Index)//笔锋
                                points2[0].setLineWidth(p.getLineWidth());
                            points2.push(p);
                        }
                    })
                    if (p1) {
                        p1.x = XlMath.toDecimal(p1.x);
                        p1.y = XlMath.toDecimal(p1.y);
                        p1.setLineWidth(points1[points1.length - 1].getLineWidth());//笔锋
                        points1.push(p1);
                    }


                    //遍历完线条points上的所有点后。根据points1和points2是否为空处理点擦除后的线条
                    if (points1.length >= 1 && points2.length >= 1) {//points1和points2都不为空，说明从中间擦除变为两条线
                        downObj.changePoints(points1);
                        var linePen = new PenLine(new RenderStyle(points2.length >= 2 ? false : true, points2.length >= 2 ? true : false, downObj.renderStyle.fillColor, downObj.renderStyle.strokeColor,
                            downObj.renderStyle.lineWidth, false, [], "round", "round"));
                        linePen.changePoints(points2);
                        that.mainLogic.addPenline(linePen);
                    } else if (points1.length == 0 && points2.length >= 1) {//从一端擦除
                        downObj.changePoints(points2);
                    } else if (points1.length >= 1 && points2.length == 0) {//从一端擦除
                        downObj.changePoints(points1);
                    } else if (points1.length == 0 && points2.length == 0) {//线条上的点全部被擦除，删除该线条
                        that.mainLogic.delPenline(downObj);
                    }
                    points1.length == 1 && (downObj.renderStyle.isFill = true, downObj.renderStyle.isStroke = false)
                } else {
                    that.mainLogic.delPenline(downObj);
                }

            }

            return true;
        }
        return false;
    }


    //true点擦除，false先擦除
    setRubberMode(rubberMode: boolean) {
        this.rubberMode = rubberMode;
    }
}