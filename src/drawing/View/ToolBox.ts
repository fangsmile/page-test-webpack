import { PenTool } from './PenTool';
import { TemplateTool } from './TemplateTool';
//画笔绘制相关逻辑
export class ToolBox {

    penTool: PenTool;
    templateTool: TemplateTool;
    modleState: ModleState = ModleState.pen;
    constructor() {
        this.penTool = new PenTool();
        this.templateTool = new TemplateTool();
        this.initEvent();
    }
    initEvent() {
        var that = this;
        $("#drawingContainer #tool_box").on("click", "li", function (e) {
            var target = e.currentTarget;
            var id = target.id;
            // if (id != "line") {
            //     $("#drawingContainer #line_list").hide();
            // }
            // if (id != "eraser") {
            //     $("#drawingContainer #eraser-totle").hide();//隐藏橡皮二级菜单
            // }
            if (id != "background")
                that.hideTemplateBox();
            if (["pencil", "black", "white", "red", "blue", "line", "eraser"].indexOf(id) >= 0) {
                document.getElementById("drawingContainer").querySelector("#pointer").classList.remove("active")
                that.modleState = ModleState.pen;
            }
            switch (id) {
                case "pointer":
                    // $("#drawingContainer #eraser-totle").hide();//隐藏橡皮二级菜单
                    $("#drawingContainer #pencil").addClass("hide");//隐藏铅笔激活状态长铅笔
                    target.classList.add("active");//指针增加激活状态
                    that.modleState = ModleState.pointer;
                    //去掉橡皮铅笔鼠标样式
                    document.getElementById("drawingContainer").querySelector("#canvasBox").classList.remove("cur-pen");
                    document.getElementById("drawingContainer").querySelector("#canvasBox").classList.remove("cur-eraser");
                    break;
                case "hide":
                    // window.drawing.vm.$bus.emit("dispatch",{
                    //     id: "00000006",
                    //     path: "drawing",
                    //     isShow: false,
                    //     type: AppType.cover,
                    // })
                    break;
                case "pencil":
                    that.penTool.setPencilStatus();
                    break;
                case "black":
                    that.penTool.setPencilStatus();
                    that.setActivePenColor("black","#2E2E2E");
                    break;
                case "white":
                        that.penTool.setPencilStatus();
                        that.setActivePenColor("white","#FFFFFF")
                        break;
                case "red":
                    that.penTool.setPencilStatus();
                    that.setActivePenColor("red","#FA5D3E")
                    break;
                case "blue":
                    that.penTool.setPencilStatus();
                    that.setActivePenColor("blue","#4F90EA")
                    break;
                case "line":
                    that.penTool.setPencilStatus();
                    $("#drawingContainer #line_list").show();
                    break;
                case "eraser":
                    that.penTool.setEraserStatus();
                    break;
                case "background":
                    if (target.classList.contains("active"))
                        that.hideTemplateBox();
                    else {
                        target.classList.add("active");
                        $("#drawingContainer .template-tool-box").show();
                    }
                    break;
                case "undo":
                    window.drawing.UndoRedo.gotoPrev();
                    break;
            }
        })
    }
    hideTemplateBox() {
        document.getElementById("drawingContainer").querySelector("#background").classList.remove("active");
        $("#drawingContainer .template-tool-box").hide();
    }
    //设置画笔颜色 colorName是颜色的名字  currColor是颜色色值
    setActivePenColor(colorName,currColor){
        let that=this;
        let penColorLi=<HTMLDivElement>document.getElementById("drawingContainer").querySelector(`#${colorName}`);
        that.penTool.removeActiveClass();
        penColorLi.classList.add("active");
        that.penTool.setCurrentLineColor(currColor);//画笔颜色
        that.penTool.showPencil();
    }
}
export enum ModleState {
    pointer,
    pen
}