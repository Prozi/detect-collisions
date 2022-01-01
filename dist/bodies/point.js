"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Point = undefined;

var _box = require("./box");

var _model = require("../model");

var _utils = require("../utils");

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

/**
 * collider - point (very tiny box)
 */
var Point = (exports.Point = (function (_Box) {
  _inherits(Point, _Box);

  /**
   * collider - point (very tiny box)
   * @param {Vector} position {x, y}
   */
  function Point(position) {
    _classCallCheck(this, Point);

    var _this = _possibleConstructorReturn(
      this,
      (Point.__proto__ || Object.getPrototypeOf(Point)).call(
        this,
        (0, _utils.ensureVectorPoint)(position),
        0.1,
        0.1
      )
    );

    _this.type = _model.Types.Point;
    return _this;
  }

  return Point;
})(_box.Box));
