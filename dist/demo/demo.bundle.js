/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/bodies/box.js":
/*!****************************!*\
  !*** ./dist/bodies/box.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Box = void 0;
const model_1 = __webpack_require__(/*! ../model */ "./dist/model.js");
const utils_1 = __webpack_require__(/*! ../utils */ "./dist/utils.js");
const polygon_1 = __webpack_require__(/*! ./polygon */ "./dist/bodies/polygon.js");
/**
 * collider - box
 */
class Box extends polygon_1.Polygon {
    /**
     * collider - box
     * @param {PotentialVector} position {x, y}
     * @param {number} width
     * @param {number} height
     */
    constructor(position, width, height, options) {
        super(position, (0, utils_1.createBox)(width, height), options);
        this.type = model_1.Types.Box;
        this._width = width;
        this._height = height;
    }
    /**
     * get box width
     */
    get width() {
        return this._width;
    }
    /**
     * set box width, update points
     */
    set width(width) {
        this._width = width;
        this.setPoints((0, utils_1.createBox)(this._width, this._height));
    }
    /**
     * get box height
     */
    get height() {
        return this._height;
    }
    /**
     * set box height, update points
     */
    set height(height) {
        this._height = height;
        this.setPoints((0, utils_1.createBox)(this._width, this._height));
    }
}
exports.Box = Box;
//# sourceMappingURL=box.js.map

/***/ }),

/***/ "./dist/bodies/circle.js":
/*!*******************************!*\
  !*** ./dist/bodies/circle.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Circle = void 0;
const sat_1 = __webpack_require__(/*! sat */ "./node_modules/sat/SAT.js");
const model_1 = __webpack_require__(/*! ../model */ "./dist/model.js");
const utils_1 = __webpack_require__(/*! ../utils */ "./dist/utils.js");
/**
 * collider - circle
 */
class Circle extends sat_1.Circle {
    /**
     * collider - circle
     * @param {PotentialVector} position {x, y}
     * @param {number} radius
     */
    constructor(position, radius, options) {
        super((0, utils_1.ensureVectorPoint)(position), radius);
        /**
         * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
         */
        this.padding = 0;
        this.type = model_1.Types.Circle;
        (0, utils_1.extendBody)(this, options);
        this.updateAABB();
    }
    get x() {
        return this.pos.x;
    }
    /**
     * updating this.pos.x by this.x = x updates AABB
     */
    set x(x) {
        var _a;
        this.pos.x = x;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.updateBody(this);
    }
    get y() {
        return this.pos.y;
    }
    /**
     * updating this.pos.y by this.y = y updates AABB
     */
    set y(y) {
        var _a;
        this.pos.y = y;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.updateBody(this);
    }
    /**
     * update position
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
        var _a;
        this.pos.x = x;
        this.pos.y = y;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.updateBody(this);
    }
    /**
     * Updates Bounding Box of collider
     */
    getAABBAsBBox() {
        return {
            minX: this.pos.x - this.r,
            minY: this.pos.y - this.r,
            maxX: this.pos.x + this.r,
            maxY: this.pos.y + this.r,
        };
    }
    /**
     * Updates Bounding Box of collider
     */
    updateAABB(bounds = this.getAABBAsBBox()) {
        (0, utils_1.updateAABB)(this, bounds);
    }
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The canvas context to draw on
     */
    draw(context) {
        const radius = this.r;
        if (this.isTrigger) {
            const max = Math.max(8, radius);
            for (let i = 0; i < max; i++) {
                const arc = (i / max) * 2 * Math.PI;
                const arcPrev = ((i - 1) / max) * 2 * Math.PI;
                const fromX = this.pos.x + Math.cos(arcPrev) * radius;
                const fromY = this.pos.y + Math.sin(arcPrev) * radius;
                const toX = this.pos.x + Math.cos(arc) * radius;
                const toY = this.pos.y + Math.sin(arc) * radius;
                (0, utils_1.dashLineTo)(context, fromX, fromY, toX, toY);
            }
        }
        else {
            context.moveTo(this.pos.x + radius, this.pos.y);
            context.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2);
        }
    }
}
exports.Circle = Circle;
//# sourceMappingURL=circle.js.map

/***/ }),

/***/ "./dist/bodies/ellipse.js":
/*!********************************!*\
  !*** ./dist/bodies/ellipse.js ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ellipse = void 0;
const model_1 = __webpack_require__(/*! ../model */ "./dist/model.js");
const utils_1 = __webpack_require__(/*! ../utils */ "./dist/utils.js");
const polygon_1 = __webpack_require__(/*! ./polygon */ "./dist/bodies/polygon.js");
/**
 * collider - ellipse
 */
class Ellipse extends polygon_1.Polygon {
    /**
     * collider - ellipse
     * @param {Vector} position {x, y}
     * @param {number} radiusX
     * @param {number} radiusY defaults to radiusX
     * @param {number} step precision division >= 1px
     */
    constructor(position, radiusX, radiusY = radiusX, step = Math.hypot(radiusX, radiusY) / Math.PI, options) {
        super(position, (0, utils_1.createEllipse)(radiusX, radiusY, step), options);
        this.type = model_1.Types.Ellipse;
        this._radiusX = radiusX;
        this._radiusY = radiusY;
        this._step = step;
    }
    /**
     * get ellipse step number
     */
    get step() {
        return this._step;
    }
    /**
     * set ellipse step number
     */
    set step(step) {
        this._step = step;
        this.setPoints((0, utils_1.createEllipse)(this._radiusX, this._radiusY, this._step));
    }
    /**
     * get ellipse radiusX
     */
    get radiusX() {
        return this._radiusX;
    }
    /**
     * set ellipse radiusX, update points
     */
    set radiusX(radiusX) {
        this._radiusX = radiusX;
        this.setPoints((0, utils_1.createEllipse)(this._radiusX, this._radiusY, this._step));
    }
    /**
     * get ellipse radiusY
     */
    get radiusY() {
        return this._radiusY;
    }
    /**
     * set ellipse radiusY, update points
     */
    set radiusY(radiusY) {
        this._radiusY = radiusY;
        this.setPoints((0, utils_1.createEllipse)(this._radiusX, this._radiusY, this._step));
    }
}
exports.Ellipse = Ellipse;
//# sourceMappingURL=ellipse.js.map

/***/ }),

/***/ "./dist/bodies/line.js":
/*!*****************************!*\
  !*** ./dist/bodies/line.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Line = void 0;
const sat_1 = __webpack_require__(/*! sat */ "./node_modules/sat/SAT.js");
const model_1 = __webpack_require__(/*! ../model */ "./dist/model.js");
const polygon_1 = __webpack_require__(/*! ./polygon */ "./dist/bodies/polygon.js");
/**
 * collider - line
 */
class Line extends polygon_1.Polygon {
    /**
     * collider - line from start to end
     * @param {Vector} start {x, y}
     * @param {Vector} end {x, y}
     */
    constructor(start, end, options) {
        super(start, [
            { x: 0, y: 0 },
            { x: end.x - start.x, y: end.y - start.y },
        ], options);
        this.type = model_1.Types.Line;
        if (this.calcPoints.length === 1 || !end) {
            console.error({ start, end });
            throw new Error("No end point for line provided");
        }
    }
    get start() {
        return {
            x: this.x + this.calcPoints[0].x,
            y: this.y + this.calcPoints[0].y,
        };
    }
    get end() {
        return {
            x: this.x + this.calcPoints[1].x,
            y: this.y + this.calcPoints[1].y,
        };
    }
    getCentroid() {
        return new sat_1.Vector((this.end.x - this.start.x) / 2, (this.end.y - this.start.y) / 2);
    }
}
exports.Line = Line;
//# sourceMappingURL=line.js.map

/***/ }),

/***/ "./dist/bodies/point.js":
/*!******************************!*\
  !*** ./dist/bodies/point.js ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Point = void 0;
const box_1 = __webpack_require__(/*! ./box */ "./dist/bodies/box.js");
const model_1 = __webpack_require__(/*! ../model */ "./dist/model.js");
const utils_1 = __webpack_require__(/*! ../utils */ "./dist/utils.js");
/**
 * collider - point (very tiny box)
 */
class Point extends box_1.Box {
    /**
     * collider - point (very tiny box)
     * @param {PotentialVector} position {x, y}
     */
    constructor(position, options) {
        super((0, utils_1.ensureVectorPoint)(position), 0.1, 0.1, options);
        this.type = model_1.Types.Point;
    }
}
exports.Point = Point;
//# sourceMappingURL=point.js.map

/***/ }),

/***/ "./dist/bodies/polygon.js":
/*!********************************!*\
  !*** ./dist/bodies/polygon.js ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Polygon = void 0;
const sat_1 = __webpack_require__(/*! sat */ "./node_modules/sat/SAT.js");
const model_1 = __webpack_require__(/*! ../model */ "./dist/model.js");
const utils_1 = __webpack_require__(/*! ../utils */ "./dist/utils.js");
/**
 * collider - polygon
 */
