'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Result = require('./Result');
var SAT = require('./SAT');

/**
 * The base class for bodies used to detect collisions
 * @class
 * @protected
 */

var Body = function () {
  /**
   * @constructor
   * @param {Number} [x = 0] The starting X coordinate
   * @param {Number} [y = 0] The starting Y coordinate
   * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
   */
  function Body() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, Body);

    /**
     * @desc The X coordinate of the body
     * @type {Number}
     */
    this.x = x;

    /**
     * @desc The Y coordinate of the body
     * @type {Number}
     */
    this.y = y;

    /**
     * @desc The amount to pad the bounding volume when testing for potential collisions
     * @type {Number}
     */
    this.padding = padding;

    /** @private */
    this._circle = false;

    /** @private */
    this._polygon = false;

    /** @private */
    this._point = false;

    /** @private */
    this._bvh = null;

    /** @private */
    this._bvh_parent = null;

    /** @private */
    this._bvh_branch = false;

    /** @private */
    this._bvh_padding = padding;

    /** @private */
    this._bvh_min_x = 0;

    /** @private */
    this._bvh_min_y = 0;

    /** @private */
    this._bvh_max_x = 0;

    /** @private */
    this._bvh_max_y = 0;
  }

  /**
   * Determines if the body is colliding with another body
   * @param {Circle|Polygon|Point} target The target body to test against
   * @param {Result} [result = null] A Result object on which to store information about the collision
   * @param {Boolean} [aabb = true] Set to false to skip the AABB test (useful if you use your own potential collision heuristic)
   * @returns {Boolean}
   */


  _createClass(Body, [{
    key: 'collides',
    value: function collides(target) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var aabb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return SAT(this, target, result, aabb);
    }

    /**
     * Returns a list of potential collisions
     * @returns {Array<Body>}
     */

  }, {
    key: 'potentials',
    value: function potentials() {
      var bvh = this._bvh;

      if (bvh === null) {
        throw new Error('Body does not belong to a collision system');
      }

      return bvh.potentials(this);
    }

    /**
     * Removes the body from its current collision system
     */

  }, {
    key: 'remove',
    value: function remove() {
      var bvh = this._bvh;

      if (bvh) {
        bvh.remove(this, false);
      }
    }

    /**
     * Creates a {@link Result} used to collect the detailed results of a collision test
     */

  }, {
    key: 'createResult',
    value: function createResult() {
      return new Result();
    }

    /**
     * Creates a Result used to collect the detailed results of a collision test
     */

  }], [{
    key: 'createResult',
    value: function createResult() {
      return new Result();
    }
  }]);

  return Body;
}();

module.exports = Body;

module.exports.default = module.exports;