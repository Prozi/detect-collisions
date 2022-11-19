"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSATFunction = exports.getBounceDirection = exports.ensureConvex = exports.mapArrayToVector = exports.mapVectorToArray = exports.clonePointsArray = exports.checkAInB = exports.intersectAABB = exports.bodyMoved = exports.extendBody = exports.clockwise = exports.distance = exports.ensurePolygonPoints = exports.ensureVectorPoint = exports.createBox = exports.createEllipse = void 0;
const sat_1 = require("sat");
const model_1 = require("../model");
function createEllipse(radiusX, radiusY = radiusX, step = 1) {
    const steps = Math.PI * Math.hypot(radiusX, radiusY) * 2;
    const length = Math.max(8, Math.ceil(steps / Math.max(1, step)));
    return Array.from({ length }, (_, index) => {
        const value = (index / length) * 2 * Math.PI;
        const x = Math.cos(value) * radiusX;
        const y = Math.sin(value) * radiusY;
        return new sat_1.Vector(x, y);
    });
}
exports.createEllipse = createEllipse;
/**
 * creates box polygon points
 */
function createBox(width, height) {
    return [
        new sat_1.Vector(0, 0),
        new sat_1.Vector(width, 0),
        new sat_1.Vector(width, height),
        new sat_1.Vector(0, height),
    ];
}
exports.createBox = createBox;
/**
 * ensure Vector point
 */
function ensureVectorPoint(point = {}) {
    return point instanceof sat_1.Vector
        ? point
        : new sat_1.Vector(point.x || 0, point.y || 0);
}
exports.ensureVectorPoint = ensureVectorPoint;
/**
 * ensure Vector points (for polygon) in counter-clockwise order
 */
function ensurePolygonPoints(points) {
    if (!points) {
        throw new Error("No points array provided");
    }
    const polygonPoints = points.map(ensureVectorPoint);
    return clockwise(polygonPoints) ? polygonPoints.reverse() : polygonPoints;
}
exports.ensurePolygonPoints = ensurePolygonPoints;
/**
 * get distance between two {x, y} points
 */
function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}
exports.distance = distance;
/**
 * check direction of polygon
 */
function clockwise(points) {
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
        const v1 = points[i];
        const v2 = points[(i + 1) % points.length];
        sum += (v2.x - v1.x) * (v2.y + v1.y);
    }
    return sum > 0;
}
exports.clockwise = clockwise;
/**
 * used for all types of bodies
 */
function extendBody(body, options) {
    body.isStatic = !!(options === null || options === void 0 ? void 0 : options.isStatic);
    body.isTrigger = !!(options === null || options === void 0 ? void 0 : options.isTrigger);
    body.padding = (options === null || options === void 0 ? void 0 : options.padding) || 0;
    if (options === null || options === void 0 ? void 0 : options.center) {
        body.center();
    }
    body.setAngle((options === null || options === void 0 ? void 0 : options.angle) || 0);
}
exports.extendBody = extendBody;
// check if body moved outside of padding
function bodyMoved(body) {
    return (body.bbox.minX < body.minX ||
        body.bbox.minY < body.minY ||
        body.bbox.maxX > body.maxX ||
        body.bbox.maxY > body.maxY);
}
exports.bodyMoved = bodyMoved;
function intersectAABB(a, b) {
    return !(b.minX > a.maxX ||
        b.minY > a.maxY ||
        b.maxX < a.minX ||
        b.maxY < a.minY);
}
exports.intersectAABB = intersectAABB;
function checkAInB(a, b) {
    const insideX = a.minX >= b.minX && a.maxX <= b.maxX;
    const insideY = a.minY >= b.minY && a.maxY <= b.maxY;
    return insideX && insideY;
}
exports.checkAInB = checkAInB;
function clonePointsArray(points) {
    return points.map(({ x, y }) => ({
        x,
        y,
    }));
}
exports.clonePointsArray = clonePointsArray;
/**
 * change format from poly-decomp to SAT.js
 */
function mapVectorToArray({ x, y }) {
    return [x, y];
}
exports.mapVectorToArray = mapVectorToArray;
/**
 * change format from SAT.js to poly-decomp
 */
function mapArrayToVector([x, y]) {
    return { x, y };
}
exports.mapArrayToVector = mapArrayToVector;
/**
 * replace body with array of related convex polygons
 */
function ensureConvex(body) {
    if (body.isConvex || body.type !== model_1.Types.Polygon) {
        return [body];
    }
    body.updateConvexPolygons();
    return body.convexPolygons;
}
exports.ensureConvex = ensureConvex;
/**
 * given 2 bodies calculate vector of bounce assuming equal mass and they are circles
 */
function getBounceDirection(body, collider) {
    const v2 = new sat_1.Vector(collider.x - body.x, collider.y - body.y);
    const v1 = new sat_1.Vector(body.x - collider.x, body.y - collider.y);
    const len = v1.dot(v2.normalize()) * 2;
    return new sat_1.Vector(v2.x * len - v1.x, v2.y * len - v1.y).normalize();
}
exports.getBounceDirection = getBounceDirection;
function getSATFunction(body, wall) {
    if (body.type === model_1.Types.Circle) {
        return (wall.type === model_1.Types.Circle ? sat_1.testCircleCircle : sat_1.testCirclePolygon);
    }
    return (wall.type === model_1.Types.Circle ? sat_1.testPolygonCircle : sat_1.testPolygonPolygon);
}
exports.getSATFunction = getSATFunction;
//# sourceMappingURL=utils.js.map