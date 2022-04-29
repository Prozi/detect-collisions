"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersectLinePolygon = exports.intersectLineLine = exports.intersectLineCircle = exports.dashLineTo = exports.clockwise = exports.distance = exports.ensurePolygonPoints = exports.ensureVectorPoint = exports.createBox = exports.createEllipse = void 0;
const sat_1 = __importDefault(require("sat"));
const line_1 = require("./bodies/line");
function createEllipse(radiusX, radiusY = radiusX, step = 1) {
    const steps = Math.PI * Math.hypot(radiusX, radiusY) * 2;
    const length = Math.max(8, Math.ceil(steps / step));
    return Array.from({ length }, (_, index) => {
        const value = (index / length) * 2 * Math.PI;
        const x = Math.cos(value) * radiusX;
        const y = Math.sin(value) * radiusY;
        return new sat_1.default.Vector(x, y);
    });
}
exports.createEllipse = createEllipse;
/**
 * creates box polygon points
 * @param {number} width
 * @param {number} height
 * @returns SAT.Vector
 */
function createBox(width, height) {
    return [
        new sat_1.default.Vector(),
        new sat_1.default.Vector(width, 0),
        new sat_1.default.Vector(width, height),
        new sat_1.default.Vector(0, height),
    ];
}
exports.createBox = createBox;
/**
 * ensure returns a SAT.Vector
 * @param {SAT.Vector} point
 */
function ensureVectorPoint(point = {}) {
    return point instanceof sat_1.default.Vector
        ? point
        : new sat_1.default.Vector(point.x || 0, point.y || 0);
}
exports.ensureVectorPoint = ensureVectorPoint;
/**
 * ensure correct counterclockwise points
 * @param {SAT.Vector[]} points
 */
function ensurePolygonPoints(points) {
    if (!points) {
        throw new Error("No points array provided");
    }
    const vectorPoints = points.map(ensureVectorPoint);
    return clockwise(vectorPoints) ? vectorPoints.reverse() : vectorPoints;
}
exports.ensurePolygonPoints = ensurePolygonPoints;
/**
 * get distance between two {x, y} points
 * @param {Vector} a
 * @param {Vector} b
 * @returns {number}
 */
function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}
exports.distance = distance;
/**
 * check direction of polygon
 * @param {SAT.Vector[]} points
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
 * draws dashed line on canvas context
 * @param {CanvasRenderingContext2D} context
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} toX
 * @param {number} toY
 * @param {number?} dash
 * @param {number?} gap
 */
function dashLineTo(context, fromX, fromY, toX, toY, dash = 2, gap = 4) {
    const xDiff = toX - fromX;
    const yDiff = toY - fromY;
    const arc = Math.atan2(yDiff, xDiff);
    const offsetX = Math.cos(arc);
    const offsetY = Math.sin(arc);
    let posX = fromX;
    let posY = fromY;
    let dist = Math.hypot(xDiff, yDiff);
    while (dist > 0) {
        const step = Math.min(dist, dash);
        context.moveTo(posX, posY);
        context.lineTo(posX + offsetX * step, posY + offsetY * step);
        posX += offsetX * (dash + gap);
        posY += offsetY * (dash + gap);
        dist -= dash + gap;
    }
}
exports.dashLineTo = dashLineTo;
// https://stackoverflow.com/questions/37224912/circle-line-segment-collision
function intersectLineCircle(line, circle) {
    const v1 = { x: line.end.x - line.start.x, y: line.end.y - line.start.y };
    const v2 = { x: line.start.x - circle.pos.x, y: line.start.y - circle.pos.y };
    const b = (v1.x * v2.x + v1.y * v2.y) * -2;
    const c = (v1.x * v1.x + v1.y * v1.y) * 2;
    const d = Math.sqrt(b * b - (v2.x * v2.x + v2.y * v2.y - circle.r * circle.r) * c * 2);
    if (isNaN(d)) {
        // no intercept
        return [];
    }
    const u1 = (b - d) / c; // these represent the unit distance of point one and two on the line
    const u2 = (b + d) / c;
    const results = []; // return array
    if (u1 <= 1 && u1 >= 0) {
        // add point if on the line segment
        results.push({ x: line.start.x + v1.x * u1, y: line.start.y + v1.y * u1 });
    }
    if (u2 <= 1 && u2 >= 0) {
        // second add point if on the line segment
        results.push({ x: line.start.x + v1.x * u2, y: line.start.y + v1.y * u2 });
    }
    return results;
}
exports.intersectLineCircle = intersectLineCircle;
// https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
function intersectLineLine(line1, line2) {
    const dX = line1.end.x - line1.start.x;
    const dY = line1.end.y - line1.start.y;
    const determinant = dX * (line2.end.y - line2.start.y) - (line2.end.x - line2.start.x) * dY;
    if (determinant === 0) {
        return null;
    }
    const lambda = ((line2.end.y - line2.start.y) * (line2.end.x - line1.start.x) +
        (line2.start.x - line2.end.x) * (line2.end.y - line1.start.y)) /
        determinant;
    const gamma = ((line1.start.y - line1.end.y) * (line2.end.x - line1.start.x) +
        dX * (line2.end.y - line1.start.y)) /
        determinant;
    // check if there is an intersection
    if (!(lambda >= 0 && lambda <= 1) || !(gamma >= 0 && gamma <= 1)) {
        return null;
    }
    return { x: line1.start.x + lambda * dX, y: line1.start.y + lambda * dY };
}
exports.intersectLineLine = intersectLineLine;
function intersectLinePolygon(line, polygon) {
    return polygon.calcPoints
        .map((to, index) => {
        const from = index
            ? polygon.calcPoints[index - 1]
            : polygon.calcPoints[polygon.calcPoints.length - 1];
        const side = new line_1.Line({ x: from.x + polygon.pos.x, y: from.y + polygon.pos.y }, { x: to.x + polygon.pos.x, y: to.y + polygon.pos.y });
        return intersectLineLine(line, side);
    })
        .filter((test) => !!test);
}
exports.intersectLinePolygon = intersectLinePolygon;
//# sourceMappingURL=utils.js.map