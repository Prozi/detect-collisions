"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const poly_decomp_1 = require("poly-decomp");
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
    constructor(position, points, options) {
        super((0, utils_1.ensureVectorPoint)(position), (0, utils_1.ensurePolygonPoints)(points));
        /**
         * is it a convex polyon as opposed to a hollow inside (concave) polygon
         */
        this.isConvex = false;
        /**
         * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
         */
        this.padding = 0;
        this.type = model_1.Types.Polygon;
        if (!(points === null || points === void 0 ? void 0 : points.length)) {
            throw new Error("No points in polygon");
        }
        (0, utils_1.extendBody)(this, options);
        // all other types other than polygon are always convex
        const convex = this.getConvex();
        this.isConvex = convex.length < 2;
        this.convexPolygons = this.isConvex
            ? []
            : Array.from({ length: this.points.length }, () => new sat_1.Polygon());
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
    getConvex() {
        return this.points.length > 2
            ? (0, poly_decomp_1.quickDecomp)(this.calcPoints.map(utils_1.mapVectorToArray))
            : [];
    }
    updateConvexPolygons() {
        this.getConvex().forEach((points, index) => {
            this.convexPolygons[index].pos.x = this.x;
            this.convexPolygons[index].pos.y = this.y;
            this.convexPolygons[index].setPoints((0, utils_1.ensurePolygonPoints)(points.map(utils_1.mapArrayToVector)));
        });
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
     * get bbox without padding
     */
    getAABBAsBBox() {
        const { pos, w, h } = this.getAABBAsBox();
        return {
            minX: pos.x,
            minY: pos.y,
            maxX: pos.x + w,
            maxY: pos.y + h,
        };
    }
    /**
     * Updates Bounding Box of collider
     */
    updateAABB(bounds = this.getAABBAsBBox()) {
        (0, utils_1.updateAABB)(this, bounds);
    }
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The canvas context to draw on
     */
    draw(context) {
        const points = [...this.calcPoints, this.calcPoints[0]];
        points.forEach((point, index) => {
            const toX = this.x + point.x;
            const toY = this.y + point.y;
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
                    const fromX = this.x + prev.x;
                    const fromY = this.y + prev.y;
                    (0, utils_1.dashLineTo)(context, fromX, fromY, toX, toY);
                }
                else {
                    context.lineTo(toX, toY);
                }
            }
        });
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
        const { x, y } = this.getCentroidWithoutRotation();
        this.translate(-x, -y);
        this.setPosition(this.x + x, this.y + y);
    }
}
exports.Polygon = Polygon;
//# sourceMappingURL=polygon.js.map