/**
 * 40-90% faster than built-in Array.forEach function.
 *
 * basic benchmark: https://jsbench.me/urle772xdn
 */
export const forEach = (array: any[] | undefined, fn: Function) => {
  if (!array) return;

  for (let i = 0, l = array.length; i < l; i++) {
    fn(array[i], i);
  }
};

/**
 * 20-60% faster than built-in Array.filter function.
 *
 * basic benchmark: https://jsbench.me/o1le77ev4l
 */
export const filter = (array: any[] | undefined, fn: Function): any[] => {
  if (!array) return [];

  const output = [];

  for (let i = 0, l = array.length; i < l; i++) {
    const item = array[i];

    if (fn(item, i)) {
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
export const map = (array: any[] | undefined, fn: Function): any[] => {
  if (!array) return [];

  const length = array.length;
  const output = new Array(length);

  for (let i = 0; i < length; i++) {
    output[i] = fn(array[i], i);
  }

  return output;
};
