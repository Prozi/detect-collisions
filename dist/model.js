"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = exports.SATPolygon = exports.SATVector = exports.Response = exports.RBush = void 0;
const rbush_1 = __importDefault(require("rbush"));
Object.defineProperty(exports, "RBush", { enumerable: true, get: function () { return rbush_1.default; } });
const sat_1 = require("sat");
Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return sat_1.Response; } });
Object.defineProperty(exports, "SATVector", { enumerable: true, get: function () { return sat_1.Vector; } });
Object.defineProperty(exports, "SATPolygon", { enumerable: true, get: function () { return sat_1.Polygon; } });
/**
 * types
 */
var Types;
(function (Types) {
    Types["Ellipse"] = "Ellipse";
    Types["Line"] = "Line";
    Types["Circle"] = "Circle";
    Types["Box"] = "Box";
    Types["Point"] = "Point";
    Types["Polygon"] = "Polygon";
})(Types = exports.Types || (exports.Types = {}));
//# sourceMappingURL=model.js.map