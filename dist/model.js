"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
Object.defineProperty(exports, "Response", {
  enumerable: true,
  get: function get() {
    return _sat.Response;
  },
});
exports.Types = void 0;

var _sat = require("sat");

/**
 * types
 */
var Types;
exports.Types = Types;

(function (Types) {
  Types["Circle"] = "Circle";
  Types["Box"] = "Box";
  Types["Point"] = "Point";
  Types["Polygon"] = "Polygon";
})(Types || (exports.Types = Types = {}));
