"use strict";

/**
 * Determines if two bodies are colliding using the Separating Axis Theorem
 * @private
 * @param {Circle|Polygon|Point} a The source body to test
 * @param {Circle|Polygon|Point} b The target body to test against
 * @param {Result} [result = null] A Result object on which to store information about the collision
 * @param {Boolean} [aabb = true] Set to false to skip the AABB test (useful if you use your own collision heuristic)
 * @returns {Boolean}
 */
function SAT(a, b) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var aabb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var a_polygon = a._polygon;
  var b_polygon = b._polygon;

  var collision = false;

  if (result) {
    result.a = a;
    result.b = b;
    result.a_in_b = true;
    result.b_in_a = true;
    result.overlap = null;
    result.overlap_x = 0;
    result.overlap_y = 0;
  }

  if (a_polygon) {
    if (a._dirty_coords || a.x !== a._x || a.y !== a._y || a.angle !== a._angle || a.scale_x !== a._scale_x || a.scale_y !== a._scale_y) {
      a._calculateCoords();
    }
  }

  if (b_polygon) {
    if (b._dirty_coords || b.x !== b._x || b.y !== b._y || b.angle !== b._angle || b.scale_x !== b._scale_x || b.scale_y !== b._scale_y) {
      b._calculateCoords();
    }
  }

  if (!aabb || aabbAABB(a, b)) {
    if (a_polygon && a._dirty_normals) {
      a._calculateNormals();
    }

    if (b_polygon && b._dirty_normals) {
      b._calculateNormals();
    }

    collision = a_polygon && b_polygon ? polygonPolygon(a, b, result) : a_polygon ? polygonCircle(a, b, result, false) : b_polygon ? polygonCircle(b, a, result, true) : circleCircle(a, b, result);
  }

  if (result) {
    result.collision = collision;
  }

  return collision;
};

/**
 * Determines if two bodies' axis aligned bounding boxes are colliding
 * @param {Circle|Polygon|Point} a The source body to test
 * @param {Circle|Polygon|Point} b The target body to test against
 */
function aabbAABB(a, b) {
  var a_polygon = a._polygon;
  var a_x = a_polygon ? 0 : a.x;
  var a_y = a_polygon ? 0 : a.y;
  var a_radius = a_polygon ? 0 : a.radius * a.scale;
  var a_min_x = a_polygon ? a._min_x : a_x - a_radius;
  var a_min_y = a_polygon ? a._min_y : a_y - a_radius;
  var a_max_x = a_polygon ? a._max_x : a_x + a_radius;
  var a_max_y = a_polygon ? a._max_y : a_y + a_radius;

  var b_polygon = b._polygon;
  var b_x = b_polygon ? 0 : b.x;
  var b_y = b_polygon ? 0 : b.y;
  var b_radius = b_polygon ? 0 : b.radius * b.scale;
  var b_min_x = b_polygon ? b._min_x : b_x - b_radius;
  var b_min_y = b_polygon ? b._min_y : b_y - b_radius;
  var b_max_x = b_polygon ? b._max_x : b_x + b_radius;
  var b_max_y = b_polygon ? b._max_y : b_y + b_radius;

  return a_min_x < b_max_x && a_min_y < b_max_y && a_max_x > b_min_x && a_max_y > b_min_y;
}

/**
 * Determines if two polygons are colliding
 * @param {Polygon} a The source polygon to test
 * @param {Polygon} b The target polygon to test against
 * @param {Result} [result = null] A Result object on which to store information about the collision
 * @returns {Boolean}
 */
