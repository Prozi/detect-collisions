"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = exports.filter = exports.some = exports.forEach = void 0;
/**
 * 40-90% faster than built-in Array.forEach function.
 *
 * basic benchmark: https://jsbench.me/urle772xdn
 */
const forEach = (array, callback) => {
    for (let i = 0, l = array === null || array === void 0 ? void 0 : array.length; i < l; i++) {
        callback(array[i], i);
    }
};
exports.forEach = forEach;
/**
 * 20-90% faster than built-in Array.some function.
 *
 * basic benchmark: https://jsbench.me/l0le7bnnsq
 */
const some = (array, callback) => {
    for (let i = 0, l = array === null || array === void 0 ? void 0 : array.length; i < l; i++) {
        if (callback(array[i], i)) {
            return true;
        }
    }
    return false;
};
exports.some = some;
/**
 * 20-60% faster than built-in Array.filter function.
 *
 * basic benchmark: https://jsbench.me/o1le77ev4l
 */
const filter = (array, callback) => {
    const output = [];
    for (let i = 0, l = array === null || array === void 0 ? void 0 : array.length; i < l; i++) {
        const item = array[i];
        if (callback(item, i)) {
            output.push(item);
        }
    }
    return output;
};
exports.filter = filter;
/**
 * 20-70% faster than built-in Array.map
 *
 * basic benchmark: https://jsbench.me/oyle77vbpc
 */
const map = (array, callback) => {
    const output = new Array(array.length);
    for (let i = 0, l = array.length; i < l; i++) {
        output[i] = callback(array[i], i);
    }
    return output;
};
exports.map = map;
//# sourceMappingURL=optimized.js.map