import { HashTable } from "common/utility/DataStructure";
import { PenLine } from "common/drawing/GraphLib/PenLineForNotes";
import { Serialize, Serializable } from "common/utility/ts-serializer";
import { CanvasContext } from "common/drawing/CanvasContext";
import { Layer } from "common/drawing/GraphLib/Layer";

@Serialize({})// 序列化
export class TemplateBase extends Serializable {
    className:string="TemplateBase"

    templateName: string;

    penLineHashTable:HashTable<PenLine>=new HashTable<PenLine>();

    initPromise: Promise<any>;

    constructor(templateName:string) {
        super();
        this.templateName = templateName;
        this.initPromise = Promise.resolve();
    }

    delete(colorKey:string) {
        this.penLineHashTable.del(colorKey);
    }

    clearPenLine() {
        this.penLineHashTable = new HashTable<PenLine>();
    }

    draw(templateCanvasContext:CanvasContext, penlineCanvasContext:CanvasContext) {}

    penlineChangeLayer(layer:Layer) {
        this.penLineHashTable.foreach((colorKey:string, penline:PenLine) => {
            penline.moveToContainer(layer);
        })
    }

    changeLayer(mainLayer:Layer, burshLayer:Layer) {

    }
}
