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
         * optimization for above
         */
        this.convexPolygons = [];
        /**
         * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
         */
        this.padding = 0;
        this.type = model_1.Types.Polygon;
        this.scaleVector = { x: 1, y: 1 };
        if (!(points === null || points === void 0 ? void 0 : points.length)) {
            throw new Error("No points in polygon");
        }
        (0, utils_1.extendBody)(this, options);
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
    get scale() {
        return this.scaleVector.x;
    }
    /**
     * allow easier setting of scale
     */
    set scale(scale) {
        this.setScale(scale);
    }
    getConvex() {
        // if not line
        return this.points.length > 2
            ? (0, poly_decomp_1.quickDecomp)(this.calcPoints.map(utils_1.mapVectorToArray))
            : // for line and point
                [];
    }
    setPoints(points) {
        super.setPoints(points);
        this.updateIsConvex();
        this.pointsBackup = (0, utils_1.clonePointsArray)(this.points);
        return this;
    }
    updateConvexPolygons(convex = this.getConvex()) {
        convex.forEach((points, index) => {
            // lazy create
            if (!this.convexPolygons[index]) {
                this.convexPolygons[index] = new sat_1.Polygon();
            }
            this.convexPolygons[index].pos.x = this.x;
            this.convexPolygons[index].pos.y = this.y;
            this.convexPolygons[index].setPoints((0, utils_1.ensurePolygonPoints)(points.map(utils_1.mapArrayToVector)));
        });
        // trim array length
        this.convexPolygons.length = convex.length;
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
     * update scale
     * @param {number} x
     * @param {number} y
     */
    setScale(x, y = x) {
        if (!this.pointsBackup) {
            this.pointsBackup = (0, utils_1.clonePointsArray)(this.points);
        }
        this.scaleVector.x = x;
        this.scaleVector.y = y;
        this.points.forEach((point, i) => {
            point.x = this.pointsBackup[i].x * x;
            point.y = this.pointsBackup[i].y * y;
        });
        super.setPoints(this.points);
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
    rotate(angle) {
        super.rotate(angle);
        this.pointsBackup = (0, utils_1.clonePointsArray)(this.points);
        return this;
    }
    /**
     * after points update set is convex
     */
    updateIsConvex() {
        // all other types other than polygon are always convex
        const convex = this.getConvex();
        // everything with empty array or one element array
        this.isConvex = convex.length <= 1;
    }
}
exports.Polygon = Polygon;
//# sourceMappingURL=polygon.js.map