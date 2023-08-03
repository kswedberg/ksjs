/**
 * @module array
 * @summary ESM Import Example:
 * ```js
 * import {isArray} from '@bamf-health/bamfjs';
 *
 * // or:
 * import {isArray} from '@bamf-health/bamfjs/array.mjs';
 * // or:
 * import {isArray} from '@bamf-health/bamfjs/array.js';
 * ```
 *
 * CommonJS Require Example:
 * ```js
 * const {isArray} = require('@bamf-health/bamfjs/array.cjs');
 * // or:
 * const {isArray} = require('@bamf-health/bamfjs/cjs/array.js');
 * ```
 *
 */

/**
 * Determine whether "arr" is a true array
 * @function isArray
 * @param  {array} arr item to determine whether it's an array
 * @returns {boolean}     `true` if arr is array, `false` if not
 * @example
 * import {isArray} from '@bamf-health/bamfjs/array.js';
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
 * Convert an object to an array of objects with name and value properties
 * @function objectToArray
 * @param  {object} obj The object to convert
 * @returns {array}     An array of objects with name and value properties
 * @example
 * import {objectToArray} from '@bamf-health/bamfjs/array.js';
 *
 * const obj = {
 *   foo: 'bar',
 *   baz: 'qux'
 * };
 *
 * const arr = objectToArray(obj);
 *  // arr = [
 * //   {name: 'foo', value: 'bar'},
 * //   {name: 'baz', value: 'qux'}
 * // ];
 *
 *
 */

export const objectToArray = function(obj) {
  const arr = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      arr.push({
        name: key,
        value: obj[key],
      });
    }
  }

  return arr;
};

/**
 * Return an array based on the given value:
 * a) Strings are split by a delimiter (defaults to /\s+/).
 * b) Plain objects are converted to an array of objects with name and value properties.
 * b2) …unless wrapObject is true in which case they are just wrapped in an array
 * c) Undefined and null are returned as an empty array.
 * d) Arrays are returned as is.
 * e) Anything else is wrapped in an array.
 * @function makeArray
 * @param  {any} value The value to convert to an array
 * @param  {string|RegExp} [delimiter = = /\s+/] A string or regular expression to use for splitting a string into an array (defaults to /\s+/)
 * @param {Boolean} [wrapObject] Whether to simply wrap an object in an array (true) or  convert to array of objects with name/value properties
 * @returns {array}      The value converted to an array
 * @example
 *  import {makeArray} from '@bamf-health/bamfjs/array.js';
 * const foo = makeArray('one two three');
 * // foo is now ['one', 'two', 'three']
 *
 * const bar = makeArray('one,two,three', ',');
 * // bar is now ['one', 'two', 'three']
 *
 * const baz = makeArray(['one', 'two', 'three']);
 * // baz is still ['one', 'two', 'three']
 *
 * const quz = makeArray({foo: 'bar'});
 * // quz is now [{name: 'foo': value: 'bar'}]
 *
 * const quuz = makeArray(null);
 * // quuz is now []
 */
export const makeArray = function(value, delimiter, wrapObject) {
  if (value == null) {
    return [];
  }

  if (typeof value === 'string') {
    const splitOn = delimiter != null ? delimiter : /\s+/;

    return value.split(splitOn);
  }

  if (isArray(value)) {
    return value;
  }

  if (typeof value === 'object') {
    return wrapObject ? [value] : objectToArray(value);
  }

  return [value];
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
* @example import {pluck} from '@bamf-health/bamfjs/array.js';
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
 * Merge two or more arrays into a single, new array.
 * @function merge
 * @param  {...array} arrays 2 or more arrays to collapse
 * @returns {array} A new merged array
 */
export const merge = function(...arrays) {
  let tmp = [];

  for (let i = 0, len = arrays.length; i < len; i++) {
    tmp.push(...arrays[i]);
  }

  return tmp;
};

/**
 * @function collapse
 * @deprecated Use {@link #module_array..merge} instead
 * @see [merge]{@link #module_array..merge} instead
 */
export const collapse = merge;

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
 * Create an array of numbers from 0 to `a` - 1 (if `b` not provided) or from `a` to `b` (if `b` is provided).
 * @function range
 * @param {number} a The length of the 0-based array to be returned if `b` is NOT provided; the first number in the array if `b` IS provided.
 * @param {number} [b] The (optional) last number of the array.
 * @returns {array} A new array of numbers
 */
export const range = function(a, b) {
  const start = b == null ? 0 : a;
  const end = b == null ? a : b;
  const diff = end - start;
  const length = Math.abs(diff) + (b == null ? 0 : 1);

  const result = Array.from({length}, (v, k) => k + (diff > 0 ? start : end));

  return diff < 0 ? result.reverse() : result;
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


const emptyCompare = (a, b) => {
  const aEmpty = !a && typeof a !== 'number';
  const bEmpty = !b && typeof b !== 'number';

  if (aEmpty === bEmpty) {
    return 0;
  }

  return aEmpty ? 1 : -1;
};

/**
 * Sort an array with sensible defaults: numbers (or numeric strings) before letters and case and diacritics ignored
 * @function sort
 * @param {array} arr Array to sort
 * @param {string} [prop] If dealing with an array of objects, the property by which to sort
 * @param {object} [options] Object indicating options to override defaults (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#options)
 * @param {string} [options.sensitivity = base] One of 'base', 'accent', 'case', 'variant'. Default is 'base'
 * @param {boolean} [options.numeric = true] Whether to treat numeric strings as numbers. Default is true
 * @param {any} [options[...rest]] Other options (besides sensitivity:'base' and numeric: true) per the spec for `Intl.Collator.prototype.compare`
 * @returns {array} The sorted array
 */
export const sort = (arr, prop, options = {}) => {
  const opts = Object.assign({sensitivity: 'base', numeric: true}, options);
  const collator = new Intl.Collator('en-US', opts);
  const localeCompare = collator.compare;

  return arr.sort((a, b) => {
    const vals = prop ? [a[prop], b[prop]] : [a, b];

    return emptyCompare(vals[0], vals[1]) || localeCompare(vals[0], vals[1]);
  });
};
