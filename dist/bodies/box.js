"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
const sat_1 = __importDefault(require("sat"));
const model_1 = require("../model");
const utils_1 = require("../utils");
const polygon_1 = require("./polygon");
/**
 * collider - box
 */
class Box extends sat_1.default.Polygon {
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
    /**
     * update position
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
        var _a;
        this.pos.x = x;
        this.pos.y = y;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.updateBody(this);
    }
    /**
     * Updates Bounding Box of collider
     */
    updateAABB() {
        const [topLeft, _, topRight] = this.calcPoints;
        this.minX = this.pos.x + topLeft.x;
        this.minY = this.pos.y + topLeft.y;
        this.maxX = this.pos.x + topRight.x;
        this.maxY = this.pos.y + topRight.y;
    }
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The canvas context to draw on
     */
    draw(context) {
        polygon_1.Polygon.prototype.draw.call(this, context);
    }
}
exports.Box = Box;
