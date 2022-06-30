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
     * @param {PotentialVector} position {x, y}
     * @param {number} width
     * @param {number} height
     */
    constructor(position, width, height, options) {
        super(position, (0, utils_1.createBox)(width, height), options);
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
}
exports.Box = Box;
//# sourceMappingURL=box.js.map