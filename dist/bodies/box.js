"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
const model_1 = require("../model");
const utils_1 = require("../utils");
const polygon_1 = require("./polygon");
/**
 * collider - box
 */
class Box extends polygon_1.Polygon {
    /**
     * collider - box
     * @param {Vector} position {x, y}
     * @param {number} width
     * @param {number} height
     */
    constructor(position, width, height) {
        super((0, utils_1.ensureVectorPoint)(position), (0, utils_1.createBox)(width, height));
        this.type = model_1.Types.Box;
        this._width = width;
        this._height = height;
    }
    /**
     * get box width
     */
    get width() {
        return this._width;
    }
    /**
     * set box width, update points
     */
    set width(width) {
        this._width = width;
        this.setPoints((0, utils_1.createBox)(this._width, this._height));
    }
    /**
     * get box height
     */
    get height() {
        return this._height;
    }
    /**
     * set box height, update points
     */
    set height(height) {
        this._height = height;
        this.setPoints((0, utils_1.createBox)(this._width, this._height));
    }
    getCentroidWithoutRotation() {
        // reset angle for get centroid
        const angle = this.angle;
        this.setAngle(0);
        const centroid = this.getCentroid();
        // revert angle change
        this.setAngle(angle);
        return centroid;
    }
    /**
     * reCenters the box anchor
     */
    center() {
        const firstPoint = this.points[0];
        // skip if has original points translated already
        if (firstPoint.x !== 0 || firstPoint.y !== 0) {
            return;
        }
        const { x, y } = this.getCentroidWithoutRotation();
        this.translate(-x, -y);
        this.setPosition(this.pos.x + x, this.pos.y + y);
    }
}
exports.Box = Box;
