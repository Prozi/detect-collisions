"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Point = void 0;

var _sat = _interopRequireDefault(require("sat"));

var _box = require("./box");

var _model = require("../model");

var _utils = require("../utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * collider - point (very tiny box)
 */
class Point extends _sat.default.Polygon {
  /**
   * collider - point (very tiny box)
   * @param {Vector} position {x, y}
   */
  constructor(position) {
    super(
      (0, _utils.ensureVectorPoint)(position),
      (0, _utils.createBox)(0.1, 0.1)
    );
    this.type = _model.Types.Point;
    this.updateAABB();
  }
  /**
   * Updates Bounding Box of collider
   */

  updateAABB() {
    _box.Box.prototype.updateAABB.call(this);
  }
  /**
   * Draws collider on a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The canvas context to draw on
   */

  draw(context) {
    _box.Box.prototype.draw.call(this, context);
  }
}

exports.Point = Point;
