/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/bodies/box.js":
/*!****************************!*\
  !*** ./dist/bodies/box.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true,\n}));\nexports.Box = void 0;\n\n__webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ \"./node_modules/core-js/modules/web.dom-collections.iterator.js\");\n\nvar _sat = _interopRequireDefault(__webpack_require__(/*! sat */ \"./node_modules/sat/SAT.js\"));\n\nvar _model = __webpack_require__(/*! ../model */ \"./dist/model.js\");\n\nvar _utils = __webpack_require__(/*! ../utils */ \"./dist/utils.js\");\n\nvar _polygon = __webpack_require__(/*! ./polygon */ \"./dist/bodies/polygon.js\");\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : { default: obj };\n}\n\n/**\n * collider - box\n */\nclass Box extends _sat.default.Polygon {\n  /**\n   * collider - box\n   * @param {Vector} position {x, y}\n   * @param {number} width\n   * @param {number} height\n   */\n  constructor(position, width, height) {\n    super(\n      (0, _utils.ensureVectorPoint)(position),\n      (0, _utils.createBox)(width, height)\n    );\n    this.type = _model.Types.Box;\n    this.updateAABB();\n  }\n  /**\n   * Updates Bounding Box of collider\n   */\n\n  updateAABB() {\n    const [topLeft, _, topRight] = this.calcPoints;\n    this.minX = this.pos.x + topLeft.x;\n    this.minY = this.pos.y + topLeft.y;\n    this.maxX = this.pos.x + topRight.x;\n    this.maxY = this.pos.y + topRight.y;\n  }\n  /**\n   * Draws collider on a CanvasRenderingContext2D's current path\n   * @param {CanvasRenderingContext2D} context The canvas context to draw on\n   */\n\n  draw(context) {\n    _polygon.Polygon.prototype.draw.call(this, context);\n  }\n}\n\nexports.Box = Box;\n\n\n//# sourceURL=webpack://detect-collisions/./dist/bodies/box.js?");

/***/ }),

/***/ "./dist/bodies/circle.js":
/*!*******************************!*\
  !*** ./dist/bodies/circle.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true,\n}));\nexports.Circle = void 0;\n\nvar _sat = _interopRequireDefault(__webpack_require__(/*! sat */ \"./node_modules/sat/SAT.js\"));\n\nvar _model = __webpack_require__(/*! ../model */ \"./dist/model.js\");\n\nvar _utils = __webpack_require__(/*! ../utils */ \"./dist/utils.js\");\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : { default: obj };\n}\n\n/**\n * collider - circle\n */\nclass Circle extends _sat.default.Circle {\n  /**\n   * collider - circle\n   * @param {Vector} position {x, y}\n   * @param {number} radius\n   */\n  constructor(position, radius) {\n    super((0, _utils.ensureVectorPoint)(position), radius);\n    this.type = _model.Types.Circle;\n    this.updateAABB();\n  }\n  /**\n   * Updates Bounding Box of collider\n   */\n\n  updateAABB() {\n    this.minX = this.pos.x - this.r;\n    this.minY = this.pos.y - this.r;\n    this.maxX = this.pos.x + this.r;\n    this.maxY = this.pos.y + this.r;\n  }\n  /**\n   * Draws collider on a CanvasRenderingContext2D's current path\n   * @param {CanvasRenderingContext2D} context The canvas context to draw on\n   */\n\n  draw(context) {\n    const x = this.pos.x;\n    const y = this.pos.y;\n    const radius = this.r;\n    context.moveTo(x + radius, y);\n    context.arc(x, y, radius, 0, Math.PI * 2);\n  }\n}\n\nexports.Circle = Circle;\n\n\n//# sourceURL=webpack://detect-collisions/./dist/bodies/circle.js?");

/***/ }),

/***/ "./dist/bodies/point.js":
/*!******************************!*\
  !*** ./dist/bodies/point.js ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true,\n}));\nexports.Point = void 0;\n\nvar _sat = _interopRequireDefault(__webpack_require__(/*! sat */ \"./node_modules/sat/SAT.js\"));\n\nvar _box = __webpack_require__(/*! ./box */ \"./dist/bodies/box.js\");\n\nvar _model = __webpack_require__(/*! ../model */ \"./dist/model.js\");\n\nvar _utils = __webpack_require__(/*! ../utils */ \"./dist/utils.js\");\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : { default: obj };\n}\n\n/**\n * collider - point (very tiny box)\n */\nclass Point extends _sat.default.Polygon {\n  /**\n   * collider - point (very tiny box)\n   * @param {Vector} position {x, y}\n   */\n  constructor(position) {\n    super(\n      (0, _utils.ensureVectorPoint)(position),\n      (0, _utils.createBox)(0.1, 0.1)\n    );\n    this.type = _model.Types.Point;\n    this.updateAABB();\n  }\n  /**\n   * Updates Bounding Box of collider\n   */\n\n  updateAABB() {\n    _box.Box.prototype.updateAABB.call(this);\n  }\n  /**\n   * Draws collider on a CanvasRenderingContext2D's current path\n   * @param {CanvasRenderingContext2D} context The canvas context to draw on\n   */\n\n  draw(context) {\n    _box.Box.prototype.draw.call(this, context);\n  }\n}\n\nexports.Point = Point;\n\n\n//# sourceURL=webpack://detect-collisions/./dist/bodies/point.js?");

/***/ }),

/***/ "./dist/bodies/polygon.js":
/*!********************************!*\
  !*** ./dist/bodies/polygon.js ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true,\n}));\nexports.Polygon = void 0;\n\nvar _sat = _interopRequireDefault(__webpack_require__(/*! sat */ \"./node_modules/sat/SAT.js\"));\n\nvar _model = __webpack_require__(/*! ../model */ \"./dist/model.js\");\n\nvar _utils = __webpack_require__(/*! ../utils */ \"./dist/utils.js\");\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : { default: obj };\n}\n\n/**\n * collider - polygon\n */\nclass Polygon extends _sat.default.Polygon {\n  /**\n   * collider - polygon\n   * @param {Vector} position {x, y}\n   * @param {Vector[]} points\n   */\n  constructor(position, points) {\n    super(\n      (0, _utils.ensureVectorPoint)(position),\n      (0, _utils.ensurePolygonPoints)(points)\n    );\n    this.type = _model.Types.Polygon;\n    this.updateAABB();\n  }\n  /**\n   * Updates Bounding Box of collider\n   */\n\n  updateAABB() {\n    const { pos, w, h } = this.getAABBAsBox();\n    this.minX = pos.x;\n    this.minY = pos.y;\n    this.maxX = pos.x + w;\n    this.maxY = pos.y + h;\n  }\n  /**\n   * Draws collider on a CanvasRenderingContext2D's current path\n   * @param {CanvasRenderingContext2D} context The canvas context to draw on\n   */\n\n  draw(context) {\n    this.calcPoints.forEach((point, index) => {\n      const posX = this.pos.x + point.x;\n      const posY = this.pos.y + point.y;\n\n      if (!index) {\n        if (this.calcPoints.length === 1) {\n          context.arc(posX, posY, 1, 0, Math.PI * 2);\n        } else {\n          context.moveTo(posX, posY);\n        }\n      } else {\n        context.lineTo(posX, posY);\n      }\n    });\n\n    if (this.calcPoints.length > 2) {\n      context.lineTo(\n        this.pos.x + this.calcPoints[0].x,\n        this.pos.y + this.calcPoints[0].y\n      );\n    }\n  }\n}\n\nexports.Polygon = Polygon;\n\n\n//# sourceURL=webpack://detect-collisions/./dist/bodies/polygon.js?");

/***/ }),

/***/ "./dist/index.js":
/*!***********************!*\
  !*** ./dist/index.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true,\n}));\n\nvar _model = __webpack_require__(/*! ./model */ \"./dist/model.js\");\n\nObject.keys(_model).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (key in exports && exports[key] === _model[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function get() {\n      return _model[key];\n    },\n  });\n});\n\nvar _circle = __webpack_require__(/*! ./bodies/circle */ \"./dist/bodies/circle.js\");\n\nObject.keys(_circle).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (key in exports && exports[key] === _circle[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function get() {\n      return _circle[key];\n    },\n  });\n});\n\nvar _polygon = __webpack_require__(/*! ./bodies/polygon */ \"./dist/bodies/polygon.js\");\n\nObject.keys(_polygon).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (key in exports && exports[key] === _polygon[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function get() {\n      return _polygon[key];\n    },\n  });\n});\n\nvar _box = __webpack_require__(/*! ./bodies/box */ \"./dist/bodies/box.js\");\n\nObject.keys(_box).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (key in exports && exports[key] === _box[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function get() {\n      return _box[key];\n    },\n  });\n});\n\nvar _point = __webpack_require__(/*! ./bodies/point */ \"./dist/bodies/point.js\");\n\nObject.keys(_point).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (key in exports && exports[key] === _point[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function get() {\n      return _point[key];\n    },\n  });\n});\n\nvar _system = __webpack_require__(/*! ./system */ \"./dist/system.js\");\n\nObject.keys(_system).forEach(function (key) {\n  if (key === \"default\" || key === \"__esModule\") return;\n  if (key in exports && exports[key] === _system[key]) return;\n  Object.defineProperty(exports, key, {\n    enumerable: true,\n    get: function get() {\n      return _system[key];\n    },\n  });\n});\n\n\n//# sourceURL=webpack://detect-collisions/./dist/index.js?");

/***/ }),

/***/ "./dist/model.js":
/*!***********************!*\
  !*** ./dist/model.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true,\n}));\nObject.defineProperty(exports, \"Response\", ({\n  enumerable: true,\n  get: function get() {\n    return _sat.Response;\n  },\n}));\nexports.Types = void 0;\n\nvar _sat = __webpack_require__(/*! sat */ \"./node_modules/sat/SAT.js\");\n\n/**\n * types\n */\nvar Types;\nexports.Types = Types;\n\n(function (Types) {\n  Types[\"Circle\"] = \"Circle\";\n  Types[\"Box\"] = \"Box\";\n  Types[\"Point\"] = \"Point\";\n  Types[\"Polygon\"] = \"Polygon\";\n})(Types || (exports.Types = Types = {}));\n\n\n//# sourceURL=webpack://detect-collisions/./dist/model.js?");

/***/ }),

/***/ "./dist/system.js":
/*!************************!*\
  !*** ./dist/system.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true,\n}));\nexports.System = void 0;\n\n__webpack_require__(/*! core-js/modules/es.regexp.exec.js */ \"./node_modules/core-js/modules/es.regexp.exec.js\");\n\n__webpack_require__(/*! core-js/modules/es.string.search.js */ \"./node_modules/core-js/modules/es.string.search.js\");\n\nvar _sat = _interopRequireDefault(__webpack_require__(/*! sat */ \"./node_modules/sat/SAT.js\"));\n\nvar _rbush = _interopRequireDefault(__webpack_require__(/*! rbush */ \"./node_modules/rbush/rbush.min.js\"));\n\nvar _model = __webpack_require__(/*! ./model */ \"./dist/model.js\");\n\nvar _box = __webpack_require__(/*! ./bodies/box */ \"./dist/bodies/box.js\");\n\nvar _circle = __webpack_require__(/*! ./bodies/circle */ \"./dist/bodies/circle.js\");\n\nvar _polygon = __webpack_require__(/*! ./bodies/polygon */ \"./dist/bodies/polygon.js\");\n\nvar _point = __webpack_require__(/*! ./bodies/point */ \"./dist/bodies/point.js\");\n\nvar _utils = __webpack_require__(/*! ./utils */ \"./dist/utils.js\");\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : { default: obj };\n}\n\n/**\n * collision system\n */\nclass System {\n  constructor() {\n    this.response = new _sat.default.Response();\n    this.tree = new _rbush.default();\n  }\n  /**\n   * getter for all tree bodies\n   */\n\n  get bodies() {\n    return this.tree.all();\n  }\n  /**\n   * draw bodies\n   * @param {CanvasRenderingContext2D} context\n   */\n\n  draw(context) {\n    this.bodies.forEach((body) => {\n      body.draw(context);\n    });\n  }\n  /**\n   * draw hierarchy\n   * @param {CanvasRenderingContext2D} context\n   */\n\n  drawBVH(context) {\n    this.tree.data.children.forEach((_ref) => {\n      let { minX, maxX, minY, maxY, children } = _ref;\n\n      _polygon.Polygon.prototype.draw.call(\n        {\n          pos: {\n            x: minX,\n            y: minY,\n          },\n          calcPoints: (0, _utils.createBox)(maxX - minX, maxY - minY),\n        },\n        context\n      );\n    });\n    this.bodies.forEach((body) => {\n      const { pos, w, h } = body.getAABBAsBox();\n\n      _polygon.Polygon.prototype.draw.call(\n        {\n          pos,\n          calcPoints: (0, _utils.createBox)(w, h),\n        },\n        context\n      );\n    });\n  }\n  /**\n   * update body aabb and in tree\n   * @param {object} body\n   */\n\n  updateBody(body) {\n    this.tree.remove(body);\n    body.updateAABB();\n    this.tree.insert(body);\n  }\n  /**\n   * update all bodies aabb\n   */\n\n  update() {\n    this.bodies.forEach((body) => {\n      this.updateBody(body);\n    });\n  }\n  /**\n   * separate (move away) colliders\n   */\n\n  separate() {\n    this.checkAll((response) => {\n      response.a.pos.x -= response.overlapV.x;\n      response.a.pos.y -= response.overlapV.y;\n      this.updateBody(response.a);\n    });\n  }\n  /**\n   * check one collider collisions with callback\n   * @param {function} callback\n   */\n\n  checkOne(body, callback) {\n    this.getPotentials(body).forEach((candidate) => {\n      if (this.collides(body, candidate)) {\n        callback(this.response);\n      }\n    });\n  }\n  /**\n   * check all colliders collisions with callback\n   * @param {function} callback\n   */\n\n  checkAll(callback) {\n    this.bodies.forEach((body) => {\n      this.checkOne(body, callback);\n    });\n  }\n  /**\n   * get object potential colliders\n   * @param {object} collider\n   */\n\n  getPotentials(body) {\n    // filter here is required as collides with self\n    return this.tree.search(body).filter((candidate) => candidate !== body);\n  }\n  /**\n   * check do 2 objects collide\n   * @param {object} collider\n   * @param {object} candidate\n   */\n\n  collides(body, candidate) {\n    this.response.clear();\n\n    if (\n      body.type === _model.Types.Circle &&\n      candidate.type === _model.Types.Circle\n    ) {\n      return _sat.default.testCircleCircle(body, candidate, this.response);\n    }\n\n    if (\n      body.type === _model.Types.Circle &&\n      candidate.type !== _model.Types.Circle\n    ) {\n      return _sat.default.testCirclePolygon(body, candidate, this.response);\n    }\n\n    if (\n      body.type !== _model.Types.Circle &&\n      candidate.type === _model.Types.Circle\n    ) {\n      return _sat.default.testPolygonCircle(body, candidate, this.response);\n    }\n\n    if (\n      body.type !== _model.Types.Circle &&\n      candidate.type !== _model.Types.Circle\n    ) {\n      return _sat.default.testPolygonPolygon(body, candidate, this.response);\n    }\n  }\n  /**\n   * create point\n   * @param {Vector} position {x, y}\n   */\n\n  createPoint(position) {\n    const point = new _point.Point(position);\n    this.tree.insert(point);\n    return point;\n  }\n  /**\n   * create circle\n   * @param {Vector} position {x, y}\n   * @param {number} radius\n   */\n\n  createCircle(position, radius) {\n    const circle = new _circle.Circle(position, radius);\n    this.tree.insert(circle);\n    return circle;\n  }\n  /**\n   * create box\n   * @param {Vector} position {x, y}\n   * @param {number} width\n   * @param {number} height\n   * @param {number} angle\n   */\n\n  createBox(position, width, height) {\n    let angle =\n      arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;\n    const box = new _box.Box(position, width, height);\n    box.setAngle(angle);\n    this.tree.insert(box);\n    return box;\n  }\n  /**\n   * create polygon\n   * @param {Vector} position {x, y}\n   * @param {Vector[]} points\n   * @param {number} angle\n   */\n\n  createPolygon(position, points) {\n    let angle =\n      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;\n    const polygon = new _polygon.Polygon(position, points);\n    polygon.setAngle(angle);\n    this.tree.insert(polygon);\n    return polygon;\n  }\n}\n\nexports.System = System;\n\n\n//# sourceURL=webpack://detect-collisions/./dist/system.js?");

/***/ }),

