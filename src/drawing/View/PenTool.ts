import smallDrawing01 from '../images/small-drawing_01.png';
import smallDrawing02 from '../images/small-drawing_02.png';
import smallDrawing03 from '../images/small-drawing_03.png';
import smallDrawing04 from '../images/small-drawing_04.png';
import smallDrawing08 from '../images/small-drawing_08.png';
import smallDrawing09 from '../images/small-drawing_09.png';
import smallDrawing10 from '../images/small-drawing_10.png';
import smallDrawing11 from '../images/small-drawing_11.png';
//画笔绘制相关逻辑
export class PenTool {

    public isEraser: boolean = false;//橡皮擦模式还是画笔
    public currentLineWidth: number;//铅笔线宽
    public currentLineColor: string;//线颜色
    pencilSVG: string =
        // 'data:image/svg+xml;utf8,' +
        '<svg version="1.1" id="图形" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="423.966 45.667 208.2 898.8" enable-background="new 423.966 45.667 208.2 898.8" xml:space="preserve"><g><g id="XMLID_107_"><path id="XMLID_110_" fill="#D1C19B" d="M480.667,421.367h8.8c4.4-28.2,20.8-49.1,40.4-49.1c19.6,0,36,21,40.4,49.1h7.8c4.4-28.2,20.8-49.1,40.4-49.1c0.3,0,0.5,0.1,0.7,0.1l-89.3-326.7l-91.6,326.8c0.6,0,1.3-0.2,1.9-0.2C459.767,372.267,476.267,393.267,480.667,421.367z"/><path id="XMLID_109_" fill="#2E2E2E" d="M619.266,372.367c-0.3,0-0.5-0.1-0.7-0.1c-19.6,0-46.4,21-50.9,49.1h2.6c-4.4-28.2-20.8-49.1-40.4-49.1c-19.6,0-36,21-40.4,49.1h1.6c-4.4-28.2-31.2-49.1-50.9-49.1c-0.7,0-1.3,0.1-1.9,0.2l-14.3,49v523h208.2v-523L619.266,372.367z"/><polygon id="XMLID_108_" fill="#2E2E2E" points="491.867,180.967 529.867,45.667 566.867,180.967"/></g></g></svg>';
    downX: number = 0;//拖拽清除全部的按钮时  mousedown位置
    isMouseDown: boolean = false;//是否点击到清除全部的按钮
    isSubmenu: boolean = true;//是否展示
    constructor() {
        this.initDrawStyle();
        this.initEvent();
    }
    initEvent() {

        var that = this;
        //点击线条隐藏自己
        $("#drawingContainer #line_list").on("click", "li", function (e) {
            let img = {
                smallDrawing01:smallDrawing01,
                smallDrawing02:smallDrawing02,
                smallDrawing03:smallDrawing03,
                smallDrawing04:smallDrawing04,
                smallDrawing08:smallDrawing08,
                smallDrawing09:smallDrawing09,
                smallDrawing10:smallDrawing10,
                smallDrawing11:smallDrawing11,
              };           
            $("#drawingContainer #line_list li.lineActive").removeClass("lineActive");
            $(this).addClass("lineActive");
            that.setCurrentLineWidth(parseInt(this.dataset.line));//画笔粗细
            var currUrl =img[this.dataset.image];
            $("#drawingContainer #line_img").attr("src", currUrl);
            $("#drawingContainer #line_list").hide();
            
        })

        var eraser_delete = document.getElementById("drawingContainer").querySelector("#eraser-delete");
        var eraser1 = document.getElementById("drawingContainer").querySelector("#eraser1");
        (<HTMLElement>eraser1).onclick = function (e) {
            $("#drawingContainer #eraser-totle").hide();
            that.isSubmenu = true;
        };
        (<HTMLElement>eraser_delete).onclick = function (e) {
            window.drawing.mainLogic.clearPenLine();
            window.drawing.mainLogic.pushData();
            //清屏后切换成画笔模式
            $("#drawingContainer #pencil").click();
        }
    }

    setPencilStatus() {
        document.getElementById("drawingContainer").querySelector("#canvasBox").classList.remove("cur-eraser");
        document.getElementById("drawingContainer").querySelector("#canvasBox").classList.add("cur-pen");
        $("#drawingContainer #pencil").removeClass("hide");
        $("#drawingContainer #eraser").removeClass("eraserActive");
        $("#drawingContainer #eraser-totle").hide();
        this.isSubmenu = true;
        this.isEraser = false;
    }
    setEraserStatus() {
        document.getElementById("drawingContainer").querySelector("#canvasBox").classList.remove("cur-pen");
        document.getElementById("drawingContainer").querySelector("#canvasBox").classList.add("cur-eraser");
        this.isEraser = true;
        $("#drawingContainer #pencil").addClass("hide");
        $("#drawingContainer #eraser").addClass("eraserActive");
        if (this.isSubmenu) {//初始显示二级菜单
            $("#drawingContainer #eraser-totle").show();
        } else {
            $("#drawingContainer #eraser-totle").hide();
        }
        this.isSubmenu = !this.isSubmenu;
        $("#drawingContainer #line_list").hide();
    }
    removeActiveClass() {
        $("#drawingContainer #black").removeClass("active");
        $("#drawingContainer #white").removeClass("active");
        $("#drawingContainer #red").removeClass("active");
        $("#drawingContainer #blue").removeClass("active");
    }
    initDrawStyle() {
        this.currentLineColor = "#2E2E2E";//默认画笔颜色
        this.currentLineWidth = 3;
    }
    showPencil() {

    }
    hidePencil() {

    }
    public setCurrentLineColor(color: string) {
        this.pencilSVG = this.pencilSVG.replaceAll(this.currentLineColor, color);
        this.currentLineColor = color;
        $("#drawingContainer #pencilLong")[0].innerHTML = "<div style='width:22px;height:65px;position:absolute;bottom:-4px;box-shadow:4px 0 7px -4px #909090;'></div>"+
        "<div style='width:22px;height:65px;position:absolute;bottom:-4px;box-shadow:-4px 0 7px -4px #909090;'></div>"+
        this.pencilSVG;
    }

    public getCurrentLineColor() {
        return this.currentLineColor;
    }
    public setCurrentLineWidth(lineWidth: number) {
        this.currentLineWidth = lineWidth;
    }

    public getCurrentLineWidth() {
        return this.currentLineWidth;
    }
}
