"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Circle = void 0;

var _sat = _interopRequireDefault(require("sat"));

var _model = require("../model");

var _utils = require("../utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * collider - circle
 */
class Circle extends _sat.default.Circle {
  /**
   * collider - circle
   * @param {Vector} position {x, y}
   * @param {number} radius
   */
  constructor(position, radius) {
    super((0, _utils.ensureVectorPoint)(position), radius);
    this.type = _model.Types.Circle;
    this.updateAABB();
  }
  /**
   * Updates Bounding Box of collider
   */

  updateAABB() {
    this.minX = this.pos.x - this.r;
    this.minY = this.pos.y - this.r;
    this.maxX = this.pos.x + this.r;
    this.maxY = this.pos.y + this.r;
  }
  /**
   * Draws collider on a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The canvas context to draw on
   */

  draw(context) {
    const x = this.pos.x;
    const y = this.pos.y;
    const radius = this.r;
    context.moveTo(x + radius, y);
    context.arc(x, y, radius, 0, Math.PI * 2);
  }
}

exports.Circle = Circle;
