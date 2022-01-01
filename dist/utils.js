"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashLineTo = exports.clockwise = exports.ensurePolygonPoints = exports.ensureVectorPoint = exports.createBox = void 0;
const sat_1 = __importDefault(require("sat"));
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
function ensureVectorPoint(point) {
    return point instanceof sat_1.default.Vector ? point : new sat_1.default.Vector(point.x, point.y);
}
exports.ensureVectorPoint = ensureVectorPoint;
/**
 * ensure correct counterclockwise points
 * @param {SAT.Vector[]} points
 */
function ensurePolygonPoints(points) {
    return (clockwise(points) ? points.reverse() : points).map(ensureVectorPoint);
}
exports.ensurePolygonPoints = ensurePolygonPoints;
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
    let distance = Math.hypot(xDiff, yDiff);
    while (distance > 0) {
        const step = Math.min(distance, dash);
        context.moveTo(posX, posY);
        context.lineTo(posX + offsetX * step, posY + offsetY * step);
        posX += offsetX * (dash + gap);
        posY += offsetY * (dash + gap);
        distance -= dash + gap;
    }
}
exports.dashLineTo = dashLineTo;
