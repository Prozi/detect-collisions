"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyGroup = exports.getGroup = exports.BodyType = exports.SATCircle = exports.SATPolygon = exports.SATVector = exports.Response = exports.RBush = exports.isSimple = void 0;
const rbush_1 = __importDefault(require("rbush"));
Object.defineProperty(exports, "RBush", { enumerable: true, get: function () { return rbush_1.default; } });
const sat_1 = require("sat");
Object.defineProperty(exports, "SATCircle", { enumerable: true, get: function () { return sat_1.Circle; } });
Object.defineProperty(exports, "SATPolygon", { enumerable: true, get: function () { return sat_1.Polygon; } });
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return sat_1.Response; } });
Object.defineProperty(exports, "SATVector", { enumerable: true, get: function () { return sat_1.Vector; } });
var poly_decomp_es_1 = require("poly-decomp-es");
Object.defineProperty(exports, "isSimple", { enumerable: true, get: function () { return poly_decomp_es_1.isSimple; } });
/**
 * types
 */
var BodyType;
(function (BodyType) {
    BodyType["Ellipse"] = "Ellipse";
    BodyType["Circle"] = "Circle";
    BodyType["Polygon"] = "Polygon";
    BodyType["Box"] = "Box";
    BodyType["Line"] = "Line";
    BodyType["Point"] = "Point";
})(BodyType = exports.BodyType || (exports.BodyType = {}));
/**
 * for groups
 */
function getGroup(group) {
    const limited = Math.max(0, Math.min(group, 0x7FFFFFFF));
    return (limited << 16) | limited;
}
exports.getGroup = getGroup;
/**
 * for groups
 */
var BodyGroup;
(function (BodyGroup) {
    BodyGroup[BodyGroup["Ellipse"] = 32] = "Ellipse";
    BodyGroup[BodyGroup["Circle"] = 16] = "Circle";
    BodyGroup[BodyGroup["Polygon"] = 8] = "Polygon";
    BodyGroup[BodyGroup["Box"] = 4] = "Box";
    BodyGroup[BodyGroup["Line"] = 2] = "Line";
    BodyGroup[BodyGroup["Point"] = 1] = "Point";
})(BodyGroup = exports.BodyGroup || (exports.BodyGroup = {}));
