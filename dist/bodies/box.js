"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Box = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

var _sat = _interopRequireDefault(require("sat"));

var _model = require("../model");

var _utils = require("../utils");

var _polygon = require("./polygon");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * collider - box
 */
class Box extends _sat.default.Polygon {
  /**
   * collider - box
   * @param {Vector} position {x, y}
   * @param {number} width
   * @param {number} height
   */
  constructor(position, width, height) {
    super(
      (0, _utils.ensureVectorPoint)(position),
      (0, _utils.createBox)(width, height)
    );
    this.type = _model.Types.Box;
    this.updateAABB();
  }
  /**
   * Updates Bounding Box of collider
   */

  updateAABB() {
    const [topLeft, _, topRight] = this.calcPoints;
    this.minX = this.pos.x + topLeft.x;
    this.minY = this.pos.y + topLeft.y;
    this.maxX = this.pos.x + topRight.x;
    this.maxY = this.pos.y + topRight.y;
  }
  /**
   * Draws collider on a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The canvas context to draw on
   */

  draw(context) {
    _polygon.Polygon.prototype.draw.call(this, context);
  }
}

exports.Box = Box;
