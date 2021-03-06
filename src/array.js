/**
 * @module array
 * @summary ES6 Import Example:
 * ```js
 * import {isArray} from 'fmjs';
 *
 * // or:
 * import {isArray} from 'fmjs/array.js';
 * ```
 *
 * CommonJS Require Example:
 * ```js
 * const {isArray} = require('fmjs/cjs/array.js');
 * ```
 *
 */

/**
 * Determine whether "arr" is a true array
 * @function isArray
 * @param  {array} arr item to determine whether it's an array
 * @returns {boolean}     `true` if arr is array, `false` if not
 * @example
 * import {isArray} from 'fmjs/array.js';
 *
 * if (isArray(window.foo)) {
 *   window.foo.push('bar');
 * }
 */
export const isArray = function(arr) {
  if (Array.isArray) {
    return Array.isArray(arr);
  }

  return typeof arr === 'object' && Object.prototype.toString.call(arr) === '[object Array]';
};

/**
 * Determine whether item "el" is in array "arr"
 * @function inArray
 * @param  {any} el  An item to test against the array
 * @param  {array} arr The array to test against
 * @returns {boolean}     Boolean (`true` if el is in array, `false` if not)
 */
export const inArray = function(el, arr) {
  if (arr.includes) {
    return arr.includes(el);
  }

  if (arr.indexOf) {
    return arr.indexOf(el) !== -1;
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === el) {
      return true;
    }
  }

  return false;
};

/**
 * Return a random item from the provided array
 * @function randomItem
 * @param  {array} arr An array of elements
 * @returns {any}     A random element from the provided array
 */
export const randomItem = function randomItem(arr) {
  const index = Math.floor(Math.random() * arr.length);

  return arr[index];
};

/**
 * Take an array of objects and a property and return an array of values of that property
 * @function pluck
 * @param  {array} arr  Array from which to pluck
 * @param  {string} prop Property to pluck
 * @returns {array} Array of values of the property (if the value is `undefined`, returns `null` instead)
* @example import {pluck} from 'fmjs/array.js';
*
* let family = [
*   {
*     id: 'dad',
*     name: 'Karl'
*   },
*   {
*     id: 'mom',
*     name: 'Sara',
*     color: 'blue'
*   },
*   {
*     id: 'son',
*     name: 'Ben',
*     color: 'green'
*   },
*   {
*     id: 'daughter',
*     name: 'Lucy'
*   }
* ];
*
* let names = pluck(family, 'name');
* let ids = pluck(family, 'id');
* let colors = pluck(family, 'color');
*
* console.log(names);
* // Logs: ['Karl', 'Sara', 'Ben', 'Lucy']
*
* console.log(ids);
* // Logs: ['dad', 'mom', 'son', 'daughter']
*
* console.log(colors);
* // Logs: [null, 'blue', 'green', null]
 */
export const pluck = function pluck(arr = [], prop) {
  return arr.map((el) => {
    return typeof el[prop] === 'undefined' ? null : el[prop];
  });
};

/**
 * Fisher-Yates (aka Knuth) shuffle. Takes an array of elements and returns the same array, but with its elements shuffled
 * @function shuffle
 * @see [knuth-shuffle]{@link https://github.com/coolaj86/knuth-shuffle}
 * @param  {array} els Array to be shuffled
 * @returns {array}     The array passed to `arr`, shuffled
 */
export const shuffle = function(els) {
  let temporaryValue, randomIndex;
  let currentIndex = els.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = els[currentIndex];
    els[currentIndex] = els[randomIndex];
    els[randomIndex] = temporaryValue;
  }

  return els;
};

/**
 * Collapse two or more arrays into a single, new array. Same as `merge()`, but not limited to two arrays.
 * @function collapse
 * @param  {...array} arrays 2 or more arrays to collapse
 * @see [merge]{@link #module_array..merge}
 * @returns {array} A new collapsed array
 * @warning untested
 */
export const collapse = function(...arrays) {
  let tmp = [];

  for (let i = 0, len = arrays.length; i < len; i++) {
    tmp.push(...arrays[i]);
  }

  return tmp;
};

/**
 * Merge two arrays into a single, new array. Same as `collapse()` but only works with two array arguments.
 * @function merge
 * @param {array} array1 First array
 * @param {array} array2 Second array
 * @see [collapse]{@link #module_array..collapse}
 * @returns {array} A new merged array
 * @warning untested
 */
export const merge = function(array1, array2) {
  return collapse(array1, array2);
};

