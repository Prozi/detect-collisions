"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyType = exports.SATCircle = exports.SATPolygon = exports.SATVector = exports.Response = exports.RBush = void 0;
const rbush_1 = __importDefault(require("rbush"));
Object.defineProperty(exports, "RBush", { enumerable: true, get: function () { return rbush_1.default; } });
const sat_1 = require("sat");
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return sat_1.Response; } });
Object.defineProperty(exports, "SATVector", { enumerable: true, get: function () { return sat_1.Vector; } });
Object.defineProperty(exports, "SATPolygon", { enumerable: true, get: function () { return sat_1.Polygon; } });
Object.defineProperty(exports, "SATCircle", { enumerable: true, get: function () { return sat_1.Circle; } });
/**
 * types
 */
var BodyType;
(function (BodyType) {
    BodyType["Ellipse"] = "Ellipse";
    BodyType["Line"] = "Line";
    BodyType["Circle"] = "Circle";
    BodyType["Box"] = "Box";
    BodyType["Point"] = "Point";
    BodyType["Polygon"] = "Polygon";
})(BodyType = exports.BodyType || (exports.BodyType = {}));
