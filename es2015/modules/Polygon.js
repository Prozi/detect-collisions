'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Body = require('./Body');

/**
 * A polygon used to detect collisions
 * @class
 */

var Polygon = function (_Body) {
  _inherits(Polygon, _Body);

  /**
   * @constructor
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Array<Number[]>} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
   * @param {Number} [angle = 0] The starting rotation in radians
   * @param {Number} [scale_x = 1] The starting scale along the X axis
   * @param {Number} [scale_y = 1] The starting scale long the Y axis
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   */
  function Polygon() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var points = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var angle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var scale_x = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
    var scale_y = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
    var padding = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

    _classCallCheck(this, Polygon);

    /**
     * @desc The angle of the body in radians
     * @type {Number}
     */
    var _this = _possibleConstructorReturn(this, (Polygon.__proto__ || Object.getPrototypeOf(Polygon)).call(this, x, y, padding));

    _this.angle = angle;

    /**
     * @desc The scale of the body along the X axis
     * @type {Number}
     */
    _this.scale_x = scale_x;

    /**
     * @desc The scale of the body along the Y axis
     * @type {Number}
     */
    _this.scale_y = scale_y;

    /** @private */
    _this._polygon = true;

    /** @private */
    _this._x = x;

    /** @private */
    _this._y = y;

    /** @private */
    _this._angle = angle;

    /** @private */
    _this._scale_x = scale_x;

    /** @private */
    _this._scale_y = scale_y;

    /** @private */
    _this._min_x = 0;

    /** @private */
    _this._min_y = 0;

    /** @private */
    _this._max_x = 0;

    /** @private */
    _this._max_y = 0;

    /** @private */
    _this._points = null;

    /** @private */
    _this._coords = null;

    /** @private */
    _this._edges = null;

    /** @private */
    _this._normals = null;

    /** @private */
    _this._dirty_coords = true;

    /** @private */
    _this._dirty_normals = true;

    Polygon.prototype.setPoints.call(_this, points);
    return _this;
  }

  /**
   * Draws the polygon to a CanvasRenderingContext2D's current path
   * @param {CanvasRenderingContext2D} context The context to add the shape to
   */


  _createClass(Polygon, [{
    key: 'draw',
    value: function draw(context) {
      if (this._dirty_coords || this.x !== this._x || this.y !== this._y || this.angle !== this._angle || this.scale_x !== this._scale_x || this.scale_y !== this._scale_y) {
        this._calculateCoords();
      }

      var coords = this._coords;

      if (coords.length === 2) {
        context.moveTo(coords[0], coords[1]);
        context.arc(coords[0], coords[1], 1, 0, Math.PI * 2);
      } else {
        context.moveTo(coords[0], coords[1]);

        for (var i = 2; i < coords.length; i += 2) {
          context.lineTo(coords[i], coords[i + 1]);
        }

        if (coords.length > 4) {
          context.lineTo(coords[0], coords[1]);
        }
      }
    }

    /**
     * Sets the points making up the polygon. It's important to use this function when changing the polygon's shape to ensure internal data is also updated.
     * @param {Array<Number[]>} new_points An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
     */

  }, {
    key: 'setPoints',
    value: function setPoints(new_points) {
      var count = new_points.length;

      this._points = new Float64Array(count * 2);
      this._coords = new Float64Array(count * 2);
      this._edges = new Float64Array(count * 2);
      this._normals = new Float64Array(count * 2);

      var points = this._points;

      for (var i = 0, ix = 0, iy = 1; i < count; ++i, ix += 2, iy += 2) {
        var new_point = new_points[i];

        points[ix] = new_point[0];
        points[iy] = new_point[1];
      }

      this._dirty_coords = true;
    }

    /**
     * Calculates and caches the polygon's world coordinates based on its points, angle, and scale
     */

  }, {
    key: '_calculateCoords',
    value: function _calculateCoords() {
      var x = this.x;
      var y = this.y;
      var angle = this.angle;
      var scale_x = this.scale_x;
      var scale_y = this.scale_y;
      var points = this._points;
      var coords = this._coords;
      var count = points.length;

      var min_x = void 0;
      var max_x = void 0;
      var min_y = void 0;
      var max_y = void 0;

      for (var ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
        var coord_x = points[ix] * scale_x;
        var coord_y = points[iy] * scale_y;

        if (angle) {
          var cos = Math.cos(angle);
          var sin = Math.sin(angle);
          var tmp_x = coord_x;
          var tmp_y = coord_y;

          coord_x = tmp_x * cos - tmp_y * sin;
          coord_y = tmp_x * sin + tmp_y * cos;
        }

        coord_x += x;
        coord_y += y;

        coords[ix] = coord_x;
        coords[iy] = coord_y;

        if (ix === 0) {
          min_x = max_x = coord_x;
          min_y = max_y = coord_y;
        } else {
          if (coord_x < min_x) {
            min_x = coord_x;
          } else if (coord_x > max_x) {
            max_x = coord_x;
          }

          if (coord_y < min_y) {
            min_y = coord_y;
          } else if (coord_y > max_y) {
            max_y = coord_y;
          }
        }
      }

      this._x = x;
      this._y = y;
      this._angle = angle;
      this._scale_x = scale_x;
      this._scale_y = scale_y;
      this._min_x = min_x;
      this._min_y = min_y;
      this._max_x = max_x;
      this._max_y = max_y;
      this._dirty_coords = false;
      this._dirty_normals = true;
    }

    /**
     * Calculates the normals and edges of the polygon's sides
     */

  }, {
    key: '_calculateNormals',
    value: function _calculateNormals() {
      var coords = this._coords;
      var edges = this._edges;
      var normals = this._normals;
      var count = coords.length;

      for (var ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
        var next = ix + 2 < count ? ix + 2 : 0;
        var x = coords[next] - coords[ix];
        var y = coords[next + 1] - coords[iy];
        var length = x || y ? Math.sqrt(x * x + y * y) : 0;

        edges[ix] = x;
        edges[iy] = y;
        normals[ix] = length ? y / length : 0;
        normals[iy] = length ? -x / length : 0;
      }

      this._dirty_normals = false;
    }
  }]);

  return Polygon;
}(Body);

module.exports = Polygon;

module.exports.default = module.exports;