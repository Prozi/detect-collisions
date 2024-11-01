"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stressBenchmark = exports.insertionBenchmark = void 0;
const insertion_bench_1 = require("./insertion.bench");
Object.defineProperty(exports, "insertionBenchmark", { enumerable: true, get: function() { return insertion_bench_1.insertionBenchmark; } });
const stress_bench_1 = require("./stress.bench");
Object.defineProperty(exports, "stressBenchmark", { enumerable: true, get: function() { return stress_bench_1.stressBenchmark; } });
