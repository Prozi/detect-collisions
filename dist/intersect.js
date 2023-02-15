"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersectLinePolygon = exports.intersectLineLine = exports.intersectLineCircle = exports.circleOutsidePolygon = exports.circleInPolygon = exports.circleInCircle = exports.pointOnCircle = exports.polygonInPolygon = exports.pointInPolygon = exports.polygonInCircle = void 0;
const sat_1 = require("sat");
const utils_1 = require("./utils");
function polygonInCircle({ pos, calcPoints }, circle) {
    return calcPoints.every((p) => (0, sat_1.pointInCircle)({ x: pos.x + p.x, y: pos.y + p.y }, circle));
}
exports.polygonInCircle = polygonInCircle;
function pointInPolygon(a, b) {
    return (0, utils_1.ensureConvex)(b).some((convex) => (0, sat_1.pointInPolygon)(a, convex));
}
exports.pointInPolygon = pointInPolygon;
function polygonInPolygon(a, b) {
    return a.calcPoints.every((p) => pointInPolygon({ x: p.x + a.pos.x, y: p.y + a.pos.y }, b));
}
exports.polygonInPolygon = polygonInPolygon;
/**
 * https://stackoverflow.com/a/68197894/1749528
 */
function pointOnCircle(p, { r, pos }) {
    return ((p.x - pos.x) * (p.x - pos.x) + (p.y - pos.y) * (p.y - pos.y) === r * r);
}
exports.pointOnCircle = pointOnCircle;
/**
 * https://stackoverflow.com/a/68197894/1749528
 */
function circleInCircle(a, b) {
    const x1 = a.pos.x;
    const y1 = a.pos.y;
    const x2 = b.pos.x;
    const y2 = b.pos.y;
    const r1 = a.r;
    const r2 = b.r;
    const distSq = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    return distSq + r2 === r1 || distSq + r2 < r1;
}
exports.circleInCircle = circleInCircle;
/**
 * https://stackoverflow.com/a/68197894/1749528
 */
function circleInPolygon(circle, polygon) {
    // Circle with radius 0 isn't a circle
    if (circle.r === 0) {
        return false;
    }
    // Necessary add polygon pos to points
    const points = polygon.calcPoints.map(({ x, y }) => ({
        x: x + polygon.pos.x,
        y: y + polygon.pos.y,
    }));
    // If the center of the circle is not within the polygon,
    // then the circle may overlap, but it'll never be "contained"
    // so return false
    if (!pointInPolygon(circle.pos, polygon)) {
        return false;
    }
    // If the center of the circle is within the polygon,
    // the circle is not outside of the polygon completely.
    // so return false.
    if (points.some((point) => (0, sat_1.pointInCircle)(point, circle))) {
        return false;
    }
    // If any line-segment of the polygon intersects the circle,
    // the circle is not "contained"
    // so return false
    if (points.some((_point, i) => {
        const start = i === 0 ? points[0] : points[i];
        const end = i === 0 ? points[points.length - 1] : points[i + 1] || points[i];
        return intersectLineCircle({ start, end }, circle).length > 0;
    })) {
        return false;
    }
    return true;
}
exports.circleInPolygon = circleInPolygon;
/**
 * https://stackoverflow.com/a/68197894/1749528
 */
function circleOutsidePolygon(circle, polygon) {
    // Circle with radius 0 isn't a circle
    if (circle.r === 0) {
        return false;
    }
    // If the center of the circle is within the polygon,
    // the circle is not outside of the polygon completely.
    // so return false.
    if (pointInPolygon(circle.pos, polygon)) {
        return false;
    }
    // Necessary add polygon pos to points
    const points = polygon.calcPoints.map(({ x, y }) => ({
        x: x + polygon.pos.x,
        y: y + polygon.pos.y,
    }));
    // If the center of the circle is within the polygon,
    // the circle is not outside of the polygon completely.
    // so return false.
    if (points.some((point) => (0, sat_1.pointInCircle)(point, circle) || pointOnCircle(point, circle))) {
        return false;
    }
    // If any line-segment of the polygon intersects the circle,
    // the circle is not "contained"
    // so return false
    if (points.some((_point, i) => {
        const start = i === 0 ? points[0] : points[i];
        const end = i === 0 ? points[points.length - 1] : points[i + 1] || points[i];
        return intersectLineCircle({ start, end }, circle).length > 0;
    })) {
        return false;
    }
    return true;
}
exports.circleOutsidePolygon = circleOutsidePolygon;
/**
 * https://stackoverflow.com/a/37225895/1749528
 */
function intersectLineCircle(line, { pos, r }) {
    const v1 = { x: line.end.x - line.start.x, y: line.end.y - line.start.y };
    const v2 = { x: line.start.x - pos.x, y: line.start.y - pos.y };
    const b = (v1.x * v2.x + v1.y * v2.y) * -2;
    const c = (v1.x * v1.x + v1.y * v1.y) * 2;
    const d = Math.sqrt(b * b - (v2.x * v2.x + v2.y * v2.y - r * r) * c * 2);
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
/**
 * https://stackoverflow.com/a/24392281/1749528
 */
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
        const side = {
            start: { x: from.x + polygon.pos.x, y: from.y + polygon.pos.y },
            end: { x: to.x + polygon.pos.x, y: to.y + polygon.pos.y },
        };
        return intersectLineLine(line, side);
    })
        .filter((test) => !!test);
}
exports.intersectLinePolygon = intersectLinePolygon;
//# sourceMappingURL=intersect.js.map