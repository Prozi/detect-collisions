"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Point = undefined;

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _sat = require("sat");

var _sat2 = _interopRequireDefault(_sat);

var _box = require("./box");

var _model = require("../model");

var _utils = require("../utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

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
var Point = (exports.Point = (function (_SAT$Polygon) {
  _inherits(Point, _SAT$Polygon);

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
        (0, _utils.createBox)(0.1, 0.1)
      )
    );

    _this.type = _model.Types.Point;
    _this.updateAABB();
    return _this;
  }
  /**
   * Updates Bounding Box of collider
   */

  _createClass(Point, [
    {
      key: "updateAABB",
      value: function updateAABB() {
        _box.Box.prototype.updateAABB.call(this);
      },
      /**
       * Draws collider on a CanvasRenderingContext2D's current path
       * @param {CanvasRenderingContext2D} context The canvas context to draw on
       */
    },
    {
      key: "draw",
      value: function draw(context) {
        _box.Box.prototype.draw.call(this, context);
      },
    },
  ]);

  return Point;
})(_sat2.default.Polygon));
