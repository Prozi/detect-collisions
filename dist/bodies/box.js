"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Box = undefined;

var _slicedToArray = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance"
      );
    }
  };
})();

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

var _polygon = require("./polygon");

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
 * collider - box
 */
var Box = (exports.Box = (function (_SAT$Polygon) {
  _inherits(Box, _SAT$Polygon);

  /**
   * collider - box
   * @param {Vector} position {x, y}
   * @param {number} width
   * @param {number} height
   */
  function Box(position, width, height) {
    _classCallCheck(this, Box);

    var _this = _possibleConstructorReturn(
      this,
      (Box.__proto__ || Object.getPrototypeOf(Box)).call(
        this,
        (0, _utils.ensureVectorPoint)(position),
        (0, _utils.createBox)(width, height)
      )
    );

    _this.type = _model.Types.Box;
    _this.updateAABB();
    return _this;
  }
  /**
   * Updates Bounding Box of collider
   */

  _createClass(Box, [
    {
      key: "updateAABB",
      value: function updateAABB() {
        var _calcPoints = _slicedToArray(this.calcPoints, 3),
          topLeft = _calcPoints[0],
          _ = _calcPoints[1],
          topRight = _calcPoints[2];

        this.minX = this.pos.x + topLeft.x;
        this.minY = this.pos.y + topLeft.y;
        this.maxX = this.pos.x + topRight.x;
        this.maxY = this.pos.y + topRight.y;
      },
      /**
       * Draws collider on a CanvasRenderingContext2D's current path
       * @param {CanvasRenderingContext2D} context The canvas context to draw on
       */
    },
    {
      key: "draw",
      value: function draw(context) {
        _polygon.Polygon.prototype.draw.call(this, context);
      },
    },
  ]);

  return Box;
})(_sat2.default.Polygon));
