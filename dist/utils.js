"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashLineTo = exports.clockwise = exports.closest = exports.distance = exports.ensurePolygonPoints = exports.ensureVectorPoint = exports.createBox = exports.createEllipse = void 0;
const sat_1 = __importDefault(require("sat"));
function createEllipse(radiusX, radiusY = radiusX, step = 1) {
    const steps = 2 * Math.PI * Math.hypot(radiusX, radiusY);
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
 * returns function to sort raycast results
 * @param {Vector} from
 * @returns {function}
 */
function closest(from) {
    return (a, b) => {
        if (!a && !b) {
            return 0;
        }
        if (!a) {
            return -Infinity;
        }
        if (!b) {
            return Infinity;
        }
        return distance(from, a.point) - distance(from, b.point);
    };
}
exports.closest = closest;
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
//# sourceMappingURL=utils.js.map