class Polygon extends sat_1.Polygon {
    /**
     * collider - polygon
     * @param {PotentialVector} position {x, y}
     * @param {PotentialVector[]} points
     */
    constructor(position, points, options) {
        super((0, utils_1.ensureVectorPoint)(position), (0, utils_1.ensurePolygonPoints)(points));
        /**
         * bodies are not reinserted during update if their bbox didnt move outside bbox + padding
         */
        this.padding = 0;
        this.type = model_1.Types.Polygon;
        if (!(points === null || points === void 0 ? void 0 : points.length)) {
            throw new Error("No points in polygon");
        }
        (0, utils_1.extendBody)(this, options);
        this.updateAABB();
    }
    get x() {
        return this.pos.x;
    }
    /**
     * updating this.pos.x by this.x = x updates AABB
     */
    set x(x) {
        var _a;
        this.pos.x = x;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.updateBody(this);
    }
    get y() {
        return this.pos.y;
    }
    /**
     * updating this.pos.y by this.y = y updates AABB
     */
    set y(y) {
        var _a;
        this.pos.y = y;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.updateBody(this);
    }
    /**
     * update position
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
        var _a;
        this.pos.x = x;
        this.pos.y = y;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.updateBody(this);
    }
    /**
     * get bbox without padding
     */
    getAABBAsBBox() {
        const { pos, w, h } = this.getAABBAsBox();
        return {
            minX: pos.x,
            minY: pos.y,
            maxX: pos.x + w,
            maxY: pos.y + h,
        };
    }
    /**
     * Updates Bounding Box of collider
     */
    updateAABB(bounds = this.getAABBAsBBox()) {
        (0, utils_1.updateAABB)(this, bounds);
    }
    /**
     * Draws collider on a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The canvas context to draw on
     */
    draw(context) {
        const points = [...this.calcPoints, this.calcPoints[0]];
        points.forEach((point, index) => {
            const toX = this.x + point.x;
            const toY = this.y + point.y;
            const prev = this.calcPoints[index - 1] ||
                this.calcPoints[this.calcPoints.length - 1];
            if (!index) {
                if (this.calcPoints.length === 1) {
                    context.arc(toX, toY, 1, 0, Math.PI * 2);
                }
                else {
                    context.moveTo(toX, toY);
                }
            }
            else if (this.calcPoints.length > 1) {
                if (this.isTrigger) {
                    const fromX = this.x + prev.x;
                    const fromY = this.y + prev.y;
                    (0, utils_1.dashLineTo)(context, fromX, fromY, toX, toY);
                }
                else {
                    context.lineTo(toX, toY);
                }
            }
        });
    }
    getCentroidWithoutRotation() {
        // reset angle for get centroid
        const angle = this.angle;
        this.setAngle(0);
        const centroid = this.getCentroid();
        // revert angle change
        this.setAngle(angle);
        return centroid;
    }
    /**
     * reCenters the box anchor
     */
    center() {
        const { x, y } = this.getCentroidWithoutRotation();
        this.translate(-x, -y);
        this.setPosition(this.x + x, this.y + y);
    }
}
exports.Polygon = Polygon;
//# sourceMappingURL=polygon.js.map

/***/ }),

/***/ "./dist/index.js":
/*!***********************!*\
  !*** ./dist/index.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./model */ "./dist/model.js"), exports);
__exportStar(__webpack_require__(/*! ./bodies/circle */ "./dist/bodies/circle.js"), exports);
__exportStar(__webpack_require__(/*! ./bodies/ellipse */ "./dist/bodies/ellipse.js"), exports);
__exportStar(__webpack_require__(/*! ./bodies/polygon */ "./dist/bodies/polygon.js"), exports);
__exportStar(__webpack_require__(/*! ./bodies/box */ "./dist/bodies/box.js"), exports);
__exportStar(__webpack_require__(/*! ./bodies/point */ "./dist/bodies/point.js"), exports);
__exportStar(__webpack_require__(/*! ./bodies/line */ "./dist/bodies/line.js"), exports);
__exportStar(__webpack_require__(/*! ./system */ "./dist/system.js"), exports);
__exportStar(__webpack_require__(/*! ./utils */ "./dist/utils.js"), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./dist/model.js":
/*!***********************!*\
  !*** ./dist/model.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Types = exports.Response = void 0;
var sat_1 = __webpack_require__(/*! sat */ "./node_modules/sat/SAT.js");
Object.defineProperty(exports, "Response", ({ enumerable: true, get: function () { return sat_1.Response; } }));
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

/***/ }),

/***/ "./dist/system.js":
/*!************************!*\
  !*** ./dist/system.js ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.System = void 0;
const sat_1 = __webpack_require__(/*! sat */ "./node_modules/sat/SAT.js");
const rbush_1 = __importDefault(__webpack_require__(/*! rbush */ "./node_modules/rbush/rbush.min.js"));
const model_1 = __webpack_require__(/*! ./model */ "./dist/model.js");
const utils_1 = __webpack_require__(/*! ./utils */ "./dist/utils.js");
const point_1 = __webpack_require__(/*! ./bodies/point */ "./dist/bodies/point.js");
const circle_1 = __webpack_require__(/*! ./bodies/circle */ "./dist/bodies/circle.js");
const box_1 = __webpack_require__(/*! ./bodies/box */ "./dist/bodies/box.js");
const polygon_1 = __webpack_require__(/*! ./bodies/polygon */ "./dist/bodies/polygon.js");
const line_1 = __webpack_require__(/*! ./bodies/line */ "./dist/bodies/line.js");
const ellipse_1 = __webpack_require__(/*! ./bodies/ellipse */ "./dist/bodies/ellipse.js");
/**
 * collision system
 */
class System extends rbush_1.default {
    constructor() {
        super(...arguments);
        this.response = new model_1.Response();
    }
    /**
     * draw bodies
     */
    draw(context) {
        this.all().forEach((body) => {
            body.draw(context);
        });
    }
    /**
     * draw hierarchy
     */
    drawBVH(context) {
        [...this.all(), ...this.data.children].forEach(({ minX, maxX, minY, maxY }) => {
            polygon_1.Polygon.prototype.draw.call({
                x: minX,
                y: minY,
                calcPoints: (0, utils_1.createBox)(maxX - minX, maxY - minY),
            }, context);
        });
    }
    /**
     * update body aabb and in tree
     */
    updateBody(body) {
        const bounds = body.getAABBAsBBox();
        const update = bounds.minX < body.minX ||
            bounds.minY < body.minY ||
            bounds.maxX > body.maxX ||
            bounds.maxY > body.maxY;
        if (!update) {
            return;
        }
        // old aabb needs to be removed
        this.remove(body);
        // then we update aabb
        body.updateAABB(bounds);
        // then we reinsert body to collision tree
        this.insert(body);
    }
    /**
     * remove body aabb from collision tree
     */
    remove(body, equals) {
        body.system = undefined;
        return super.remove(body, equals);
    }
    /**
     * add body aabb to collision tree
     */
    insert(body) {
        body.system = this;
        return super.insert(body);
    }
    /**
     * update all bodies aabb
     */
    update() {
        this.all().forEach((body) => {
            // no need to every cycle update static body aabb
            if (!body.isStatic) {
                this.updateBody(body);
            }
        });
    }
    /**
     * separate (move away) colliders
     */
    separate() {
        this.checkAll((response) => {
            // static bodies and triggers do not move back / separate
            if (response.a.isTrigger) {
                return;
            }
            response.a.x -= response.overlapV.x;
            response.a.y -= response.overlapV.y;
            this.updateBody(response.a);
        });
    }
    /**
     * check one collider collisions with callback
     */
    checkOne(body, callback) {
        // no need to check static body collision
        if (body.isStatic) {
            return;
        }
        this.getPotentials(body).forEach((candidate) => {
            if (this.checkCollision(body, candidate)) {
                callback(this.response);
            }
        });
    }
    /**
     * check all colliders collisions with callback
     */
    checkAll(callback) {
        this.all().forEach((body) => {
            this.checkOne(body, callback);
        });
    }
    /**
     * get object potential colliders
     */
    getPotentials(body) {
        // filter here is required as collides with self
        return this.search(body).filter((candidate) => candidate !== body);
    }
    /**
     * check do 2 objects collide
     */
    checkCollision(body, candidate) {
        this.response.clear();
        if (body.type === model_1.Types.Circle && candidate.type === model_1.Types.Circle) {
            return (0, sat_1.testCircleCircle)(body, candidate, this.response);
        }
        if (body.type === model_1.Types.Circle && candidate.type !== model_1.Types.Circle) {
            return (0, sat_1.testCirclePolygon)(body, candidate, this.response);
        }
        if (body.type !== model_1.Types.Circle && candidate.type === model_1.Types.Circle) {
            return (0, sat_1.testPolygonCircle)(body, candidate, this.response);
        }
        if (body.type !== model_1.Types.Circle && candidate.type !== model_1.Types.Circle) {
            return (0, sat_1.testPolygonPolygon)(body, candidate, this.response);
        }
        throw Error("Not implemented");
    }
    /**
     * raycast to get collider of ray from start to end
     */
    raycast(start, end, allowCollider = () => true) {
        let minDistance = Infinity;
        let result = null;
        const ray = this.createLine(start, end);
        const colliders = this.getPotentials(ray).filter((potential) => allowCollider(potential) && this.checkCollision(ray, potential));
        this.remove(ray);
        colliders.forEach((collider) => {
            const points = collider.type === model_1.Types.Circle
                ? (0, utils_1.intersectLineCircle)(ray, collider)
                : (0, utils_1.intersectLinePolygon)(ray, collider);
            points.forEach((point) => {
                const pointDistance = (0, utils_1.distance)(start, point);
                if (pointDistance < minDistance) {
                    minDistance = pointDistance;
                    result = { point, collider };
                }
            });
        });
        return result;
    }
    createPoint(position) {
        const point = new point_1.Point(position);
        this.insert(point);
        return point;
    }
    createLine(start, end, options) {
        const line = new line_1.Line(start, end, options);
        this.insert(line);
        return line;
    }
    createCircle(position, radius) {
        const circle = new circle_1.Circle(position, radius);
        this.insert(circle);
        return circle;
    }
    createBox(position, width, height, options) {
        const box = new box_1.Box(position, width, height, options);
        this.insert(box);
        return box;
    }
    createEllipse(position, radiusX, radiusY, step, options) {
        const ellipse = new ellipse_1.Ellipse(position, radiusX, radiusY, step, options);
        this.insert(ellipse);
        return ellipse;
    }
    createPolygon(position, points, options) {
        const polygon = new polygon_1.Polygon(position, points, options);
        this.insert(polygon);
        return polygon;
    }
}
exports.System = System;
//# sourceMappingURL=system.js.map

/***/ }),

/***/ "./dist/utils.js":
/*!***********************!*\
  !*** ./dist/utils.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.intersectLinePolygon = exports.intersectLineLine = exports.intersectLineCircle = exports.dashLineTo = exports.updateAABB = exports.extendBody = exports.clockwise = exports.distance = exports.ensurePolygonPoints = exports.ensureVectorPoint = exports.createBox = exports.createEllipse = void 0;
const sat_1 = __webpack_require__(/*! sat */ "./node_modules/sat/SAT.js");
const line_1 = __webpack_require__(/*! ./bodies/line */ "./dist/bodies/line.js");
const model_1 = __webpack_require__(/*! ./model */ "./dist/model.js");
function createEllipse(radiusX, radiusY = radiusX, step = 1) {
    const steps = Math.PI * Math.hypot(radiusX, radiusY) * 2;
    const length = Math.max(8, Math.ceil(steps / step));
    return Array.from({ length }, (_, index) => {
        const value = (index / length) * 2 * Math.PI;
        const x = Math.cos(value) * radiusX;
        const y = Math.sin(value) * radiusY;
        return new sat_1.Vector(x, y);
    });
}
exports.createEllipse = createEllipse;
/**
 * creates box polygon points
 */
