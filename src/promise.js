/**
 * @module promise
 * @summary ES6 Import Example:
 * ```js
 * import {peach} from '@bamf-health/bamfjs';
 *
 * // or:
 * import {peach} from '@bamf-health/bamfjs/promise.js';
 * ```
 *
 * CommonJS Require Example:
 * ```js
 * const {peach} = require('@bamf-health/bamfjs/cjs/promise.js');
 * ```
 *
 */

/**
* @callback ArrayCallback
* @param {any} item
* @param {number} [index]
* @param {array} [array]
* @returns {Promise}
*/

/**
 * "Promised `each()`" for iterating over an array of items, calling a function that returns a promise for each one. So, each one waits for the previous one to resolve before being called
 * @function peach
 * @param {array} arr Array to iterate over
 * @param {ArrayCallback} fn Function that is called for each element in the array, each returning a promise
 * @returns {Array.<Promise>} Array of promises
 */
export const peach = (arr, fn) => {
  const originalArray = [...arr];
  const funcs = arr.map((item, i) => {
    return () => fn(item, i, originalArray);
  });

  // @ts-ignore
  return funcs.reduce((promise, func) => {
    return promise
    .then((result) => {
      const called = func();
      // If the function doesn't return a "then-able", create one with Promise.resolve():

      return (called && typeof called.then === 'function' ? called : Promise.resolve(called))
      .then([].concat.bind(result));
    });

  }, Promise.resolve([]));
};

/**
 * "Promised `map()`" for iterating over an array of items sequentially (or in parallel), calling a function that returns either the Promise of a modified item or the modified item itself, ultimately returning a single resolved Promise containing the modified array.
 * @function pmap
 * @param {array} arr Array to iterate over
 * @param {ArrayCallback} fn Function that is called for each element in the array, each returning a modified result
 * @param {string} [order=sequence] Whether to call the callback for each item sequentially (`'sequence'`, default) or at the same time (`'parallel'`).
 * @returns {Promise} A resolved Promise, fulfilled with an array containing the mapped items of `arr`
 * @example
 * import {pmap} from '@bamf-health/bamfjs/promise.js';
 *
 * const fruits = ['apple', 'banana', 'pear'];
 *
 * const indexedFruits = pmap(fruits, (fruit, i) => {
 *
 * });
 */
export const pmap = async function(arr, fn, order) {
  if (order === 'parallel') {
    const mapped = arr.map(fn);

    try {
      const ret = await Promise.all(mapped);

      return ret;
    } catch (err) {
      throw err;
    }

  }

  const ret = [];

  for (let i = 0; i < arr.length; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await fn(arr[i], i);

      ret.push(res);
    } catch (err) {
      throw err;
    }

  }

  return ret;
};


/**
* "Promised `filter()`" to iterate over an array of items sequentially (or in parallel), which acts just like `Array.prototype.filter()` but allows the callback function to return either a Promise containing a truthy/falsy value or the truthy/falsy value itself. Returns a single resolved Promise containing the filtered array.
* @function pfilter
* @param {array} arr Array to iterate over
* @param {ArrayCallback} fn(item,index,array) Function that is called for each element in the array, each returning a modified result
* @param {string} [order=sequence] Whether to call the callback for each item sequentially (`'sequence'`, default) or at the same time (`'parallel'`).
* @returns {Promise} A resolved Promise, fulfilled with an array containing the mapped items of `arr`
* @example
* import {pmap} from '@bamf-health/bamfjs/promise.js';
*
* const fruits = ['apple', 'banana', 'pear'];
*
* const indexedFruits = pmap(fruits, (fruit, i) => {
*
* });
*/
export const pfilter = async function(arr, fn, order) {
  if (order === 'parallel') {
    const mapped = arr.map(fn);

    try {
      const ret = await Promise.all(mapped);

      return arr.filter((item, i) => !!ret[i]);
    } catch (err) {
      throw err;
    }

  }

  const ret = [];

  for (let i = 0; i < arr.length; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await fn(arr[i], i);

      if (res) {
        ret.push(arr[i]);
      }
    } catch (err) {
      throw err;
    }

  }

  return ret;
};
