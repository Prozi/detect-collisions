"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.createBox = createBox;
exports.ensureVectorPoint = ensureVectorPoint;
exports.ensurePolygonPoints = ensurePolygonPoints;
exports.clockwise = clockwise;
exports.dashLineTo = dashLineTo;

var _sat = require("sat");

var _sat2 = _interopRequireDefault(_sat);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * creates box polygon points
 * @param {number} width
 * @param {number} height
 * @returns SAT.Vector
 */
function createBox(width, height) {
  return [
    new _sat2.default.Vector(),
    new _sat2.default.Vector(width, 0),
    new _sat2.default.Vector(width, height),
    new _sat2.default.Vector(0, height),
  ];
}
/**
 * ensure returns a SAT.Vector
 * @param {SAT.Vector} point
 */
function ensureVectorPoint(point) {
  return point instanceof _sat2.default.Vector
    ? point
    : new _sat2.default.Vector(point.x, point.y);
}
/**
 * ensure correct counterclockwise points
 * @param {SAT.Vector[]} points
 */
function ensurePolygonPoints(points) {
  return (clockwise(points) ? points.reverse() : points).map(ensureVectorPoint);
}
/**
 * check direction of polygon
 * @param {SAT.Vector[]} points
 */
function clockwise(points) {
  var sum = 0;
  for (var i = 0; i < points.length; i++) {
    var v1 = points[i];
    var v2 = points[(i + 1) % points.length];
    sum += (v2.x - v1.x) * (v2.y + v1.y);
  }
  return sum > 0;
}
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
function dashLineTo(context, fromX, fromY, toX, toY) {
  var dash =
    arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 2;
  var gap =
    arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 4;

  var xDiff = toX - fromX;
  var yDiff = toY - fromY;
  var arc = Math.atan2(yDiff, xDiff);
  var offsetX = Math.cos(arc);
  var offsetY = Math.sin(arc);
  var posX = fromX;
  var posY = fromY;
  var distance = Math.hypot(xDiff, yDiff);
  while (distance > 0) {
    var step = Math.min(distance, dash);
    context.moveTo(posX, posY);
    context.lineTo(posX + offsetX * step, posY + offsetY * step);
    posX += offsetX * (dash + gap);
    posY += offsetY * (dash + gap);
    distance -= dash + gap;
  }
}