function polygonPolygon(a, b) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var a_count = a._coords.length;
  var b_count = b._coords.length;

  // Handle points specially
  if (a_count === 2 && b_count === 2) {
    var _a_coords = a._coords;
    var _b_coords = b._coords;

    if (result) {
      result.overlap = 0;
    }

    return _a_coords[0] === _b_coords[0] && _a_coords[1] === _b_coords[1];
  }

  var a_coords = a._coords;
  var b_coords = b._coords;
  var a_normals = a._normals;
  var b_normals = b._normals;

  if (a_count > 2) {
    for (var ix = 0, iy = 1; ix < a_count; ix += 2, iy += 2) {
      if (separatingAxis(a_coords, b_coords, a_normals[ix], a_normals[iy], result)) {
        return false;
      }
    }
  }

  if (b_count > 2) {
    for (var _ix = 0, _iy = 1; _ix < b_count; _ix += 2, _iy += 2) {
      if (separatingAxis(a_coords, b_coords, b_normals[_ix], b_normals[_iy], result)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Determines if a polygon and a circle are colliding
 * @param {Polygon} a The source polygon to test
 * @param {Circle} b The target circle to test against
 * @param {Result} [result = null] A Result object on which to store information about the collision
 * @param {Boolean} [reverse = false] Set to true to reverse a and b in the result parameter when testing circle->polygon instead of polygon->circle
 * @returns {Boolean}
 */
function polygonCircle(a, b) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var reverse = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var a_coords = a._coords;
  var a_edges = a._edges;
  var a_normals = a._normals;
  var b_x = b.x;
  var b_y = b.y;
  var b_radius = b.radius * b.scale;
  var b_radius2 = b_radius * 2;
  var radius_squared = b_radius * b_radius;
  var count = a_coords.length;

  var a_in_b = true;
  var b_in_a = true;
  var overlap = null;
  var overlap_x = 0;
  var overlap_y = 0;

  // Handle points specially
  if (count === 2) {
    var coord_x = b_x - a_coords[0];
    var coord_y = b_y - a_coords[1];
    var length_squared = coord_x * coord_x + coord_y * coord_y;

    if (length_squared > radius_squared) {
      return false;
    }

    if (result) {
      var length = Math.sqrt(length_squared);

      overlap = b_radius - length;
      overlap_x = coord_x / length;
      overlap_y = coord_y / length;
      b_in_a = false;
    }
  } else {
    for (var ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
      var _coord_x = b_x - a_coords[ix];
      var _coord_y = b_y - a_coords[iy];
      var edge_x = a_edges[ix];
      var edge_y = a_edges[iy];
      var dot = _coord_x * edge_x + _coord_y * edge_y;
      var region = dot < 0 ? -1 : dot > edge_x * edge_x + edge_y * edge_y ? 1 : 0;

      var tmp_overlapping = false;
      var tmp_overlap = 0;
      var tmp_overlap_x = 0;
      var tmp_overlap_y = 0;

      if (result && a_in_b && _coord_x * _coord_x + _coord_y * _coord_y > radius_squared) {
        a_in_b = false;
      }

      if (region) {
        var left = region === -1;
        var other_x = left ? ix === 0 ? count - 2 : ix - 2 : ix === count - 2 ? 0 : ix + 2;
        var other_y = other_x + 1;
        var coord2_x = b_x - a_coords[other_x];
        var coord2_y = b_y - a_coords[other_y];
        var edge2_x = a_edges[other_x];
        var edge2_y = a_edges[other_y];
        var dot2 = coord2_x * edge2_x + coord2_y * edge2_y;
        var region2 = dot2 < 0 ? -1 : dot2 > edge2_x * edge2_x + edge2_y * edge2_y ? 1 : 0;

        if (region2 === -region) {
          var target_x = left ? _coord_x : coord2_x;
          var target_y = left ? _coord_y : coord2_y;
          var _length_squared = target_x * target_x + target_y * target_y;

          if (_length_squared > radius_squared) {
            return false;
          }

          if (result) {
            var _length = Math.sqrt(_length_squared);

            tmp_overlapping = true;
            tmp_overlap = b_radius - _length;
            tmp_overlap_x = target_x / _length;
            tmp_overlap_y = target_y / _length;
            b_in_a = false;
          }
        }
      } else {
        var normal_x = a_normals[ix];
        var normal_y = a_normals[iy];
        var _length2 = _coord_x * normal_x + _coord_y * normal_y;
        var absolute_length = _length2 < 0 ? -_length2 : _length2;

        if (_length2 > 0 && absolute_length > b_radius) {
          return false;
        }

        if (result) {
          tmp_overlapping = true;
          tmp_overlap = b_radius - _length2;
          tmp_overlap_x = normal_x;
          tmp_overlap_y = normal_y;

          if (b_in_a && _length2 >= 0 || tmp_overlap < b_radius2) {
            b_in_a = false;
          }
        }
      }

      if (tmp_overlapping && (overlap === null || overlap > tmp_overlap)) {
        overlap = tmp_overlap;
        overlap_x = tmp_overlap_x;
        overlap_y = tmp_overlap_y;
      }
    }
  }

  if (result) {
    result.a_in_b = reverse ? b_in_a : a_in_b;
    result.b_in_a = reverse ? a_in_b : b_in_a;
    result.overlap = overlap;
    result.overlap_x = reverse ? -overlap_x : overlap_x;
    result.overlap_y = reverse ? -overlap_y : overlap_y;
  }

  return true;
}

/**
 * Determines if two circles are colliding
 * @param {Circle} a The source circle to test
 * @param {Circle} b The target circle to test against
 * @param {Result} [result = null] A Result object on which to store information about the collision
 * @returns {Boolean}
 */
function circleCircle(a, b) {
  var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var a_radius = a.radius * a.scale;
  var b_radius = b.radius * b.scale;
  var difference_x = b.x - a.x;
  var difference_y = b.y - a.y;
  var radius_sum = a_radius + b_radius;
  var length_squared = difference_x * difference_x + difference_y * difference_y;

  if (length_squared > radius_sum * radius_sum) {
    return false;
  }

  if (result) {
    var length = Math.sqrt(length_squared);

    result.a_in_b = a_radius <= b_radius && length <= b_radius - a_radius;
    result.b_in_a = b_radius <= a_radius && length <= a_radius - b_radius;
    result.overlap = radius_sum - length;
    result.overlap_x = difference_x / length;
    result.overlap_y = difference_y / length;
  }

  return true;
}

/**
 * Determines if two polygons are separated by an axis
 * @param {Array<Number[]>} a_coords The coordinates of the polygon to test
 * @param {Array<Number[]>} b_coords The coordinates of the polygon to test against
 * @param {Number} x The X direction of the axis
 * @param {Number} y The Y direction of the axis
 * @param {Result} [result = null] A Result object on which to store information about the collision
 * @returns {Boolean}
 */
function separatingAxis(a_coords, b_coords, x, y) {
  var result = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

  var a_count = a_coords.length;
  var b_count = b_coords.length;

  if (!a_count || !b_count) {
    return true;
  }

  var a_start = null;
  var a_end = null;
  var b_start = null;
  var b_end = null;

  for (var ix = 0, iy = 1; ix < a_count; ix += 2, iy += 2) {
    var dot = a_coords[ix] * x + a_coords[iy] * y;

    if (a_start === null || a_start > dot) {
      a_start = dot;
    }

    if (a_end === null || a_end < dot) {
      a_end = dot;
    }
  }

  for (var _ix2 = 0, _iy2 = 1; _ix2 < b_count; _ix2 += 2, _iy2 += 2) {
    var _dot = b_coords[_ix2] * x + b_coords[_iy2] * y;

    if (b_start === null || b_start > _dot) {
      b_start = _dot;
    }

    if (b_end === null || b_end < _dot) {
      b_end = _dot;
    }
  }

  if (a_start > b_end || a_end < b_start) {
    return true;
  }

  if (result) {
    var overlap = 0;

    if (a_start < b_start) {
      result.a_in_b = false;

      if (a_end < b_end) {
        overlap = a_end - b_start;
        result.b_in_a = false;
      } else {
        var option1 = a_end - b_start;
        var option2 = b_end - a_start;

        overlap = option1 < option2 ? option1 : -option2;
      }
    } else {
      result.b_in_a = false;

      if (a_end > b_end) {
        overlap = a_start - b_end;
        result.a_in_b = false;
      } else {
        var _option = a_end - b_start;
        var _option2 = b_end - a_start;

        overlap = _option < _option2 ? _option : -_option2;
      }
    }

    var current_overlap = result.overlap;
    var absolute_overlap = overlap < 0 ? -overlap : overlap;

    if (current_overlap === null || current_overlap > absolute_overlap) {
      var sign = overlap < 0 ? -1 : 1;

      result.overlap = absolute_overlap;
      result.overlap_x = x * sign;
      result.overlap_y = y * sign;
    }
  }

  return false;
}

module.exports = SAT;

module.exports.default = module.exports;