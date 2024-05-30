"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBits = exports.ensureNumber = exports.bin2dec = exports.getGroup = exports.returnTrue = exports.cloneResponse = exports.drawBVH = exports.drawPolygon = exports.dashLineTo = exports.getSATTest = exports.getBounceDirection = exports.mapArrayToVector = exports.mapVectorToArray = exports.clonePointsArray = exports.checkAInB = exports.canInteract = exports.intersectAABB = exports.notIntersectAABB = exports.bodyMoved = exports.extendBody = exports.clockwise = exports.distance = exports.ensurePolygonPoints = exports.ensureVectorPoint = exports.createBox = exports.createEllipse = exports.rad2deg = exports.deg2rad = exports.RAD2DEG = exports.DEG2RAD = void 0;
const sat_1 = require("sat");
const intersect_1 = require("./intersect");
const model_1 = require("./model");
const optimized_1 = require("./optimized");
/* helpers for faster getSATTest() and checkAInB() */
const testMap = {
    satCircleCircle: sat_1.testCircleCircle,
    satCirclePolygon: sat_1.testCirclePolygon,
    satPolygonCircle: sat_1.testPolygonCircle,
    satPolygonPolygon: sat_1.testPolygonPolygon,
    inCircleCircle: intersect_1.circleInCircle,
    inCirclePolygon: intersect_1.circleInPolygon,
    inPolygonCircle: intersect_1.polygonInCircle,
    inPolygonPolygon: intersect_1.polygonInPolygon
};
function createMap(bodyType, testType) {
    return Object.values(model_1.BodyType).reduce((result, type) => (Object.assign(Object.assign({}, result), { [type]: type === model_1.BodyType.Circle
            ? testMap[`${testType}${bodyType}Circle`]
            : testMap[`${testType}${bodyType}Polygon`] })), {});
}
const circleSATFunctions = createMap(model_1.BodyType.Circle, "sat");
const circleInFunctions = createMap(model_1.BodyType.Circle, "in");
const polygonSATFunctions = createMap(model_1.BodyType.Polygon, "sat");
const polygonInFunctions = createMap(model_1.BodyType.Polygon, "in");
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
    const ellipse = [];
    for (let index = 0; index < length; index++) {
        const value = (index / length) * 2 * Math.PI;
        const x = Math.cos(value) * radiusX;
        const y = Math.sin(value) * radiusY;
        ellipse.push(new sat_1.Vector(x, y));
    }
    return ellipse;
}
exports.createEllipse = createEllipse;
/**
 * creates box shaped polygon points
 */
function createBox(width, height) {
    return [
        new sat_1.Vector(0, 0),
        new sat_1.Vector(width, 0),
        new sat_1.Vector(width, height),
        new sat_1.Vector(0, height)
    ];
}
exports.createBox = createBox;
/**
 * ensure SATVector type point result
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
function ensurePolygonPoints(points = []) {
    const polygonPoints = (0, optimized_1.map)(points, ensureVectorPoint);
    return clockwise(polygonPoints) ? polygonPoints.reverse() : polygonPoints;
}
exports.ensurePolygonPoints = ensurePolygonPoints;
/**
 * get distance between two Vector points
 */
function distance(bodyA, bodyB) {
    const xDiff = bodyA.x - bodyB.x;
    const yDiff = bodyA.y - bodyB.y;
    return Math.hypot(xDiff, yDiff);
}
exports.distance = distance;
/**
 * check [is clockwise] direction of polygon
 */
function clockwise(points) {
    const length = points.length;
    let sum = 0;
    (0, optimized_1.forEach)(points, (v1, index) => {
        const v2 = points[(index + 1) % length];
        sum += (v2.x - v1.x) * (v2.y + v1.y);
    });
    return sum > 0;
}
exports.clockwise = clockwise;
/**
 * used for all types of bodies in constructor
 */
function extendBody(body, options = {}) {
    body.isStatic = !!options.isStatic;
    body.isTrigger = !!options.isTrigger;
    body.padding = options.padding || 0;
    body.group = typeof options.group === "number" ? options.group : 0x7FFFFFFF;
    if (body.typeGroup !== model_1.BodyGroup.Circle) {
        body.isCentered = options.isCentered || false;
    }
    body.setAngle(options.angle || 0);
}
exports.extendBody = extendBody;
/**
 * check if body moved outside of its padding
 */