function createBox(width, height) {
    return [
        new sat_1.Vector(0, 0),
        new sat_1.Vector(width, 0),
        new sat_1.Vector(width, height),
        new sat_1.Vector(0, height),
    ];
}
exports.createBox = createBox;
/**
 * ensure returns a Vector
 */
function ensureVectorPoint(point = {}) {
    return point instanceof sat_1.Vector
        ? point
        : new sat_1.Vector(point.x || 0, point.y || 0);
}
exports.ensureVectorPoint = ensureVectorPoint;
/**
 * ensure correct counterclockwise points
 */
function ensurePolygonPoints(points) {
    if (!points) {
        throw new Error("No points array provided");
    }
    const vectorPoints = points.map(ensureVectorPoint);
    return clockwise(vectorPoints) ? vectorPoints.reverse() : vectorPoints;
}
exports.ensurePolygonPoints = ensurePolygonPoints;
/**
 * get distance between two {x, y} points
 */
function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}
exports.distance = distance;
/**
 * check direction of polygon
 */
function clockwise(points) {
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
        const v1 = points[i];
        const v2 = points[(i + 1) % points.length];
        sum += (v2.x - v1.x) * (v2.y + v1.y);
    }
    return sum > 0;
}
exports.clockwise = clockwise;
/**
 * used for all types of bodies
 */
function extendBody(body, options) {
    body.isStatic = !!(options === null || options === void 0 ? void 0 : options.isStatic);
    body.isTrigger = !!(options === null || options === void 0 ? void 0 : options.isTrigger);
    body.padding = (options === null || options === void 0 ? void 0 : options.padding) || 0;
    if (body.type !== model_1.Types.Circle &&
        body.type !== model_1.Types.Ellipse &&
        (options === null || options === void 0 ? void 0 : options.center)) {
        body.center();
    }
    if (body.type !== model_1.Types.Circle && (options === null || options === void 0 ? void 0 : options.angle)) {
        body.setAngle(options.angle);
    }
}
exports.extendBody = extendBody;
function updateAABB(body, bounds) {
    body.minX = bounds.minX - body.padding;
    body.minY = bounds.minY - body.padding;
    body.maxX = bounds.maxX + body.padding;
    body.maxY = bounds.maxY + body.padding;
}
exports.updateAABB = updateAABB;
/**
 * draws dashed line on canvas context
 */
function dashLineTo(context, fromX, fromY, toX, toY, dash = 2, gap = 4) {
    const xDiff = toX - fromX;
    const yDiff = toY - fromY;
    const arc = Math.atan2(yDiff, xDiff);
    const offsetX = Math.cos(arc);
    const offsetY = Math.sin(arc);
    let posX = fromX;
    let posY = fromY;
    let dist = Math.hypot(xDiff, yDiff);
    while (dist > 0) {
        const step = Math.min(dist, dash);
        context.moveTo(posX, posY);
        context.lineTo(posX + offsetX * step, posY + offsetY * step);
        posX += offsetX * (dash + gap);
        posY += offsetY * (dash + gap);
        dist -= dash + gap;
    }
}
exports.dashLineTo = dashLineTo;
// https://stackoverflow.com/questions/37224912/circle-line-segment-collision
function intersectLineCircle(line, circle) {
    const v1 = { x: line.end.x - line.start.x, y: line.end.y - line.start.y };
    const v2 = { x: line.start.x - circle.pos.x, y: line.start.y - circle.pos.y };
    const b = (v1.x * v2.x + v1.y * v2.y) * -2;
    const c = (v1.x * v1.x + v1.y * v1.y) * 2;
    const d = Math.sqrt(b * b - (v2.x * v2.x + v2.y * v2.y - circle.r * circle.r) * c * 2);
    if (isNaN(d)) {
        // no intercept
        return [];
    }
    const u1 = (b - d) / c; // these represent the unit distance of point one and two on the line
    const u2 = (b + d) / c;
    const results = []; // return array
    if (u1 <= 1 && u1 >= 0) {
        // add point if on the line segment
        results.push({ x: line.start.x + v1.x * u1, y: line.start.y + v1.y * u1 });
    }
    if (u2 <= 1 && u2 >= 0) {
        // second add point if on the line segment
        results.push({ x: line.start.x + v1.x * u2, y: line.start.y + v1.y * u2 });
    }
    return results;
}
exports.intersectLineCircle = intersectLineCircle;
// https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
function intersectLineLine(line1, line2) {
    const dX = line1.end.x - line1.start.x;
    const dY = line1.end.y - line1.start.y;
    const determinant = dX * (line2.end.y - line2.start.y) - (line2.end.x - line2.start.x) * dY;
    if (determinant === 0) {
        return null;
    }
    const lambda = ((line2.end.y - line2.start.y) * (line2.end.x - line1.start.x) +
        (line2.start.x - line2.end.x) * (line2.end.y - line1.start.y)) /
        determinant;
    const gamma = ((line1.start.y - line1.end.y) * (line2.end.x - line1.start.x) +
        dX * (line2.end.y - line1.start.y)) /
        determinant;
    // check if there is an intersection
    if (!(lambda >= 0 && lambda <= 1) || !(gamma >= 0 && gamma <= 1)) {
        return null;
    }
    return { x: line1.start.x + lambda * dX, y: line1.start.y + lambda * dY };
}
exports.intersectLineLine = intersectLineLine;
/**
 * check if line (ray) intersects polygon
 */
function intersectLinePolygon(line, polygon) {
    return polygon.calcPoints
        .map((to, index) => {
        const from = index
            ? polygon.calcPoints[index - 1]
            : polygon.calcPoints[polygon.calcPoints.length - 1];
        const side = new line_1.Line({ x: from.x + polygon.pos.x, y: from.y + polygon.pos.y }, { x: to.x + polygon.pos.x, y: to.y + polygon.pos.y });
        return intersectLineLine(line, side);
    })
        .filter((test) => !!test);
}
exports.intersectLinePolygon = intersectLinePolygon;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "./node_modules/rbush/rbush.min.js":
/*!*****************************************!*\
  !*** ./node_modules/rbush/rbush.min.js ***!
  \*****************************************/
