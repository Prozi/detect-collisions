"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.clockwise = clockwise;
exports.createBox = createBox;
exports.ensurePolygonPoints = ensurePolygonPoints;
exports.ensureVectorPoint = ensureVectorPoint;

require("core-js/modules/es.array.reverse.js");

var _sat = _interopRequireDefault(require("sat"));

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
    new _sat.default.Vector(),
    new _sat.default.Vector(width, 0),
    new _sat.default.Vector(width, height),
    new _sat.default.Vector(0, height),
  ];
}
/**
 * ensure returns a SAT.Vector
 * @param {SAT.Vector} point
 */

function ensureVectorPoint(point) {
  return point instanceof _sat.default.Vector
    ? point
    : new _sat.default.Vector(point.x, point.y);
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
  let sum = 0;

  for (let i = 0; i < points.length; i++) {
    const v1 = points[i];
    const v2 = points[(i + 1) % points.length];
    sum += (v2.x - v1.x) * (v2.y + v1.y);
  }

  return sum > 0;
}
