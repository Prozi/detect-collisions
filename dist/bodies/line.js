"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = void 0;
const model_1 = require("../model");
const polygon_1 = require("./polygon");
/**
 * collider - line
 */
class Line extends polygon_1.Polygon {
    /**
     * collider - line from start to end
     * @param {Vector} start {x, y}
     * @param {Vector} end {x, y}
     */
    constructor(start, end) {
        // position at middle of (start, end)
        super({ x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 }, [
            // first point at minus half length
            { x: -(end.x - start.x) / 2, y: -(end.y - start.y) / 2 },
            // second point at plus half length
            { x: (end.x - start.x) / 2, y: (end.y - start.y) / 2 },
        ]);
        this.type = model_1.Types.Line;
        if (this.calcPoints.length === 1 || !end) {
            console.error({ start, end });
            throw new Error("No end point for line provided");
        }
    }
    get start() {
        return {
            x: this.x + this.calcPoints[0].x,
            y: this.y + this.calcPoints[0].y,
        };
    }
    get end() {
        return {
            x: this.x + this.calcPoints[1].x,
            y: this.y + this.calcPoints[1].y,
        };
    }
}
exports.Line = Line;
//# sourceMappingURL=line.js.map