"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.createBox = createBox;
exports.ensureVectorPoint = ensureVectorPoint;
exports.ensurePolygonPoints = ensurePolygonPoints;
exports.clockwise = clockwise;

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
