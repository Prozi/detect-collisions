"use strict";
const __importDefault = (this && this.__importDefault) || function(mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyGroup = exports.BodyType = exports.SATCircle = exports.SATPolygon = exports.SATVector = exports.Response = exports.RBush = exports.isSimple = void 0;
const sat_1 = require("sat");
Object.defineProperty(exports, "SATCircle", { enumerable: true, get: function() { return sat_1.Circle; } });
Object.defineProperty(exports, "SATPolygon", { enumerable: true, get: function() { return sat_1.Polygon; } });
Object.defineProperty(exports, "Response", { enumerable: true, get: function() { return sat_1.Response; } });
Object.defineProperty(exports, "SATVector", { enumerable: true, get: function() { return sat_1.Vector; } });
// version 4.0.0 1=1 copy
const rbush_1 = __importDefault(require("./external/rbush"));
exports.RBush = rbush_1.default;
const poly_decomp_es_1 = require("poly-decomp-es");
Object.defineProperty(exports, "isSimple", { enumerable: true, get: function() { return poly_decomp_es_1.isSimple; } });
/**
 * types
 */
let BodyType;
(function(BodyType) {
  BodyType["Ellipse"] = "Ellipse";
  BodyType["Circle"] = "Circle";
  BodyType["Polygon"] = "Polygon";
  BodyType["Box"] = "Box";
  BodyType["Line"] = "Line";
  BodyType["Point"] = "Point";
})(BodyType || (exports.BodyType = BodyType = {}));
/**
 * for groups
 */
let BodyGroup;
(function(BodyGroup) {
  BodyGroup[BodyGroup["Ellipse"] = 32] = "Ellipse";
  BodyGroup[BodyGroup["Circle"] = 16] = "Circle";
  BodyGroup[BodyGroup["Polygon"] = 8] = "Polygon";
  BodyGroup[BodyGroup["Box"] = 4] = "Box";
  BodyGroup[BodyGroup["Line"] = 2] = "Line";
  BodyGroup[BodyGroup["Point"] = 1] = "Point";
})(BodyGroup || (exports.BodyGroup = BodyGroup = {}));