/***/ (function(module) {

!function(t,i){ true?module.exports=i():0}(this,function(){"use strict";function t(t,r,e,a,h){!function t(n,r,e,a,h){for(;a>e;){if(a-e>600){var o=a-e+1,s=r-e+1,l=Math.log(o),f=.5*Math.exp(2*l/3),u=.5*Math.sqrt(l*f*(o-f)/o)*(s-o/2<0?-1:1),m=Math.max(e,Math.floor(r-s*f/o+u)),c=Math.min(a,Math.floor(r+(o-s)*f/o+u));t(n,r,m,c,h)}var p=n[r],d=e,x=a;for(i(n,e,r),h(n[a],p)>0&&i(n,e,a);d<x;){for(i(n,d,x),d++,x--;h(n[d],p)<0;)d++;for(;h(n[x],p)>0;)x--}0===h(n[e],p)?i(n,e,x):i(n,++x,a),x<=r&&(e=x+1),r<=x&&(a=x-1)}}(t,r,e||0,a||t.length-1,h||n)}function i(t,i,n){var r=t[i];t[i]=t[n],t[n]=r}function n(t,i){return t<i?-1:t>i?1:0}var r=function(t){void 0===t&&(t=9),this._maxEntries=Math.max(4,t),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),this.clear()};function e(t,i,n){if(!n)return i.indexOf(t);for(var r=0;r<i.length;r++)if(n(t,i[r]))return r;return-1}function a(t,i){h(t,0,t.children.length,i,t)}function h(t,i,n,r,e){e||(e=p(null)),e.minX=1/0,e.minY=1/0,e.maxX=-1/0,e.maxY=-1/0;for(var a=i;a<n;a++){var h=t.children[a];o(e,t.leaf?r(h):h)}return e}function o(t,i){return t.minX=Math.min(t.minX,i.minX),t.minY=Math.min(t.minY,i.minY),t.maxX=Math.max(t.maxX,i.maxX),t.maxY=Math.max(t.maxY,i.maxY),t}function s(t,i){return t.minX-i.minX}function l(t,i){return t.minY-i.minY}function f(t){return(t.maxX-t.minX)*(t.maxY-t.minY)}function u(t){return t.maxX-t.minX+(t.maxY-t.minY)}function m(t,i){return t.minX<=i.minX&&t.minY<=i.minY&&i.maxX<=t.maxX&&i.maxY<=t.maxY}function c(t,i){return i.minX<=t.maxX&&i.minY<=t.maxY&&i.maxX>=t.minX&&i.maxY>=t.minY}function p(t){return{children:t,height:1,leaf:!0,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}}function d(i,n,r,e,a){for(var h=[n,r];h.length;)if(!((r=h.pop())-(n=h.pop())<=e)){var o=n+Math.ceil((r-n)/e/2)*e;t(i,o,n,r,a),h.push(n,o,o,r)}}return r.prototype.all=function(){return this._all(this.data,[])},r.prototype.search=function(t){var i=this.data,n=[];if(!c(t,i))return n;for(var r=this.toBBox,e=[];i;){for(var a=0;a<i.children.length;a++){var h=i.children[a],o=i.leaf?r(h):h;c(t,o)&&(i.leaf?n.push(h):m(t,o)?this._all(h,n):e.push(h))}i=e.pop()}return n},r.prototype.collides=function(t){var i=this.data;if(!c(t,i))return!1;for(var n=[];i;){for(var r=0;r<i.children.length;r++){var e=i.children[r],a=i.leaf?this.toBBox(e):e;if(c(t,a)){if(i.leaf||m(t,a))return!0;n.push(e)}}i=n.pop()}return!1},r.prototype.load=function(t){if(!t||!t.length)return this;if(t.length<this._minEntries){for(var i=0;i<t.length;i++)this.insert(t[i]);return this}var n=this._build(t.slice(),0,t.length-1,0);if(this.data.children.length)if(this.data.height===n.height)this._splitRoot(this.data,n);else{if(this.data.height<n.height){var r=this.data;this.data=n,n=r}this._insert(n,this.data.height-n.height-1,!0)}else this.data=n;return this},r.prototype.insert=function(t){return t&&this._insert(t,this.data.height-1),this},r.prototype.clear=function(){return this.data=p([]),this},r.prototype.remove=function(t,i){if(!t)return this;for(var n,r,a,h=this.data,o=this.toBBox(t),s=[],l=[];h||s.length;){if(h||(h=s.pop(),r=s[s.length-1],n=l.pop(),a=!0),h.leaf){var f=e(t,h.children,i);if(-1!==f)return h.children.splice(f,1),s.push(h),this._condense(s),this}a||h.leaf||!m(h,o)?r?(n++,h=r.children[n],a=!1):h=null:(s.push(h),l.push(n),n=0,r=h,h=h.children[0])}return this},r.prototype.toBBox=function(t){return t},r.prototype.compareMinX=function(t,i){return t.minX-i.minX},r.prototype.compareMinY=function(t,i){return t.minY-i.minY},r.prototype.toJSON=function(){return this.data},r.prototype.fromJSON=function(t){return this.data=t,this},r.prototype._all=function(t,i){for(var n=[];t;)t.leaf?i.push.apply(i,t.children):n.push.apply(n,t.children),t=n.pop();return i},r.prototype._build=function(t,i,n,r){var e,h=n-i+1,o=this._maxEntries;if(h<=o)return a(e=p(t.slice(i,n+1)),this.toBBox),e;r||(r=Math.ceil(Math.log(h)/Math.log(o)),o=Math.ceil(h/Math.pow(o,r-1))),(e=p([])).leaf=!1,e.height=r;var s=Math.ceil(h/o),l=s*Math.ceil(Math.sqrt(o));d(t,i,n,l,this.compareMinX);for(var f=i;f<=n;f+=l){var u=Math.min(f+l-1,n);d(t,f,u,s,this.compareMinY);for(var m=f;m<=u;m+=s){var c=Math.min(m+s-1,u);e.children.push(this._build(t,m,c,r-1))}}return a(e,this.toBBox),e},r.prototype._chooseSubtree=function(t,i,n,r){for(;r.push(i),!i.leaf&&r.length-1!==n;){for(var e=1/0,a=1/0,h=void 0,o=0;o<i.children.length;o++){var s=i.children[o],l=f(s),u=(m=t,c=s,(Math.max(c.maxX,m.maxX)-Math.min(c.minX,m.minX))*(Math.max(c.maxY,m.maxY)-Math.min(c.minY,m.minY))-l);u<a?(a=u,e=l<e?l:e,h=s):u===a&&l<e&&(e=l,h=s)}i=h||i.children[0]}var m,c;return i},r.prototype._insert=function(t,i,n){var r=n?t:this.toBBox(t),e=[],a=this._chooseSubtree(r,this.data,i,e);for(a.children.push(t),o(a,r);i>=0&&e[i].children.length>this._maxEntries;)this._split(e,i),i--;this._adjustParentBBoxes(r,e,i)},r.prototype._split=function(t,i){var n=t[i],r=n.children.length,e=this._minEntries;this._chooseSplitAxis(n,e,r);var h=this._chooseSplitIndex(n,e,r),o=p(n.children.splice(h,n.children.length-h));o.height=n.height,o.leaf=n.leaf,a(n,this.toBBox),a(o,this.toBBox),i?t[i-1].children.push(o):this._splitRoot(n,o)},r.prototype._splitRoot=function(t,i){this.data=p([t,i]),this.data.height=t.height+1,this.data.leaf=!1,a(this.data,this.toBBox)},r.prototype._chooseSplitIndex=function(t,i,n){for(var r,e,a,o,s,l,u,m=1/0,c=1/0,p=i;p<=n-i;p++){var d=h(t,0,p,this.toBBox),x=h(t,p,n,this.toBBox),v=(e=d,a=x,o=void 0,s=void 0,l=void 0,u=void 0,o=Math.max(e.minX,a.minX),s=Math.max(e.minY,a.minY),l=Math.min(e.maxX,a.maxX),u=Math.min(e.maxY,a.maxY),Math.max(0,l-o)*Math.max(0,u-s)),M=f(d)+f(x);v<m?(m=v,r=p,c=M<c?M:c):v===m&&M<c&&(c=M,r=p)}return r||n-i},r.prototype._chooseSplitAxis=function(t,i,n){var r=t.leaf?this.compareMinX:s,e=t.leaf?this.compareMinY:l;this._allDistMargin(t,i,n,r)<this._allDistMargin(t,i,n,e)&&t.children.sort(r)},r.prototype._allDistMargin=function(t,i,n,r){t.children.sort(r);for(var e=this.toBBox,a=h(t,0,i,e),s=h(t,n-i,n,e),l=u(a)+u(s),f=i;f<n-i;f++){var m=t.children[f];o(a,t.leaf?e(m):m),l+=u(a)}for(var c=n-i-1;c>=i;c--){var p=t.children[c];o(s,t.leaf?e(p):p),l+=u(s)}return l},r.prototype._adjustParentBBoxes=function(t,i,n){for(var r=n;r>=0;r--)o(i[r],t)},r.prototype._condense=function(t){for(var i=t.length-1,n=void 0;i>=0;i--)0===t[i].children.length?i>0?(n=t[i-1].children).splice(n.indexOf(t[i]),1):this.clear():a(t[i],this.toBBox)},r});


/***/ }),

/***/ "./node_modules/sat/SAT.js":
/*!*********************************!*\
  !*** ./node_modules/sat/SAT.js ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// Version 0.9.0 - Copyright 2012 - 2021 -  Jim Riecken <jimr@jimr.ca>
//
// Released under the MIT License - https://github.com/jriecken/sat-js
//
// A simple library for determining intersections of circles and
// polygons using the Separating Axis Theorem.
/** @preserve SAT.js - Version 0.9.0 - Copyright 2012 - 2021 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */

/*global define: false, module: false*/
/*jshint shadow:true, sub:true, forin:true, noarg:true, noempty:true,
  eqeqeq:true, bitwise:true, strict:true, undef:true,
  curly:true, browser:true */

// Create a UMD wrapper for SAT. Works in:
//
//  - Plain browser via global SAT variable
//  - AMD loader (like require.js)
//  - Node.js
//
// The quoted properties all over the place are used so that the Closure Compiler
// does not mangle the exposed API in advanced mode.
/**
 * @param {*} root - The global scope
 * @param {Function} factory - Factory that creates SAT module
 */
