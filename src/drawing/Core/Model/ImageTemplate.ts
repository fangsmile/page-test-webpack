import { Serialize } from "common/utility/ts-serializer";
import { TemplateBase } from "./TemplateBase";
import { Util } from "common/utility/util";
import { ImageEle } from "./ImageEle";
import { CanvasContext } from "common/drawing/CanvasContext";
import { Layer } from "common/drawing/GraphLib/Layer";
import { RegionConfig } from "common/drawing/GraphLib/OptionConfig";

@Serialize({})// 序列化
export class ImageTemplate extends TemplateBase {
    className = "ImageTemplate"

    imageEle: ImageEle;

    constructor(name: string, src: string, canvasSize: RegionConfig) {
        super(name);
        // let imagesrc = require(src);
        if (src) {
            this.imageEle = new ImageEle("", null, null, src);
            this.initPromise = this.imageEle.init(canvasSize);
        }
    }

    changeLayer(mainLayer: Layer, burshLayer: Layer) {
        this.penlineChangeLayer(burshLayer);
        this.imageEle && this.imageEle.moveToContainer(mainLayer);
    }
}
