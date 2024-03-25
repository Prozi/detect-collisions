"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = void 0;
const sat_1 = require("sat");
const model_1 = require("../model");
const polygon_1 = require("./polygon");
/**
 * collider - line
 */
class Line extends polygon_1.Polygon {
    /**
     * collider - line from start to end
     */
    constructor(start, end, options) {
        super(start, [
            { x: 0, y: 0 },
            { x: end.x - start.x, y: end.y - start.y }
        ], options);
        /**
         * line type
         */
        this.type = model_1.BodyType.Line;
        /**
         * line is convex
         */
        this.isConvex = true;
        if (this.calcPoints.length === 1 || !end) {
            console.error({ start, end });
            throw new Error("No end point for line provided");
        }
    }
    get start() {
        return {
            x: this.x + this.calcPoints[0].x,
            y: this.y + this.calcPoints[0].y
        };
    }
    set start({ x, y }) {
        this.x = x;
        this.y = y;
    }
    get end() {
        return {
            x: this.x + this.calcPoints[1].x,
            y: this.y + this.calcPoints[1].y
        };
    }
    set end({ x, y }) {
        this.points[1].x = x - this.start.x;
        this.points[1].y = y - this.start.y;
        this.setPoints(this.points);
    }
    getCentroid() {
        return new sat_1.Vector((this.end.x - this.start.x) / 2, (this.end.y - this.start.y) / 2);
    }
    /**
     * do not attempt to use Polygon.updateIsConvex()
     */
    updateIsConvex() {
        return;
    }
}
exports.Line = Line;
