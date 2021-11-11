"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Polygon = undefined;

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
 * collider - polygon
 */
var Polygon = (exports.Polygon = (function (_SAT$Polygon) {
  _inherits(Polygon, _SAT$Polygon);

  /**
   * collider - polygon
   * @param {Vector} position {x, y}
   * @param {Vector[]} points
   */
  function Polygon(position, points) {
    _classCallCheck(this, Polygon);

    var _this = _possibleConstructorReturn(
      this,
      (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(
        this,
        (0, _utils.ensureVectorPoint)(position),
        (0, _utils.ensurePolygonPoints)(points)
      )
    );

    _this.type = _model.Types.Polygon;
    _this.updateAABB();
    return _this;
  }
  /**
   * Updates Bounding Box of collider
   */

  _createClass(Polygon, [
    {
      key: "updateAABB",
      value: function updateAABB() {
        var _getAABBAsBox = this.getAABBAsBox(),
          pos = _getAABBAsBox.pos,
          w = _getAABBAsBox.w,
          h = _getAABBAsBox.h;

        this.minX = pos.x;
        this.minY = pos.y;
        this.maxX = pos.x + w;
        this.maxY = pos.y + h;
      },
      /**
       * Draws collider on a CanvasRenderingContext2D's current path
       * @param {CanvasRenderingContext2D} context The canvas context to draw on
       */
    },
    {
      key: "draw",
      value: function draw(context) {
        var _this2 = this;

        this.calcPoints.forEach(function (point, index) {
          var posX = _this2.pos.x + point.x;
          var posY = _this2.pos.y + point.y;
          if (!index) {
            if (_this2.calcPoints.length === 1) {
              context.arc(posX, posY, 1, 0, Math.PI * 2);
            } else {
              context.moveTo(posX, posY);
            }
          } else {
            context.lineTo(posX, posY);
          }
        });
        if (this.calcPoints.length > 2) {
          context.lineTo(
            this.pos.x + this.calcPoints[0].x,
            this.pos.y + this.calcPoints[0].y
          );
        }
      },
    },
  ]);

  return Polygon;
})(_sat2.default.Polygon));
