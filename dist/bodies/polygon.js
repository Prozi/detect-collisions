"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const poly_decomp_1 = require("poly-decomp");
const sat_1 = require("sat");
const model_1 = require("../model");
const optimized_1 = require("../optimized");
const utils_1 = require("../utils");
/**
 * collider - polygon
 */
class Polygon extends sat_1.Polygon {
    /**
     * collider - polygon
     */
    constructor(position, points, options) {
        super((0, utils_1.ensureVectorPoint)(position), (0, utils_1.ensurePolygonPoints)(points));
        /**
         * type of body
         */
        this.type = model_1.BodyType.Polygon;
        /**
         * is body centered
         */
        this.centered = false;
        /**
         * scale Vector of body
         */
        this.scaleVector = { x: 1, y: 1 };
        if (!(points === null || points === void 0 ? void 0 : points.length)) {
            throw new Error("No points in polygon");
        }
        (0, utils_1.extendBody)(this, options);
    }
    /**
     * flag to set is polygon centered
     */
    set isCentered(isCentered) {
        if (this.centered === isCentered) {
            return;
        }
        const centroid = this.getCentroidWithoutRotation();
        const x = centroid.x * (isCentered ? 1 : -1);
        const y = centroid.y * (isCentered ? 1 : -1);
        this.translate(-x, -y);
        this.pos.x += x;
        this.pos.y += y;
        this.centered = isCentered;
    }
    /**
     * is polygon centered?
     */
    get isCentered() {
        return this.centered;
    }
    get x() {
        return this.pos.x;
    }
    /**
     * updating this.pos.x by this.x = x updates AABB
     * @deprecated use setPosition(x, y) instead
     */
    set x(x) {
        var _a;
        this.pos.x = x;
        this.updateConvexPolygonPositions();
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.insert(this);
    }
    get y() {
        return this.pos.y;
    }
    /**
     * updating this.pos.y by this.y = y updates AABB
     * @deprecated use setPosition(x, y) instead
     */
    set y(y) {
        var _a;
        this.pos.y = y;
        this.updateConvexPolygonPositions();
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.insert(this);
    }
    /**
     * allow exact getting of scale x - use setScale(x, y) to set
     */
    get scaleX() {
        return this.scaleVector.x;
    }
    /**
     * allow exact getting of scale y - use setScale(x, y) to set
     */
    get scaleY() {
        return this.scaleVector.y;
    }
    /**
     * allow approx getting of scale
     */
    get scale() {
        return this.scaleVector.x;
    }
    /**
     * allow easier setting of scale
     */
    set scale(scale) {
        this.setScale(scale);
    }
    /**
     * update position
     */
    setPosition(x, y) {
        var _a;
        this.pos.x = x;
        this.pos.y = y;
        this.updateConvexPolygonPositions();
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.insert(this);
    }
    /**
     * update scale
     */
    setScale(x, y = x) {
        this.scaleVector.x = x;
        this.scaleVector.y = y;
        (0, optimized_1.forEach)(this.points, (point, i) => {
            point.x = this.pointsBackup[i].x * x;
            point.y = this.pointsBackup[i].y * y;
        });
        super.setPoints(this.points);
    }
    /**
     * get body bounding box, without padding
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
     * Draws collider on a CanvasRenderingContext2D's current path
     */
    draw(context) {
        (0, utils_1.drawPolygon)(context, this, this.isTrigger);
    }
    /**
     * get body centroid without applied angle
     */
    getCentroidWithoutRotation() {
        // keep angle copy
        const angle = this.angle;
        // reset angle for get centroid
        this.setAngle(0);
        // get centroid
        const centroid = this.getCentroid();
        // revert angle change
        this.setAngle(angle);
        return centroid;
    }
    /**
     * sets polygon points to new array of vectors
     */
    setPoints(points) {
        super.setPoints(points);
        this.updateIsConvex();
        this.pointsBackup = (0, utils_1.clonePointsArray)(points);
        return this;
    }
    /**
     * translates polygon points in x, y direction
     */
    translate(x, y) {
        super.translate(x, y);
        this.pointsBackup = (0, utils_1.clonePointsArray)(this.points);
        return this;
    }
    /**
     * rotates polygon points by angle, in radians
     */
    rotate(angle) {
        super.rotate(angle);
        this.pointsBackup = (0, utils_1.clonePointsArray)(this.points);
        return this;
    }
    /**
     * update the position of the decomposed convex polygons (if any), called
     * after the position of the body has changed
     */
    updateConvexPolygonPositions() {
        (0, optimized_1.forEach)(this.convexPolygons, (polygon) => {
            polygon.pos.x = this.pos.x;
            polygon.pos.y = this.pos.y;
        });
    }
    /**
     * returns body split into convex polygons, or empty array for convex bodies
     */
    getConvex() {
        if ((this.type && this.type !== model_1.BodyType.Polygon) ||
            this.points.length < 4) {
            return [];
        }
        const points = (0, optimized_1.map)(this.calcPoints, utils_1.mapVectorToArray);
        if ((0, poly_decomp_1.isSimple)(points)) {
            return (0, poly_decomp_1.quickDecomp)(points);
        }
        return (0, poly_decomp_1.decomp)(points);
    }
    /**
     * updates convex polygons cache in body
     */
    updateConvexPolygons(convex = this.getConvex()) {
        if (this.isConvex) {
            return;
        }
        if (!this.convexPolygons) {
            this.convexPolygons = [];
        }
        (0, optimized_1.forEach)(convex, (points, index) => {
            // lazy create
            if (!this.convexPolygons[index]) {
                this.convexPolygons[index] = new sat_1.Polygon();
            }
            this.convexPolygons[index].pos.x = this.pos.x;
            this.convexPolygons[index].pos.y = this.pos.y;
            this.convexPolygons[index].setPoints((0, utils_1.ensurePolygonPoints)((0, optimized_1.map)(points, utils_1.mapArrayToVector)));
        });
        // trim array length
        this.convexPolygons.length = convex.length;
    }
    /**
     * after points update set is convex
     */
    updateIsConvex() {
        // all other types other than polygon are always convex
        const convex = this.getConvex();
        // everything with empty array or one element array
        this.isConvex = convex.length <= 1;
        this.updateConvexPolygons(convex);
    }
}
exports.Polygon = Polygon;
//# sourceMappingURL=polygon.js.map