function bodyMoved(body) {
    const { bbox, minX, minY, maxX, maxY } = body;
    return (bbox.minX < minX || bbox.minY < minY || bbox.maxX > maxX || bbox.maxY > maxY);
}
exports.bodyMoved = bodyMoved;
/**
 * returns true if two boxes not intersect
 */
function notIntersectAABB(bodyA, bodyB) {
    return (bodyB.minX > bodyA.maxX ||
        bodyB.minY > bodyA.maxY ||
        bodyB.maxX < bodyA.minX ||
        bodyB.maxY < bodyA.minY);
}
exports.notIntersectAABB = notIntersectAABB;
/**
 * checks if two boxes intersect
 */
function intersectAABB(bodyA, bodyB) {
    return !notIntersectAABB(bodyA, bodyB);
}
exports.intersectAABB = intersectAABB;
/**
 * checks if two bodies can interact (for collision filtering)
 */
function canInteract(bodyA, bodyB) {
    return (((bodyA.group >> 16) & (bodyB.group & 0xFFFF) &&
        (bodyB.group >> 16) & (bodyA.group & 0xFFFF)) !== 0);
}
exports.canInteract = canInteract;
/**
 * checks if body a is in body b
 */
function checkAInB(bodyA, bodyB) {
    const check = bodyA.typeGroup === model_1.BodyGroup.Circle
        ? circleInFunctions
        : polygonInFunctions;
    return check[bodyB.type](bodyA, bodyB);
}
exports.checkAInB = checkAInB;
/**
 * clone sat vector points array into vector points array
 */
function clonePointsArray(points) {
    return (0, optimized_1.map)(points, ({ x, y }) => ({ x, y }));
}
exports.clonePointsArray = clonePointsArray;
/**
 * change format from SAT.js to poly-decomp
 */
function mapVectorToArray({ x, y } = { x: 0, y: 0 }) {
    return [x, y];
}
exports.mapVectorToArray = mapVectorToArray;
/**
 * change format from poly-decomp to SAT.js
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
function getSATTest(bodyA, bodyB) {
    const check = bodyA.typeGroup === model_1.BodyGroup.Circle
        ? circleSATFunctions
        : polygonSATFunctions;
    return check[bodyB.type];
}
exports.getSATTest = getSATTest;
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
 * draw polygon
 */
function drawPolygon(context, { pos, calcPoints }, isTrigger = false) {
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
 * draw body bounding body box
 */
function drawBVH(context, body) {
    drawPolygon(context, {
        pos: { x: body.minX, y: body.minY },
        calcPoints: createBox(body.maxX - body.minX, body.maxY - body.minY)
    });
}
exports.drawBVH = drawBVH;
/**
 * clone response object returning new response with previous ones values
 */
function cloneResponse(response) {
    const clone = new sat_1.Response();
    const { a, b, overlap, overlapN, overlapV, aInB, bInA } = response;
    clone.a = a;
    clone.b = b;
    clone.overlap = overlap;
    clone.overlapN = overlapN.clone();
    clone.overlapV = overlapV.clone();
    clone.aInB = aInB;
    clone.bInA = bInA;
    return clone;
}
exports.cloneResponse = cloneResponse;
/**
 * dummy fn used as default, for optimization
 */
function returnTrue() {
    return true;
}
exports.returnTrue = returnTrue;
/**
 * for groups
 */
function getGroup(group) {
    return Math.max(0, Math.min(group, 0x7FFFFFFF));
}
exports.getGroup = getGroup;
/**
 * binary string to decimal number
 */
function bin2dec(binary) {
    return Number(`0b${binary}`.replace(/\s/g, ""));
}
exports.bin2dec = bin2dec;
/**
 * helper for groupBits()
 *
 * @param input - number or binary string
 */
function ensureNumber(input) {
    return typeof input === "number" ? input : bin2dec(input);
}
exports.ensureNumber = ensureNumber;
/**
 * create group bits from category and mask
 *
 * @param category - category bits
 * @param mask - mask bits (default: category)
 */
function groupBits(category, mask = category) {
    return (ensureNumber(category) << 16) | ensureNumber(mask);
}
exports.groupBits = groupBits;
