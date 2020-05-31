'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BVHBranch = require('./BVHBranch');

/**
 * A Bounding Volume Hierarchy (BVH) used to find potential collisions quickly
 * @class
 * @private
 */

var BVH = function () {
  /**
   * @constructor
   */
  function BVH() {
    _classCallCheck(this, BVH);

    /** @private */
    this._hierarchy = null;

    /** @private */
    this._bodies = [];

    /** @private */
    this._dirty_branches = [];
  }

  /**
   * Inserts a body into the BVH
   * @param {Circle|Polygon|Point} body The body to insert
   * @param {Boolean} [updating = false] Set to true if the body already exists in the BVH (used internally when updating the body's position)
   */


  _createClass(BVH, [{
    key: 'insert',
    value: function insert(body) {
      var updating = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!updating) {
        var bvh = body._bvh;

        if (bvh && bvh !== this) {
          throw new Error('Body belongs to another collision system');
        }

        body._bvh = this;
        this._bodies.push(body);
      }

      var polygon = body._polygon;
      var body_x = body.x;
      var body_y = body.y;

      if (polygon) {
        if (body._dirty_coords || body.x !== body._x || body.y !== body._y || body.angle !== body._angle || body.scale_x !== body._scale_x || body.scale_y !== body._scale_y) {
          body._calculateCoords();
        }
      }

      var padding = body._bvh_padding;
      var radius = polygon ? 0 : body.radius * body.scale;
      var body_min_x = (polygon ? body._min_x : body_x - radius) - padding;
      var body_min_y = (polygon ? body._min_y : body_y - radius) - padding;
      var body_max_x = (polygon ? body._max_x : body_x + radius) + padding;
      var body_max_y = (polygon ? body._max_y : body_y + radius) + padding;

      body._bvh_min_x = body_min_x;
      body._bvh_min_y = body_min_y;
      body._bvh_max_x = body_max_x;
      body._bvh_max_y = body_max_y;

      var current = this._hierarchy;
      var sort = 0;

      if (!current) {
        this._hierarchy = body;
      } else {
        while (true) {
          // Branch
          if (current._bvh_branch) {
            var left = current._bvh_left;
            var left_min_y = left._bvh_min_y;
            var left_max_x = left._bvh_max_x;
            var left_max_y = left._bvh_max_y;
            var left_new_min_x = body_min_x < left._bvh_min_x ? body_min_x : left._bvh_min_x;
            var left_new_min_y = body_min_y < left_min_y ? body_min_y : left_min_y;
            var left_new_max_x = body_max_x > left_max_x ? body_max_x : left_max_x;
            var left_new_max_y = body_max_y > left_max_y ? body_max_y : left_max_y;
            var left_volume = (left_max_x - left._bvh_min_x) * (left_max_y - left_min_y);
            var left_new_volume = (left_new_max_x - left_new_min_x) * (left_new_max_y - left_new_min_y);
            var left_difference = left_new_volume - left_volume;

            var right = current._bvh_right;
            var right_min_x = right._bvh_min_x;
            var right_min_y = right._bvh_min_y;
            var right_max_x = right._bvh_max_x;
            var right_max_y = right._bvh_max_y;
            var right_new_min_x = body_min_x < right_min_x ? body_min_x : right_min_x;
            var right_new_min_y = body_min_y < right_min_y ? body_min_y : right_min_y;
            var right_new_max_x = body_max_x > right_max_x ? body_max_x : right_max_x;
            var right_new_max_y = body_max_y > right_max_y ? body_max_y : right_max_y;
            var right_volume = (right_max_x - right_min_x) * (right_max_y - right_min_y);
            var right_new_volume = (right_new_max_x - right_new_min_x) * (right_new_max_y - right_new_min_y);
            var right_difference = right_new_volume - right_volume;

            current._bvh_sort = sort++;
            current._bvh_min_x = left_new_min_x < right_new_min_x ? left_new_min_x : right_new_min_x;
            current._bvh_min_y = left_new_min_y < right_new_min_y ? left_new_min_y : right_new_min_y;
            current._bvh_max_x = left_new_max_x > right_new_max_x ? left_new_max_x : right_new_max_x;
            current._bvh_max_y = left_new_max_y > right_new_max_y ? left_new_max_y : right_new_max_y;

            current = left_difference <= right_difference ? left : right;
          } else {
            // Leaf
            var grandparent = current._bvh_parent;
            var parent_min_x = current._bvh_min_x;
            var parent_min_y = current._bvh_min_y;
            var parent_max_x = current._bvh_max_x;
            var parent_max_y = current._bvh_max_y;
            var new_parent = current._bvh_parent = body._bvh_parent = BVHBranch.getBranch();

            new_parent._bvh_parent = grandparent;
            new_parent._bvh_left = current;
            new_parent._bvh_right = body;
            new_parent._bvh_sort = sort++;
            new_parent._bvh_min_x = body_min_x < parent_min_x ? body_min_x : parent_min_x;
            new_parent._bvh_min_y = body_min_y < parent_min_y ? body_min_y : parent_min_y;
            new_parent._bvh_max_x = body_max_x > parent_max_x ? body_max_x : parent_max_x;
            new_parent._bvh_max_y = body_max_y > parent_max_y ? body_max_y : parent_max_y;

            if (!grandparent) {
              this._hierarchy = new_parent;
            } else if (grandparent._bvh_left === current) {
              grandparent._bvh_left = new_parent;
            } else {
              grandparent._bvh_right = new_parent;
            }

            break;
          }
        }
      }
    }

    /**
     * Removes a body from the BVH
     * @param {Circle|Polygon|Point} body The body to remove
     * @param {Boolean} [updating = false] Set to true if this is a temporary removal (used internally when updating the body's position)
     */

  }, {
    key: 'remove',
    value: function remove(body) {
      var updating = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!updating) {
        var bvh = body._bvh;

        if (bvh && bvh !== this) {
          throw new Error('Body belongs to another collision system');
        }

        body._bvh = null;
        this._bodies.splice(this._bodies.indexOf(body), 1);
      }

      if (this._hierarchy === body) {
        this._hierarchy = null;

        return;
      }

      var parent = body._bvh_parent;
      var grandparent = parent._bvh_parent;
      var parent_left = parent._bvh_left;
      var sibling = parent_left === body ? parent._bvh_right : parent_left;

      sibling._bvh_parent = grandparent;

      if (sibling._bvh_branch) {
        sibling._bvh_sort = parent._bvh_sort;
      }

      if (grandparent) {
        if (grandparent._bvh_left === parent) {
          grandparent._bvh_left = sibling;
        } else {
          grandparent._bvh_right = sibling;
        }

        var branch = grandparent;

        while (branch) {
          var left = branch._bvh_left;
          var left_min_x = left._bvh_min_x;
          var left_min_y = left._bvh_min_y;
          var left_max_x = left._bvh_max_x;
          var left_max_y = left._bvh_max_y;

          var right = branch._bvh_right;
          var right_min_x = right._bvh_min_x;
          var right_min_y = right._bvh_min_y;
          var right_max_x = right._bvh_max_x;
          var right_max_y = right._bvh_max_y;

          branch._bvh_min_x = left_min_x < right_min_x ? left_min_x : right_min_x;
          branch._bvh_min_y = left_min_y < right_min_y ? left_min_y : right_min_y;
          branch._bvh_max_x = left_max_x > right_max_x ? left_max_x : right_max_x;
          branch._bvh_max_y = left_max_y > right_max_y ? left_max_y : right_max_y;

          branch = branch._bvh_parent;
        }
      } else {
        this._hierarchy = sibling;
      }

      BVHBranch.releaseBranch(parent);
    }

    /**
     * Updates the BVH. Moved bodies are removed/inserted.
     */

  }, {
    key: 'update',
    value: function update() {
      var bodies = this._bodies;
      var count = bodies.length;

      for (var i = 0; i < count; ++i) {
        var body = bodies[i];

        var update = false;

        if (!update && body.padding !== body._bvh_padding) {
          body._bvh_padding = body.padding;
          update = true;
        }

        if (!update) {
          var polygon = body._polygon;

          if (polygon) {
            if (body._dirty_coords || body.x !== body._x || body.y !== body._y || body.angle !== body._angle || body.scale_x !== body._scale_x || body.scale_y !== body._scale_y) {
              body._calculateCoords();
            }
          }

          var x = body.x;
          var y = body.y;
          var radius = polygon ? 0 : body.radius * body.scale;
          var min_x = polygon ? body._min_x : x - radius;
          var min_y = polygon ? body._min_y : y - radius;
          var max_x = polygon ? body._max_x : x + radius;
          var max_y = polygon ? body._max_y : y + radius;

          update = min_x < body._bvh_min_x || min_y < body._bvh_min_y || max_x > body._bvh_max_x || max_y > body._bvh_max_y;
        }

        if (update) {
          this.remove(body, true);
          this.insert(body, true);
        }
      }
    }

    /**
     * Returns a list of potential collisions for a body
     * @param {Circle|Polygon|Point} body The body to test
     * @returns {Array<Body>}
     */

  }, {
    key: 'potentials',
    value: function potentials(body) {
      var results = [];
      var min_x = body._bvh_min_x;
      var min_y = body._bvh_min_y;
      var max_x = body._bvh_max_x;
      var max_y = body._bvh_max_y;

      var current = this._hierarchy;
      var traverse_left = true;

      if (!current || !current._bvh_branch) {
        return results;
      }

      while (current) {
        if (traverse_left) {
          traverse_left = false;

          var left = current._bvh_branch ? current._bvh_left : null;

          while (left && left._bvh_max_x >= min_x && left._bvh_max_y >= min_y && left._bvh_min_x <= max_x && left._bvh_min_y <= max_y) {
            current = left;
            left = current._bvh_branch ? current._bvh_left : null;
          }
        }

        var branch = current._bvh_branch;
        var right = branch ? current._bvh_right : null;

        if (right && right._bvh_max_x > min_x && right._bvh_max_y > min_y && right._bvh_min_x < max_x && right._bvh_min_y < max_y) {
          current = right;
          traverse_left = true;
        } else {
          if (!branch && current !== body) {
            results.push(current);
          }

          var parent = current._bvh_parent;

          if (parent) {
            while (parent && parent._bvh_right === current) {
              current = parent;
              parent = current._bvh_parent;
            }

            current = parent;
          } else {
            break;
          }
        }
      }

      return results;
    }

    /**
     * Draws the bodies within the BVH to a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The context to draw to
     */

  }, {
    key: 'draw',
    value: function draw(context) {
      var bodies = this._bodies;
      var count = bodies.length;

      for (var i = 0; i < count; ++i) {
        bodies[i].draw(context);
      }
    }

    /**
     * Draws the BVH to a CanvasRenderingContext2D's current path. This is useful for testing out different padding values for bodies.
     * @param {CanvasRenderingContext2D} context The context to draw to
     */

  }, {
    key: 'drawBVH',
    value: function drawBVH(context) {
      var current = this._hierarchy;
      var traverse_left = true;

      while (current) {
        if (traverse_left) {
          traverse_left = false;

          var left = current._bvh_branch ? current._bvh_left : null;

          while (left) {
            current = left;
            left = current._bvh_branch ? current._bvh_left : null;
          }
        }

        var branch = current._bvh_branch;
        var min_x = current._bvh_min_x;
        var min_y = current._bvh_min_y;
        var max_x = current._bvh_max_x;
        var max_y = current._bvh_max_y;
        var right = branch ? current._bvh_right : null;

        context.moveTo(min_x, min_y);
        context.lineTo(max_x, min_y);
        context.lineTo(max_x, max_y);
        context.lineTo(min_x, max_y);
        context.lineTo(min_x, min_y);

        if (right) {
          current = right;
          traverse_left = true;
        } else {
          var parent = current._bvh_parent;

          if (parent) {
            while (parent && parent._bvh_right === current) {
              current = parent;
              parent = current._bvh_parent;
            }

            current = parent;
          } else {
            break;
          }
        }
      }
    }
  }]);

  return BVH;
}();

;

module.exports = BVH;

module.exports.default = module.exports;