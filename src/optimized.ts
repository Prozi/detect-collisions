/* tslint:disable:one-variable-per-declaration */

/**
 * 40-90% faster than built-in Array.forEach function.
 *
 * basic benchmark: https://jsbench.me/urle772xdn
 */
export const forEach = <T>(
  array: T[],
  callback: (item: T, index: number) => void,
): void => {
  for (let i = 0, l = array.length; i < l; i++) {
    callback(array[i], i);
  }
};

/**
 * 20-90% faster than built-in Array.some function.
 *
 * basic benchmark: https://jsbench.me/l0le7bnnsq
 */
export const some = <T>(
  array: T[],
  callback: (item: T, index: number) => unknown,
): boolean => {
  for (let i = 0, l = array.length; i < l; i++) {
    if (callback(array[i], i)) {
      return true;
    }
  }

  return false;
};

/**
 * 20-40% faster than built-in Array.every function.
 *
 * basic benchmark: https://jsbench.me/unle7da29v
 */
export const every = <T>(
  array: T[],
  callback: (item: T, index: number) => unknown,
): boolean => {
  for (let i = 0, l = array.length; i < l; i++) {
    if (!callback(array[i], i)) {
      return false;
    }
  }

  return true;
};

/**
 * 20-60% faster than built-in Array.filter function.
 *
 * basic benchmark: https://jsbench.me/o1le77ev4l
 */
export const filter = <T>(
  array: T[],
  callback: (item: T, index: number) => unknown,
): T[] => {
  const output: T[] = [];

  for (let i = 0, l = array.length; i < l; i++) {
    const item = array[i];

    if (callback(item, i)) {
      output.push(item);
    }
  }

  return output;
};

/**
 * 20-70% faster than built-in Array.map
 *
 * basic benchmark: https://jsbench.me/oyle77vbpc
 */
export const map = <T, Y>(
  array: T[],
  callback: (item: T, index: number) => Y,
): Y[] => {
  const l = array.length;
  const output = new Array<Y>(l);

  for (let i = 0; i < l; i++) {
    output[i] = callback(array[i], i);
  }

  return output;
};