(function (root, factory) {
  "use strict";
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function () {
  "use strict";

  var SAT = {};

  //
  // ## Vector
  //
  // Represents a vector in two dimensions with `x` and `y` properties.


  // Create a new Vector, optionally passing in the `x` and `y` coordinates. If
  // a coordinate is not specified, it will be set to `0`
  /**
   * @param {?number=} x The x position.
   * @param {?number=} y The y position.
   * @constructor
   */
  function Vector(x, y) {
    this['x'] = x || 0;
    this['y'] = y || 0;
  }
  SAT['Vector'] = Vector;
  // Alias `Vector` as `V`
  SAT['V'] = Vector;


  // Copy the values of another Vector into this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['copy'] = Vector.prototype.copy = function (other) {
    this['x'] = other['x'];
    this['y'] = other['y'];
    return this;
  };

  // Create a new vector with the same coordinates as this on.
  /**
   * @return {Vector} The new cloned vector
   */
  Vector.prototype['clone'] = Vector.prototype.clone = function () {
    return new Vector(this['x'], this['y']);
  };

  // Change this vector to be perpendicular to what it was before. (Effectively
  // roatates it 90 degrees in a clockwise direction)
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['perp'] = Vector.prototype.perp = function () {
    var x = this['x'];
    this['x'] = this['y'];
    this['y'] = -x;
    return this;
  };

  // Rotate this vector (counter-clockwise) by the specified angle (in radians).
  /**
   * @param {number} angle The angle to rotate (in radians)
   * @return {Vector} This for chaining.
   */
  Vector.prototype['rotate'] = Vector.prototype.rotate = function (angle) {
    var x = this['x'];
    var y = this['y'];
    this['x'] = x * Math.cos(angle) - y * Math.sin(angle);
    this['y'] = x * Math.sin(angle) + y * Math.cos(angle);
    return this;
  };

  // Reverse this vector.
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reverse'] = Vector.prototype.reverse = function () {
    this['x'] = -this['x'];
    this['y'] = -this['y'];
    return this;
  };


  // Normalize this vector.  (make it have length of `1`)
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['normalize'] = Vector.prototype.normalize = function () {
    var d = this.len();
    if (d > 0) {
      this['x'] = this['x'] / d;
      this['y'] = this['y'] / d;
    }
    return this;
  };

  // Add another vector to this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['add'] = Vector.prototype.add = function (other) {
    this['x'] += other['x'];
    this['y'] += other['y'];
    return this;
  };

  // Subtract another vector from this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaiing.
   */
  Vector.prototype['sub'] = Vector.prototype.sub = function (other) {
    this['x'] -= other['x'];
    this['y'] -= other['y'];
    return this;
  };

  // Scale this vector. An independent scaling factor can be provided
  // for each axis, or a single scaling factor that will scale both `x` and `y`.
  /**
   * @param {number} x The scaling factor in the x direction.
   * @param {?number=} y The scaling factor in the y direction.  If this
   *   is not specified, the x scaling factor will be used.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['scale'] = Vector.prototype.scale = function (x, y) {
    this['x'] *= x;
    this['y'] *= typeof y != 'undefined' ? y : x;
    return this;
  };

  // Project this vector on to another vector.
  /**
   * @param {Vector} other The vector to project onto.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['project'] = Vector.prototype.project = function (other) {
    var amt = this.dot(other) / other.len2();
    this['x'] = amt * other['x'];
    this['y'] = amt * other['y'];
    return this;
  };

  // Project this vector onto a vector of unit length. This is slightly more efficient
  // than `project` when dealing with unit vectors.
  /**
   * @param {Vector} other The unit vector to project onto.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['projectN'] = Vector.prototype.projectN = function (other) {
    var amt = this.dot(other);
    this['x'] = amt * other['x'];
    this['y'] = amt * other['y'];
    return this;
  };

  // Reflect this vector on an arbitrary axis.
  /**
   * @param {Vector} axis The vector representing the axis.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reflect'] = Vector.prototype.reflect = function (axis) {
    var x = this['x'];
    var y = this['y'];
    this.project(axis).scale(2);
    this['x'] -= x;
    this['y'] -= y;
    return this;
  };

  // Reflect this vector on an arbitrary axis (represented by a unit vector). This is
  // slightly more efficient than `reflect` when dealing with an axis that is a unit vector.
  /**
   * @param {Vector} axis The unit vector representing the axis.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reflectN'] = Vector.prototype.reflectN = function (axis) {
    var x = this['x'];
    var y = this['y'];
    this.projectN(axis).scale(2);
    this['x'] -= x;
    this['y'] -= y;
    return this;
  };

  // Get the dot product of this vector and another.
  /**
   * @param {Vector}  other The vector to dot this one against.
   * @return {number} The dot product.
   */
  Vector.prototype['dot'] = Vector.prototype.dot = function (other) {
    return this['x'] * other['x'] + this['y'] * other['y'];
  };

  // Get the squared length of this vector.
  /**
   * @return {number} The length^2 of this vector.
   */
  Vector.prototype['len2'] = Vector.prototype.len2 = function () {
    return this.dot(this);
  };

  // Get the length of this vector.
  /**
   * @return {number} The length of this vector.
   */
  Vector.prototype['len'] = Vector.prototype.len = function () {
    return Math.sqrt(this.len2());
  };

  // ## Circle
  //
  // Represents a circle with a position and a radius.

  // Create a new circle, optionally passing in a position and/or radius. If no position
  // is given, the circle will be at `(0,0)`. If no radius is provided, the circle will
  // have a radius of `0`.
  /**
   * @param {Vector=} pos A vector representing the position of the center of the circle
   * @param {?number=} r The radius of the circle
   * @constructor
   */
  function Circle(pos, r) {
    this['pos'] = pos || new Vector();
    this['r'] = r || 0;
    this['offset'] = new Vector();
  }
  SAT['Circle'] = Circle;

  // Compute the axis-aligned bounding box (AABB) of this Circle.
  //
  // Note: Returns a _new_ `Box` each time you call this.
  /**
   * @return {Polygon} The AABB
   */
  Circle.prototype['getAABBAsBox'] = Circle.prototype.getAABBAsBox = function () {
    var r = this['r'];
    var corner = this['pos'].clone().add(this['offset']).sub(new Vector(r, r));
    return new Box(corner, r * 2, r * 2);
  };

  // Compute the axis-aligned bounding box (AABB) of this Circle.
  //
  // Note: Returns a _new_ `Polygon` each time you call this.
  /**
   * @return {Polygon} The AABB
   */
  Circle.prototype['getAABB'] = Circle.prototype.getAABB = function () {
    return this.getAABBAsBox().toPolygon();
  };

  // Set the current offset to apply to the radius.
  /**
   * @param {Vector} offset The new offset vector.
   * @return {Circle} This for chaining.
   */
  Circle.prototype['setOffset'] = Circle.prototype.setOffset = function (offset) {
    this['offset'] = offset;
    return this;
  };

  // ## Polygon
  //
  // Represents a *convex* polygon with any number of points (specified in counter-clockwise order)
  //
  // Note: Do _not_ manually change the `points`, `angle`, or `offset` properties. Use the
  // provided setters. Otherwise the calculated properties will not be updated correctly.
  //
  // `pos` can be changed directly.

  // Create a new polygon, passing in a position vector, and an array of points (represented
  // by vectors relative to the position vector). If no position is passed in, the position
  // of the polygon will be `(0,0)`.
  /**
   * @param {Vector=} pos A vector representing the origin of the polygon. (all other
   *   points are relative to this one)
   * @param {Array<Vector>=} points An array of vectors representing the points in the polygon,
   *   in counter-clockwise order.
   * @constructor
   */
  function Polygon(pos, points) {
    this['pos'] = pos || new Vector();
    this['angle'] = 0;
    this['offset'] = new Vector();
    this.setPoints(points || []);
  }
  SAT['Polygon'] = Polygon;

  // Set the points of the polygon. Any consecutive duplicate points will be combined.
  //
  // Note: The points are counter-clockwise *with respect to the coordinate system*.
  // If you directly draw the points on a screen that has the origin at the top-left corner
  // it will _appear_ visually that the points are being specified clockwise. This is just
  // because of the inversion of the Y-axis when being displayed.
  /**
   * @param {Array<Vector>=} points An array of vectors representing the points in the polygon,
   *   in counter-clockwise order.
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['setPoints'] = Polygon.prototype.setPoints = function (points) {
    // Only re-allocate if this is a new polygon or the number of points has changed.
    var lengthChanged = !this['points'] || this['points'].length !== points.length;
    if (lengthChanged) {
      var i;
      var calcPoints = this['calcPoints'] = [];
      var edges = this['edges'] = [];
      var normals = this['normals'] = [];
      // Allocate the vector arrays for the calculated properties
      for (i = 0; i < points.length; i++) {
        // Remove consecutive duplicate points
        var p1 = points[i];
        var p2 = i < points.length - 1 ? points[i + 1] : points[0];
        if (p1 !== p2 && p1.x === p2.x && p1.y === p2.y) {
          points.splice(i, 1);
          i -= 1;
          continue;
        }
        calcPoints.push(new Vector());
        edges.push(new Vector());
        normals.push(new Vector());
      }
    }
    this['points'] = points;
    this._recalc();
    return this;
  };

  // Set the current rotation angle of the polygon.
  /**
   * @param {number} angle The current rotation angle (in radians).
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['setAngle'] = Polygon.prototype.setAngle = function (angle) {
    this['angle'] = angle;
    this._recalc();
    return this;
  };

  // Set the current offset to apply to the `points` before applying the `angle` rotation.
  /**
   * @param {Vector} offset The new offset vector.
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['setOffset'] = Polygon.prototype.setOffset = function (offset) {
    this['offset'] = offset;
    this._recalc();
    return this;
  };

  // Rotates this polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).
  //
  // Note: This changes the **original** points (so any `angle` will be applied on top of this rotation).
  /**
   * @param {number} angle The angle to rotate (in radians)
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['rotate'] = Polygon.prototype.rotate = function (angle) {
    var points = this['points'];
    var len = points.length;
    for (var i = 0; i < len; i++) {
      points[i].rotate(angle);
    }
    this._recalc();
    return this;
  };

  // Translates the points of this polygon by a specified amount relative to the origin of *its own coordinate
  // system* (i.e. `pos`).
  //
  // This is most useful to change the "center point" of a polygon. If you just want to move the whole polygon, change
  // the coordinates of `pos`.
  //
  // Note: This changes the **original** points (so any `offset` will be applied on top of this translation)
  /**
   * @param {number} x The horizontal amount to translate.
   * @param {number} y The vertical amount to translate.
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['translate'] = Polygon.prototype.translate = function (x, y) {
    var points = this['points'];
    var len = points.length;
    for (var i = 0; i < len; i++) {
      points[i]['x'] += x;
      points[i]['y'] += y;
    }
    this._recalc();
    return this;
  };


  // Computes the calculated collision polygon. Applies the `angle` and `offset` to the original points then recalculates the
  // edges and normals of the collision polygon.
  /**
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype._recalc = function () {
    // Calculated points - this is what is used for underlying collisions and takes into account
    // the angle/offset set on the polygon.
    var calcPoints = this['calcPoints'];
    // The edges here are the direction of the `n`th edge of the polygon, relative to
    // the `n`th point. If you want to draw a given edge from the edge value, you must
    // first translate to the position of the starting point.
    var edges = this['edges'];
    // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
    // to the position of the `n`th point. If you want to draw an edge normal, you must first
    // translate to the position of the starting point.
    var normals = this['normals'];
    // Copy the original points array and apply the offset/angle
    var points = this['points'];
    var offset = this['offset'];
    var angle = this['angle'];
    var len = points.length;
    var i;
    for (i = 0; i < len; i++) {
      var calcPoint = calcPoints[i].copy(points[i]);
      calcPoint['x'] += offset['x'];
      calcPoint['y'] += offset['y'];
      if (angle !== 0) {
        calcPoint.rotate(angle);
      }
    }
    // Calculate the edges/normals
    for (i = 0; i < len; i++) {
      var p1 = calcPoints[i];
      var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];
      var e = edges[i].copy(p2).sub(p1);
      normals[i].copy(e).perp().normalize();
    }
    return this;
  };


  // Compute the axis-aligned bounding box. Any current state
  // (translations/rotations) will be applied before constructing the AABB.
  //
  // Note: Returns a _new_ `Box` each time you call this.
  /**
   * @return {Polygon} The AABB
   */
  Polygon.prototype['getAABBAsBox'] = Polygon.prototype.getAABBAsBox = function () {
    var points = this['calcPoints'];
    var len = points.length;
    var xMin = points[0]['x'];
    var yMin = points[0]['y'];
    var xMax = points[0]['x'];
    var yMax = points[0]['y'];
    for (var i = 1; i < len; i++) {
      var point = points[i];
      if (point['x'] < xMin) {
        xMin = point['x'];
      }
      else if (point['x'] > xMax) {
        xMax = point['x'];
      }
      if (point['y'] < yMin) {
        yMin = point['y'];
      }
      else if (point['y'] > yMax) {
        yMax = point['y'];
      }
    }
    return new Box(this['pos'].clone().add(new Vector(xMin, yMin)), xMax - xMin, yMax - yMin);
  };


  // Compute the axis-aligned bounding box. Any current state
  // (translations/rotations) will be applied before constructing the AABB.
  //
  // Note: Returns a _new_ `Polygon` each time you call this.
  /**
   * @return {Polygon} The AABB
   */
  Polygon.prototype['getAABB'] = Polygon.prototype.getAABB = function () {
    return this.getAABBAsBox().toPolygon();
  };

  // Compute the centroid (geometric center) of the polygon. Any current state
  // (translations/rotations) will be applied before computing the centroid.
  //
  // See https://en.wikipedia.org/wiki/Centroid#Centroid_of_a_polygon
  //
  // Note: Returns a _new_ `Vector` each time you call this.
  /**
   * @return {Vector} A Vector that contains the coordinates of the Centroid.
   */
  Polygon.prototype['getCentroid'] = Polygon.prototype.getCentroid = function () {
    var points = this['calcPoints'];
    var len = points.length;
    var cx = 0;
    var cy = 0;
    var ar = 0;
    for (var i = 0; i < len; i++) {
      var p1 = points[i];
      var p2 = i === len - 1 ? points[0] : points[i + 1]; // Loop around if last point
      var a = p1['x'] * p2['y'] - p2['x'] * p1['y'];
      cx += (p1['x'] + p2['x']) * a;
      cy += (p1['y'] + p2['y']) * a;
      ar += a;
    }
    ar = ar * 3; // we want 1 / 6 the area and we currently have 2*area
    cx = cx / ar;
    cy = cy / ar;
    return new Vector(cx, cy);
  };


  // ## Box
  //
  // Represents an axis-aligned box, with a width and height.


  // Create a new box, with the specified position, width, and height. If no position
  // is given, the position will be `(0,0)`. If no width or height are given, they will
  // be set to `0`.
  /**
   * @param {Vector=} pos A vector representing the bottom-left of the box (i.e. the smallest x and smallest y value).
   * @param {?number=} w The width of the box.
   * @param {?number=} h The height of the box.
   * @constructor
   */
  function Box(pos, w, h) {
    this['pos'] = pos || new Vector();
    this['w'] = w || 0;
    this['h'] = h || 0;
  }
  SAT['Box'] = Box;

  // Returns a polygon whose edges are the same as this box.
  /**
   * @return {Polygon} A new Polygon that represents this box.
   */
  Box.prototype['toPolygon'] = Box.prototype.toPolygon = function () {
    var pos = this['pos'];
    var w = this['w'];
    var h = this['h'];
    return new Polygon(new Vector(pos['x'], pos['y']), [
      new Vector(), new Vector(w, 0),
      new Vector(w, h), new Vector(0, h)
    ]);
  };

  // ## Response
  //
  // An object representing the result of an intersection. Contains:
  //  - The two objects participating in the intersection
  //  - The vector representing the minimum change necessary to extract the first object
  //    from the second one (as well as a unit vector in that direction and the magnitude
  //    of the overlap)
  //  - Whether the first object is entirely inside the second, and vice versa.
  /**
   * @constructor
   */
  function Response() {
    this['a'] = null;
    this['b'] = null;
    this['overlapN'] = new Vector();
    this['overlapV'] = new Vector();
    this.clear();
  }
  SAT['Response'] = Response;

  // Set some values of the response back to their defaults.  Call this between tests if
  // you are going to reuse a single Response object for multiple intersection tests (recommented
  // as it will avoid allcating extra memory)
  /**
   * @return {Response} This for chaining
   */
  Response.prototype['clear'] = Response.prototype.clear = function () {
    this['aInB'] = true;
    this['bInA'] = true;
    this['overlap'] = Number.MAX_VALUE;
    return this;
  };

  // ## Object Pools

  // A pool of `Vector` objects that are used in calculations to avoid
  // allocating memory.
  /**
   * @type {Array<Vector>}
   */
  var T_VECTORS = [];
  for (var i = 0; i < 10; i++) { T_VECTORS.push(new Vector()); }

  // A pool of arrays of numbers used in calculations to avoid allocating
  // memory.
  /**
   * @type {Array<Array<number>>}
   */
  var T_ARRAYS = [];
  for (var i = 0; i < 5; i++) { T_ARRAYS.push([]); }

  // Temporary response used for polygon hit detection.
  /**
   * @type {Response}
   */
  var T_RESPONSE = new Response();

  // Tiny "point" polygon used for polygon hit detection.
  /**
   * @type {Polygon}
   */
  var TEST_POINT = new Box(new Vector(), 0.000001, 0.000001).toPolygon();

  // ## Helper Functions

  // Flattens the specified array of points onto a unit vector axis,
  // resulting in a one dimensional range of the minimum and
  // maximum value on that axis.
  /**
   * @param {Array<Vector>} points The points to flatten.
   * @param {Vector} normal The unit vector axis to flatten on.
   * @param {Array<number>} result An array.  After calling this function,
   *   result[0] will be the minimum value,
   *   result[1] will be the maximum value.
   */
  function flattenPointsOn(points, normal, result) {
    var min = Number.MAX_VALUE;
    var max = -Number.MAX_VALUE;
    var len = points.length;
    for (var i = 0; i < len; i++) {
      // The magnitude of the projection of the point onto the normal
      var dot = points[i].dot(normal);
      if (dot < min) { min = dot; }
      if (dot > max) { max = dot; }
    }
    result[0] = min; result[1] = max;
  }

  // Check whether two convex polygons are separated by the specified
  // axis (must be a unit vector).
  /**
   * @param {Vector} aPos The position of the first polygon.
   * @param {Vector} bPos The position of the second polygon.
   * @param {Array<Vector>} aPoints The points in the first polygon.
   * @param {Array<Vector>} bPoints The points in the second polygon.
   * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
   *   will be projected onto this axis.
   * @param {Response=} response A Response object (optional) which will be populated
   *   if the axis is not a separating axis.
   * @return {boolean} true if it is a separating axis, false otherwise.  If false,
   *   and a response is passed in, information about how much overlap and
   *   the direction of the overlap will be populated.
   */
  function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
    var rangeA = T_ARRAYS.pop();
    var rangeB = T_ARRAYS.pop();
    // The magnitude of the offset between the two polygons
    var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
    var projectedOffset = offsetV.dot(axis);
    // Project the polygons onto the axis.
    flattenPointsOn(aPoints, axis, rangeA);
    flattenPointsOn(bPoints, axis, rangeB);
    // Move B's range to its position relative to A.
    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;
    // Check if there is a gap. If there is, this is a separating axis and we can stop
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
      T_VECTORS.push(offsetV);
      T_ARRAYS.push(rangeA);
      T_ARRAYS.push(rangeB);
      return true;
    }
    // This is not a separating axis. If we're calculating a response, calculate the overlap.
    if (response) {
      var overlap = 0;
      // A starts further left than B
      if (rangeA[0] < rangeB[0]) {
        response['aInB'] = false;
        // A ends before B does. We have to pull A out of B
        if (rangeA[1] < rangeB[1]) {
          overlap = rangeA[1] - rangeB[0];
          response['bInA'] = false;
          // B is fully inside A.  Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
        // B starts further left than A
      } else {
        response['bInA'] = false;
        // B ends before A ends. We have to push A out of B
        if (rangeA[1] > rangeB[1]) {
          overlap = rangeA[0] - rangeB[1];
          response['aInB'] = false;
          // A is fully inside B.  Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
      }
      // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
      var absOverlap = Math.abs(overlap);
      if (absOverlap < response['overlap']) {
        response['overlap'] = absOverlap;
        response['overlapN'].copy(axis);
        if (overlap < 0) {
          response['overlapN'].reverse();
        }
      }
    }
    T_VECTORS.push(offsetV);
    T_ARRAYS.push(rangeA);
    T_ARRAYS.push(rangeB);
    return false;
  }
  SAT['isSeparatingAxis'] = isSeparatingAxis;

  // Calculates which Voronoi region a point is on a line segment.
  // It is assumed that both the line and the point are relative to `(0,0)`
  //
  //            |       (0)      |
  //     (-1)  [S]--------------[E]  (1)
  //            |       (0)      |
  /**
   * @param {Vector} line The line segment.
   * @param {Vector} point The point.
   * @return  {number} LEFT_VORONOI_REGION (-1) if it is the left region,
   *          MIDDLE_VORONOI_REGION (0) if it is the middle region,
   *          RIGHT_VORONOI_REGION (1) if it is the right region.
   */
  function voronoiRegion(line, point) {
    var len2 = line.len2();
    var dp = point.dot(line);
    // If the point is beyond the start of the line, it is in the
    // left voronoi region.
    if (dp < 0) { return LEFT_VORONOI_REGION; }
    // If the point is beyond the end of the line, it is in the
    // right voronoi region.
    else if (dp > len2) { return RIGHT_VORONOI_REGION; }
    // Otherwise, it's in the middle one.
    else { return MIDDLE_VORONOI_REGION; }
  }
  // Constants for Voronoi regions
  /**
   * @const
   */
  var LEFT_VORONOI_REGION = -1;
  /**
   * @const
   */
  var MIDDLE_VORONOI_REGION = 0;
  /**
   * @const
   */
  var RIGHT_VORONOI_REGION = 1;

  // ## Collision Tests

  // Check if a point is inside a circle.
  /**
   * @param {Vector} p The point to test.
   * @param {Circle} c The circle to test.
   * @return {boolean} true if the point is inside the circle, false if it is not.
   */
  function pointInCircle(p, c) {
    var differenceV = T_VECTORS.pop().copy(p).sub(c['pos']).sub(c['offset']);
    var radiusSq = c['r'] * c['r'];
    var distanceSq = differenceV.len2();
    T_VECTORS.push(differenceV);
    // If the distance between is smaller than the radius then the point is inside the circle.
    return distanceSq <= radiusSq;
  }
  SAT['pointInCircle'] = pointInCircle;

  // Check if a point is inside a convex polygon.
  /**
   * @param {Vector} p The point to test.
   * @param {Polygon} poly The polygon to test.
   * @return {boolean} true if the point is inside the polygon, false if it is not.
   */
  function pointInPolygon(p, poly) {
    TEST_POINT['pos'].copy(p);
    T_RESPONSE.clear();
    var result = testPolygonPolygon(TEST_POINT, poly, T_RESPONSE);
    if (result) {
      result = T_RESPONSE['aInB'];
    }
    return result;
  }
  SAT['pointInPolygon'] = pointInPolygon;

  // Check if two circles collide.
  /**
   * @param {Circle} a The first circle.
   * @param {Circle} b The second circle.
   * @param {Response=} response Response object (optional) that will be populated if
   *   the circles intersect.
   * @return {boolean} true if the circles intersect, false if they don't.
   */
  function testCircleCircle(a, b, response) {
    // Check if the distance between the centers of the two
    // circles is greater than their combined radius.
    var differenceV = T_VECTORS.pop().copy(b['pos']).add(b['offset']).sub(a['pos']).sub(a['offset']);
    var totalRadius = a['r'] + b['r'];
    var totalRadiusSq = totalRadius * totalRadius;
    var distanceSq = differenceV.len2();
    // If the distance is bigger than the combined radius, they don't intersect.
    if (distanceSq > totalRadiusSq) {
      T_VECTORS.push(differenceV);
      return false;
    }
    // They intersect.  If we're calculating a response, calculate the overlap.
    if (response) {
      var dist = Math.sqrt(distanceSq);
      response['a'] = a;
      response['b'] = b;
      response['overlap'] = totalRadius - dist;
      response['overlapN'].copy(differenceV.normalize());
      response['overlapV'].copy(differenceV).scale(response['overlap']);
      response['aInB'] = a['r'] <= b['r'] && dist <= b['r'] - a['r'];
      response['bInA'] = b['r'] <= a['r'] && dist <= a['r'] - b['r'];
    }
    T_VECTORS.push(differenceV);
    return true;
  }
  SAT['testCircleCircle'] = testCircleCircle;

  // Check if a polygon and a circle collide.
  /**
   * @param {Polygon} polygon The polygon.
   * @param {Circle} circle The circle.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testPolygonCircle(polygon, circle, response) {
    // Get the position of the circle relative to the polygon.
    var circlePos = T_VECTORS.pop().copy(circle['pos']).add(circle['offset']).sub(polygon['pos']);
    var radius = circle['r'];
    var radius2 = radius * radius;
    var points = polygon['calcPoints'];
    var len = points.length;
    var edge = T_VECTORS.pop();
    var point = T_VECTORS.pop();

    // For each edge in the polygon:
    for (var i = 0; i < len; i++) {
      var next = i === len - 1 ? 0 : i + 1;
      var prev = i === 0 ? len - 1 : i - 1;
      var overlap = 0;
      var overlapN = null;

      // Get the edge.
      edge.copy(polygon['edges'][i]);
      // Calculate the center of the circle relative to the starting point of the edge.
      point.copy(circlePos).sub(points[i]);

      // If the distance between the center of the circle and the point
      // is bigger than the radius, the polygon is definitely not fully in
      // the circle.
      if (response && point.len2() > radius2) {
        response['aInB'] = false;
      }

      // Calculate which Voronoi region the center of the circle is in.
      var region = voronoiRegion(edge, point);
      // If it's the left region:
      if (region === LEFT_VORONOI_REGION) {
        // We need to make sure we're in the RIGHT_VORONOI_REGION of the previous edge.
        edge.copy(polygon['edges'][prev]);
        // Calculate the center of the circle relative the starting point of the previous edge
        var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
        region = voronoiRegion(edge, point2);
        if (region === RIGHT_VORONOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos);
            T_VECTORS.push(edge);
            T_VECTORS.push(point);
            T_VECTORS.push(point2);
            return false;
          } else if (response) {
            // It intersects, calculate the overlap.
            response['bInA'] = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
        T_VECTORS.push(point2);
        // If it's the right region:
      } else if (region === RIGHT_VORONOI_REGION) {
        // We need to make sure we're in the left region on the next edge
        edge.copy(polygon['edges'][next]);
        // Calculate the center of the circle relative to the starting point of the next edge.
        point.copy(circlePos).sub(points[next]);
        region = voronoiRegion(edge, point);
        if (region === LEFT_VORONOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos);
            T_VECTORS.push(edge);
            T_VECTORS.push(point);
            return false;
          } else if (response) {
            // It intersects, calculate the overlap.
            response['bInA'] = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
        // Otherwise, it's the middle region:
      } else {
        // Need to check if the circle is intersecting the edge,
        // Change the edge into its "edge normal".
        var normal = edge.perp().normalize();
        // Find the perpendicular distance between the center of the
        // circle and the edge.
        var dist = point.dot(normal);
        var distAbs = Math.abs(dist);
        // If the circle is on the outside of the edge, there is no intersection.
        if (dist > 0 && distAbs > radius) {
          // No intersection
          T_VECTORS.push(circlePos);
          T_VECTORS.push(normal);
          T_VECTORS.push(point);
          return false;
        } else if (response) {
          // It intersects, calculate the overlap.
          overlapN = normal;
          overlap = radius - dist;
          // If the center of the circle is on the outside of the edge, or part of the
          // circle is on the outside, the circle is not fully inside the polygon.
          if (dist >= 0 || overlap < 2 * radius) {
            response['bInA'] = false;
          }
        }
      }

      // If this is the smallest overlap we've seen, keep it.
      // (overlapN may be null if the circle was in the wrong Voronoi region).
      if (overlapN && response && Math.abs(overlap) < Math.abs(response['overlap'])) {
        response['overlap'] = overlap;
        response['overlapN'].copy(overlapN);
      }
    }

    // Calculate the final overlap vector - based on the smallest overlap.
    if (response) {
      response['a'] = polygon;
      response['b'] = circle;
      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
    }
    T_VECTORS.push(circlePos);
    T_VECTORS.push(edge);
    T_VECTORS.push(point);
    return true;
  }
  SAT['testPolygonCircle'] = testPolygonCircle;

  // Check if a circle and a polygon collide.
  //
  // **NOTE:** This is slightly less efficient than polygonCircle as it just
  // runs polygonCircle and reverses everything at the end.
  /**
   * @param {Circle} circle The circle.
   * @param {Polygon} polygon The polygon.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testCirclePolygon(circle, polygon, response) {
    // Test the polygon against the circle.
    var result = testPolygonCircle(polygon, circle, response);
    if (result && response) {
      // Swap A and B in the response.
      var a = response['a'];
      var aInB = response['aInB'];
      response['overlapN'].reverse();
      response['overlapV'].reverse();
      response['a'] = response['b'];
      response['b'] = a;
      response['aInB'] = response['bInA'];
      response['bInA'] = aInB;
    }
    return result;
  }
  SAT['testCirclePolygon'] = testCirclePolygon;

  // Checks whether polygons collide.
  /**
   * @param {Polygon} a The first polygon.
   * @param {Polygon} b The second polygon.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testPolygonPolygon(a, b, response) {
    var aPoints = a['calcPoints'];
    var aLen = aPoints.length;
    var bPoints = b['calcPoints'];
    var bLen = bPoints.length;
    // If any of the edge normals of A is a separating axis, no intersection.
    for (var i = 0; i < aLen; i++) {
      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, a['normals'][i], response)) {
        return false;
      }
    }
    // If any of the edge normals of B is a separating axis, no intersection.
    for (var i = 0; i < bLen; i++) {
      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, b['normals'][i], response)) {
        return false;
      }
    }
    // Since none of the edge normals of A or B are a separating axis, there is an intersection
    // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
    // final overlap vector.
    if (response) {
      response['a'] = a;
      response['b'] = b;
      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
    }
    return true;
  }
  SAT['testPolygonPolygon'] = testPolygonPolygon;

  return SAT;
}));


/***/ }),

