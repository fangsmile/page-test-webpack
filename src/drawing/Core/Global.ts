
export class MouseInfo {
    curX: number;

    curY: number;

    lastX: number;

    lastY: number;

    isCanvas: boolean;

    constructor(curX: number, curY: number, lastX: number, lastY: number, isCanvas: boolean = false) {
        this.curX = curX;
        this.curY = curY;
        this.lastX = lastX;
        this.lastY = lastY;
        this.isCanvas = isCanvas;
    }
}
export class XYRange {
    startX: number;

    startY: number;

    endX: number;

    endY: number;

    constructor() {

    }

    set(startX: number,
        startY: number,
        endX: number,
        endY: number) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY
    }
}

