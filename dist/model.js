"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _sat = require("sat");

Object.defineProperty(exports, "Response", {
  enumerable: true,
  get: function get() {
    return _sat.Response;
  },
});

/**
 * types
 */
var Types = (exports.Types = undefined);
(function (Types) {
  Types["Circle"] = "Circle";
  Types["Box"] = "Box";
  Types["Point"] = "Point";
  Types["Polygon"] = "Polygon";
})(Types || (exports.Types = Types = {}));