/***/ "./src/demo/canvas.js":
/*!****************************!*\
  !*** ./src/demo/canvas.js ***!
  \****************************/
/***/ ((module) => {

const width = innerWidth || 1024;
const height = innerHeight || 768;

class TestCanvas {
  constructor(test) {
    this.test = test;

    this.element = document.createElement("div");
    this.element.id = "debug";
    this.element.innerHTML = `${this.test.legend}
    <div>
      <label>
        <input id="bvh" type="checkbox"/> Show Bounding Volume Hierarchy
      </label>
    </div>`;

    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;

    this.context = this.canvas.getContext("2d");
    this.context.font = "24px Arial";
    this.test.context = this.context;

    this.bvhCheckbox = this.element.querySelector("#bvh");

    if (this.canvas instanceof Node) {
      this.element.appendChild(this.canvas);
    }

    const start = loop(() => this.update());

    start();
  }

  update() {
    // Clear the canvas
    this.context.fillStyle = "#000000";
    this.context.fillRect(0, 0, width, height);

    // Render the bodies
    this.context.strokeStyle = "#FFFFFF";
    this.context.beginPath();
    this.test.physics.draw(this.context);
    this.context.stroke();

    // Render the BVH
    if (this.bvhCheckbox.checked) {
      this.context.strokeStyle = "#00FF00";
      this.context.beginPath();
      this.test.physics.drawBVH(this.context);
      this.context.stroke();
    }

    // Render the FPS
    if (this.test.fps) {
      this.context.fillStyle = "#FFCC00";
      this.context.fillText(this.test.fps, 10, 30);
    }

    if (this.test.drawCallback) {
      this.test.drawCallback();
    }
  }
}

function random(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function loop(callback, loopFn = requestAnimationFrame) {
  let time = performance.now() - 1; // prevent Infinity fps

  return function frame() {
    const now = performance.now();
    const fps = 1000 / (now - time);

    loopFn(frame);
    callback(fps);

    time = now;
  };
}

module.exports.TestCanvas = TestCanvas;

module.exports.random = random;

module.exports.loop = loop;

module.exports.width = width;

module.exports.height = height;


/***/ }),

/***/ "./src/demo/stress.js":
/*!****************************!*\
  !*** ./src/demo/stress.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { System } = __webpack_require__(/*! ../../dist */ "./dist/index.js");