/***/ "./dist/utils.js":
/*!***********************!*\
  !*** ./dist/utils.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", ({\n  value: true,\n}));\nexports.clockwise = clockwise;\nexports.createBox = createBox;\nexports.ensurePolygonPoints = ensurePolygonPoints;\nexports.ensureVectorPoint = ensureVectorPoint;\n\n__webpack_require__(/*! core-js/modules/es.array.reverse.js */ \"./node_modules/core-js/modules/es.array.reverse.js\");\n\nvar _sat = _interopRequireDefault(__webpack_require__(/*! sat */ \"./node_modules/sat/SAT.js\"));\n\nfunction _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : { default: obj };\n}\n\n/**\n * creates box polygon points\n * @param {number} width\n * @param {number} height\n * @returns SAT.Vector\n */\nfunction createBox(width, height) {\n  return [\n    new _sat.default.Vector(),\n    new _sat.default.Vector(width, 0),\n    new _sat.default.Vector(width, height),\n    new _sat.default.Vector(0, height),\n  ];\n}\n/**\n * ensure returns a SAT.Vector\n * @param {SAT.Vector} point\n */\n\nfunction ensureVectorPoint(point) {\n  return point instanceof _sat.default.Vector\n    ? point\n    : new _sat.default.Vector(point.x, point.y);\n}\n/**\n * ensure correct counterclockwise points\n * @param {SAT.Vector[]} points\n */\n\nfunction ensurePolygonPoints(points) {\n  return (clockwise(points) ? points.reverse() : points).map(ensureVectorPoint);\n}\n/**\n * check direction of polygon\n * @param {SAT.Vector[]} points\n */\n\nfunction clockwise(points) {\n  let sum = 0;\n\n  for (let i = 0; i < points.length; i++) {\n    const v1 = points[i];\n    const v2 = points[(i + 1) % points.length];\n    sum += (v2.x - v1.x) * (v2.y + v1.y);\n  }\n\n  return sum > 0;\n}\n\n\n//# sourceURL=webpack://detect-collisions/./dist/utils.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/a-callable.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-callable.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\nvar tryToString = __webpack_require__(/*! ../internals/try-to-string */ \"./node_modules/core-js/internals/try-to-string.js\");\n\nvar TypeError = global.TypeError;\n\n// `Assert: IsCallable(argument) is true`\nmodule.exports = function (argument) {\n  if (isCallable(argument)) return argument;\n  throw TypeError(tryToString(argument) + ' is not a function');\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/a-callable.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/a-possible-prototype.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/a-possible-prototype.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\n\nvar String = global.String;\nvar TypeError = global.TypeError;\n\nmodule.exports = function (argument) {\n  if (typeof argument == 'object' || isCallable(argument)) return argument;\n  throw TypeError(\"Can't set \" + String(argument) + ' as a prototype');\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/a-possible-prototype.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/add-to-unscopables.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/add-to-unscopables.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ \"./node_modules/core-js/internals/well-known-symbol.js\");\nvar create = __webpack_require__(/*! ../internals/object-create */ \"./node_modules/core-js/internals/object-create.js\");\nvar definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ \"./node_modules/core-js/internals/object-define-property.js\");\n\nvar UNSCOPABLES = wellKnownSymbol('unscopables');\nvar ArrayPrototype = Array.prototype;\n\n// Array.prototype[@@unscopables]\n// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables\nif (ArrayPrototype[UNSCOPABLES] == undefined) {\n  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {\n    configurable: true,\n    value: create(null)\n  });\n}\n\n// add a key to Array.prototype[@@unscopables]\nmodule.exports = function (key) {\n  ArrayPrototype[UNSCOPABLES][key] = true;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/add-to-unscopables.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/an-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar isObject = __webpack_require__(/*! ../internals/is-object */ \"./node_modules/core-js/internals/is-object.js\");\n\nvar String = global.String;\nvar TypeError = global.TypeError;\n\n// `Assert: Type(argument) is Object`\nmodule.exports = function (argument) {\n  if (isObject(argument)) return argument;\n  throw TypeError(String(argument) + ' is not an object');\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/an-object.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/array-includes.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-includes.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ \"./node_modules/core-js/internals/to-indexed-object.js\");\nvar toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ \"./node_modules/core-js/internals/to-absolute-index.js\");\nvar lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ \"./node_modules/core-js/internals/length-of-array-like.js\");\n\n// `Array.prototype.{ indexOf, includes }` methods implementation\nvar createMethod = function (IS_INCLUDES) {\n  return function ($this, el, fromIndex) {\n    var O = toIndexedObject($this);\n    var length = lengthOfArrayLike(O);\n    var index = toAbsoluteIndex(fromIndex, length);\n    var value;\n    // Array#includes uses SameValueZero equality algorithm\n    // eslint-disable-next-line no-self-compare -- NaN check\n    if (IS_INCLUDES && el != el) while (length > index) {\n      value = O[index++];\n      // eslint-disable-next-line no-self-compare -- NaN check\n      if (value != value) return true;\n    // Array#indexOf ignores holes, Array#includes - not\n    } else for (;length > index; index++) {\n      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;\n    } return !IS_INCLUDES && -1;\n  };\n};\n\nmodule.exports = {\n  // `Array.prototype.includes` method\n  // https://tc39.es/ecma262/#sec-array.prototype.includes\n  includes: createMethod(true),\n  // `Array.prototype.indexOf` method\n  // https://tc39.es/ecma262/#sec-array.prototype.indexof\n  indexOf: createMethod(false)\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/array-includes.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/classof-raw.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\n\nvar toString = uncurryThis({}.toString);\nvar stringSlice = uncurryThis(''.slice);\n\nmodule.exports = function (it) {\n  return stringSlice(toString(it), 8, -1);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/classof-raw.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/classof.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ \"./node_modules/core-js/internals/to-string-tag-support.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\nvar classofRaw = __webpack_require__(/*! ../internals/classof-raw */ \"./node_modules/core-js/internals/classof-raw.js\");\nvar wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ \"./node_modules/core-js/internals/well-known-symbol.js\");\n\nvar TO_STRING_TAG = wellKnownSymbol('toStringTag');\nvar Object = global.Object;\n\n// ES3 wrong here\nvar CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';\n\n// fallback for IE11 Script Access Denied error\nvar tryGet = function (it, key) {\n  try {\n    return it[key];\n  } catch (error) { /* empty */ }\n};\n\n// getting tag from ES6+ `Object.prototype.toString`\nmodule.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {\n  var O, tag, result;\n  return it === undefined ? 'Undefined' : it === null ? 'Null'\n    // @@toStringTag case\n    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag\n    // builtinTag case\n    : CORRECT_ARGUMENTS ? classofRaw(O)\n    // ES3 arguments fallback\n    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/classof.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/copy-constructor-properties.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ \"./node_modules/core-js/internals/has-own-property.js\");\nvar ownKeys = __webpack_require__(/*! ../internals/own-keys */ \"./node_modules/core-js/internals/own-keys.js\");\nvar getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ \"./node_modules/core-js/internals/object-get-own-property-descriptor.js\");\nvar definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ \"./node_modules/core-js/internals/object-define-property.js\");\n\nmodule.exports = function (target, source) {\n  var keys = ownKeys(source);\n  var defineProperty = definePropertyModule.f;\n  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;\n  for (var i = 0; i < keys.length; i++) {\n    var key = keys[i];\n    if (!hasOwn(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));\n  }\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/copy-constructor-properties.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/correct-prototype-getter.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/correct-prototype-getter.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\n\nmodule.exports = !fails(function () {\n  function F() { /* empty */ }\n  F.prototype.constructor = null;\n  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing\n  return Object.getPrototypeOf(new F()) !== F.prototype;\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/correct-prototype-getter.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/create-iterator-constructor.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-iterator-constructor.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\nvar IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ \"./node_modules/core-js/internals/iterators-core.js\").IteratorPrototype);\nvar create = __webpack_require__(/*! ../internals/object-create */ \"./node_modules/core-js/internals/object-create.js\");\nvar createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ \"./node_modules/core-js/internals/create-property-descriptor.js\");\nvar setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ \"./node_modules/core-js/internals/set-to-string-tag.js\");\nvar Iterators = __webpack_require__(/*! ../internals/iterators */ \"./node_modules/core-js/internals/iterators.js\");\n\nvar returnThis = function () { return this; };\n\nmodule.exports = function (IteratorConstructor, NAME, next) {\n  var TO_STRING_TAG = NAME + ' Iterator';\n  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });\n  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);\n  Iterators[TO_STRING_TAG] = returnThis;\n  return IteratorConstructor;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/create-iterator-constructor.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/create-non-enumerable-property.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/create-non-enumerable-property.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ \"./node_modules/core-js/internals/descriptors.js\");\nvar definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ \"./node_modules/core-js/internals/object-define-property.js\");\nvar createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ \"./node_modules/core-js/internals/create-property-descriptor.js\");\n\nmodule.exports = DESCRIPTORS ? function (object, key, value) {\n  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));\n} : function (object, key, value) {\n  object[key] = value;\n  return object;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/create-non-enumerable-property.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/create-property-descriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
