"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const sat_1 = require("sat");
const model_1 = require("../model");
const utils_1 = require("../utils");
/**
 * collider - polygon
 */
class Polygon extends sat_1.Polygon {
    /**
     * collider - polygon
     * @param {PotentialVector} position {x, y}
     * @param {PotentialVector[]} points
     */
    constructor(position, points) {
        super((0, utils_1.ensureVectorPoint)(position), (0, utils_1.ensurePolygonPoints)(points));
        this.type = model_1.Types.Polygon;
        if (!(points === null || points === void 0 ? void 0 : points.length)) {
            throw new Error("No points in polygon");
        }
        this.updateAABB();
    }
    get x() {
        return this.pos.x;
    }
    /**
     * updating this.pos.x by this.x = x updates AABB
     */
    set x(x) {
        var _a;
        this.pos.x = x;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.updateBody(this);
    }
    get y() {
        return this.pos.y;
    }
    /**
     * updating this.pos.y by this.y = y updates AABB
     */
    set y(y) {
        var _a;
        this.pos.y = y;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.updateBody(this);
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
//# sourceMappingURL=polygon.js.map