const { width, height, random, loop } = __webpack_require__(/*! ./canvas */ "./src/demo/canvas.js");

class Stress {
  constructor(count = 1000) {
    const size = Math.hypot(width, height) / count;

    this.physics = new System(24);
    this.bodies = [];
    this.polygons = 0;
    this.boxes = 0;
    this.circles = 0;
    this.ellipses = 0;
    this.lines = 0;

    this.fps = 0;
    this.frame = 0;
    this.fpsTotal = 0;

    // World bounds
    this.bounds = [
      this.physics.createPolygon({ x: 0, y: 0 }, [
        { x: 0, y: 0 },
        { x: width, y: 0 },
      ]),
      this.physics.createPolygon({ x: 0, y: 0 }, [
        { x: width, y: 0 },
        { x: width, y: height },
      ]),
      this.physics.createPolygon({ x: 0, y: 0 }, [
        { x: width, y: height },
        { x: 0, y: height },
      ]),
      this.physics.createPolygon({ x: 0, y: 0 }, [
        { x: 0, y: height },
        { x: 0, y: 0 },
      ]),
    ];

    for (let i = 0; i < count; ++i) {
      this.createShape(!random(0, 20), size);
    }

    this.legend = `<div><b>Total:</b> ${count}</div>
    <div><b>Polygons:</b> ${this.polygons}</div>
    <div><b>Boxes:</b> ${this.boxes}</div>
    <div><b>Circles:</b> ${this.circles}</div>
    <div><b>Ellipses:</b> ${this.ellipses}</div>
    <div><b>Lines:</b> ${this.lines}</div>`;

    const start = loop((fps) => this.update(fps));

    start();
  }

  update(fps) {
    this.frame++;
    this.fpsTotal += fps;
    this.fps = Math.round(this.fpsTotal / this.frame);

    if (this.frame > 100) {
      this.frame = 1;
      this.fpsTotal = this.fps;
    }

    this.bodies.forEach((body) => {
      if (body.type !== "Circle") {
        body.rotationAngle += body.rotationSpeed;
        body.setAngle(body.rotationAngle);
      }

      body.setPosition(
        body.pos.x + body.directionX,
        body.pos.y + body.directionY
      );
    });

    this.physics.checkAll(({ a, overlapV }) => {
      if (this.bounds.includes(a)) {
        return;
      }

      const direction = (random(0, 360) * Math.PI) / 180;

      a.setPosition(a.pos.x - overlapV.x, a.pos.y - overlapV.y);

      a.directionX = Math.cos(direction);
      a.directionY = Math.sin(direction);

      if (a.type !== "Circle") {
        a.rotationSpeed = (Math.random() - Math.random()) * 0.1;
      }
    });
  }

