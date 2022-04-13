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
        this.updateAABB();
    }
}
exports.Box = Box;
