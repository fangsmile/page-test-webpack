import { Serialize } from "common/utility/ts-serializer";
import { TemplateBase } from "./TemplateBase";
import { Shape } from "common/drawing/GraphLib/Shape";
import { TianZiGe } from "common/drawing/GraphLib/TianZiGe";
import { MiZiGe } from "common/drawing/GraphLib/MiZiGe";
import { FangGe } from "common/drawing/GraphLib/FangGe";
import { SiXianGe } from "common/drawing/GraphLib/SiXianGe";
import { SiXianSanGe } from "common/drawing/GraphLib/SiXianSanGe";
import { PinYinTianZiGe } from "common/drawing/GraphLib/PinYinTianZiGe";
import { LianXiGeConfig, RegionConfig } from "common/drawing/GraphLib/OptionConfig";
import { Layer } from "common/drawing/GraphLib/Layer";
import { PenLine } from "common/drawing/GraphLib/PenLineForNotes";
@Serialize({})//序列化
export class WordTemplate extends TemplateBase {
    className = "WordTemplate"
    lianXiGe: Shape;
    canvasSize: RegionConfig;
    constructor(templateName: string, canvasSize: RegionConfig) {
        super(templateName);
        this.canvasSize = canvasSize;
        //实线颜色#666666，虚线颜色#999999
        if (templateName == "FangGe") {
            let width = 120;
            let leftTop = this.computeSize(width, width + 16);
            if (leftTop.top * 2 > width)
                leftTop.top = (leftTop.top * 2 - width) / 2;
            else
                leftTop.top = (leftTop.top * 2 + 16) / 2;
            this.lianXiGe = new FangGe(new LianXiGeConfig(width, width, 2, "rgba(102,102,102,1)", 1, "rgba(153,153,153,1)", 16), new RegionConfig(leftTop.left, leftTop.top, canvasSize.width - leftTop.left * 2, canvasSize.height - leftTop.top * 2));
        } else if (templateName == "TianZiGe") {
            let width = 120;
            let leftTop = this.computeSize(width, width);
            this.lianXiGe = new TianZiGe(new LianXiGeConfig(width, width, 2, "rgba(102,102,102,1)", 1, "rgba(153,153,153,1)"), new RegionConfig(leftTop.left, leftTop.top, canvasSize.width - leftTop.left * 2, canvasSize.height - leftTop.top * 2))
        } else if (templateName == "MiZiGe") {
            let width = 120;
            let leftTop = this.computeSize(width, width);
            this.lianXiGe = new MiZiGe(new LianXiGeConfig(width, width, 2, "rgba(102,102,102,1)", 1, "rgba(153,153,153,1)"), new RegionConfig(leftTop.left, leftTop.top, canvasSize.width - leftTop.left * 2, canvasSize.height - leftTop.top * 2))
        } else if (templateName == "SiXianGe") {
            let leftTop = this.computeSize(120, 32 * 3 + 60);
            if (leftTop.top * 2 > 32 * 3)
                leftTop.top = (leftTop.top * 2 - 32 * 3) / 2;
            else
                leftTop.top = (leftTop.top * 2 + 60) / 2;
            this.lianXiGe = new SiXianGe(new LianXiGeConfig(0, 0, 2, "rgba(102,102,102,1)", 1, "rgba(153,153,153,1)", 60, 32), new RegionConfig(leftTop.left, leftTop.top, canvasSize.width - leftTop.left * 2, canvasSize.height - leftTop.top * 2))
        } else if (templateName == "SiXianSanGe") {
            let leftTop = this.computeSize(120, 32 * 3 + 60);
            if (leftTop.top * 2 > 32 * 3)
                leftTop.top = (leftTop.top * 2 - 32 * 3) / 2;
            else
                leftTop.top = (leftTop.top * 2 + 60) / 2;
            this.lianXiGe = new SiXianSanGe(new LianXiGeConfig(0, 0, 2, "rgba(102,102,102,1)", 1, "rgba(153,153,153,1)", 60, 32, 4), new RegionConfig(leftTop.left, leftTop.top, canvasSize.width - leftTop.left * 2, canvasSize.height - leftTop.top * 2))
        } else if (templateName == "PinYinTianZiGe") {
            let leftTop = this.computeSize(120, 120 + 20 * 3);
            this.lianXiGe = new PinYinTianZiGe(new LianXiGeConfig(120, 120, 2, "rgba(102,102,102,1)", 1, "rgba(153,153,153,1)", 60, 20), new RegionConfig(leftTop.left, leftTop.top, canvasSize.width - leftTop.left * 2, canvasSize.height - leftTop.top * 2))
        }
        this.lianXiGe.isDrawHit = false;
    }
    changeLayer(mainLayer: Layer, burshLayer: Layer) {
        this.penlineChangeLayer(burshLayer);
        this.lianXiGe && this.lianXiGe.moveToContainer(mainLayer);
    }
    computeSize(width: number, height: number) {
        let left = (this.canvasSize.width % width == 0 ? 120 : this.canvasSize.width % width) / 2;
        let top = (this.canvasSize.height % height) / 2;
        return { left: left, top: top };
    }
    resetLianXiGeSize(canvasSize: RegionConfig) {
        this.canvasSize = canvasSize;
        let width = 120;
        let leftTop = this.computeSize(width, width + 16);
        if (this.templateName == "FangGe") {
            width = 120;
            leftTop = this.computeSize(width, width + 16);
            if (leftTop.top * 2 > width)
                leftTop.top = (leftTop.top * 2 - width) / 2;
            else
                leftTop.top = (leftTop.top * 2 + 16) / 2;
        } else if (this.templateName == "TianZiGe") {
            width = 120;
            leftTop = this.computeSize(width, width);
        } else if (this.templateName == "MiZiGe") {
            width = 120;
            leftTop = this.computeSize(width, width);
        } else if (this.templateName == "SiXianGe") {
            leftTop = this.computeSize(120, 32 * 3 + 60);
            if (leftTop.top * 2 > 32 * 3)
                leftTop.top = (leftTop.top * 2 - 32 * 3) / 2;
            else
                leftTop.top = (leftTop.top * 2 + 60) / 2;
        } else if (this.templateName == "SiXianSanGe") {
            leftTop = this.computeSize(120, 32 * 3 + 60);
            if (leftTop.top * 2 > 32 * 3)
                leftTop.top = (leftTop.top * 2 - 32 * 3) / 2;
            else
                leftTop.top = (leftTop.top * 2 + 60) / 2;
        } else if (this.templateName == "PinYinTianZiGe") {
            leftTop = this.computeSize(120, 120 + 20 * 3);
        }
        let oldRegionConfig = this.lianXiGe.regionConfig;
        this.lianXiGe.regionConfig = new RegionConfig(leftTop.left, leftTop.top, canvasSize.width - leftTop.left * 2, canvasSize.height - leftTop.top * 2);
        (<FangGe>this.lianXiGe).initLines();
        this.penlinesmoveBy(this.lianXiGe.regionConfig.x - oldRegionConfig.x, this.lianXiGe.regionConfig.y - oldRegionConfig.y);
    }
    penlinesmoveBy(diffX, diffY) {
        this.penLineHashTable.foreach((key, penline: PenLine) => {
            penline.moveBy(diffX, diffY)
        })
    }
}