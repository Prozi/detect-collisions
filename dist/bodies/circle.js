"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Circle = undefined;

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
 * collider - circle
 */
var Circle = (exports.Circle = (function (_SAT$Circle) {
  _inherits(Circle, _SAT$Circle);

  /**
   * collider - circle
   * @param {Vector} position {x, y}
   * @param {number} radius
   */
  function Circle(position, radius) {
    _classCallCheck(this, Circle);

    var _this = _possibleConstructorReturn(
      this,
      (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(
        this,
        (0, _utils.ensureVectorPoint)(position),
        radius
      )
    );

    _this.type = _model.Types.Circle;
    _this.updateAABB();
    return _this;
  }
  /**
   * Updates Bounding Box of collider
   */

  _createClass(Circle, [
    {
      key: "updateAABB",
      value: function updateAABB() {
        this.minX = this.pos.x - this.r;
        this.minY = this.pos.y - this.r;
        this.maxX = this.pos.x + this.r;
        this.maxY = this.pos.y + this.r;
      },
      /**
       * Draws collider on a CanvasRenderingContext2D's current path
       * @param {CanvasRenderingContext2D} context The canvas context to draw on
       */
    },
    {
      key: "draw",
      value: function draw(context) {
        var radius = this.r;
        if (this.isTrigger) {
          var max = radius / 2;
          for (var i = 0; i < max; i++) {
            var arc = (i / max) * 2 * Math.PI;
            var arcPrev = ((i - 1) / max) * 2 * Math.PI;
            var fromX = this.pos.x + Math.cos(arcPrev) * radius;
            var fromY = this.pos.y + Math.sin(arcPrev) * radius;
            var toX = this.pos.x + Math.cos(arc) * radius;
            var toY = this.pos.y + Math.sin(arc) * radius;
            (0, _utils.dashLineTo)(context, fromX, fromY, toX, toY);
          }
        } else {
          context.moveTo(this.pos.x + radius, this.pos.y);
          context.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2);
        }
      },
    },
  ]);

  return Circle;
})(_sat2.default.Circle));