/**
 * Return a subset of `array1`, only including elements from `array2` that are also in `array1`.
 * * If `prop` is provided, only that property of an element needs to match for the two arrays to be considered intersecting at that element
 * @function intersect
 * @param {array} array1 First array
 * @param {array} array2 Second array
 * @param {any} [prop] Optional property to compare in each element of the array
 * @returns {array} A new filtered array
 * @example
 * const array1 = [{name: 'Foo', id: 'a'}, {name: 'Bar', id: 'b'}];
 * const array2 = [{name: 'Foo', id: 'z'}, {name: 'Zippy', id: 'b'}];
 *
 * console.log(intersect(array1, array2, 'name'));
 * // Logs [{name: 'Foo', id: 'a'}]
 *
 * console.log(intersect(array1, array2, 'id'));
 * // Logs [{name: 'Bar', id: 'b'}]
 */
export const intersect = function(array1, array2, prop) {

  return array1.filter((item) => {
    if (typeof item !== 'object') {
      return array2.includes(item);
    }

    // If a prop argument is provided, we only need to match on that property of the object
    if (prop) {
      return !!array2.find((array2Item) => array2Item[prop] === item[prop]);
    }

    // If NO prop provided, match against the entire (stringified) object
    const strung = JSON.stringify(item);

    return !!array2.find((array2Item) => strung === JSON.stringify(array2Item));
  });
};

/**
 * Take an array of elements and return an array containing unique elements.
 * If an element is an object or array:
 * * when `prop` is *undefined*, uses `JSON.stringify()` when checking the elements
 * * when `prop` is *provided*, only that property needs to match for the element to be considered a duplicate and thus excluded from the returned array
 * @function unique
 * @param {array} arr Array to be filtered by uniqueness of elements (or property of elements)
 * @param {any} [prop] Optional property to be tested if an element in `arr` is an object or array
 * @returns {array} A new filtered array
 * @example
 * const array1 = [1, 2, 3, 2, 5, 1];
 * const uniq = unique(array1);

 * console.log(uniq);
 * // Logs: [1, 2, 3, 5]
 */
export const unique = function(arr, prop) {
  return arr.filter((item, i) => {
    if (typeof item !== 'object') {
      return arr.indexOf(item) === i;
    }

    // If a prop argument is provided, we only need to match on that property of the object
    if (prop) {
      return arr.findIndex((test) => test[prop] === item[prop]) === i;
    }

    // If NO prop provided, match against the entire (stringified) object
    const strung = JSON.stringify(item);

    return arr.findIndex((test) => JSON.stringify(test) === strung) === i;
  });
};

/**
 * Return a subset of `array1`, only including elements that are NOT also in `array2`. The returned array won't include any elements from `array2`.
 * If an element is an object or array:
 * * when `prop` is *undefined*, uses `JSON.stringify()` when performing the comparison on an object or array
 * * when `prop` is *provided*, only that property needs to match for the item to be excluded fom the returned array
 * @function diff
 * @param {array} array1 Array for which to return a subset
 * @param {array} array2 Array to use as a comparison
 * @param {string} [prop] Optional property to be tested if an element in `array1` is an object or array
 * @returns {array} A filtered array
 * @example
 * const array1 = [1, 2, 3, 4];
 * const array2 = [2, 3, 5, 6, -1];

 * console.log(diff(array1, array2));
 * // Logs: [1, 4]
 */
export const diff = function(array1, array2, prop) {
  return array1.filter((item) => {

    if (typeof item !== 'object') {
      return !array2.includes(item);
    }

    if (prop) {
      return !array2.find((array2Item) => item[prop] === array2Item[prop]);
    }

    const strung = JSON.stringify(item);

    return !array2.find((array2Item) => strung === JSON.stringify(array2Item));
  });
};

/**
 * From an array passed into the first argument, create an array of arrays, each one consisting of `n` items. (The final nested array may have fewer than `n` items.)
 * @function chunk
 * @param {array} arr Array to be chunked. This array itself will not be modified.
 * @param {number} n Number of elements per chunk
 * @returns {array} A new, chunked, array
 */
export const chunk = function(arr, n) {
  const num = Math.floor(n);
  const chunkedArray = [];
  const original = [...arr];

  if (num < 1) {
    return arr;
  }
  while (original.length) {
    chunkedArray.push(original.splice(0, num));
  }

  return chunkedArray;
};

/**
 * Pad an array with `value` until its length equals `size`
 * @function pad
 * @param {array} arr Array to pad
 * @param {number} size Total length of the array after padding it
 * @param {any} value Value to use for each "padded" element of the array
 * @returns {array} The array passed to `arr`, padded
 */
export const pad = function(arr, size, value) {

  for (let i = arr.length; i < size; i++) {
    arr.push(value);
  }

  return arr;
};
