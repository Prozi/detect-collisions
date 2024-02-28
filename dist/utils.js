"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnTrue = exports.cloneResponse = exports.drawBVH = exports.drawPolygon = exports.getSATTest = exports.getBounceDirection = exports.mapArrayToVector = exports.mapVectorToArray = exports.dashLineTo = exports.clonePointsArray = exports.checkAInB = exports.intersectAABB = exports.notIntersectAABB = exports.bodyMoved = exports.extendBody = exports.clockwise = exports.distance = exports.ensurePolygonPoints = exports.ensureVectorPoint = exports.createBox = exports.createEllipse = exports.rad2deg = exports.deg2rad = exports.RAD2DEG = exports.DEG2RAD = void 0;
const sat_1 = require("sat");
const intersect_1 = require("./intersect");
const model_1 = require("./model");
const optimized_1 = require("./optimized");
exports.DEG2RAD = Math.PI / 180;
exports.RAD2DEG = 180 / Math.PI;
/**
 * convert from degrees to radians
 */
function deg2rad(degrees) {
    return degrees * exports.DEG2RAD;
}
exports.deg2rad = deg2rad;
/**
 * convert from radians to degrees
 */
function rad2deg(radians) {
    return radians * exports.RAD2DEG;
}
exports.rad2deg = rad2deg;
/**
 * creates ellipse-shaped polygon based on params
 */
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
    const polygonPoints = (0, optimized_1.map)(points, ensureVectorPoint);
    return clockwise(polygonPoints) ? polygonPoints.reverse() : polygonPoints;
}
exports.ensurePolygonPoints = ensurePolygonPoints;
/**
 * get distance between two Vector points
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
    if (body.type !== model_1.BodyType.Circle) {
        body.isCentered = (options === null || options === void 0 ? void 0 : options.isCentered) || false;
    }
    body.setAngle((options === null || options === void 0 ? void 0 : options.angle) || 0);
}
exports.extendBody = extendBody;
/**
 * check if body moved outside of its padding
 */
function bodyMoved(body) {
    return (body.bbox.minX < body.minX ||
        body.bbox.minY < body.minY ||
        body.bbox.maxX > body.maxX ||
        body.bbox.maxY > body.maxY);
}
exports.bodyMoved = bodyMoved;
/**
 * returns true if two boxes not intersect
 */
function notIntersectAABB(a, b) {
    return (b.minX > a.maxX || b.minY > a.maxY || b.maxX < a.minX || b.maxY < a.minY);
}
exports.notIntersectAABB = notIntersectAABB;
/**
 * checks if two boxes intersect
 */
function intersectAABB(a, b) {
    return !notIntersectAABB(a, b);
}
exports.intersectAABB = intersectAABB;
/**
 * checks if body a is in body b
 */
function checkAInB(a, b) {
    if (a.type === model_1.BodyType.Circle) {
        if (b.type !== model_1.BodyType.Circle) {
            return (0, intersect_1.circleInPolygon)(a, b);
        }
        return (0, intersect_1.circleInCircle)(a, b);
    }
    if (b.type === model_1.BodyType.Circle) {
        return (0, intersect_1.polygonInCircle)(a, b);
    }
    return (0, intersect_1.polygonInPolygon)(a, b);
}
exports.checkAInB = checkAInB;
/**
 * clone sat vector points array into vector points array
 */
function clonePointsArray(points) {
    return (0, optimized_1.map)(points, ({ x, y }) => ({
        x,
        y,
    }));
}
exports.clonePointsArray = clonePointsArray;
/**
 * draws dashed line on canvas context
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
/**
 * change format from poly-decomp to SAT.js
 */
function mapVectorToArray({ x, y } = { x: 0, y: 0 }) {
    return [x, y];
}
exports.mapVectorToArray = mapVectorToArray;
/**
 * change format from SAT.js to poly-decomp
 */
function mapArrayToVector([x, y] = [0, 0]) {
    return { x, y };
}
exports.mapArrayToVector = mapArrayToVector;
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
/**
 * returns correct sat.js testing function based on body types
 */
function getSATTest(body, wall) {
    if (body.type === model_1.BodyType.Circle) {
        return wall.type === model_1.BodyType.Circle ? sat_1.testCircleCircle : sat_1.testCirclePolygon;
    }
    return wall.type === model_1.BodyType.Circle ? sat_1.testPolygonCircle : sat_1.testPolygonPolygon;
}
exports.getSATTest = getSATTest;
/**
 * draw polygon
 */
function drawPolygon(context, { pos, calcPoints, }, isTrigger = false) {
    const lastPoint = calcPoints[calcPoints.length - 1];
    const fromX = pos.x + lastPoint.x;
    const fromY = pos.y + lastPoint.y;
    if (calcPoints.length === 1) {
        context.arc(fromX, fromY, 1, 0, Math.PI * 2);
    }
    else {
        context.moveTo(fromX, fromY);
    }
    (0, optimized_1.forEach)(calcPoints, (point, index) => {
        const toX = pos.x + point.x;
        const toY = pos.y + point.y;
        if (isTrigger) {
            const prev = calcPoints[index - 1] || lastPoint;
            dashLineTo(context, pos.x + prev.x, pos.y + prev.y, toX, toY);
        }
        else {
            context.lineTo(toX, toY);
        }
    });
}
exports.drawPolygon = drawPolygon;
/**
 * draw body bounding body
 */
function drawBVH(context, body) {
    drawPolygon(context, {
        pos: { x: body.minX, y: body.minY },
        calcPoints: createBox(body.maxX - body.minX, body.maxY - body.minY),
    });
}
exports.drawBVH = drawBVH;
/**
 * clone response object returning new response with previous ones values
 */
function cloneResponse(response) {
    const clone = new sat_1.Response();
    clone.a = response.a;
    clone.b = response.b;
    clone.overlap = response.overlap;
    clone.overlapN = response.overlapN.clone();
    clone.overlapV = response.overlapV.clone();
    clone.aInB = response.aInB;
    clone.bInA = response.bInA;
    return clone;
}
exports.cloneResponse = cloneResponse;
function returnTrue() {
    return true;
}
exports.returnTrue = returnTrue;
