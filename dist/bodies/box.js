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
     */
    constructor(position, width, height, options) {
        super(position, (0, utils_1.createBox)(width, height), options);
        /**
         * type of body
         */
        this.type = model_1.BodyType.Box;
        /**
         * faster than type
         */
        this.typeGroup = model_1.BodyGroup.Box;
        /**
         * boxes are convex
         */
        this.isConvex = true;
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
        this.afterUpdateSize();
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
        this.afterUpdateSize();
    }
    /**
     * after setting width/height update translate
     * see https://github.com/Prozi/detect-collisions/issues/70
     */
    afterUpdateSize() {
        const x = this.x;
        const y = this.y;
        const angle = this.angle;
        this.setAngle(0, false);
        this.setPoints((0, utils_1.createBox)(this._width, this._height));
        this.setAngle(angle, false);
        this.setPosition(x, y);
    }
    /**
     * do not attempt to use Polygon.updateIsConvex()
     */
    updateIsConvex() {
        return;
    }
}
exports.Box = Box;
