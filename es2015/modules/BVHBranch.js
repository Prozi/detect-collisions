"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @private
 */
var branch_pool = [];

/**
 * A branch within a BVH
 * @class
 * @private
 */

var BVHBranch = function () {
  /**
   * @constructor
   */
  function BVHBranch() {
    _classCallCheck(this, BVHBranch);

    /** @private */
    this._bvh_parent = null;

    /** @private */
    this._bvh_branch = true;

    /** @private */
    this._bvh_left = null;

    /** @private */
    this._bvh_right = null;

    /** @private */
    this._bvh_sort = 0;

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
   * Returns a branch from the branch pool or creates a new branch
   * @returns {BVHBranch}
   */


  _createClass(BVHBranch, null, [{
    key: "getBranch",
    value: function getBranch() {
      if (branch_pool.length) {
        return branch_pool.pop();
      }

      return new BVHBranch();
    }

    /**
     * Releases a branch back into the branch pool
     * @param {BVHBranch} branch The branch to release
     */

  }, {
    key: "releaseBranch",
    value: function releaseBranch(branch) {
      branch_pool.push(branch);
    }

    /**
     * Sorting callback used to sort branches by deepest first
     * @param {BVHBranch} a The first branch
     * @param {BVHBranch} b The second branch
     * @returns {Number}
     */

  }, {
    key: "sortBranches",
    value: function sortBranches(a, b) {
      return a.sort > b.sort ? -1 : 1;
    }
  }]);

  return BVHBranch;
}();

;

module.exports = BVHBranch;

module.exports.default = module.exports;