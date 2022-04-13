"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const sat_1 = __importDefault(require("sat"));
const model_1 = require("../model");
const utils_1 = require("../utils");
/**
 * collider - polygon
 */
class Polygon extends sat_1.default.Polygon {
    /**
     * collider - polygon
     * @param {Vector} position {x, y}
     * @param {Vector[]} points
     */
    constructor(position, points) {
        super((0, utils_1.ensureVectorPoint)(position), (0, utils_1.ensurePolygonPoints)(points));
        this.type = model_1.Types.Polygon;
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
        const { pos, w, h } = this.getAABBAsBox();
        this.minX = pos.x;
        this.minY = pos.y;
        this.maxX = pos.x + w;
        this.maxY = pos.y + h;
    }
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The canvas context to draw on
     */
    draw(context) {
        const points = [...this.calcPoints, this.calcPoints[0]];
        points.forEach((point, index) => {
            const toX = this.pos.x + point.x;
            const toY = this.pos.y + point.y;
            const prev = this.calcPoints[index - 1] ||
                this.calcPoints[this.calcPoints.length - 1];
            if (!index) {
                if (this.calcPoints.length === 1) {
                    context.arc(toX, toY, 1, 0, Math.PI * 2);
                }
                else {
                    context.moveTo(toX, toY);
                }
            }
            else if (this.calcPoints.length > 1) {
                if (this.isTrigger) {
                    const fromX = this.pos.x + prev.x;
                    const fromY = this.pos.y + prev.y;
                    (0, utils_1.dashLineTo)(context, fromX, fromY, toX, toY);
                }
                else {
                    context.lineTo(toX, toY);
                }
            }
        });
    }
}
exports.Polygon = Polygon;
