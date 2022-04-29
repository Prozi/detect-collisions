"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
const box_1 = require("./box");
const model_1 = require("../model");
const utils_1 = require("../utils");
/**
 * collider - point (very tiny box)
 */
class Point extends box_1.Box {
    /**
     * collider - point (very tiny box)
     * @param {Vector} position {x, y}
     */
    constructor(position) {
        super((0, utils_1.ensureVectorPoint)(position), 0.1, 0.1);
        this.type = model_1.Types.Point;
    }
}
exports.Point = Point;
//# sourceMappingURL=point.js.map