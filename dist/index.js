"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _model = require("./model");

Object.keys(_model).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _model[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _model[key];
    },
  });
});

var _circle = require("./bodies/circle");

Object.keys(_circle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _circle[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _circle[key];
    },
  });
});

var _polygon = require("./bodies/polygon");

Object.keys(_polygon).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _polygon[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _polygon[key];
    },
  });
});

var _box = require("./bodies/box");

Object.keys(_box).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _box[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _box[key];
    },
  });
});

var _point = require("./bodies/point");

Object.keys(_point).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _point[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _point[key];
    },
  });
});

var _system = require("./system");

Object.keys(_system).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _system[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _system[key];
    },
  });
});