/***/ ((module) => {

eval("module.exports = function (bitmap, value) {\n  return {\n    enumerable: !(bitmap & 1),\n    configurable: !(bitmap & 2),\n    writable: !(bitmap & 4),\n    value: value\n  };\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/create-property-descriptor.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/define-iterator.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-iterator.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\nvar $ = __webpack_require__(/*! ../internals/export */ \"./node_modules/core-js/internals/export.js\");\nvar call = __webpack_require__(/*! ../internals/function-call */ \"./node_modules/core-js/internals/function-call.js\");\nvar IS_PURE = __webpack_require__(/*! ../internals/is-pure */ \"./node_modules/core-js/internals/is-pure.js\");\nvar FunctionName = __webpack_require__(/*! ../internals/function-name */ \"./node_modules/core-js/internals/function-name.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\nvar createIteratorConstructor = __webpack_require__(/*! ../internals/create-iterator-constructor */ \"./node_modules/core-js/internals/create-iterator-constructor.js\");\nvar getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ \"./node_modules/core-js/internals/object-get-prototype-of.js\");\nvar setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ \"./node_modules/core-js/internals/object-set-prototype-of.js\");\nvar setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ \"./node_modules/core-js/internals/set-to-string-tag.js\");\nvar createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ \"./node_modules/core-js/internals/create-non-enumerable-property.js\");\nvar redefine = __webpack_require__(/*! ../internals/redefine */ \"./node_modules/core-js/internals/redefine.js\");\nvar wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ \"./node_modules/core-js/internals/well-known-symbol.js\");\nvar Iterators = __webpack_require__(/*! ../internals/iterators */ \"./node_modules/core-js/internals/iterators.js\");\nvar IteratorsCore = __webpack_require__(/*! ../internals/iterators-core */ \"./node_modules/core-js/internals/iterators-core.js\");\n\nvar PROPER_FUNCTION_NAME = FunctionName.PROPER;\nvar CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;\nvar IteratorPrototype = IteratorsCore.IteratorPrototype;\nvar BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;\nvar ITERATOR = wellKnownSymbol('iterator');\nvar KEYS = 'keys';\nvar VALUES = 'values';\nvar ENTRIES = 'entries';\n\nvar returnThis = function () { return this; };\n\nmodule.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {\n  createIteratorConstructor(IteratorConstructor, NAME, next);\n\n  var getIterationMethod = function (KIND) {\n    if (KIND === DEFAULT && defaultIterator) return defaultIterator;\n    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];\n    switch (KIND) {\n      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };\n      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };\n      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };\n    } return function () { return new IteratorConstructor(this); };\n  };\n\n  var TO_STRING_TAG = NAME + ' Iterator';\n  var INCORRECT_VALUES_NAME = false;\n  var IterablePrototype = Iterable.prototype;\n  var nativeIterator = IterablePrototype[ITERATOR]\n    || IterablePrototype['@@iterator']\n    || DEFAULT && IterablePrototype[DEFAULT];\n  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);\n  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;\n  var CurrentIteratorPrototype, methods, KEY;\n\n  // fix native\n  if (anyNativeIterator) {\n    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));\n    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {\n      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {\n        if (setPrototypeOf) {\n          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);\n        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {\n          redefine(CurrentIteratorPrototype, ITERATOR, returnThis);\n        }\n      }\n      // Set @@toStringTag to native iterators\n      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);\n      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;\n    }\n  }\n\n  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF\n  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {\n    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {\n      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);\n    } else {\n      INCORRECT_VALUES_NAME = true;\n      defaultIterator = function values() { return call(nativeIterator, this); };\n    }\n  }\n\n  // export additional methods\n  if (DEFAULT) {\n    methods = {\n      values: getIterationMethod(VALUES),\n      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),\n      entries: getIterationMethod(ENTRIES)\n    };\n    if (FORCED) for (KEY in methods) {\n      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {\n        redefine(IterablePrototype, KEY, methods[KEY]);\n      }\n    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);\n  }\n\n  // define iterator\n  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {\n    redefine(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });\n  }\n  Iterators[NAME] = defaultIterator;\n\n  return methods;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/define-iterator.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/descriptors.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\n\n// Detect IE8's incomplete defineProperty implementation\nmodule.exports = !fails(function () {\n  // eslint-disable-next-line es/no-object-defineproperty -- required for testing\n  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/descriptors.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/document-create-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar isObject = __webpack_require__(/*! ../internals/is-object */ \"./node_modules/core-js/internals/is-object.js\");\n\nvar document = global.document;\n// typeof document.createElement is 'object' in old IE\nvar EXISTS = isObject(document) && isObject(document.createElement);\n\nmodule.exports = function (it) {\n  return EXISTS ? document.createElement(it) : {};\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/document-create-element.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/dom-iterables.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/dom-iterables.js ***!
  \*********************************************************/
/***/ ((module) => {

eval("// iterable DOM collections\n// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods\nmodule.exports = {\n  CSSRuleList: 0,\n  CSSStyleDeclaration: 0,\n  CSSValueList: 0,\n  ClientRectList: 0,\n  DOMRectList: 0,\n  DOMStringList: 0,\n  DOMTokenList: 1,\n  DataTransferItemList: 0,\n  FileList: 0,\n  HTMLAllCollection: 0,\n  HTMLCollection: 0,\n  HTMLFormElement: 0,\n  HTMLSelectElement: 0,\n  MediaList: 0,\n  MimeTypeArray: 0,\n  NamedNodeMap: 0,\n  NodeList: 1,\n  PaintRequestList: 0,\n  Plugin: 0,\n  PluginArray: 0,\n  SVGLengthList: 0,\n  SVGNumberList: 0,\n  SVGPathSegList: 0,\n  SVGPointList: 0,\n  SVGStringList: 0,\n  SVGTransformList: 0,\n  SourceBufferList: 0,\n  StyleSheetList: 0,\n  TextTrackCueList: 0,\n  TextTrackList: 0,\n  TouchList: 0\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/dom-iterables.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/dom-token-list-prototype.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/dom-token-list-prototype.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`\nvar documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ \"./node_modules/core-js/internals/document-create-element.js\");\n\nvar classList = documentCreateElement('span').classList;\nvar DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;\n\nmodule.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/dom-token-list-prototype.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/engine-user-agent.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ \"./node_modules/core-js/internals/get-built-in.js\");\n\nmodule.exports = getBuiltIn('navigator', 'userAgent') || '';\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/engine-user-agent.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/engine-v8-version.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ \"./node_modules/core-js/internals/engine-user-agent.js\");\n\nvar process = global.process;\nvar Deno = global.Deno;\nvar versions = process && process.versions || Deno && Deno.version;\nvar v8 = versions && versions.v8;\nvar match, version;\n\nif (v8) {\n  match = v8.split('.');\n  // in old Chrome, versions of V8 isn't V8 = Chrome / 10\n  // but their correct versions are not interesting for us\n  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);\n}\n\n// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`\n// so check `userAgent` even if `.v8` exists, but 0\nif (!version && userAgent) {\n  match = userAgent.match(/Edge\\/(\\d+)/);\n  if (!match || match[1] >= 74) {\n    match = userAgent.match(/Chrome\\/(\\d+)/);\n    if (match) version = +match[1];\n  }\n}\n\nmodule.exports = version;\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/engine-v8-version.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/enum-bug-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  \*********************************************************/
/***/ ((module) => {

eval("// IE8- don't enum bug keys\nmodule.exports = [\n  'constructor',\n  'hasOwnProperty',\n  'isPrototypeOf',\n  'propertyIsEnumerable',\n  'toLocaleString',\n  'toString',\n  'valueOf'\n];\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/enum-bug-keys.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/export.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/export.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ \"./node_modules/core-js/internals/object-get-own-property-descriptor.js\").f);\nvar createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ \"./node_modules/core-js/internals/create-non-enumerable-property.js\");\nvar redefine = __webpack_require__(/*! ../internals/redefine */ \"./node_modules/core-js/internals/redefine.js\");\nvar setGlobal = __webpack_require__(/*! ../internals/set-global */ \"./node_modules/core-js/internals/set-global.js\");\nvar copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ \"./node_modules/core-js/internals/copy-constructor-properties.js\");\nvar isForced = __webpack_require__(/*! ../internals/is-forced */ \"./node_modules/core-js/internals/is-forced.js\");\n\n/*\n  options.target      - name of the target object\n  options.global      - target is the global object\n  options.stat        - export as static methods of target\n  options.proto       - export as prototype methods of target\n  options.real        - real prototype method for the `pure` version\n  options.forced      - export even if the native feature is available\n  options.bind        - bind methods to the target, required for the `pure` version\n  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version\n  options.unsafe      - use the simple assignment of property instead of delete + defineProperty\n  options.sham        - add a flag to not completely full polyfills\n  options.enumerable  - export as enumerable property\n  options.noTargetGet - prevent calling a getter on target\n  options.name        - the .name of the function if it does not match the key\n*/\nmodule.exports = function (options, source) {\n  var TARGET = options.target;\n  var GLOBAL = options.global;\n  var STATIC = options.stat;\n  var FORCED, target, key, targetProperty, sourceProperty, descriptor;\n  if (GLOBAL) {\n    target = global;\n  } else if (STATIC) {\n    target = global[TARGET] || setGlobal(TARGET, {});\n  } else {\n    target = (global[TARGET] || {}).prototype;\n  }\n  if (target) for (key in source) {\n    sourceProperty = source[key];\n    if (options.noTargetGet) {\n      descriptor = getOwnPropertyDescriptor(target, key);\n      targetProperty = descriptor && descriptor.value;\n    } else targetProperty = target[key];\n    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);\n    // contained in target\n    if (!FORCED && targetProperty !== undefined) {\n      if (typeof sourceProperty == typeof targetProperty) continue;\n      copyConstructorProperties(sourceProperty, targetProperty);\n    }\n    // add a flag to not completely full polyfills\n    if (options.sham || (targetProperty && targetProperty.sham)) {\n      createNonEnumerableProperty(sourceProperty, 'sham', true);\n    }\n    // extend global\n    redefine(target, key, sourceProperty, options);\n  }\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/export.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/fails.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
/***/ ((module) => {

eval("module.exports = function (exec) {\n  try {\n    return !!exec();\n  } catch (error) {\n    return true;\n  }\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/fails.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n// TODO: Remove from `core-js@4` since it's moved to entry points\n__webpack_require__(/*! ../modules/es.regexp.exec */ \"./node_modules/core-js/modules/es.regexp.exec.js\");\nvar uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\nvar redefine = __webpack_require__(/*! ../internals/redefine */ \"./node_modules/core-js/internals/redefine.js\");\nvar regexpExec = __webpack_require__(/*! ../internals/regexp-exec */ \"./node_modules/core-js/internals/regexp-exec.js\");\nvar fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\nvar wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ \"./node_modules/core-js/internals/well-known-symbol.js\");\nvar createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ \"./node_modules/core-js/internals/create-non-enumerable-property.js\");\n\nvar SPECIES = wellKnownSymbol('species');\nvar RegExpPrototype = RegExp.prototype;\n\nmodule.exports = function (KEY, exec, FORCED, SHAM) {\n  var SYMBOL = wellKnownSymbol(KEY);\n\n  var DELEGATES_TO_SYMBOL = !fails(function () {\n    // String methods call symbol-named RegEp methods\n    var O = {};\n    O[SYMBOL] = function () { return 7; };\n    return ''[KEY](O) != 7;\n  });\n\n  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {\n    // Symbol-named RegExp methods call .exec\n    var execCalled = false;\n    var re = /a/;\n\n    if (KEY === 'split') {\n      // We can't use real regex here since it causes deoptimization\n      // and serious performance degradation in V8\n      // https://github.com/zloirock/core-js/issues/306\n      re = {};\n      // RegExp[@@split] doesn't call the regex's exec method, but first creates\n      // a new one. We need to return the patched regex when creating the new one.\n      re.constructor = {};\n      re.constructor[SPECIES] = function () { return re; };\n      re.flags = '';\n      re[SYMBOL] = /./[SYMBOL];\n    }\n\n    re.exec = function () { execCalled = true; return null; };\n\n    re[SYMBOL]('');\n    return !execCalled;\n  });\n\n  if (\n    !DELEGATES_TO_SYMBOL ||\n    !DELEGATES_TO_EXEC ||\n    FORCED\n  ) {\n    var uncurriedNativeRegExpMethod = uncurryThis(/./[SYMBOL]);\n    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {\n      var uncurriedNativeMethod = uncurryThis(nativeMethod);\n      var $exec = regexp.exec;\n      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {\n        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {\n          // The native String method already delegates to @@method (this\n          // polyfilled function), leasing to infinite recursion.\n          // We avoid it by directly calling the native @@method method.\n          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };\n        }\n        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };\n      }\n      return { done: false };\n    });\n\n    redefine(String.prototype, KEY, methods[0]);\n    redefine(RegExpPrototype, SYMBOL, methods[1]);\n  }\n\n  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/function-call.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-call.js ***!
  \*********************************************************/
/***/ ((module) => {

eval("var call = Function.prototype.call;\n\nmodule.exports = call.bind ? call.bind(call) : function () {\n  return call.apply(call, arguments);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/function-call.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/function-name.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-name.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ \"./node_modules/core-js/internals/descriptors.js\");\nvar hasOwn = __webpack_require__(/*! ../internals/has-own-property */ \"./node_modules/core-js/internals/has-own-property.js\");\n\nvar FunctionPrototype = Function.prototype;\n// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe\nvar getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;\n\nvar EXISTS = hasOwn(FunctionPrototype, 'name');\n// additional protection from minified / mangled / dropped function names\nvar PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';\nvar CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));\n\nmodule.exports = {\n  EXISTS: EXISTS,\n  PROPER: PROPER,\n  CONFIGURABLE: CONFIGURABLE\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/function-name.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this.js ***!
  \*****************************************************************/
/***/ ((module) => {

eval("var FunctionPrototype = Function.prototype;\nvar bind = FunctionPrototype.bind;\nvar call = FunctionPrototype.call;\nvar callBind = bind && bind.bind(call);\n\nmodule.exports = bind ? function (fn) {\n  return fn && callBind(call, fn);\n} : function (fn) {\n  return fn && function () {\n    return call.apply(fn, arguments);\n  };\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/function-uncurry-this.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/get-built-in.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-built-in.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\n\nvar aFunction = function (argument) {\n  return isCallable(argument) ? argument : undefined;\n};\n\nmodule.exports = function (namespace, method) {\n  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/get-built-in.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/get-method.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/get-method.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var aCallable = __webpack_require__(/*! ../internals/a-callable */ \"./node_modules/core-js/internals/a-callable.js\");\n\n// `GetMethod` abstract operation\n// https://tc39.es/ecma262/#sec-getmethod\nmodule.exports = function (V, P) {\n  var func = V[P];\n  return func == null ? undefined : aCallable(func);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/get-method.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/global.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/global.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var check = function (it) {\n  return it && it.Math == Math && it;\n};\n\n// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028\nmodule.exports =\n  // eslint-disable-next-line es/no-global-this -- safe\n  check(typeof globalThis == 'object' && globalThis) ||\n  check(typeof window == 'object' && window) ||\n  // eslint-disable-next-line no-restricted-globals -- safe\n  check(typeof self == 'object' && self) ||\n  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||\n  // eslint-disable-next-line no-new-func -- fallback\n  (function () { return this; })() || Function('return this')();\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/global.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/has-own-property.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/has-own-property.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\nvar toObject = __webpack_require__(/*! ../internals/to-object */ \"./node_modules/core-js/internals/to-object.js\");\n\nvar hasOwnProperty = uncurryThis({}.hasOwnProperty);\n\n// `HasOwnProperty` abstract operation\n// https://tc39.es/ecma262/#sec-hasownproperty\nmodule.exports = Object.hasOwn || function hasOwn(it, key) {\n  return hasOwnProperty(toObject(it), key);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/has-own-property.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/hidden-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
/***/ ((module) => {

eval("module.exports = {};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/hidden-keys.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/html.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/html.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ \"./node_modules/core-js/internals/get-built-in.js\");\n\nmodule.exports = getBuiltIn('document', 'documentElement');\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/html.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/ie8-dom-define.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ \"./node_modules/core-js/internals/descriptors.js\");\nvar fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\nvar createElement = __webpack_require__(/*! ../internals/document-create-element */ \"./node_modules/core-js/internals/document-create-element.js\");\n\n// Thank's IE8 for his funny defineProperty\nmodule.exports = !DESCRIPTORS && !fails(function () {\n  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing\n  return Object.defineProperty(createElement('div'), 'a', {\n    get: function () { return 7; }\n  }).a != 7;\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/ie8-dom-define.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/indexed-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\nvar fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\nvar classof = __webpack_require__(/*! ../internals/classof-raw */ \"./node_modules/core-js/internals/classof-raw.js\");\n\nvar Object = global.Object;\nvar split = uncurryThis(''.split);\n\n// fallback for non-array-like ES3 and non-enumerable old V8 strings\nmodule.exports = fails(function () {\n  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346\n  // eslint-disable-next-line no-prototype-builtins -- safe\n  return !Object('z').propertyIsEnumerable(0);\n}) ? function (it) {\n  return classof(it) == 'String' ? split(it, '') : Object(it);\n} : Object;\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/indexed-object.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/inspect-source.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/inspect-source.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\nvar store = __webpack_require__(/*! ../internals/shared-store */ \"./node_modules/core-js/internals/shared-store.js\");\n\nvar functionToString = uncurryThis(Function.toString);\n\n// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper\nif (!isCallable(store.inspectSource)) {\n  store.inspectSource = function (it) {\n    return functionToString(it);\n  };\n}\n\nmodule.exports = store.inspectSource;\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/inspect-source.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/internal-state.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/native-weak-map */ \"./node_modules/core-js/internals/native-weak-map.js\");\nvar global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\nvar isObject = __webpack_require__(/*! ../internals/is-object */ \"./node_modules/core-js/internals/is-object.js\");\nvar createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ \"./node_modules/core-js/internals/create-non-enumerable-property.js\");\nvar hasOwn = __webpack_require__(/*! ../internals/has-own-property */ \"./node_modules/core-js/internals/has-own-property.js\");\nvar shared = __webpack_require__(/*! ../internals/shared-store */ \"./node_modules/core-js/internals/shared-store.js\");\nvar sharedKey = __webpack_require__(/*! ../internals/shared-key */ \"./node_modules/core-js/internals/shared-key.js\");\nvar hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ \"./node_modules/core-js/internals/hidden-keys.js\");\n\nvar OBJECT_ALREADY_INITIALIZED = 'Object already initialized';\nvar TypeError = global.TypeError;\nvar WeakMap = global.WeakMap;\nvar set, get, has;\n\nvar enforce = function (it) {\n  return has(it) ? get(it) : set(it, {});\n};\n\nvar getterFor = function (TYPE) {\n  return function (it) {\n    var state;\n    if (!isObject(it) || (state = get(it)).type !== TYPE) {\n      throw TypeError('Incompatible receiver, ' + TYPE + ' required');\n    } return state;\n  };\n};\n\nif (NATIVE_WEAK_MAP || shared.state) {\n  var store = shared.state || (shared.state = new WeakMap());\n  var wmget = uncurryThis(store.get);\n  var wmhas = uncurryThis(store.has);\n  var wmset = uncurryThis(store.set);\n  set = function (it, metadata) {\n    if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);\n    metadata.facade = it;\n    wmset(store, it, metadata);\n    return metadata;\n  };\n  get = function (it) {\n    return wmget(store, it) || {};\n  };\n  has = function (it) {\n    return wmhas(store, it);\n  };\n} else {\n  var STATE = sharedKey('state');\n  hiddenKeys[STATE] = true;\n  set = function (it, metadata) {\n    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);\n    metadata.facade = it;\n    createNonEnumerableProperty(it, STATE, metadata);\n    return metadata;\n  };\n  get = function (it) {\n    return hasOwn(it, STATE) ? it[STATE] : {};\n  };\n  has = function (it) {\n    return hasOwn(it, STATE);\n  };\n}\n\nmodule.exports = {\n  set: set,\n  get: get,\n  has: has,\n  enforce: enforce,\n  getterFor: getterFor\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/internal-state.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/is-array.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/is-array.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var classof = __webpack_require__(/*! ../internals/classof-raw */ \"./node_modules/core-js/internals/classof-raw.js\");\n\n// `IsArray` abstract operation\n// https://tc39.es/ecma262/#sec-isarray\n// eslint-disable-next-line es/no-array-isarray -- safe\nmodule.exports = Array.isArray || function isArray(argument) {\n  return classof(argument) == 'Array';\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/is-array.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/is-callable.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-callable.js ***!
  \*******************************************************/
/***/ ((module) => {

eval("// `IsCallable` abstract operation\n// https://tc39.es/ecma262/#sec-iscallable\nmodule.exports = function (argument) {\n  return typeof argument == 'function';\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/is-callable.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/is-forced.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-forced.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\n\nvar replacement = /#|\\.prototype\\./;\n\nvar isForced = function (feature, detection) {\n  var value = data[normalize(feature)];\n  return value == POLYFILL ? true\n    : value == NATIVE ? false\n    : isCallable(detection) ? fails(detection)\n    : !!detection;\n};\n\nvar normalize = isForced.normalize = function (string) {\n  return String(string).replace(replacement, '.').toLowerCase();\n};\n\nvar data = isForced.data = {};\nvar NATIVE = isForced.NATIVE = 'N';\nvar POLYFILL = isForced.POLYFILL = 'P';\n\nmodule.exports = isForced;\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/is-forced.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/is-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\n\nmodule.exports = function (it) {\n  return typeof it == 'object' ? it !== null : isCallable(it);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/is-object.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/is-pure.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
/***/ ((module) => {

eval("module.exports = false;\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/is-pure.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/is-symbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-symbol.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ \"./node_modules/core-js/internals/get-built-in.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\nvar isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ \"./node_modules/core-js/internals/object-is-prototype-of.js\");\nvar USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ \"./node_modules/core-js/internals/use-symbol-as-uid.js\");\n\nvar Object = global.Object;\n\nmodule.exports = USE_SYMBOL_AS_UID ? function (it) {\n  return typeof it == 'symbol';\n} : function (it) {\n  var $Symbol = getBuiltIn('Symbol');\n  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, Object(it));\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/is-symbol.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/iterators-core.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/iterators-core.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\nvar fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\nvar create = __webpack_require__(/*! ../internals/object-create */ \"./node_modules/core-js/internals/object-create.js\");\nvar getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ \"./node_modules/core-js/internals/object-get-prototype-of.js\");\nvar redefine = __webpack_require__(/*! ../internals/redefine */ \"./node_modules/core-js/internals/redefine.js\");\nvar wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ \"./node_modules/core-js/internals/well-known-symbol.js\");\nvar IS_PURE = __webpack_require__(/*! ../internals/is-pure */ \"./node_modules/core-js/internals/is-pure.js\");\n\nvar ITERATOR = wellKnownSymbol('iterator');\nvar BUGGY_SAFARI_ITERATORS = false;\n\n// `%IteratorPrototype%` object\n// https://tc39.es/ecma262/#sec-%iteratorprototype%-object\nvar IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;\n\n/* eslint-disable es/no-array-prototype-keys -- safe */\nif ([].keys) {\n  arrayIterator = [].keys();\n  // Safari 8 has buggy iterators w/o `next`\n  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;\n  else {\n    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));\n    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;\n  }\n}\n\nvar NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {\n  var test = {};\n  // FF44- legacy iterators case\n  return IteratorPrototype[ITERATOR].call(test) !== test;\n});\n\nif (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};\nelse if (IS_PURE) IteratorPrototype = create(IteratorPrototype);\n\n// `%IteratorPrototype%[@@iterator]()` method\n// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator\nif (!isCallable(IteratorPrototype[ITERATOR])) {\n  redefine(IteratorPrototype, ITERATOR, function () {\n    return this;\n  });\n}\n\nmodule.exports = {\n  IteratorPrototype: IteratorPrototype,\n  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/iterators-core.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/iterators.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/iterators.js ***!
  \*****************************************************/
/***/ ((module) => {

eval("module.exports = {};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/iterators.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/length-of-array-like.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/length-of-array-like.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var toLength = __webpack_require__(/*! ../internals/to-length */ \"./node_modules/core-js/internals/to-length.js\");\n\n// `LengthOfArrayLike` abstract operation\n// https://tc39.es/ecma262/#sec-lengthofarraylike\nmodule.exports = function (obj) {\n  return toLength(obj.length);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/length-of-array-like.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/native-symbol.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/native-symbol.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/* eslint-disable es/no-symbol -- required for testing */\nvar V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ \"./node_modules/core-js/internals/engine-v8-version.js\");\nvar fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\n\n// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing\nmodule.exports = !!Object.getOwnPropertySymbols && !fails(function () {\n  var symbol = Symbol();\n  // Chrome 38 Symbol has incorrect toString conversion\n  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances\n  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||\n    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances\n    !Symbol.sham && V8_VERSION && V8_VERSION < 41;\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/native-symbol.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/native-weak-map.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/native-weak-map.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\nvar inspectSource = __webpack_require__(/*! ../internals/inspect-source */ \"./node_modules/core-js/internals/inspect-source.js\");\n\nvar WeakMap = global.WeakMap;\n\nmodule.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/native-weak-map.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-create.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-create.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/* global ActiveXObject -- old IE, WSH */\nvar anObject = __webpack_require__(/*! ../internals/an-object */ \"./node_modules/core-js/internals/an-object.js\");\nvar defineProperties = __webpack_require__(/*! ../internals/object-define-properties */ \"./node_modules/core-js/internals/object-define-properties.js\");\nvar enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ \"./node_modules/core-js/internals/enum-bug-keys.js\");\nvar hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ \"./node_modules/core-js/internals/hidden-keys.js\");\nvar html = __webpack_require__(/*! ../internals/html */ \"./node_modules/core-js/internals/html.js\");\nvar documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ \"./node_modules/core-js/internals/document-create-element.js\");\nvar sharedKey = __webpack_require__(/*! ../internals/shared-key */ \"./node_modules/core-js/internals/shared-key.js\");\n\nvar GT = '>';\nvar LT = '<';\nvar PROTOTYPE = 'prototype';\nvar SCRIPT = 'script';\nvar IE_PROTO = sharedKey('IE_PROTO');\n\nvar EmptyConstructor = function () { /* empty */ };\n\nvar scriptTag = function (content) {\n  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;\n};\n\n// Create object with fake `null` prototype: use ActiveX Object with cleared prototype\nvar NullProtoObjectViaActiveX = function (activeXDocument) {\n  activeXDocument.write(scriptTag(''));\n  activeXDocument.close();\n  var temp = activeXDocument.parentWindow.Object;\n  activeXDocument = null; // avoid memory leak\n  return temp;\n};\n\n// Create object with fake `null` prototype: use iframe Object with cleared prototype\nvar NullProtoObjectViaIFrame = function () {\n  // Thrash, waste and sodomy: IE GC bug\n  var iframe = documentCreateElement('iframe');\n  var JS = 'java' + SCRIPT + ':';\n  var iframeDocument;\n  iframe.style.display = 'none';\n  html.appendChild(iframe);\n  // https://github.com/zloirock/core-js/issues/475\n  iframe.src = String(JS);\n  iframeDocument = iframe.contentWindow.document;\n  iframeDocument.open();\n  iframeDocument.write(scriptTag('document.F=Object'));\n  iframeDocument.close();\n  return iframeDocument.F;\n};\n\n// Check for document.domain and active x support\n// No need to use active x approach when document.domain is not set\n// see https://github.com/es-shims/es5-shim/issues/150\n// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346\n// avoid IE GC bug\nvar activeXDocument;\nvar NullProtoObject = function () {\n  try {\n    activeXDocument = new ActiveXObject('htmlfile');\n  } catch (error) { /* ignore */ }\n  NullProtoObject = typeof document != 'undefined'\n    ? document.domain && activeXDocument\n      ? NullProtoObjectViaActiveX(activeXDocument) // old IE\n      : NullProtoObjectViaIFrame()\n    : NullProtoObjectViaActiveX(activeXDocument); // WSH\n  var length = enumBugKeys.length;\n  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];\n  return NullProtoObject();\n};\n\nhiddenKeys[IE_PROTO] = true;\n\n// `Object.create` method\n// https://tc39.es/ecma262/#sec-object.create\nmodule.exports = Object.create || function create(O, Properties) {\n  var result;\n  if (O !== null) {\n    EmptyConstructor[PROTOTYPE] = anObject(O);\n    result = new EmptyConstructor();\n    EmptyConstructor[PROTOTYPE] = null;\n    // add \"__proto__\" for Object.getPrototypeOf polyfill\n    result[IE_PROTO] = O;\n  } else result = NullProtoObject();\n  return Properties === undefined ? result : defineProperties(result, Properties);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-create.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-define-properties.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-properties.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ \"./node_modules/core-js/internals/descriptors.js\");\nvar definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ \"./node_modules/core-js/internals/object-define-property.js\");\nvar anObject = __webpack_require__(/*! ../internals/an-object */ \"./node_modules/core-js/internals/an-object.js\");\nvar toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ \"./node_modules/core-js/internals/to-indexed-object.js\");\nvar objectKeys = __webpack_require__(/*! ../internals/object-keys */ \"./node_modules/core-js/internals/object-keys.js\");\n\n// `Object.defineProperties` method\n// https://tc39.es/ecma262/#sec-object.defineproperties\n// eslint-disable-next-line es/no-object-defineproperties -- safe\nmodule.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {\n  anObject(O);\n  var props = toIndexedObject(Properties);\n  var keys = objectKeys(Properties);\n  var length = keys.length;\n  var index = 0;\n  var key;\n  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);\n  return O;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-define-properties.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-define-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ \"./node_modules/core-js/internals/descriptors.js\");\nvar IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ \"./node_modules/core-js/internals/ie8-dom-define.js\");\nvar anObject = __webpack_require__(/*! ../internals/an-object */ \"./node_modules/core-js/internals/an-object.js\");\nvar toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ \"./node_modules/core-js/internals/to-property-key.js\");\n\nvar TypeError = global.TypeError;\n// eslint-disable-next-line es/no-object-defineproperty -- safe\nvar $defineProperty = Object.defineProperty;\n\n// `Object.defineProperty` method\n// https://tc39.es/ecma262/#sec-object.defineproperty\nexports.f = DESCRIPTORS ? $defineProperty : function defineProperty(O, P, Attributes) {\n  anObject(O);\n  P = toPropertyKey(P);\n  anObject(Attributes);\n  if (IE8_DOM_DEFINE) try {\n    return $defineProperty(O, P, Attributes);\n  } catch (error) { /* empty */ }\n  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');\n  if ('value' in Attributes) O[P] = Attributes.value;\n  return O;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-define-property.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-descriptor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ \"./node_modules/core-js/internals/descriptors.js\");\nvar call = __webpack_require__(/*! ../internals/function-call */ \"./node_modules/core-js/internals/function-call.js\");\nvar propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ \"./node_modules/core-js/internals/object-property-is-enumerable.js\");\nvar createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ \"./node_modules/core-js/internals/create-property-descriptor.js\");\nvar toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ \"./node_modules/core-js/internals/to-indexed-object.js\");\nvar toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ \"./node_modules/core-js/internals/to-property-key.js\");\nvar hasOwn = __webpack_require__(/*! ../internals/has-own-property */ \"./node_modules/core-js/internals/has-own-property.js\");\nvar IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ \"./node_modules/core-js/internals/ie8-dom-define.js\");\n\n// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe\nvar $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;\n\n// `Object.getOwnPropertyDescriptor` method\n// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor\nexports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {\n  O = toIndexedObject(O);\n  P = toPropertyKey(P);\n  if (IE8_DOM_DEFINE) try {\n    return $getOwnPropertyDescriptor(O, P);\n  } catch (error) { /* empty */ }\n  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-get-own-property-descriptor.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ \"./node_modules/core-js/internals/object-keys-internal.js\");\nvar enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ \"./node_modules/core-js/internals/enum-bug-keys.js\");\n\nvar hiddenKeys = enumBugKeys.concat('length', 'prototype');\n\n// `Object.getOwnPropertyNames` method\n// https://tc39.es/ecma262/#sec-object.getownpropertynames\n// eslint-disable-next-line es/no-object-getownpropertynames -- safe\nexports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {\n  return internalObjectKeys(O, hiddenKeys);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-get-own-property-names.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-symbols.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe\nexports.f = Object.getOwnPropertySymbols;\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-get-own-property-symbols.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-get-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-prototype-of.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar hasOwn = __webpack_require__(/*! ../internals/has-own-property */ \"./node_modules/core-js/internals/has-own-property.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\nvar toObject = __webpack_require__(/*! ../internals/to-object */ \"./node_modules/core-js/internals/to-object.js\");\nvar sharedKey = __webpack_require__(/*! ../internals/shared-key */ \"./node_modules/core-js/internals/shared-key.js\");\nvar CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ \"./node_modules/core-js/internals/correct-prototype-getter.js\");\n\nvar IE_PROTO = sharedKey('IE_PROTO');\nvar Object = global.Object;\nvar ObjectPrototype = Object.prototype;\n\n// `Object.getPrototypeOf` method\n// https://tc39.es/ecma262/#sec-object.getprototypeof\nmodule.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {\n  var object = toObject(O);\n  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];\n  var constructor = object.constructor;\n  if (isCallable(constructor) && object instanceof constructor) {\n    return constructor.prototype;\n  } return object instanceof Object ? ObjectPrototype : null;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-get-prototype-of.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-is-prototype-of.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-prototype-of.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\n\nmodule.exports = uncurryThis({}.isPrototypeOf);\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-is-prototype-of.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-keys-internal.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\nvar hasOwn = __webpack_require__(/*! ../internals/has-own-property */ \"./node_modules/core-js/internals/has-own-property.js\");\nvar toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ \"./node_modules/core-js/internals/to-indexed-object.js\");\nvar indexOf = (__webpack_require__(/*! ../internals/array-includes */ \"./node_modules/core-js/internals/array-includes.js\").indexOf);\nvar hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ \"./node_modules/core-js/internals/hidden-keys.js\");\n\nvar push = uncurryThis([].push);\n\nmodule.exports = function (object, names) {\n  var O = toIndexedObject(object);\n  var i = 0;\n  var result = [];\n  var key;\n  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);\n  // Don't enum bug & hidden keys\n  while (names.length > i) if (hasOwn(O, key = names[i++])) {\n    ~indexOf(result, key) || push(result, key);\n  }\n  return result;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-keys-internal.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ \"./node_modules/core-js/internals/object-keys-internal.js\");\nvar enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ \"./node_modules/core-js/internals/enum-bug-keys.js\");\n\n// `Object.keys` method\n// https://tc39.es/ecma262/#sec-object.keys\n// eslint-disable-next-line es/no-object-keys -- safe\nmodule.exports = Object.keys || function keys(O) {\n  return internalObjectKeys(O, enumBugKeys);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-keys.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-property-is-enumerable.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
eval("\nvar $propertyIsEnumerable = {}.propertyIsEnumerable;\n// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe\nvar getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;\n\n// Nashorn ~ JDK8 bug\nvar NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);\n\n// `Object.prototype.propertyIsEnumerable` method implementation\n// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable\nexports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {\n  var descriptor = getOwnPropertyDescriptor(this, V);\n  return !!descriptor && descriptor.enumerable;\n} : $propertyIsEnumerable;\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-property-is-enumerable.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/object-set-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-set-prototype-of.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/* eslint-disable no-proto -- safe */\nvar uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\nvar anObject = __webpack_require__(/*! ../internals/an-object */ \"./node_modules/core-js/internals/an-object.js\");\nvar aPossiblePrototype = __webpack_require__(/*! ../internals/a-possible-prototype */ \"./node_modules/core-js/internals/a-possible-prototype.js\");\n\n// `Object.setPrototypeOf` method\n// https://tc39.es/ecma262/#sec-object.setprototypeof\n// Works with __proto__ only. Old v8 can't work with null proto objects.\n// eslint-disable-next-line es/no-object-setprototypeof -- safe\nmodule.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {\n  var CORRECT_SETTER = false;\n  var test = {};\n  var setter;\n  try {\n    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe\n    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);\n    setter(test, []);\n    CORRECT_SETTER = test instanceof Array;\n  } catch (error) { /* empty */ }\n  return function setPrototypeOf(O, proto) {\n    anObject(O);\n    aPossiblePrototype(proto);\n    if (CORRECT_SETTER) setter(O, proto);\n    else O.__proto__ = proto;\n    return O;\n  };\n}() : undefined);\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/object-set-prototype-of.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/ordinary-to-primitive.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/ordinary-to-primitive.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar call = __webpack_require__(/*! ../internals/function-call */ \"./node_modules/core-js/internals/function-call.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\nvar isObject = __webpack_require__(/*! ../internals/is-object */ \"./node_modules/core-js/internals/is-object.js\");\n\nvar TypeError = global.TypeError;\n\n// `OrdinaryToPrimitive` abstract operation\n// https://tc39.es/ecma262/#sec-ordinarytoprimitive\nmodule.exports = function (input, pref) {\n  var fn, val;\n  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;\n  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;\n  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;\n  throw TypeError(\"Can't convert object to primitive value\");\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/ordinary-to-primitive.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/own-keys.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/own-keys.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ \"./node_modules/core-js/internals/get-built-in.js\");\nvar uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\nvar getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ \"./node_modules/core-js/internals/object-get-own-property-names.js\");\nvar getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ \"./node_modules/core-js/internals/object-get-own-property-symbols.js\");\nvar anObject = __webpack_require__(/*! ../internals/an-object */ \"./node_modules/core-js/internals/an-object.js\");\n\nvar concat = uncurryThis([].concat);\n\n// all object keys, includes non-enumerable and symbols\nmodule.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {\n  var keys = getOwnPropertyNamesModule.f(anObject(it));\n  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;\n  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/own-keys.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/redefine.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/redefine.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\nvar hasOwn = __webpack_require__(/*! ../internals/has-own-property */ \"./node_modules/core-js/internals/has-own-property.js\");\nvar createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ \"./node_modules/core-js/internals/create-non-enumerable-property.js\");\nvar setGlobal = __webpack_require__(/*! ../internals/set-global */ \"./node_modules/core-js/internals/set-global.js\");\nvar inspectSource = __webpack_require__(/*! ../internals/inspect-source */ \"./node_modules/core-js/internals/inspect-source.js\");\nvar InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ \"./node_modules/core-js/internals/internal-state.js\");\nvar CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ \"./node_modules/core-js/internals/function-name.js\").CONFIGURABLE);\n\nvar getInternalState = InternalStateModule.get;\nvar enforceInternalState = InternalStateModule.enforce;\nvar TEMPLATE = String(String).split('String');\n\n(module.exports = function (O, key, value, options) {\n  var unsafe = options ? !!options.unsafe : false;\n  var simple = options ? !!options.enumerable : false;\n  var noTargetGet = options ? !!options.noTargetGet : false;\n  var name = options && options.name !== undefined ? options.name : key;\n  var state;\n  if (isCallable(value)) {\n    if (String(name).slice(0, 7) === 'Symbol(') {\n      name = '[' + String(name).replace(/^Symbol\\(([^)]*)\\)/, '$1') + ']';\n    }\n    if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {\n      createNonEnumerableProperty(value, 'name', name);\n    }\n    state = enforceInternalState(value);\n    if (!state.source) {\n      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');\n    }\n  }\n  if (O === global) {\n    if (simple) O[key] = value;\n    else setGlobal(key, value);\n    return;\n  } else if (!unsafe) {\n    delete O[key];\n  } else if (!noTargetGet && O[key]) {\n    simple = true;\n  }\n  if (simple) O[key] = value;\n  else createNonEnumerableProperty(O, key, value);\n// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative\n})(Function.prototype, 'toString', function toString() {\n  return isCallable(this) && getInternalState(this).source || inspectSource(this);\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/redefine.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/regexp-exec-abstract.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-exec-abstract.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar call = __webpack_require__(/*! ../internals/function-call */ \"./node_modules/core-js/internals/function-call.js\");\nvar anObject = __webpack_require__(/*! ../internals/an-object */ \"./node_modules/core-js/internals/an-object.js\");\nvar isCallable = __webpack_require__(/*! ../internals/is-callable */ \"./node_modules/core-js/internals/is-callable.js\");\nvar classof = __webpack_require__(/*! ../internals/classof-raw */ \"./node_modules/core-js/internals/classof-raw.js\");\nvar regexpExec = __webpack_require__(/*! ../internals/regexp-exec */ \"./node_modules/core-js/internals/regexp-exec.js\");\n\nvar TypeError = global.TypeError;\n\n// `RegExpExec` abstract operation\n// https://tc39.es/ecma262/#sec-regexpexec\nmodule.exports = function (R, S) {\n  var exec = R.exec;\n  if (isCallable(exec)) {\n    var result = call(exec, R, S);\n    if (result !== null) anObject(result);\n    return result;\n  }\n  if (classof(R) === 'RegExp') return call(regexpExec, R, S);\n  throw TypeError('RegExp#exec called on incompatible receiver');\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/regexp-exec-abstract.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/regexp-exec.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-exec.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */\n/* eslint-disable regexp/no-useless-quantifier -- testing */\nvar call = __webpack_require__(/*! ../internals/function-call */ \"./node_modules/core-js/internals/function-call.js\");\nvar uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\nvar toString = __webpack_require__(/*! ../internals/to-string */ \"./node_modules/core-js/internals/to-string.js\");\nvar regexpFlags = __webpack_require__(/*! ../internals/regexp-flags */ \"./node_modules/core-js/internals/regexp-flags.js\");\nvar stickyHelpers = __webpack_require__(/*! ../internals/regexp-sticky-helpers */ \"./node_modules/core-js/internals/regexp-sticky-helpers.js\");\nvar shared = __webpack_require__(/*! ../internals/shared */ \"./node_modules/core-js/internals/shared.js\");\nvar create = __webpack_require__(/*! ../internals/object-create */ \"./node_modules/core-js/internals/object-create.js\");\nvar getInternalState = (__webpack_require__(/*! ../internals/internal-state */ \"./node_modules/core-js/internals/internal-state.js\").get);\nvar UNSUPPORTED_DOT_ALL = __webpack_require__(/*! ../internals/regexp-unsupported-dot-all */ \"./node_modules/core-js/internals/regexp-unsupported-dot-all.js\");\nvar UNSUPPORTED_NCG = __webpack_require__(/*! ../internals/regexp-unsupported-ncg */ \"./node_modules/core-js/internals/regexp-unsupported-ncg.js\");\n\nvar nativeReplace = shared('native-string-replace', String.prototype.replace);\nvar nativeExec = RegExp.prototype.exec;\nvar patchedExec = nativeExec;\nvar charAt = uncurryThis(''.charAt);\nvar indexOf = uncurryThis(''.indexOf);\nvar replace = uncurryThis(''.replace);\nvar stringSlice = uncurryThis(''.slice);\n\nvar UPDATES_LAST_INDEX_WRONG = (function () {\n  var re1 = /a/;\n  var re2 = /b*/g;\n  call(nativeExec, re1, 'a');\n  call(nativeExec, re2, 'a');\n  return re1.lastIndex !== 0 || re2.lastIndex !== 0;\n})();\n\nvar UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;\n\n// nonparticipating capturing group, copied from es5-shim's String#split patch.\nvar NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;\n\nvar PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;\n\nif (PATCH) {\n  // eslint-disable-next-line max-statements -- TODO\n  patchedExec = function exec(string) {\n    var re = this;\n    var state = getInternalState(re);\n    var str = toString(string);\n    var raw = state.raw;\n    var result, reCopy, lastIndex, match, i, object, group;\n\n    if (raw) {\n      raw.lastIndex = re.lastIndex;\n      result = call(patchedExec, raw, str);\n      re.lastIndex = raw.lastIndex;\n      return result;\n    }\n\n    var groups = state.groups;\n    var sticky = UNSUPPORTED_Y && re.sticky;\n    var flags = call(regexpFlags, re);\n    var source = re.source;\n    var charsAdded = 0;\n    var strCopy = str;\n\n    if (sticky) {\n      flags = replace(flags, 'y', '');\n      if (indexOf(flags, 'g') === -1) {\n        flags += 'g';\n      }\n\n      strCopy = stringSlice(str, re.lastIndex);\n      // Support anchored sticky behavior.\n      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\\n')) {\n        source = '(?: ' + source + ')';\n        strCopy = ' ' + strCopy;\n        charsAdded++;\n      }\n      // ^(? + rx + ) is needed, in combination with some str slicing, to\n      // simulate the 'y' flag.\n      reCopy = new RegExp('^(?:' + source + ')', flags);\n    }\n\n    if (NPCG_INCLUDED) {\n      reCopy = new RegExp('^' + source + '$(?!\\\\s)', flags);\n    }\n    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;\n\n    match = call(nativeExec, sticky ? reCopy : re, strCopy);\n\n    if (sticky) {\n      if (match) {\n        match.input = stringSlice(match.input, charsAdded);\n        match[0] = stringSlice(match[0], charsAdded);\n        match.index = re.lastIndex;\n        re.lastIndex += match[0].length;\n      } else re.lastIndex = 0;\n    } else if (UPDATES_LAST_INDEX_WRONG && match) {\n      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;\n    }\n    if (NPCG_INCLUDED && match && match.length > 1) {\n      // Fix browsers whose `exec` methods don't consistently return `undefined`\n      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/\n      call(nativeReplace, match[0], reCopy, function () {\n        for (i = 1; i < arguments.length - 2; i++) {\n          if (arguments[i] === undefined) match[i] = undefined;\n        }\n      });\n    }\n\n    if (match && groups) {\n      match.groups = object = create(null);\n      for (i = 0; i < groups.length; i++) {\n        group = groups[i];\n        object[group[0]] = match[group[1]];\n      }\n    }\n\n    return match;\n  };\n}\n\nmodule.exports = patchedExec;\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/regexp-exec.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/regexp-flags.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-flags.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\nvar anObject = __webpack_require__(/*! ../internals/an-object */ \"./node_modules/core-js/internals/an-object.js\");\n\n// `RegExp.prototype.flags` getter implementation\n// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags\nmodule.exports = function () {\n  var that = anObject(this);\n  var result = '';\n  if (that.global) result += 'g';\n  if (that.ignoreCase) result += 'i';\n  if (that.multiline) result += 'm';\n  if (that.dotAll) result += 's';\n  if (that.unicode) result += 'u';\n  if (that.sticky) result += 'y';\n  return result;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/regexp-flags.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/regexp-sticky-helpers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-sticky-helpers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("var fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\nvar global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\n\n// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError\nvar $RegExp = global.RegExp;\n\nexports.UNSUPPORTED_Y = fails(function () {\n  var re = $RegExp('a', 'y');\n  re.lastIndex = 2;\n  return re.exec('abcd') != null;\n});\n\nexports.BROKEN_CARET = fails(function () {\n  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687\n  var re = $RegExp('^r', 'gy');\n  re.lastIndex = 2;\n  return re.exec('str') != null;\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/regexp-sticky-helpers.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/regexp-unsupported-dot-all.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-unsupported-dot-all.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\nvar global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\n\n// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError\nvar $RegExp = global.RegExp;\n\nmodule.exports = fails(function () {\n  var re = $RegExp('.', 's');\n  return !(re.dotAll && re.exec('\\n') && re.flags === 's');\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/regexp-unsupported-dot-all.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/regexp-unsupported-ncg.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-unsupported-ncg.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var fails = __webpack_require__(/*! ../internals/fails */ \"./node_modules/core-js/internals/fails.js\");\nvar global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\n\n// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError\nvar $RegExp = global.RegExp;\n\nmodule.exports = fails(function () {\n  var re = $RegExp('(?<a>b)', 'g');\n  return re.exec('b').groups.a !== 'b' ||\n    'b'.replace(re, '$<a>c') !== 'bc';\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/regexp-unsupported-ncg.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/require-object-coercible.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\n\nvar TypeError = global.TypeError;\n\n// `RequireObjectCoercible` abstract operation\n// https://tc39.es/ecma262/#sec-requireobjectcoercible\nmodule.exports = function (it) {\n  if (it == undefined) throw TypeError(\"Can't call method on \" + it);\n  return it;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/require-object-coercible.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/same-value.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/same-value.js ***!
  \******************************************************/
/***/ ((module) => {

eval("// `SameValue` abstract operation\n// https://tc39.es/ecma262/#sec-samevalue\n// eslint-disable-next-line es/no-object-is -- safe\nmodule.exports = Object.is || function is(x, y) {\n  // eslint-disable-next-line no-self-compare -- NaN check\n  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/same-value.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/set-global.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/set-global.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\n\n// eslint-disable-next-line es/no-object-defineproperty -- safe\nvar defineProperty = Object.defineProperty;\n\nmodule.exports = function (key, value) {\n  try {\n    defineProperty(global, key, { value: value, configurable: true, writable: true });\n  } catch (error) {\n    global[key] = value;\n  } return value;\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/set-global.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/set-to-string-tag.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/set-to-string-tag.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ \"./node_modules/core-js/internals/object-define-property.js\").f);\nvar hasOwn = __webpack_require__(/*! ../internals/has-own-property */ \"./node_modules/core-js/internals/has-own-property.js\");\nvar wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ \"./node_modules/core-js/internals/well-known-symbol.js\");\n\nvar TO_STRING_TAG = wellKnownSymbol('toStringTag');\n\nmodule.exports = function (it, TAG, STATIC) {\n  if (it && !hasOwn(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {\n    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });\n  }\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/set-to-string-tag.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/shared-key.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var shared = __webpack_require__(/*! ../internals/shared */ \"./node_modules/core-js/internals/shared.js\");\nvar uid = __webpack_require__(/*! ../internals/uid */ \"./node_modules/core-js/internals/uid.js\");\n\nvar keys = shared('keys');\n\nmodule.exports = function (key) {\n  return keys[key] || (keys[key] = uid(key));\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/shared-key.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/shared-store.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/shared-store.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar setGlobal = __webpack_require__(/*! ../internals/set-global */ \"./node_modules/core-js/internals/set-global.js\");\n\nvar SHARED = '__core-js_shared__';\nvar store = global[SHARED] || setGlobal(SHARED, {});\n\nmodule.exports = store;\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/shared-store.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/shared.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ \"./node_modules/core-js/internals/is-pure.js\");\nvar store = __webpack_require__(/*! ../internals/shared-store */ \"./node_modules/core-js/internals/shared-store.js\");\n\n(module.exports = function (key, value) {\n  return store[key] || (store[key] = value !== undefined ? value : {});\n})('versions', []).push({\n  version: '3.19.1',\n  mode: IS_PURE ? 'pure' : 'global',\n  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/shared.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/to-absolute-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ \"./node_modules/core-js/internals/to-integer-or-infinity.js\");\n\nvar max = Math.max;\nvar min = Math.min;\n\n// Helper for a popular repeating case of the spec:\n// Let integer be ? ToInteger(index).\n// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).\nmodule.exports = function (index, length) {\n  var integer = toIntegerOrInfinity(index);\n  return integer < 0 ? max(integer + length, 0) : min(integer, length);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/to-absolute-index.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/to-indexed-object.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("// toObject with fallback for non-array-like ES3 strings\nvar IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ \"./node_modules/core-js/internals/indexed-object.js\");\nvar requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ \"./node_modules/core-js/internals/require-object-coercible.js\");\n\nmodule.exports = function (it) {\n  return IndexedObject(requireObjectCoercible(it));\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/to-indexed-object.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/to-integer-or-infinity.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer-or-infinity.js ***!
  \******************************************************************/
/***/ ((module) => {

eval("var ceil = Math.ceil;\nvar floor = Math.floor;\n\n// `ToIntegerOrInfinity` abstract operation\n// https://tc39.es/ecma262/#sec-tointegerorinfinity\nmodule.exports = function (argument) {\n  var number = +argument;\n  // eslint-disable-next-line no-self-compare -- safe\n  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/to-integer-or-infinity.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/to-length.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ \"./node_modules/core-js/internals/to-integer-or-infinity.js\");\n\nvar min = Math.min;\n\n// `ToLength` abstract operation\n// https://tc39.es/ecma262/#sec-tolength\nmodule.exports = function (argument) {\n  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/to-length.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/to-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ \"./node_modules/core-js/internals/require-object-coercible.js\");\n\nvar Object = global.Object;\n\n// `ToObject` abstract operation\n// https://tc39.es/ecma262/#sec-toobject\nmodule.exports = function (argument) {\n  return Object(requireObjectCoercible(argument));\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/to-object.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/to-primitive.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar call = __webpack_require__(/*! ../internals/function-call */ \"./node_modules/core-js/internals/function-call.js\");\nvar isObject = __webpack_require__(/*! ../internals/is-object */ \"./node_modules/core-js/internals/is-object.js\");\nvar isSymbol = __webpack_require__(/*! ../internals/is-symbol */ \"./node_modules/core-js/internals/is-symbol.js\");\nvar getMethod = __webpack_require__(/*! ../internals/get-method */ \"./node_modules/core-js/internals/get-method.js\");\nvar ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ \"./node_modules/core-js/internals/ordinary-to-primitive.js\");\nvar wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ \"./node_modules/core-js/internals/well-known-symbol.js\");\n\nvar TypeError = global.TypeError;\nvar TO_PRIMITIVE = wellKnownSymbol('toPrimitive');\n\n// `ToPrimitive` abstract operation\n// https://tc39.es/ecma262/#sec-toprimitive\nmodule.exports = function (input, pref) {\n  if (!isObject(input) || isSymbol(input)) return input;\n  var exoticToPrim = getMethod(input, TO_PRIMITIVE);\n  var result;\n  if (exoticToPrim) {\n    if (pref === undefined) pref = 'default';\n    result = call(exoticToPrim, input, pref);\n    if (!isObject(result) || isSymbol(result)) return result;\n    throw TypeError(\"Can't convert object to primitive value\");\n  }\n  if (pref === undefined) pref = 'number';\n  return ordinaryToPrimitive(input, pref);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/to-primitive.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/to-property-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/to-property-key.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ \"./node_modules/core-js/internals/to-primitive.js\");\nvar isSymbol = __webpack_require__(/*! ../internals/is-symbol */ \"./node_modules/core-js/internals/is-symbol.js\");\n\n// `ToPropertyKey` abstract operation\n// https://tc39.es/ecma262/#sec-topropertykey\nmodule.exports = function (argument) {\n  var key = toPrimitive(argument, 'string');\n  return isSymbol(key) ? key : key + '';\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/to-property-key.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/to-string-tag-support.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/to-string-tag-support.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ \"./node_modules/core-js/internals/well-known-symbol.js\");\n\nvar TO_STRING_TAG = wellKnownSymbol('toStringTag');\nvar test = {};\n\ntest[TO_STRING_TAG] = 'z';\n\nmodule.exports = String(test) === '[object z]';\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/to-string-tag-support.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/to-string.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-string.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar classof = __webpack_require__(/*! ../internals/classof */ \"./node_modules/core-js/internals/classof.js\");\n\nvar String = global.String;\n\nmodule.exports = function (argument) {\n  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');\n  return String(argument);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/to-string.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/try-to-string.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/try-to-string.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\n\nvar String = global.String;\n\nmodule.exports = function (argument) {\n  try {\n    return String(argument);\n  } catch (error) {\n    return 'Object';\n  }\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/try-to-string.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/uid.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\n\nvar id = 0;\nvar postfix = Math.random();\nvar toString = uncurryThis(1.0.toString);\n\nmodule.exports = function (key) {\n  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/uid.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/use-symbol-as-uid.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/use-symbol-as-uid.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/* eslint-disable es/no-symbol -- required for testing */\nvar NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ \"./node_modules/core-js/internals/native-symbol.js\");\n\nmodule.exports = NATIVE_SYMBOL\n  && !Symbol.sham\n  && typeof Symbol.iterator == 'symbol';\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/use-symbol-as-uid.js?");

/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar shared = __webpack_require__(/*! ../internals/shared */ \"./node_modules/core-js/internals/shared.js\");\nvar hasOwn = __webpack_require__(/*! ../internals/has-own-property */ \"./node_modules/core-js/internals/has-own-property.js\");\nvar uid = __webpack_require__(/*! ../internals/uid */ \"./node_modules/core-js/internals/uid.js\");\nvar NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ \"./node_modules/core-js/internals/native-symbol.js\");\nvar USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ \"./node_modules/core-js/internals/use-symbol-as-uid.js\");\n\nvar WellKnownSymbolsStore = shared('wks');\nvar Symbol = global.Symbol;\nvar symbolFor = Symbol && Symbol['for'];\nvar createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;\n\nmodule.exports = function (name) {\n  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {\n    var description = 'Symbol.' + name;\n    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {\n      WellKnownSymbolsStore[name] = Symbol[name];\n    } else if (USE_SYMBOL_AS_UID && symbolFor) {\n      WellKnownSymbolsStore[name] = symbolFor(description);\n    } else {\n      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);\n    }\n  } return WellKnownSymbolsStore[name];\n};\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/internals/well-known-symbol.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es.array.iterator.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.iterator.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\nvar toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ \"./node_modules/core-js/internals/to-indexed-object.js\");\nvar addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ \"./node_modules/core-js/internals/add-to-unscopables.js\");\nvar Iterators = __webpack_require__(/*! ../internals/iterators */ \"./node_modules/core-js/internals/iterators.js\");\nvar InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ \"./node_modules/core-js/internals/internal-state.js\");\nvar defineIterator = __webpack_require__(/*! ../internals/define-iterator */ \"./node_modules/core-js/internals/define-iterator.js\");\n\nvar ARRAY_ITERATOR = 'Array Iterator';\nvar setInternalState = InternalStateModule.set;\nvar getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);\n\n// `Array.prototype.entries` method\n// https://tc39.es/ecma262/#sec-array.prototype.entries\n// `Array.prototype.keys` method\n// https://tc39.es/ecma262/#sec-array.prototype.keys\n// `Array.prototype.values` method\n// https://tc39.es/ecma262/#sec-array.prototype.values\n// `Array.prototype[@@iterator]` method\n// https://tc39.es/ecma262/#sec-array.prototype-@@iterator\n// `CreateArrayIterator` internal method\n// https://tc39.es/ecma262/#sec-createarrayiterator\nmodule.exports = defineIterator(Array, 'Array', function (iterated, kind) {\n  setInternalState(this, {\n    type: ARRAY_ITERATOR,\n    target: toIndexedObject(iterated), // target\n    index: 0,                          // next index\n    kind: kind                         // kind\n  });\n// `%ArrayIteratorPrototype%.next` method\n// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next\n}, function () {\n  var state = getInternalState(this);\n  var target = state.target;\n  var kind = state.kind;\n  var index = state.index++;\n  if (!target || index >= target.length) {\n    state.target = undefined;\n    return { value: undefined, done: true };\n  }\n  if (kind == 'keys') return { value: index, done: false };\n  if (kind == 'values') return { value: target[index], done: false };\n  return { value: [index, target[index]], done: false };\n}, 'values');\n\n// argumentsList[@@iterator] is %ArrayProto_values%\n// https://tc39.es/ecma262/#sec-createunmappedargumentsobject\n// https://tc39.es/ecma262/#sec-createmappedargumentsobject\nIterators.Arguments = Iterators.Array;\n\n// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables\naddToUnscopables('keys');\naddToUnscopables('values');\naddToUnscopables('entries');\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/modules/es.array.iterator.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es.array.reverse.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.reverse.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\nvar $ = __webpack_require__(/*! ../internals/export */ \"./node_modules/core-js/internals/export.js\");\nvar uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ \"./node_modules/core-js/internals/function-uncurry-this.js\");\nvar isArray = __webpack_require__(/*! ../internals/is-array */ \"./node_modules/core-js/internals/is-array.js\");\n\nvar un$Reverse = uncurryThis([].reverse);\nvar test = [1, 2];\n\n// `Array.prototype.reverse` method\n// https://tc39.es/ecma262/#sec-array.prototype.reverse\n// fix for Safari 12.0 bug\n// https://bugs.webkit.org/show_bug.cgi?id=188794\n$({ target: 'Array', proto: true, forced: String(test) === String(test.reverse()) }, {\n  reverse: function reverse() {\n    // eslint-disable-next-line no-self-assign -- dirty hack\n    if (isArray(this)) this.length = this.length;\n    return un$Reverse(this);\n  }\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/modules/es.array.reverse.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es.regexp.exec.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.regexp.exec.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\nvar $ = __webpack_require__(/*! ../internals/export */ \"./node_modules/core-js/internals/export.js\");\nvar exec = __webpack_require__(/*! ../internals/regexp-exec */ \"./node_modules/core-js/internals/regexp-exec.js\");\n\n// `RegExp.prototype.exec` method\n// https://tc39.es/ecma262/#sec-regexp.prototype.exec\n$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {\n  exec: exec\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/modules/es.regexp.exec.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/es.string.search.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.search.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\nvar call = __webpack_require__(/*! ../internals/function-call */ \"./node_modules/core-js/internals/function-call.js\");\nvar fixRegExpWellKnownSymbolLogic = __webpack_require__(/*! ../internals/fix-regexp-well-known-symbol-logic */ \"./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js\");\nvar anObject = __webpack_require__(/*! ../internals/an-object */ \"./node_modules/core-js/internals/an-object.js\");\nvar requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ \"./node_modules/core-js/internals/require-object-coercible.js\");\nvar sameValue = __webpack_require__(/*! ../internals/same-value */ \"./node_modules/core-js/internals/same-value.js\");\nvar toString = __webpack_require__(/*! ../internals/to-string */ \"./node_modules/core-js/internals/to-string.js\");\nvar getMethod = __webpack_require__(/*! ../internals/get-method */ \"./node_modules/core-js/internals/get-method.js\");\nvar regExpExec = __webpack_require__(/*! ../internals/regexp-exec-abstract */ \"./node_modules/core-js/internals/regexp-exec-abstract.js\");\n\n// @@search logic\nfixRegExpWellKnownSymbolLogic('search', function (SEARCH, nativeSearch, maybeCallNative) {\n  return [\n    // `String.prototype.search` method\n    // https://tc39.es/ecma262/#sec-string.prototype.search\n    function search(regexp) {\n      var O = requireObjectCoercible(this);\n      var searcher = regexp == undefined ? undefined : getMethod(regexp, SEARCH);\n      return searcher ? call(searcher, regexp, O) : new RegExp(regexp)[SEARCH](toString(O));\n    },\n    // `RegExp.prototype[@@search]` method\n    // https://tc39.es/ecma262/#sec-regexp.prototype-@@search\n    function (string) {\n      var rx = anObject(this);\n      var S = toString(string);\n      var res = maybeCallNative(nativeSearch, rx, S);\n\n      if (res.done) return res.value;\n\n      var previousLastIndex = rx.lastIndex;\n      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;\n      var result = regExpExec(rx, S);\n      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;\n      return result === null ? -1 : result.index;\n    }\n  ];\n});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/modules/es.string.search.js?");

/***/ }),

/***/ "./node_modules/core-js/modules/web.dom-collections.iterator.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-collections.iterator.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("var global = __webpack_require__(/*! ../internals/global */ \"./node_modules/core-js/internals/global.js\");\nvar DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ \"./node_modules/core-js/internals/dom-iterables.js\");\nvar DOMTokenListPrototype = __webpack_require__(/*! ../internals/dom-token-list-prototype */ \"./node_modules/core-js/internals/dom-token-list-prototype.js\");\nvar ArrayIteratorMethods = __webpack_require__(/*! ../modules/es.array.iterator */ \"./node_modules/core-js/modules/es.array.iterator.js\");\nvar createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ \"./node_modules/core-js/internals/create-non-enumerable-property.js\");\nvar wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ \"./node_modules/core-js/internals/well-known-symbol.js\");\n\nvar ITERATOR = wellKnownSymbol('iterator');\nvar TO_STRING_TAG = wellKnownSymbol('toStringTag');\nvar ArrayValues = ArrayIteratorMethods.values;\n\nvar handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {\n  if (CollectionPrototype) {\n    // some Chrome versions have non-configurable methods on DOMTokenList\n    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {\n      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);\n    } catch (error) {\n      CollectionPrototype[ITERATOR] = ArrayValues;\n    }\n    if (!CollectionPrototype[TO_STRING_TAG]) {\n      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);\n    }\n    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {\n      // some Chrome versions have non-configurable methods on DOMTokenList\n      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {\n        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);\n      } catch (error) {\n        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];\n      }\n    }\n  }\n};\n\nfor (var COLLECTION_NAME in DOMIterables) {\n  handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype, COLLECTION_NAME);\n}\n\nhandlePrototype(DOMTokenListPrototype, 'DOMTokenList');\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/core-js/modules/web.dom-collections.iterator.js?");

/***/ }),

/***/ "./node_modules/rbush/rbush.min.js":
/*!*****************************************!*\
  !*** ./node_modules/rbush/rbush.min.js ***!
  \*****************************************/
/***/ (function(module) {

eval("!function(t,i){ true?module.exports=i():0}(this,function(){\"use strict\";function t(t,r,e,a,h){!function t(n,r,e,a,h){for(;a>e;){if(a-e>600){var o=a-e+1,s=r-e+1,l=Math.log(o),f=.5*Math.exp(2*l/3),u=.5*Math.sqrt(l*f*(o-f)/o)*(s-o/2<0?-1:1),m=Math.max(e,Math.floor(r-s*f/o+u)),c=Math.min(a,Math.floor(r+(o-s)*f/o+u));t(n,r,m,c,h)}var p=n[r],d=e,x=a;for(i(n,e,r),h(n[a],p)>0&&i(n,e,a);d<x;){for(i(n,d,x),d++,x--;h(n[d],p)<0;)d++;for(;h(n[x],p)>0;)x--}0===h(n[e],p)?i(n,e,x):i(n,++x,a),x<=r&&(e=x+1),r<=x&&(a=x-1)}}(t,r,e||0,a||t.length-1,h||n)}function i(t,i,n){var r=t[i];t[i]=t[n],t[n]=r}function n(t,i){return t<i?-1:t>i?1:0}var r=function(t){void 0===t&&(t=9),this._maxEntries=Math.max(4,t),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),this.clear()};function e(t,i,n){if(!n)return i.indexOf(t);for(var r=0;r<i.length;r++)if(n(t,i[r]))return r;return-1}function a(t,i){h(t,0,t.children.length,i,t)}function h(t,i,n,r,e){e||(e=p(null)),e.minX=1/0,e.minY=1/0,e.maxX=-1/0,e.maxY=-1/0;for(var a=i;a<n;a++){var h=t.children[a];o(e,t.leaf?r(h):h)}return e}function o(t,i){return t.minX=Math.min(t.minX,i.minX),t.minY=Math.min(t.minY,i.minY),t.maxX=Math.max(t.maxX,i.maxX),t.maxY=Math.max(t.maxY,i.maxY),t}function s(t,i){return t.minX-i.minX}function l(t,i){return t.minY-i.minY}function f(t){return(t.maxX-t.minX)*(t.maxY-t.minY)}function u(t){return t.maxX-t.minX+(t.maxY-t.minY)}function m(t,i){return t.minX<=i.minX&&t.minY<=i.minY&&i.maxX<=t.maxX&&i.maxY<=t.maxY}function c(t,i){return i.minX<=t.maxX&&i.minY<=t.maxY&&i.maxX>=t.minX&&i.maxY>=t.minY}function p(t){return{children:t,height:1,leaf:!0,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}}function d(i,n,r,e,a){for(var h=[n,r];h.length;)if(!((r=h.pop())-(n=h.pop())<=e)){var o=n+Math.ceil((r-n)/e/2)*e;t(i,o,n,r,a),h.push(n,o,o,r)}}return r.prototype.all=function(){return this._all(this.data,[])},r.prototype.search=function(t){var i=this.data,n=[];if(!c(t,i))return n;for(var r=this.toBBox,e=[];i;){for(var a=0;a<i.children.length;a++){var h=i.children[a],o=i.leaf?r(h):h;c(t,o)&&(i.leaf?n.push(h):m(t,o)?this._all(h,n):e.push(h))}i=e.pop()}return n},r.prototype.collides=function(t){var i=this.data;if(!c(t,i))return!1;for(var n=[];i;){for(var r=0;r<i.children.length;r++){var e=i.children[r],a=i.leaf?this.toBBox(e):e;if(c(t,a)){if(i.leaf||m(t,a))return!0;n.push(e)}}i=n.pop()}return!1},r.prototype.load=function(t){if(!t||!t.length)return this;if(t.length<this._minEntries){for(var i=0;i<t.length;i++)this.insert(t[i]);return this}var n=this._build(t.slice(),0,t.length-1,0);if(this.data.children.length)if(this.data.height===n.height)this._splitRoot(this.data,n);else{if(this.data.height<n.height){var r=this.data;this.data=n,n=r}this._insert(n,this.data.height-n.height-1,!0)}else this.data=n;return this},r.prototype.insert=function(t){return t&&this._insert(t,this.data.height-1),this},r.prototype.clear=function(){return this.data=p([]),this},r.prototype.remove=function(t,i){if(!t)return this;for(var n,r,a,h=this.data,o=this.toBBox(t),s=[],l=[];h||s.length;){if(h||(h=s.pop(),r=s[s.length-1],n=l.pop(),a=!0),h.leaf){var f=e(t,h.children,i);if(-1!==f)return h.children.splice(f,1),s.push(h),this._condense(s),this}a||h.leaf||!m(h,o)?r?(n++,h=r.children[n],a=!1):h=null:(s.push(h),l.push(n),n=0,r=h,h=h.children[0])}return this},r.prototype.toBBox=function(t){return t},r.prototype.compareMinX=function(t,i){return t.minX-i.minX},r.prototype.compareMinY=function(t,i){return t.minY-i.minY},r.prototype.toJSON=function(){return this.data},r.prototype.fromJSON=function(t){return this.data=t,this},r.prototype._all=function(t,i){for(var n=[];t;)t.leaf?i.push.apply(i,t.children):n.push.apply(n,t.children),t=n.pop();return i},r.prototype._build=function(t,i,n,r){var e,h=n-i+1,o=this._maxEntries;if(h<=o)return a(e=p(t.slice(i,n+1)),this.toBBox),e;r||(r=Math.ceil(Math.log(h)/Math.log(o)),o=Math.ceil(h/Math.pow(o,r-1))),(e=p([])).leaf=!1,e.height=r;var s=Math.ceil(h/o),l=s*Math.ceil(Math.sqrt(o));d(t,i,n,l,this.compareMinX);for(var f=i;f<=n;f+=l){var u=Math.min(f+l-1,n);d(t,f,u,s,this.compareMinY);for(var m=f;m<=u;m+=s){var c=Math.min(m+s-1,u);e.children.push(this._build(t,m,c,r-1))}}return a(e,this.toBBox),e},r.prototype._chooseSubtree=function(t,i,n,r){for(;r.push(i),!i.leaf&&r.length-1!==n;){for(var e=1/0,a=1/0,h=void 0,o=0;o<i.children.length;o++){var s=i.children[o],l=f(s),u=(m=t,c=s,(Math.max(c.maxX,m.maxX)-Math.min(c.minX,m.minX))*(Math.max(c.maxY,m.maxY)-Math.min(c.minY,m.minY))-l);u<a?(a=u,e=l<e?l:e,h=s):u===a&&l<e&&(e=l,h=s)}i=h||i.children[0]}var m,c;return i},r.prototype._insert=function(t,i,n){var r=n?t:this.toBBox(t),e=[],a=this._chooseSubtree(r,this.data,i,e);for(a.children.push(t),o(a,r);i>=0&&e[i].children.length>this._maxEntries;)this._split(e,i),i--;this._adjustParentBBoxes(r,e,i)},r.prototype._split=function(t,i){var n=t[i],r=n.children.length,e=this._minEntries;this._chooseSplitAxis(n,e,r);var h=this._chooseSplitIndex(n,e,r),o=p(n.children.splice(h,n.children.length-h));o.height=n.height,o.leaf=n.leaf,a(n,this.toBBox),a(o,this.toBBox),i?t[i-1].children.push(o):this._splitRoot(n,o)},r.prototype._splitRoot=function(t,i){this.data=p([t,i]),this.data.height=t.height+1,this.data.leaf=!1,a(this.data,this.toBBox)},r.prototype._chooseSplitIndex=function(t,i,n){for(var r,e,a,o,s,l,u,m=1/0,c=1/0,p=i;p<=n-i;p++){var d=h(t,0,p,this.toBBox),x=h(t,p,n,this.toBBox),v=(e=d,a=x,o=void 0,s=void 0,l=void 0,u=void 0,o=Math.max(e.minX,a.minX),s=Math.max(e.minY,a.minY),l=Math.min(e.maxX,a.maxX),u=Math.min(e.maxY,a.maxY),Math.max(0,l-o)*Math.max(0,u-s)),M=f(d)+f(x);v<m?(m=v,r=p,c=M<c?M:c):v===m&&M<c&&(c=M,r=p)}return r||n-i},r.prototype._chooseSplitAxis=function(t,i,n){var r=t.leaf?this.compareMinX:s,e=t.leaf?this.compareMinY:l;this._allDistMargin(t,i,n,r)<this._allDistMargin(t,i,n,e)&&t.children.sort(r)},r.prototype._allDistMargin=function(t,i,n,r){t.children.sort(r);for(var e=this.toBBox,a=h(t,0,i,e),s=h(t,n-i,n,e),l=u(a)+u(s),f=i;f<n-i;f++){var m=t.children[f];o(a,t.leaf?e(m):m),l+=u(a)}for(var c=n-i-1;c>=i;c--){var p=t.children[c];o(s,t.leaf?e(p):p),l+=u(s)}return l},r.prototype._adjustParentBBoxes=function(t,i,n){for(var r=n;r>=0;r--)o(i[r],t)},r.prototype._condense=function(t){for(var i=t.length-1,n=void 0;i>=0;i--)0===t[i].children.length?i>0?(n=t[i-1].children).splice(n.indexOf(t[i]),1):this.clear():a(t[i],this.toBBox)},r});\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/rbush/rbush.min.js?");

/***/ }),

/***/ "./node_modules/sat/SAT.js":
/*!*********************************!*\
  !*** ./node_modules/sat/SAT.js ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// Version 0.9.0 - Copyright 2012 - 2021 -  Jim Riecken <jimr@jimr.ca>\n//\n// Released under the MIT License - https://github.com/jriecken/sat-js\n//\n// A simple library for determining intersections of circles and\n// polygons using the Separating Axis Theorem.\n/** @preserve SAT.js - Version 0.9.0 - Copyright 2012 - 2021 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */\n\n/*global define: false, module: false*/\n/*jshint shadow:true, sub:true, forin:true, noarg:true, noempty:true,\n  eqeqeq:true, bitwise:true, strict:true, undef:true,\n  curly:true, browser:true */\n\n// Create a UMD wrapper for SAT. Works in:\n//\n//  - Plain browser via global SAT variable\n//  - AMD loader (like require.js)\n//  - Node.js\n//\n// The quoted properties all over the place are used so that the Closure Compiler\n// does not mangle the exposed API in advanced mode.\n/**\n * @param {*} root - The global scope\n * @param {Function} factory - Factory that creates SAT module\n */\n(function (root, factory) {\n  \"use strict\";\n  if (true) {\n    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n  } else {}\n}(this, function () {\n  \"use strict\";\n\n  var SAT = {};\n\n  //\n  // ## Vector\n  //\n  // Represents a vector in two dimensions with `x` and `y` properties.\n\n\n  // Create a new Vector, optionally passing in the `x` and `y` coordinates. If\n  // a coordinate is not specified, it will be set to `0`\n  /**\n   * @param {?number=} x The x position.\n   * @param {?number=} y The y position.\n   * @constructor\n   */\n  function Vector(x, y) {\n    this['x'] = x || 0;\n    this['y'] = y || 0;\n  }\n  SAT['Vector'] = Vector;\n  // Alias `Vector` as `V`\n  SAT['V'] = Vector;\n\n\n  // Copy the values of another Vector into this one.\n  /**\n   * @param {Vector} other The other Vector.\n   * @return {Vector} This for chaining.\n   */\n  Vector.prototype['copy'] = Vector.prototype.copy = function (other) {\n    this['x'] = other['x'];\n    this['y'] = other['y'];\n    return this;\n  };\n\n  // Create a new vector with the same coordinates as this on.\n  /**\n   * @return {Vector} The new cloned vector\n   */\n  Vector.prototype['clone'] = Vector.prototype.clone = function () {\n    return new Vector(this['x'], this['y']);\n  };\n\n  // Change this vector to be perpendicular to what it was before. (Effectively\n  // roatates it 90 degrees in a clockwise direction)\n  /**\n   * @return {Vector} This for chaining.\n   */\n  Vector.prototype['perp'] = Vector.prototype.perp = function () {\n    var x = this['x'];\n    this['x'] = this['y'];\n    this['y'] = -x;\n    return this;\n  };\n\n  // Rotate this vector (counter-clockwise) by the specified angle (in radians).\n  /**\n   * @param {number} angle The angle to rotate (in radians)\n   * @return {Vector} This for chaining.\n   */\n  Vector.prototype['rotate'] = Vector.prototype.rotate = function (angle) {\n    var x = this['x'];\n    var y = this['y'];\n    this['x'] = x * Math.cos(angle) - y * Math.sin(angle);\n    this['y'] = x * Math.sin(angle) + y * Math.cos(angle);\n    return this;\n  };\n\n  // Reverse this vector.\n  /**\n   * @return {Vector} This for chaining.\n   */\n  Vector.prototype['reverse'] = Vector.prototype.reverse = function () {\n    this['x'] = -this['x'];\n    this['y'] = -this['y'];\n    return this;\n  };\n\n\n  // Normalize this vector.  (make it have length of `1`)\n  /**\n   * @return {Vector} This for chaining.\n   */\n  Vector.prototype['normalize'] = Vector.prototype.normalize = function () {\n    var d = this.len();\n    if (d > 0) {\n      this['x'] = this['x'] / d;\n      this['y'] = this['y'] / d;\n    }\n    return this;\n  };\n\n  // Add another vector to this one.\n  /**\n   * @param {Vector} other The other Vector.\n   * @return {Vector} This for chaining.\n   */\n  Vector.prototype['add'] = Vector.prototype.add = function (other) {\n    this['x'] += other['x'];\n    this['y'] += other['y'];\n    return this;\n  };\n\n  // Subtract another vector from this one.\n  /**\n   * @param {Vector} other The other Vector.\n   * @return {Vector} This for chaiing.\n   */\n  Vector.prototype['sub'] = Vector.prototype.sub = function (other) {\n    this['x'] -= other['x'];\n    this['y'] -= other['y'];\n    return this;\n  };\n\n  // Scale this vector. An independent scaling factor can be provided\n  // for each axis, or a single scaling factor that will scale both `x` and `y`.\n  /**\n   * @param {number} x The scaling factor in the x direction.\n   * @param {?number=} y The scaling factor in the y direction.  If this\n   *   is not specified, the x scaling factor will be used.\n   * @return {Vector} This for chaining.\n   */\n  Vector.prototype['scale'] = Vector.prototype.scale = function (x, y) {\n    this['x'] *= x;\n    this['y'] *= typeof y != 'undefined' ? y : x;\n    return this;\n  };\n\n  // Project this vector on to another vector.\n  /**\n   * @param {Vector} other The vector to project onto.\n   * @return {Vector} This for chaining.\n   */\n  Vector.prototype['project'] = Vector.prototype.project = function (other) {\n    var amt = this.dot(other) / other.len2();\n    this['x'] = amt * other['x'];\n    this['y'] = amt * other['y'];\n    return this;\n  };\n\n  // Project this vector onto a vector of unit length. This is slightly more efficient\n  // than `project` when dealing with unit vectors.\n  /**\n   * @param {Vector} other The unit vector to project onto.\n   * @return {Vector} This for chaining.\n   */\n  Vector.prototype['projectN'] = Vector.prototype.projectN = function (other) {\n    var amt = this.dot(other);\n    this['x'] = amt * other['x'];\n    this['y'] = amt * other['y'];\n    return this;\n  };\n\n  // Reflect this vector on an arbitrary axis.\n  /**\n   * @param {Vector} axis The vector representing the axis.\n   * @return {Vector} This for chaining.\n   */\n  Vector.prototype['reflect'] = Vector.prototype.reflect = function (axis) {\n    var x = this['x'];\n    var y = this['y'];\n    this.project(axis).scale(2);\n    this['x'] -= x;\n    this['y'] -= y;\n    return this;\n  };\n\n  // Reflect this vector on an arbitrary axis (represented by a unit vector). This is\n  // slightly more efficient than `reflect` when dealing with an axis that is a unit vector.\n  /**\n   * @param {Vector} axis The unit vector representing the axis.\n   * @return {Vector} This for chaining.\n   */\n  Vector.prototype['reflectN'] = Vector.prototype.reflectN = function (axis) {\n    var x = this['x'];\n    var y = this['y'];\n    this.projectN(axis).scale(2);\n    this['x'] -= x;\n    this['y'] -= y;\n    return this;\n  };\n\n  // Get the dot product of this vector and another.\n  /**\n   * @param {Vector}  other The vector to dot this one against.\n   * @return {number} The dot product.\n   */\n  Vector.prototype['dot'] = Vector.prototype.dot = function (other) {\n    return this['x'] * other['x'] + this['y'] * other['y'];\n  };\n\n  // Get the squared length of this vector.\n  /**\n   * @return {number} The length^2 of this vector.\n   */\n  Vector.prototype['len2'] = Vector.prototype.len2 = function () {\n    return this.dot(this);\n  };\n\n  // Get the length of this vector.\n  /**\n   * @return {number} The length of this vector.\n   */\n  Vector.prototype['len'] = Vector.prototype.len = function () {\n    return Math.sqrt(this.len2());\n  };\n\n  // ## Circle\n  //\n  // Represents a circle with a position and a radius.\n\n  // Create a new circle, optionally passing in a position and/or radius. If no position\n  // is given, the circle will be at `(0,0)`. If no radius is provided, the circle will\n  // have a radius of `0`.\n  /**\n   * @param {Vector=} pos A vector representing the position of the center of the circle\n   * @param {?number=} r The radius of the circle\n   * @constructor\n   */\n  function Circle(pos, r) {\n    this['pos'] = pos || new Vector();\n    this['r'] = r || 0;\n    this['offset'] = new Vector();\n  }\n  SAT['Circle'] = Circle;\n\n  // Compute the axis-aligned bounding box (AABB) of this Circle.\n  //\n  // Note: Returns a _new_ `Box` each time you call this.\n  /**\n   * @return {Polygon} The AABB\n   */\n  Circle.prototype['getAABBAsBox'] = Circle.prototype.getAABBAsBox = function () {\n    var r = this['r'];\n    var corner = this['pos'].clone().add(this['offset']).sub(new Vector(r, r));\n    return new Box(corner, r * 2, r * 2);\n  };\n\n  // Compute the axis-aligned bounding box (AABB) of this Circle.\n  //\n  // Note: Returns a _new_ `Polygon` each time you call this.\n  /**\n   * @return {Polygon} The AABB\n   */\n  Circle.prototype['getAABB'] = Circle.prototype.getAABB = function () {\n    return this.getAABBAsBox().toPolygon();\n  };\n\n  // Set the current offset to apply to the radius.\n  /**\n   * @param {Vector} offset The new offset vector.\n   * @return {Circle} This for chaining.\n   */\n  Circle.prototype['setOffset'] = Circle.prototype.setOffset = function (offset) {\n    this['offset'] = offset;\n    return this;\n  };\n\n  // ## Polygon\n  //\n  // Represents a *convex* polygon with any number of points (specified in counter-clockwise order)\n  //\n  // Note: Do _not_ manually change the `points`, `angle`, or `offset` properties. Use the\n  // provided setters. Otherwise the calculated properties will not be updated correctly.\n  //\n  // `pos` can be changed directly.\n\n  // Create a new polygon, passing in a position vector, and an array of points (represented\n  // by vectors relative to the position vector). If no position is passed in, the position\n  // of the polygon will be `(0,0)`.\n  /**\n   * @param {Vector=} pos A vector representing the origin of the polygon. (all other\n   *   points are relative to this one)\n   * @param {Array<Vector>=} points An array of vectors representing the points in the polygon,\n   *   in counter-clockwise order.\n   * @constructor\n   */\n  function Polygon(pos, points) {\n    this['pos'] = pos || new Vector();\n    this['angle'] = 0;\n    this['offset'] = new Vector();\n    this.setPoints(points || []);\n  }\n  SAT['Polygon'] = Polygon;\n\n  // Set the points of the polygon. Any consecutive duplicate points will be combined.\n  //\n  // Note: The points are counter-clockwise *with respect to the coordinate system*.\n  // If you directly draw the points on a screen that has the origin at the top-left corner\n  // it will _appear_ visually that the points are being specified clockwise. This is just\n  // because of the inversion of the Y-axis when being displayed.\n  /**\n   * @param {Array<Vector>=} points An array of vectors representing the points in the polygon,\n   *   in counter-clockwise order.\n   * @return {Polygon} This for chaining.\n   */\n  Polygon.prototype['setPoints'] = Polygon.prototype.setPoints = function (points) {\n    // Only re-allocate if this is a new polygon or the number of points has changed.\n    var lengthChanged = !this['points'] || this['points'].length !== points.length;\n    if (lengthChanged) {\n      var i;\n      var calcPoints = this['calcPoints'] = [];\n      var edges = this['edges'] = [];\n      var normals = this['normals'] = [];\n      // Allocate the vector arrays for the calculated properties\n      for (i = 0; i < points.length; i++) {\n        // Remove consecutive duplicate points\n        var p1 = points[i];\n        var p2 = i < points.length - 1 ? points[i + 1] : points[0];\n        if (p1 !== p2 && p1.x === p2.x && p1.y === p2.y) {\n          points.splice(i, 1);\n          i -= 1;\n          continue;\n        }\n        calcPoints.push(new Vector());\n        edges.push(new Vector());\n        normals.push(new Vector());\n      }\n    }\n    this['points'] = points;\n    this._recalc();\n    return this;\n  };\n\n  // Set the current rotation angle of the polygon.\n  /**\n   * @param {number} angle The current rotation angle (in radians).\n   * @return {Polygon} This for chaining.\n   */\n  Polygon.prototype['setAngle'] = Polygon.prototype.setAngle = function (angle) {\n    this['angle'] = angle;\n    this._recalc();\n    return this;\n  };\n\n  // Set the current offset to apply to the `points` before applying the `angle` rotation.\n  /**\n   * @param {Vector} offset The new offset vector.\n   * @return {Polygon} This for chaining.\n   */\n  Polygon.prototype['setOffset'] = Polygon.prototype.setOffset = function (offset) {\n    this['offset'] = offset;\n    this._recalc();\n    return this;\n  };\n\n  // Rotates this polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).\n  //\n  // Note: This changes the **original** points (so any `angle` will be applied on top of this rotation).\n  /**\n   * @param {number} angle The angle to rotate (in radians)\n   * @return {Polygon} This for chaining.\n   */\n  Polygon.prototype['rotate'] = Polygon.prototype.rotate = function (angle) {\n    var points = this['points'];\n    var len = points.length;\n    for (var i = 0; i < len; i++) {\n      points[i].rotate(angle);\n    }\n    this._recalc();\n    return this;\n  };\n\n  // Translates the points of this polygon by a specified amount relative to the origin of *its own coordinate\n  // system* (i.e. `pos`).\n  //\n  // This is most useful to change the \"center point\" of a polygon. If you just want to move the whole polygon, change\n  // the coordinates of `pos`.\n  //\n  // Note: This changes the **original** points (so any `offset` will be applied on top of this translation)\n  /**\n   * @param {number} x The horizontal amount to translate.\n   * @param {number} y The vertical amount to translate.\n   * @return {Polygon} This for chaining.\n   */\n  Polygon.prototype['translate'] = Polygon.prototype.translate = function (x, y) {\n    var points = this['points'];\n    var len = points.length;\n    for (var i = 0; i < len; i++) {\n      points[i]['x'] += x;\n      points[i]['y'] += y;\n    }\n    this._recalc();\n    return this;\n  };\n\n\n  // Computes the calculated collision polygon. Applies the `angle` and `offset` to the original points then recalculates the\n  // edges and normals of the collision polygon.\n  /**\n   * @return {Polygon} This for chaining.\n   */\n  Polygon.prototype._recalc = function () {\n    // Calculated points - this is what is used for underlying collisions and takes into account\n    // the angle/offset set on the polygon.\n    var calcPoints = this['calcPoints'];\n    // The edges here are the direction of the `n`th edge of the polygon, relative to\n    // the `n`th point. If you want to draw a given edge from the edge value, you must\n    // first translate to the position of the starting point.\n    var edges = this['edges'];\n    // The normals here are the direction of the normal for the `n`th edge of the polygon, relative\n    // to the position of the `n`th point. If you want to draw an edge normal, you must first\n    // translate to the position of the starting point.\n    var normals = this['normals'];\n    // Copy the original points array and apply the offset/angle\n    var points = this['points'];\n    var offset = this['offset'];\n    var angle = this['angle'];\n    var len = points.length;\n    var i;\n    for (i = 0; i < len; i++) {\n      var calcPoint = calcPoints[i].copy(points[i]);\n      calcPoint['x'] += offset['x'];\n      calcPoint['y'] += offset['y'];\n      if (angle !== 0) {\n        calcPoint.rotate(angle);\n      }\n    }\n    // Calculate the edges/normals\n    for (i = 0; i < len; i++) {\n      var p1 = calcPoints[i];\n      var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];\n      var e = edges[i].copy(p2).sub(p1);\n      normals[i].copy(e).perp().normalize();\n    }\n    return this;\n  };\n\n\n  // Compute the axis-aligned bounding box. Any current state\n  // (translations/rotations) will be applied before constructing the AABB.\n  //\n  // Note: Returns a _new_ `Box` each time you call this.\n  /**\n   * @return {Polygon} The AABB\n   */\n  Polygon.prototype['getAABBAsBox'] = Polygon.prototype.getAABBAsBox = function () {\n    var points = this['calcPoints'];\n    var len = points.length;\n    var xMin = points[0]['x'];\n    var yMin = points[0]['y'];\n    var xMax = points[0]['x'];\n    var yMax = points[0]['y'];\n    for (var i = 1; i < len; i++) {\n      var point = points[i];\n      if (point['x'] < xMin) {\n        xMin = point['x'];\n      }\n      else if (point['x'] > xMax) {\n        xMax = point['x'];\n      }\n      if (point['y'] < yMin) {\n        yMin = point['y'];\n      }\n      else if (point['y'] > yMax) {\n        yMax = point['y'];\n      }\n    }\n    return new Box(this['pos'].clone().add(new Vector(xMin, yMin)), xMax - xMin, yMax - yMin);\n  };\n\n\n  // Compute the axis-aligned bounding box. Any current state\n  // (translations/rotations) will be applied before constructing the AABB.\n  //\n  // Note: Returns a _new_ `Polygon` each time you call this.\n  /**\n   * @return {Polygon} The AABB\n   */\n  Polygon.prototype['getAABB'] = Polygon.prototype.getAABB = function () {\n    return this.getAABBAsBox().toPolygon();\n  };\n\n  // Compute the centroid (geometric center) of the polygon. Any current state\n  // (translations/rotations) will be applied before computing the centroid.\n  //\n  // See https://en.wikipedia.org/wiki/Centroid#Centroid_of_a_polygon\n  //\n  // Note: Returns a _new_ `Vector` each time you call this.\n  /**\n   * @return {Vector} A Vector that contains the coordinates of the Centroid.\n   */\n  Polygon.prototype['getCentroid'] = Polygon.prototype.getCentroid = function () {\n    var points = this['calcPoints'];\n    var len = points.length;\n    var cx = 0;\n    var cy = 0;\n    var ar = 0;\n    for (var i = 0; i < len; i++) {\n      var p1 = points[i];\n      var p2 = i === len - 1 ? points[0] : points[i + 1]; // Loop around if last point\n      var a = p1['x'] * p2['y'] - p2['x'] * p1['y'];\n      cx += (p1['x'] + p2['x']) * a;\n      cy += (p1['y'] + p2['y']) * a;\n      ar += a;\n    }\n    ar = ar * 3; // we want 1 / 6 the area and we currently have 2*area\n    cx = cx / ar;\n    cy = cy / ar;\n    return new Vector(cx, cy);\n  };\n\n\n  // ## Box\n  //\n  // Represents an axis-aligned box, with a width and height.\n\n\n  // Create a new box, with the specified position, width, and height. If no position\n  // is given, the position will be `(0,0)`. If no width or height are given, they will\n  // be set to `0`.\n  /**\n   * @param {Vector=} pos A vector representing the bottom-left of the box (i.e. the smallest x and smallest y value).\n   * @param {?number=} w The width of the box.\n   * @param {?number=} h The height of the box.\n   * @constructor\n   */\n  function Box(pos, w, h) {\n    this['pos'] = pos || new Vector();\n    this['w'] = w || 0;\n    this['h'] = h || 0;\n  }\n  SAT['Box'] = Box;\n\n  // Returns a polygon whose edges are the same as this box.\n  /**\n   * @return {Polygon} A new Polygon that represents this box.\n   */\n  Box.prototype['toPolygon'] = Box.prototype.toPolygon = function () {\n    var pos = this['pos'];\n    var w = this['w'];\n    var h = this['h'];\n    return new Polygon(new Vector(pos['x'], pos['y']), [\n      new Vector(), new Vector(w, 0),\n      new Vector(w, h), new Vector(0, h)\n    ]);\n  };\n\n  // ## Response\n  //\n  // An object representing the result of an intersection. Contains:\n  //  - The two objects participating in the intersection\n  //  - The vector representing the minimum change necessary to extract the first object\n  //    from the second one (as well as a unit vector in that direction and the magnitude\n  //    of the overlap)\n  //  - Whether the first object is entirely inside the second, and vice versa.\n  /**\n   * @constructor\n   */\n  function Response() {\n    this['a'] = null;\n    this['b'] = null;\n    this['overlapN'] = new Vector();\n    this['overlapV'] = new Vector();\n    this.clear();\n  }\n  SAT['Response'] = Response;\n\n  // Set some values of the response back to their defaults.  Call this between tests if\n  // you are going to reuse a single Response object for multiple intersection tests (recommented\n  // as it will avoid allcating extra memory)\n  /**\n   * @return {Response} This for chaining\n   */\n  Response.prototype['clear'] = Response.prototype.clear = function () {\n    this['aInB'] = true;\n    this['bInA'] = true;\n    this['overlap'] = Number.MAX_VALUE;\n    return this;\n  };\n\n  // ## Object Pools\n\n  // A pool of `Vector` objects that are used in calculations to avoid\n  // allocating memory.\n  /**\n   * @type {Array<Vector>}\n   */\n  var T_VECTORS = [];\n  for (var i = 0; i < 10; i++) { T_VECTORS.push(new Vector()); }\n\n  // A pool of arrays of numbers used in calculations to avoid allocating\n  // memory.\n  /**\n   * @type {Array<Array<number>>}\n   */\n  var T_ARRAYS = [];\n  for (var i = 0; i < 5; i++) { T_ARRAYS.push([]); }\n\n  // Temporary response used for polygon hit detection.\n  /**\n   * @type {Response}\n   */\n  var T_RESPONSE = new Response();\n\n  // Tiny \"point\" polygon used for polygon hit detection.\n  /**\n   * @type {Polygon}\n   */\n  var TEST_POINT = new Box(new Vector(), 0.000001, 0.000001).toPolygon();\n\n  // ## Helper Functions\n\n  // Flattens the specified array of points onto a unit vector axis,\n  // resulting in a one dimensional range of the minimum and\n  // maximum value on that axis.\n  /**\n   * @param {Array<Vector>} points The points to flatten.\n   * @param {Vector} normal The unit vector axis to flatten on.\n   * @param {Array<number>} result An array.  After calling this function,\n   *   result[0] will be the minimum value,\n   *   result[1] will be the maximum value.\n   */\n  function flattenPointsOn(points, normal, result) {\n    var min = Number.MAX_VALUE;\n    var max = -Number.MAX_VALUE;\n    var len = points.length;\n    for (var i = 0; i < len; i++) {\n      // The magnitude of the projection of the point onto the normal\n      var dot = points[i].dot(normal);\n      if (dot < min) { min = dot; }\n      if (dot > max) { max = dot; }\n    }\n    result[0] = min; result[1] = max;\n  }\n\n  // Check whether two convex polygons are separated by the specified\n  // axis (must be a unit vector).\n  /**\n   * @param {Vector} aPos The position of the first polygon.\n   * @param {Vector} bPos The position of the second polygon.\n   * @param {Array<Vector>} aPoints The points in the first polygon.\n   * @param {Array<Vector>} bPoints The points in the second polygon.\n   * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons\n   *   will be projected onto this axis.\n   * @param {Response=} response A Response object (optional) which will be populated\n   *   if the axis is not a separating axis.\n   * @return {boolean} true if it is a separating axis, false otherwise.  If false,\n   *   and a response is passed in, information about how much overlap and\n   *   the direction of the overlap will be populated.\n   */\n  function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {\n    var rangeA = T_ARRAYS.pop();\n    var rangeB = T_ARRAYS.pop();\n    // The magnitude of the offset between the two polygons\n    var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);\n    var projectedOffset = offsetV.dot(axis);\n    // Project the polygons onto the axis.\n    flattenPointsOn(aPoints, axis, rangeA);\n    flattenPointsOn(bPoints, axis, rangeB);\n    // Move B's range to its position relative to A.\n    rangeB[0] += projectedOffset;\n    rangeB[1] += projectedOffset;\n    // Check if there is a gap. If there is, this is a separating axis and we can stop\n    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {\n      T_VECTORS.push(offsetV);\n      T_ARRAYS.push(rangeA);\n      T_ARRAYS.push(rangeB);\n      return true;\n    }\n    // This is not a separating axis. If we're calculating a response, calculate the overlap.\n    if (response) {\n      var overlap = 0;\n      // A starts further left than B\n      if (rangeA[0] < rangeB[0]) {\n        response['aInB'] = false;\n        // A ends before B does. We have to pull A out of B\n        if (rangeA[1] < rangeB[1]) {\n          overlap = rangeA[1] - rangeB[0];\n          response['bInA'] = false;\n          // B is fully inside A.  Pick the shortest way out.\n        } else {\n          var option1 = rangeA[1] - rangeB[0];\n          var option2 = rangeB[1] - rangeA[0];\n          overlap = option1 < option2 ? option1 : -option2;\n        }\n        // B starts further left than A\n      } else {\n        response['bInA'] = false;\n        // B ends before A ends. We have to push A out of B\n        if (rangeA[1] > rangeB[1]) {\n          overlap = rangeA[0] - rangeB[1];\n          response['aInB'] = false;\n          // A is fully inside B.  Pick the shortest way out.\n        } else {\n          var option1 = rangeA[1] - rangeB[0];\n          var option2 = rangeB[1] - rangeA[0];\n          overlap = option1 < option2 ? option1 : -option2;\n        }\n      }\n      // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.\n      var absOverlap = Math.abs(overlap);\n      if (absOverlap < response['overlap']) {\n        response['overlap'] = absOverlap;\n        response['overlapN'].copy(axis);\n        if (overlap < 0) {\n          response['overlapN'].reverse();\n        }\n      }\n    }\n    T_VECTORS.push(offsetV);\n    T_ARRAYS.push(rangeA);\n    T_ARRAYS.push(rangeB);\n    return false;\n  }\n  SAT['isSeparatingAxis'] = isSeparatingAxis;\n\n  // Calculates which Voronoi region a point is on a line segment.\n  // It is assumed that both the line and the point are relative to `(0,0)`\n  //\n  //            |       (0)      |\n  //     (-1)  [S]--------------[E]  (1)\n  //            |       (0)      |\n  /**\n   * @param {Vector} line The line segment.\n   * @param {Vector} point The point.\n   * @return  {number} LEFT_VORONOI_REGION (-1) if it is the left region,\n   *          MIDDLE_VORONOI_REGION (0) if it is the middle region,\n   *          RIGHT_VORONOI_REGION (1) if it is the right region.\n   */\n  function voronoiRegion(line, point) {\n    var len2 = line.len2();\n    var dp = point.dot(line);\n    // If the point is beyond the start of the line, it is in the\n    // left voronoi region.\n    if (dp < 0) { return LEFT_VORONOI_REGION; }\n    // If the point is beyond the end of the line, it is in the\n    // right voronoi region.\n    else if (dp > len2) { return RIGHT_VORONOI_REGION; }\n    // Otherwise, it's in the middle one.\n    else { return MIDDLE_VORONOI_REGION; }\n  }\n  // Constants for Voronoi regions\n  /**\n   * @const\n   */\n  var LEFT_VORONOI_REGION = -1;\n  /**\n   * @const\n   */\n  var MIDDLE_VORONOI_REGION = 0;\n  /**\n   * @const\n   */\n  var RIGHT_VORONOI_REGION = 1;\n\n  // ## Collision Tests\n\n  // Check if a point is inside a circle.\n  /**\n   * @param {Vector} p The point to test.\n   * @param {Circle} c The circle to test.\n   * @return {boolean} true if the point is inside the circle, false if it is not.\n   */\n  function pointInCircle(p, c) {\n    var differenceV = T_VECTORS.pop().copy(p).sub(c['pos']).sub(c['offset']);\n    var radiusSq = c['r'] * c['r'];\n    var distanceSq = differenceV.len2();\n    T_VECTORS.push(differenceV);\n    // If the distance between is smaller than the radius then the point is inside the circle.\n    return distanceSq <= radiusSq;\n  }\n  SAT['pointInCircle'] = pointInCircle;\n\n  // Check if a point is inside a convex polygon.\n  /**\n   * @param {Vector} p The point to test.\n   * @param {Polygon} poly The polygon to test.\n   * @return {boolean} true if the point is inside the polygon, false if it is not.\n   */\n  function pointInPolygon(p, poly) {\n    TEST_POINT['pos'].copy(p);\n    T_RESPONSE.clear();\n    var result = testPolygonPolygon(TEST_POINT, poly, T_RESPONSE);\n    if (result) {\n      result = T_RESPONSE['aInB'];\n    }\n    return result;\n  }\n  SAT['pointInPolygon'] = pointInPolygon;\n\n  // Check if two circles collide.\n  /**\n   * @param {Circle} a The first circle.\n   * @param {Circle} b The second circle.\n   * @param {Response=} response Response object (optional) that will be populated if\n   *   the circles intersect.\n   * @return {boolean} true if the circles intersect, false if they don't.\n   */\n  function testCircleCircle(a, b, response) {\n    // Check if the distance between the centers of the two\n    // circles is greater than their combined radius.\n    var differenceV = T_VECTORS.pop().copy(b['pos']).add(b['offset']).sub(a['pos']).sub(a['offset']);\n    var totalRadius = a['r'] + b['r'];\n    var totalRadiusSq = totalRadius * totalRadius;\n    var distanceSq = differenceV.len2();\n    // If the distance is bigger than the combined radius, they don't intersect.\n    if (distanceSq > totalRadiusSq) {\n      T_VECTORS.push(differenceV);\n      return false;\n    }\n    // They intersect.  If we're calculating a response, calculate the overlap.\n    if (response) {\n      var dist = Math.sqrt(distanceSq);\n      response['a'] = a;\n      response['b'] = b;\n      response['overlap'] = totalRadius - dist;\n      response['overlapN'].copy(differenceV.normalize());\n      response['overlapV'].copy(differenceV).scale(response['overlap']);\n      response['aInB'] = a['r'] <= b['r'] && dist <= b['r'] - a['r'];\n      response['bInA'] = b['r'] <= a['r'] && dist <= a['r'] - b['r'];\n    }\n    T_VECTORS.push(differenceV);\n    return true;\n  }\n  SAT['testCircleCircle'] = testCircleCircle;\n\n  // Check if a polygon and a circle collide.\n  /**\n   * @param {Polygon} polygon The polygon.\n   * @param {Circle} circle The circle.\n   * @param {Response=} response Response object (optional) that will be populated if\n   *   they interset.\n   * @return {boolean} true if they intersect, false if they don't.\n   */\n  function testPolygonCircle(polygon, circle, response) {\n    // Get the position of the circle relative to the polygon.\n    var circlePos = T_VECTORS.pop().copy(circle['pos']).add(circle['offset']).sub(polygon['pos']);\n    var radius = circle['r'];\n    var radius2 = radius * radius;\n    var points = polygon['calcPoints'];\n    var len = points.length;\n    var edge = T_VECTORS.pop();\n    var point = T_VECTORS.pop();\n\n    // For each edge in the polygon:\n    for (var i = 0; i < len; i++) {\n      var next = i === len - 1 ? 0 : i + 1;\n      var prev = i === 0 ? len - 1 : i - 1;\n      var overlap = 0;\n      var overlapN = null;\n\n      // Get the edge.\n      edge.copy(polygon['edges'][i]);\n      // Calculate the center of the circle relative to the starting point of the edge.\n      point.copy(circlePos).sub(points[i]);\n\n      // If the distance between the center of the circle and the point\n      // is bigger than the radius, the polygon is definitely not fully in\n      // the circle.\n      if (response && point.len2() > radius2) {\n        response['aInB'] = false;\n      }\n\n      // Calculate which Voronoi region the center of the circle is in.\n      var region = voronoiRegion(edge, point);\n      // If it's the left region:\n      if (region === LEFT_VORONOI_REGION) {\n        // We need to make sure we're in the RIGHT_VORONOI_REGION of the previous edge.\n        edge.copy(polygon['edges'][prev]);\n        // Calculate the center of the circle relative the starting point of the previous edge\n        var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);\n        region = voronoiRegion(edge, point2);\n        if (region === RIGHT_VORONOI_REGION) {\n          // It's in the region we want.  Check if the circle intersects the point.\n          var dist = point.len();\n          if (dist > radius) {\n            // No intersection\n            T_VECTORS.push(circlePos);\n            T_VECTORS.push(edge);\n            T_VECTORS.push(point);\n            T_VECTORS.push(point2);\n            return false;\n          } else if (response) {\n            // It intersects, calculate the overlap.\n            response['bInA'] = false;\n            overlapN = point.normalize();\n            overlap = radius - dist;\n          }\n        }\n        T_VECTORS.push(point2);\n        // If it's the right region:\n      } else if (region === RIGHT_VORONOI_REGION) {\n        // We need to make sure we're in the left region on the next edge\n        edge.copy(polygon['edges'][next]);\n        // Calculate the center of the circle relative to the starting point of the next edge.\n        point.copy(circlePos).sub(points[next]);\n        region = voronoiRegion(edge, point);\n        if (region === LEFT_VORONOI_REGION) {\n          // It's in the region we want.  Check if the circle intersects the point.\n          var dist = point.len();\n          if (dist > radius) {\n            // No intersection\n            T_VECTORS.push(circlePos);\n            T_VECTORS.push(edge);\n            T_VECTORS.push(point);\n            return false;\n          } else if (response) {\n            // It intersects, calculate the overlap.\n            response['bInA'] = false;\n            overlapN = point.normalize();\n            overlap = radius - dist;\n          }\n        }\n        // Otherwise, it's the middle region:\n      } else {\n        // Need to check if the circle is intersecting the edge,\n        // Change the edge into its \"edge normal\".\n        var normal = edge.perp().normalize();\n        // Find the perpendicular distance between the center of the\n        // circle and the edge.\n        var dist = point.dot(normal);\n        var distAbs = Math.abs(dist);\n        // If the circle is on the outside of the edge, there is no intersection.\n        if (dist > 0 && distAbs > radius) {\n          // No intersection\n          T_VECTORS.push(circlePos);\n          T_VECTORS.push(normal);\n          T_VECTORS.push(point);\n          return false;\n        } else if (response) {\n          // It intersects, calculate the overlap.\n          overlapN = normal;\n          overlap = radius - dist;\n          // If the center of the circle is on the outside of the edge, or part of the\n          // circle is on the outside, the circle is not fully inside the polygon.\n          if (dist >= 0 || overlap < 2 * radius) {\n            response['bInA'] = false;\n          }\n        }\n      }\n\n      // If this is the smallest overlap we've seen, keep it.\n      // (overlapN may be null if the circle was in the wrong Voronoi region).\n      if (overlapN && response && Math.abs(overlap) < Math.abs(response['overlap'])) {\n        response['overlap'] = overlap;\n        response['overlapN'].copy(overlapN);\n      }\n    }\n\n    // Calculate the final overlap vector - based on the smallest overlap.\n    if (response) {\n      response['a'] = polygon;\n      response['b'] = circle;\n      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);\n    }\n    T_VECTORS.push(circlePos);\n    T_VECTORS.push(edge);\n    T_VECTORS.push(point);\n    return true;\n  }\n  SAT['testPolygonCircle'] = testPolygonCircle;\n\n  // Check if a circle and a polygon collide.\n  //\n  // **NOTE:** This is slightly less efficient than polygonCircle as it just\n  // runs polygonCircle and reverses everything at the end.\n  /**\n   * @param {Circle} circle The circle.\n   * @param {Polygon} polygon The polygon.\n   * @param {Response=} response Response object (optional) that will be populated if\n   *   they interset.\n   * @return {boolean} true if they intersect, false if they don't.\n   */\n  function testCirclePolygon(circle, polygon, response) {\n    // Test the polygon against the circle.\n    var result = testPolygonCircle(polygon, circle, response);\n    if (result && response) {\n      // Swap A and B in the response.\n      var a = response['a'];\n      var aInB = response['aInB'];\n      response['overlapN'].reverse();\n      response['overlapV'].reverse();\n      response['a'] = response['b'];\n      response['b'] = a;\n      response['aInB'] = response['bInA'];\n      response['bInA'] = aInB;\n    }\n    return result;\n  }\n  SAT['testCirclePolygon'] = testCirclePolygon;\n\n  // Checks whether polygons collide.\n  /**\n   * @param {Polygon} a The first polygon.\n   * @param {Polygon} b The second polygon.\n   * @param {Response=} response Response object (optional) that will be populated if\n   *   they interset.\n   * @return {boolean} true if they intersect, false if they don't.\n   */\n  function testPolygonPolygon(a, b, response) {\n    var aPoints = a['calcPoints'];\n    var aLen = aPoints.length;\n    var bPoints = b['calcPoints'];\n    var bLen = bPoints.length;\n    // If any of the edge normals of A is a separating axis, no intersection.\n    for (var i = 0; i < aLen; i++) {\n      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, a['normals'][i], response)) {\n        return false;\n      }\n    }\n    // If any of the edge normals of B is a separating axis, no intersection.\n    for (var i = 0; i < bLen; i++) {\n      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, b['normals'][i], response)) {\n        return false;\n      }\n    }\n    // Since none of the edge normals of A or B are a separating axis, there is an intersection\n    // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the\n    // final overlap vector.\n    if (response) {\n      response['a'] = a;\n      response['b'] = b;\n      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);\n    }\n    return true;\n  }\n  SAT['testPolygonPolygon'] = testPolygonPolygon;\n\n  return SAT;\n}));\n\n\n//# sourceURL=webpack://detect-collisions/./node_modules/sat/SAT.js?");

/***/ }),

/***/ "./src/demo/index.js":
/*!***************************!*\
  !*** ./src/demo/index.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("if (window.location.search.indexOf(\"?stress\") !== -1) {\n  const { Stress } = __webpack_require__(/*! ./stress */ \"./src/demo/stress.js\");\n\n  document.body.appendChild(new Stress().element);\n} else {\n  const { Tank } = __webpack_require__(/*! ./tank */ \"./src/demo/tank.js\");\n\n  document.body.appendChild(new Tank().element);\n}\n\n\n//# sourceURL=webpack://detect-collisions/./src/demo/index.js?");

/***/ }),

/***/ "./src/demo/stress.js":
/*!****************************!*\
  !*** ./src/demo/stress.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Stress\": () => (/* binding */ Stress)\n/* harmony export */ });\nconst { System } = __webpack_require__(/*! ../../dist */ \"./dist/index.js\");\n\nconst width = document.body.offsetWidth;\nconst height = document.body.offsetHeight;\nconst count = 500;\nconst speed = 1;\nconst size = 5;\n\nlet frame = 0;\nlet fps_total = 0;\n\nclass Stress {\n  constructor() {\n    this.element = document.createElement(\"div\");\n    this.canvas = document.createElement(\"canvas\");\n    this.context = this.canvas.getContext(\"2d\");\n    this.collisions = new System();\n    this.bodies = [];\n    this.polygons = 0;\n    this.circles = 0;\n\n    this.canvas.width = width;\n    this.canvas.height = height;\n    this.context.font = \"24px Arial\";\n\n    // World bounds\n    this.bounds = [\n      this.collisions.createPolygon({ x: 0, y: 0 }, [\n        { x: 0, y: 0 },\n        { x: width, y: 0 },\n      ]),\n      this.collisions.createPolygon({ x: 0, y: 0 }, [\n        { x: width, y: 0 },\n        { x: width, y: height },\n      ]),\n      this.collisions.createPolygon({ x: 0, y: 0 }, [\n        { x: width, y: height },\n        { x: 0, y: height },\n      ]),\n      this.collisions.createPolygon({ x: 0, y: 0 }, [\n        { x: 0, y: height },\n        { x: 0, y: 0 },\n      ]),\n    ];\n\n    for (let i = 0; i < count; ++i) {\n      this.createShape(!random(0, 49));\n    }\n\n    this.element.innerHTML = `\n      <div><b>Total:</b> ${count}</div>\n      <div><b>Polygons:</b> ${this.polygons}</div>\n      <div><b>Circles:</b> ${this.circles}</div>\n      <div><label><input id=\"bvh\" type=\"checkbox\"> Show Bounding Volume Hierarchy</label></div>\n    `;\n\n    this.bvh_checkbox = this.element.querySelector(\"#bvh\");\n\n    if (this.canvas instanceof Node) {\n      this.element.appendChild(this.canvas);\n    }\n\n    const self = this;\n\n    let time = performance.now();\n\n    this.frame = requestAnimationFrame(function frame() {\n      const current_time = performance.now();\n\n      try {\n        self.update(1000 / (current_time - time));\n      } catch (err) {\n        console.warn(err.message || err);\n      }\n\n      self.frame = requestAnimationFrame(frame);\n\n      time = current_time;\n    });\n  }\n\n  update(fps) {\n    ++frame;\n    fps_total += fps;\n\n    const average_fps = Math.round(fps_total / frame);\n\n    if (frame > 100) {\n      frame = 1;\n      fps_total = average_fps;\n    }\n\n    this.bodies.forEach((body) => {\n      body.pos.x += body.direction_x * speed;\n      body.pos.y += body.direction_y * speed;\n    });\n\n    this.collisions.update();\n    this.collisions.checkAll(({ a, overlapV }) => {\n      if (this.bounds.includes(a)) {\n        return;\n      }\n\n      const direction = (random(0, 360) * Math.PI) / 180;\n\n      a.pos.x -= overlapV.x;\n      a.pos.y -= overlapV.y;\n\n      a.direction_x = Math.cos(direction);\n      a.direction_y = Math.sin(direction);\n    });\n\n    // Clear the canvas\n    this.context.fillStyle = \"#000000\";\n    this.context.fillRect(0, 0, width, height);\n\n    // Render the bodies\n    this.context.strokeStyle = \"#FFFFFF\";\n    this.context.beginPath();\n    this.collisions.draw(this.context);\n    this.context.stroke();\n\n    // Render the BVH\n    if (this.bvh_checkbox.checked) {\n      this.context.strokeStyle = \"#00FF00\";\n      this.context.beginPath();\n      this.collisions.drawBVH(this.context);\n      this.context.stroke();\n    }\n\n    // Render the FPS\n    this.context.fillStyle = \"#FFCC00\";\n    this.context.fillText(average_fps, 10, 30);\n  }\n\n  createShape(large) {\n    const min_size = size * 0.75 * (large ? 3 : 1);\n    const max_size = size * 1.25 * (large ? 5 : 1);\n    const x = random(0, width);\n    const y = random(0, height);\n    const direction = (random(0, 360) * Math.PI) / 180;\n\n    let body;\n\n    if (random(0, 2)) {\n      body = this.collisions.createCircle({ x, y }, random(min_size, max_size));\n\n      ++this.circles;\n    } else {\n      body = this.collisions.createPolygon(\n        {\n          x,\n          y,\n        },\n        [\n          { x: -random(min_size, max_size), y: -random(min_size, max_size) },\n          { x: random(min_size, max_size), y: -random(min_size, max_size) },\n          { x: random(min_size, max_size), y: random(min_size, max_size) },\n          { x: -random(min_size, max_size), y: random(3, size) },\n        ],\n        (random(0, 360) * Math.PI) / 180\n      );\n\n      ++this.polygons;\n    }\n\n    body.direction_x = Math.cos(direction);\n    body.direction_y = Math.sin(direction);\n\n    this.bodies.push(body);\n  }\n}\n\nfunction random(min, max) {\n  return Math.floor(Math.random() * max) + min;\n}\n\n\n//# sourceURL=webpack://detect-collisions/./src/demo/stress.js?");

/***/ }),

/***/ "./src/demo/tank.js":
/*!**************************!*\
  !*** ./src/demo/tank.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Tank\": () => (/* binding */ Tank)\n/* harmony export */ });\nconst { System } = __webpack_require__(/*! ../../dist */ \"./dist/index.js\");\n\nclass Tank {\n  constructor() {\n    const width = document.body.offsetWidth;\n    const height = document.body.offsetHeight;\n    const collisions = new System();\n\n    this.element = document.createElement(\"div\");\n    this.canvas = document.createElement(\"canvas\");\n    this.context = this.canvas.getContext(\"2d\");\n    this.collisions = collisions;\n    this.bodies = [];\n\n    this.canvas.width = width;\n    this.canvas.height = height;\n    this.player = null;\n\n    this.up = false;\n    this.down = false;\n    this.left = false;\n    this.right = false;\n\n    this.element.innerHTML = `\n      <div><b>W, S</b> - Accelerate/Decelerate</div>\n      <div><b>A, D</b> - Turn</div>\n      <div><label><input id=\"bvh\" type=\"checkbox\"> Show Bounding Volume Hierarchy</label></div>\n    `;\n\n    const updateKeys = (e) => {\n      const keydown = e.type === \"keydown\";\n      const key = e.key.toLowerCase();\n\n      key === \"w\" && (this.up = keydown);\n      key === \"s\" && (this.down = keydown);\n      key === \"a\" && (this.left = keydown);\n      key === \"d\" && (this.right = keydown);\n    };\n\n    document.addEventListener(\"keydown\", updateKeys);\n    document.addEventListener(\"keyup\", updateKeys);\n\n    this.bvh_checkbox = this.element.querySelector(\"#bvh\");\n\n    if (this.canvas instanceof Node) {\n      this.element.appendChild(this.canvas);\n    }\n\n    this.createPlayer(400, 300);\n    this.createMap(800, 600);\n\n    const frame = () => {\n      try {\n        this.update();\n      } catch (err) {\n        console.warn(err.message || err);\n      }\n      requestAnimationFrame(frame);\n    };\n\n    frame();\n  }\n\n  update() {\n    this.handleInput();\n    this.processGameLogic();\n    this.handleCollisions();\n    this.render();\n  }\n\n  handleInput() {\n    this.up && (this.player.velocity += 0.1);\n    this.down && (this.player.velocity -= 0.1);\n\n    if (this.left) {\n      this.player.setAngle(this.player.angle - 0.04);\n    }\n    if (this.right) {\n      this.player.setAngle(this.player.angle + 0.04);\n    }\n  }\n\n  processGameLogic() {\n    const x = Math.cos(this.player.angle);\n    const y = Math.sin(this.player.angle);\n\n    if (this.player.velocity > 0) {\n      this.player.velocity -= 0.05;\n\n      if (this.player.velocity > 3) {\n        this.player.velocity = 3;\n      }\n    } else if (this.player.velocity < 0) {\n      this.player.velocity += 0.05;\n\n      if (this.player.velocity < -2) {\n        this.player.velocity = -2;\n      }\n    }\n\n    if (!Math.round(this.player.velocity * 100)) {\n      this.player.velocity = 0;\n    }\n\n    if (this.player.velocity) {\n      this.player.pos.x += x * this.player.velocity;\n      this.player.pos.y += y * this.player.velocity;\n    }\n  }\n\n  handleCollisions() {\n    this.collisions.update();\n    this.collisions.checkOne(this.player, (result) => {\n      this.player.pos.x -= result.overlapV.x;\n      this.player.pos.y -= result.overlapV.y;\n      this.player.velocity *= 0.9;\n    });\n  }\n\n  render() {\n    this.context.fillStyle = \"#000000\";\n    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);\n\n    this.context.strokeStyle = \"#FFFFFF\";\n    this.context.beginPath();\n    this.collisions.draw(this.context);\n    this.context.stroke();\n\n    if (this.bvh_checkbox.checked) {\n      this.context.strokeStyle = \"#00FF00\";\n      this.context.beginPath();\n      this.collisions.drawBVH(this.context);\n      this.context.stroke();\n    }\n  }\n\n  createPlayer(x, y, size = 13) {\n    this.player = this.createPolygon(x, y, [\n      [-size * 1.3, -size],\n      [size * 1.3, -size],\n      [size * 1.3, size],\n      [-size * 1.3, size],\n    ]);\n\n    this.player.setAngle(0.2);\n    this.player.velocity = 0;\n  }\n\n  scaleX(x) {\n    return (x / 800) * this.canvas.width;\n  }\n\n  scaleY(y) {\n    return (y / 600) * this.canvas.height;\n  }\n\n  createCircle(x, y, radius) {\n    this.collisions.createCircle(\n      { x: this.scaleX(x), y: this.scaleY(y) },\n      radius\n    );\n  }\n\n  createPolygon(x, y, points, angle) {\n    const scaledPoints = points.map(([pointX, pointY]) => ({\n      x: this.scaleX(pointX),\n      y: this.scaleY(pointY),\n    }));\n\n    return this.collisions.createPolygon(\n      { x: this.scaleX(x), y: this.scaleY(y) },\n      scaledPoints,\n      angle\n    );\n  }\n\n  createMap(width, height) {\n    // World bounds\n    this.createPolygon(0, 0, [\n      [0, 0],\n      [width, 0],\n    ]);\n    this.createPolygon(0, 0, [\n      [width, 0],\n      [width, height],\n    ]);\n    this.createPolygon(0, 0, [\n      [width, height],\n      [0, height],\n    ]);\n    this.createPolygon(0, 0, [\n      [0, height],\n      [0, 0],\n    ]);\n\n    // Factory\n    this.createPolygon(\n      100,\n      100,\n      [\n        [-50, -50],\n        [50, -50],\n        [50, 50],\n        [-50, 50],\n      ],\n      0.4\n    );\n    this.createPolygon(\n      190,\n      105,\n      [\n        [-20, -20],\n        [20, -20],\n        [20, 20],\n        [-20, 20],\n      ],\n      0.4\n    );\n    this.createCircle(170, 140, 8);\n    this.createCircle(185, 155, 8);\n    this.createCircle(165, 165, 8);\n    this.createCircle(145, 165, 8);\n\n    // Airstrip\n    this.createPolygon(\n      230,\n      50,\n      [\n        [-150, -30],\n        [150, -30],\n        [150, 30],\n        [-150, 30],\n      ],\n      0.4\n    );\n\n    // HQ\n    this.createPolygon(\n      100,\n      500,\n      [\n        [-40, -50],\n        [40, -50],\n        [50, 50],\n        [-50, 50],\n      ],\n      0.2\n    );\n    this.createCircle(180, 490, 20);\n    this.createCircle(175, 540, 20);\n\n    // Barracks\n    this.createPolygon(\n      400,\n      500,\n      [\n        [-60, -20],\n        [60, -20],\n        [60, 20],\n        [-60, 20],\n      ],\n      1.7\n    );\n    this.createPolygon(\n      350,\n      494,\n      [\n        [-60, -20],\n        [60, -20],\n        [60, 20],\n        [-60, 20],\n      ],\n      1.7\n    );\n\n    // Mountains\n    this.createPolygon(750, 0, [\n      [0, 0],\n      [-20, 100],\n    ]);\n    this.createPolygon(750, 0, [\n      [-20, 100],\n      [30, 250],\n    ]);\n    this.createPolygon(750, 0, [\n      [30, 250],\n      [20, 300],\n    ]);\n    this.createPolygon(750, 0, [\n      [20, 300],\n      [-50, 320],\n    ]);\n    this.createPolygon(750, 0, [\n      [-50, 320],\n      [-90, 500],\n    ]);\n    this.createPolygon(750, 0, [\n      [-90, 500],\n      [-200, 600],\n    ]);\n\n    // Lake\n    this.createPolygon(550, 100, [\n      [-60, -20],\n      [-20, -40],\n      [30, -30],\n      [60, 20],\n      [40, 70],\n      [10, 100],\n      [-30, 110],\n      [-80, 90],\n      [-110, 50],\n      [-100, 20],\n    ]);\n  }\n}\n\n\n//# sourceURL=webpack://detect-collisions/./src/demo/tank.js?");

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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/demo/index.js");
/******/ 	
/******/ })()
;