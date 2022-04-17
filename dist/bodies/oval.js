"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oval = void 0;
const model_1 = require("../model");
const utils_1 = require("../utils");
const polygon_1 = require("./polygon");
/**
 * collider - oval
 */
class Oval extends polygon_1.Polygon {
    /**
     * collider - oval
     * @param {Vector} position {x, y}
     * @param {number} radiusX
     * @param {number} radiusY
     */
    constructor(position, radiusX, radiusY = radiusX, step = 1) {
        super((0, utils_1.ensureVectorPoint)(position), (0, utils_1.createOval)(radiusX, radiusY, step));
        this.type = model_1.Types.Oval;
        this._radiusX = radiusX;
        this._radiusY = radiusY;
        this._step = step;
    }
    /**
     * get oval step number
     */
    get step() {
        return this._step;
    }
    /**
     * set oval step number
     */
    set step(step) {
        this._step = step;
        this.setPoints((0, utils_1.createOval)(this._radiusX, this._radiusY, this._step));
    }
    /**
     * get oval radiusX
     */
    get radiusX() {
        return this._radiusX;
    }
    /**
     * set oval radiusX, update points
     */
    set radiusX(radiusX) {
        this._radiusX = radiusX;
        this.setPoints((0, utils_1.createOval)(this._radiusX, this._radiusY, this._step));
    }
    /**
     * get oval radiusY
     */
    get radiusY() {
        return this._radiusY;
    }
    /**
     * set oval radiusY, update points
     */
    set radiusY(radiusY) {
        this._radiusY = radiusY;
        this.setPoints((0, utils_1.createOval)(this._radiusX, this._radiusY, this._step));
    }
}
exports.Oval = Oval;
