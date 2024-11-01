"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const poly_decomp_es_1 = require("poly-decomp-es");
const model_1 = require("../model");
const optimized_1 = require("../optimized");
const utils_1 = require("../utils");
const sat_1 = require("sat");
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
         * was the polygon modified and needs update in the next checkCollision
         */
        this.dirty = false;
        /**
         * type of body
         */
        this.type = model_1.BodyType.Polygon;
        /**
         * faster than type
         */
        this.typeGroup = model_1.BodyGroup.Polygon;
        /**
         * is body centered
         */
        this.centered = false;
        /**
         * scale Vector of body
         */
        this.scaleVector = { x: 1, y: 1 };
        if (!points.length) {
            throw new Error("No points in polygon");
        }
        (0, utils_1.extendBody)(this, options);
    }
    /**
     * flag to set is polygon centered
     */
    set isCentered(isCentered) {
        if (this.centered !== isCentered) {
            const { x, y } = this.getCentroidWithoutRotation();
            if (x || y) {
                const direction = isCentered ? 1 : -1;
                this.translate(-x * direction, -y * direction);
            }
            this.centered = isCentered;
        }
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
     */
    set x(x) {
        this.pos.x = x;
        this.markAsDirty();
    }
    get y() {
        return this.pos.y;
    }
    /**
     * updating this.pos.y by this.y = y updates AABB
     */
    set y(y) {
        this.pos.y = y;
        this.markAsDirty();
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
        return (this.scaleVector.x + this.scaleVector.y) / 2;
    }
    /**
     * allow easier setting of scale
     */
    set scale(scale) {
        this.setScale(scale);
    }
    // Don't overwrite docs from BodyProps
    get group() {
        return this._group;
    }
    // Don't overwrite docs from BodyProps
    set group(group) {
        this._group = (0, utils_1.getGroup)(group);
    }
    /**
     * update position BY MOVING FORWARD IN ANGLE DIRECTION
     */
    move(speed = 1, updateNow = true) {
        (0, utils_1.move)(this, speed, updateNow);
        return this;
    }
    /**
     * update position BY TELEPORTING
     */
    setPosition(x, y, updateNow = true) {
        this.pos.x = x;
        this.pos.y = y;
        this.markAsDirty(updateNow);
        return this;
    }
    /**
     * update scale
     */
    setScale(x, y = x, updateNow = true) {
        this.scaleVector.x = Math.abs(x);
        this.scaleVector.y = Math.abs(y);
        super.setPoints((0, optimized_1.map)(this.points, (point, index) => {
            point.x = this.pointsBackup[index].x * this.scaleVector.x;
            point.y = this.pointsBackup[index].y * this.scaleVector.y;
            return point;
        }));
        this.markAsDirty(updateNow);
        return this;
    }
    setAngle(angle, updateNow = true) {
        super.setAngle(angle);
        this.markAsDirty(updateNow);
        return this;
    }
    setOffset(offset, updateNow = true) {
        super.setOffset(offset);
        this.markAsDirty(updateNow);
        return this;
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
     * Draws exact collider on canvas context
     */
    draw(context) {
        (0, utils_1.drawPolygon)(context, this, this.isTrigger);
    }
    /**
     * Draws Bounding Box on canvas context
     */
    drawBVH(context) {
        (0, utils_1.drawBVH)(context, this);
    }
    /**
     * get body centroid without applied angle
     */
    getCentroidWithoutRotation() {
        // keep angle copy
        const angle = this.angle;
        if (angle) {
            // reset angle for get centroid
            this.setAngle(0);
            // get centroid
            const centroid = this.getCentroid();
            // revert angle change
            this.setAngle(angle);
            return centroid;
        }
        return this.getCentroid();
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
     * if true, polygon is not an invalid, self-crossing polygon
     */
    isSimple() {
        return (0, poly_decomp_es_1.isSimple)((0, optimized_1.map)(this.calcPoints, utils_1.mapVectorToArray));
    }
    /**
     * inner function for after position change update aabb in system and convex inner polygons
     */
    updateBody(updateNow = this.dirty) {
        var _a;
        if (updateNow) {
            this.updateConvexPolygonPositions();
            (_a = this.system) === null || _a === void 0 ? void 0 : _a.insert(this);
            this.dirty = false;
        }
    }
    retranslate(isCentered = this.isCentered) {
        const centroid = this.getCentroidWithoutRotation();
        if (centroid.x || centroid.y) {
            const x = centroid.x * (isCentered ? 1 : -1);
            const y = centroid.y * (isCentered ? 1 : -1);
            this.translate(-x, -y);
        }
    }
    /**
     * update instantly or mark as dirty
     */
    markAsDirty(updateNow = false) {
        if (updateNow) {
            this.updateBody(true);
        }
        else {
            this.dirty = true;
        }
    }
    /**
     * update the position of the decomposed convex polygons (if any), called
     * after the position of the body has changed
     */
    updateConvexPolygonPositions() {
        if (this.isConvex || !this.convexPolygons) {
            return;
        }
        (0, optimized_1.forEach)(this.convexPolygons, (polygon) => {
            polygon.pos.x = this.pos.x;
            polygon.pos.y = this.pos.y;
            if (polygon.angle !== this.angle) {
                // Must use setAngle to recalculate the points of the Polygon
                polygon.setAngle(this.angle);
            }
        });
    }
    /**
     * returns body split into convex polygons, or empty array for convex bodies
     */
    getConvex() {
        if ((this.typeGroup && this.typeGroup !== model_1.BodyGroup.Polygon) ||
            this.points.length < 4) {
            return [];
        }
        const points = (0, optimized_1.map)(this.calcPoints, utils_1.mapVectorToArray);
        return (0, poly_decomp_es_1.quickDecomp)(points);
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
            this.convexPolygons[index].angle = this.angle;
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
