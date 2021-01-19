import { CanvasContext } from "common/drawing/CanvasContext";
import { SizeConfig as RangeConfig } from "common/drawing/GraphLib/GraphLib";
import { RegionConfig, RenderStyle } from "common/drawing/GraphLib/OptionConfig";
import { Shape } from "common/drawing/GraphLib/Shape";
import { Serialize, SerializeProperty } from "common/utility/ts-serializer";
import { Util } from "common/utility/util";



@Serialize({})//序列化
export class ImageEle extends Shape {
    className: string = "ImageEle";
    public imgElement: HTMLImageElement;//dom元素（image标签）
    private imgElPromise: Promise<any>;
    constructor(colorKey: string, renderStyle: RenderStyle, region: RegionConfig,
        src: string) {
        super(renderStyle, null, region, colorKey)
        this.imgElement = this.createHtmlImage(src);
        this.imgElPromise = Util.getImgLoadPromise(this.imgElement);
    }
    public init(canvasSize:RegionConfig): Promise<any> {

        let that = this;
        let promise = new Promise<any>((resolve, reject) => {
            that.imgElPromise.then(() => {
                var width = that.imgElement.width;
                var height = that.imgElement.height;
                if (that.regionConfig.width == 0) {//刚加载图片
                    let wScale=canvasSize.width/width;
                    let hScale=canvasSize.height/height;
                    var scale = Math.min(wScale, hScale);
                    that.regionConfig.width = width * scale;
                    that.regionConfig.height = height * scale;
                    that.regionConfig.x = (canvasSize.width-that.regionConfig.width) / 2;
                    that.regionConfig.y = (canvasSize.height-that.regionConfig.height) / 2;
                }
                resolve(that);
            })
                .catch((e) => {
                    reject(e);
                });
        });
        return promise;
    }

    private createHtmlImage(src: string): HTMLImageElement {
        var img = document.createElement("img");
        img.crossOrigin = "anonymous";
        img.src = src;
        return img;
    }

    public draw(context: CanvasContext, hitCtx: CanvasContext) {
        try {
            var that = this;
            context.save();
            that.rotateContext();
            var config = this.regionConfig;

            context.drawImage(this.imgElement, config.x, config.y, config.width, config.height);

            context.restore();

        } catch (e) {
            console.log(e);
        }
    }


}