  createShape(large, size) {
    const minSize = size * 1.0 * (large ? 2 : 1);
    const maxSize = size * 1.25 * (large ? 3 : 1);
    const x = random(0, width);
    const y = random(0, height);
    const direction = (random(0, 360) * Math.PI) / 180;
    const center = true;
    const padding = size * 7;

    let body;
    let variant = random(0, 5);

    switch (variant) {
      case 0:
        body = this.physics.createCircle({ x, y }, random(minSize, maxSize));

        ++this.circles;
        break;

      case 1:
        body = this.physics.createEllipse(
          { x, y },
          random(minSize, maxSize),
          random(minSize, maxSize),
          2,
          { padding }
        );

        ++this.ellipses;
        break;

      case 2:
        body = this.physics.createBox(
          { x, y },
          random(minSize, maxSize),
          random(minSize, maxSize),
          { center, padding }
        );

        ++this.boxes;
        break;

      case 3:
        body = this.physics.createLine(
          { x, y },
          {
            x: x + random(minSize, maxSize),
            y: y + random(minSize, maxSize),
          },
          { center, padding }
        );

        ++this.lines;
        break;

      default:
        body = this.physics.createPolygon(
          { x, y },
          [
            { x: -random(minSize, maxSize), y: -random(minSize, maxSize) },
            { x: random(minSize, maxSize), y: -random(minSize, maxSize) },
            { x: random(minSize, maxSize), y: random(minSize, maxSize) },
            { x: -random(minSize, maxSize), y: random(minSize, maxSize) },
          ],
          { center, padding }
        );

        ++this.polygons;
        break;
    }

    if (body.type !== "Circle") {
      // set initial rotation angle direction
      body.rotationSpeed = (Math.random() - Math.random()) * 0.1;
      body.rotationAngle = (random(0, 360) * Math.PI) / 180;
      body.setAngle(body.rotationAngle);
    }

    body.directionX = Math.cos(direction);
    body.directionY = Math.sin(direction);

    this.bodies.push(body);
  }
}

module.exports = Stress;


/***/ }),

/***/ "./src/demo/tank.js":
/*!**************************!*\
  !*** ./src/demo/tank.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { System } = __webpack_require__(/*! ../../dist */ "./dist/index.js");
const { width, height, loop } = __webpack_require__(/*! ./canvas */ "./src/demo/canvas.js");

class Tank {
  constructor() {
    this.physics = new System();
    this.bodies = [];
    this.player = this.createPlayer(400, 300);

    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;

    this.legend = `<div><b>W, S</b> - Accelerate/Decelerate</div>
    <div><b>A, D</b> - Turn</div>`;

    const updateKeys = ({ type, key }) => {
      const keyDown = type === "keydown";
      const keyLowerCase = key.toLowerCase();

      keyLowerCase === "w" && (this.up = keyDown);
      keyLowerCase === "s" && (this.down = keyDown);
      keyLowerCase === "a" && (this.left = keyDown);
      keyLowerCase === "d" && (this.right = keyDown);
    };

    document.addEventListener("keydown", updateKeys);
    document.addEventListener("keyup", updateKeys);

    if (this.canvas instanceof Node) {
      this.element.appendChild(this.canvas);
    }

    this.createMap();

    const start = loop((fps) => this.update(fps));

    start();
  }

  update() {
    this.handleInput();
    this.processGameLogic();
    this.handleCollisions();
    this.updateTurret();
  }

  handleInput() {
    this.up && (this.player.velocity += 0.1);
    this.down && (this.player.velocity -= 0.1);

    if (this.left) {
      this.player.setAngle(this.player.angle - 0.04);
    }

    if (this.right) {
      this.player.setAngle(this.player.angle + 0.04);
    }
  }

  processGameLogic() {
    const x = Math.cos(this.player.angle);
    const y = Math.sin(this.player.angle);

    if (this.player.velocity > 0) {
      this.player.velocity -= 0.05;

      if (this.player.velocity > 3) {
        this.player.velocity = 3;
      }
    } else if (this.player.velocity < 0) {
      this.player.velocity += 0.05;

      if (this.player.velocity < -2) {
        this.player.velocity = -2;
      }
    }

    if (!Math.round(this.player.velocity * 100)) {
      this.player.velocity = 0;
    }

    if (this.player.velocity) {
      this.player.pos.x += x * this.player.velocity;
      this.player.pos.y += y * this.player.velocity;
    }
  }

  handleCollisions() {
    this.physics.update();
    this.physics.checkAll(({ a, b, overlapV }) => {
      if (a === this.playerTurret || b === this.playerTurret) {
        return;
      }

      if (a.type === "Circle" || a === this.player) {
        a.setPosition(a.pos.x - overlapV.x, a.pos.y - overlapV.y);
      }

      if (b.type === "Circle" || b === this.player) {
        b.setPosition(b.pos.x + overlapV.x, b.pos.y + overlapV.y);
      }

      if (a === this.player) {
        a.velocity *= 0.9;
      }
    });
  }

  updateTurret() {
    this.playerTurret.setPosition(this.player.x, this.player.y);
    this.playerTurret.setAngle(this.player.angle);
    this.playerTurret.updateAABB();

    const hit = this.physics.raycast(
      this.playerTurret.start,
      this.playerTurret.end,
      (test) => test !== this.player
    );

    this.drawCallback = () => {
      if (hit) {
        this.context.strokeStyle = "#FF0000";
        this.context.beginPath();
        this.context.arc(hit.point.x, hit.point.y, 5, 0, 2 * Math.PI);
        this.context.stroke();
      }
    };
  }

  createPlayer(x, y, size = 13) {
    const player = this.physics.createBox(
      { x: this.scaleX(x), y: this.scaleY(y) },
      this.scaleX(2.6 * size),
      this.scaleX(1.3 * size),
      { angle: 0.2, center: true }
    );

    player.velocity = 0;

    this.playerTurret = this.physics.createLine(
      player,
      { x: player.x + this.scaleX(70), y: player.y },
      { angle: 0.2, isTrigger: true }
    );

    this.playerTurret.translate(this.scaleX(17), 0);

    return player;
  }

  scaleX(x) {
    return (x / 800) * width;
  }

  scaleY(y) {
    return (y / 600) * height;
  }

  createCircle(x, y, radius) {
    this.physics.createCircle(
      { x: this.scaleX(x), y: this.scaleY(y) },
      this.scaleX(radius)
    );
  }

  createEllipse(x, y, radiusX, radiusY, step, angle) {
    this.physics.createEllipse(
      { x: this.scaleX(x), y: this.scaleY(y) },
      this.scaleX(radiusX),
      this.scaleY(radiusY),
      step,
      { angle }
    );
  }

  createPolygon(x, y, points, angle) {
    const scaledPoints = points.map(([pointX, pointY]) => ({
      x: this.scaleX(pointX),
      y: this.scaleY(pointY),
    }));

    return this.physics.createPolygon(
      { x: this.scaleX(x), y: this.scaleY(y) },
      scaledPoints,
      { angle }
    );
  }

  createMap(width = 800, height = 600) {
    // World bounds
    // World bounds
    this.createPolygon(0, 0, [
      [0, 0],
      [width, 0],
    ]);
    this.createPolygon(0, 0, [
      [width, 0],
      [width, height],
    ]);
    this.createPolygon(0, 0, [
      [width, height],
      [0, height],
    ]);
    this.createPolygon(0, 0, [
      [0, height],
      [0, 0],
    ]);

    // Factory
    this.createPolygon(
      100,
      100,
      [
        [-50, -50],
        [50, -50],
        [50, 50],
        [-50, 50],
      ],
      0.4
    );
    this.createPolygon(
      190,
      105,
      [
        [-20, -20],
        [20, -20],
        [20, 20],
        [-20, 20],
      ],
      0.4
    );
    this.createCircle(170, 140, 6);
    this.createCircle(185, 155, 6);
    this.createCircle(165, 165, 6);
    this.createCircle(145, 165, 6);

    // Airstrip
    this.createPolygon(
      230,
      50,
      [
        [-150, -30],
        [150, -30],
        [150, 30],
        [-150, 30],
      ],
      0.4
    );

    // HQ
    this.createPolygon(
      100,
      500,
      [
        [-40, -50],
        [40, -50],
        [50, 50],
        [-50, 50],
      ],
      0.2
    );
    this.createCircle(180, 490, 12);
    this.createCircle(175, 540, 12);

    // Barracks
    this.createPolygon(
      400,
      500,
      [
        [-60, -20],
        [60, -20],
        [60, 20],
        [-60, 20],
      ],
      1.7
    );
    this.createPolygon(
      350,
      494,
      [
        [-60, -20],
        [60, -20],
        [60, 20],
        [-60, 20],
      ],
      1.7
    );

    // Mountains
    this.createPolygon(750, 0, [
      [0, 0],
      [-20, 100],
    ]);
    this.createPolygon(750, 0, [
      [-20, 100],
      [30, 250],
    ]);
    this.createPolygon(750, 0, [
      [30, 250],
      [20, 300],
    ]);
    this.createPolygon(750, 0, [
      [20, 300],
      [-50, 320],
    ]);
    this.createPolygon(750, 0, [
      [-50, 320],
      [-90, 500],
    ]);
    this.createPolygon(750, 0, [
      [-90, 500],
      [-200, 600],
    ]);

    // Lake
    this.createEllipse(530, 130, 80, 70, 10, -0.2);
  }
}

module.exports = Tank;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/demo/index.js ***!
  \***************************/
const { TestCanvas } = __webpack_require__(/*! ./canvas */ "./src/demo/canvas.js");

const isStressTest = window.location.search.indexOf("?stress") !== -1;
const Test = isStressTest ? __webpack_require__(/*! ./stress */ "./src/demo/stress.js") : __webpack_require__(/*! ./tank */ "./src/demo/tank.js");

const test = new Test();
const canvas = new TestCanvas(test);

document.body.appendChild(canvas.element);

})();

/******/ })()
;