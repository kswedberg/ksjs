/**
 * @module math
 * @summary ESM Import Example:
 * ```js
 * import {median} from 'ksjs';
 *
 * // or:
 * import {median} from 'ksjs/math.mjs';
 * // or:
 * import {median} from 'ksjs/math.js';
 * ```
 *
 * CommonJS Require Example:
 * ```js
 * const {median} = require('ksjs/math.cjs');
 * // or:
 * const {median} = require('ksjs/cjs/math.js');
 * ```
 *
 */

const fnType = [].reduce ? 'reduce' : 'loop';

const fns = {
  add: function(a, b) {
    return a + b;
  },
  subtract: function(a, b) {
    return a - b;
  },
  multiply: function(a, b) {
    return a * b;
  },
  divide: function(a, b) {
    return a / b;
  },
};

const compute = {
  reduce: function reduce(operation) {
    return function(nums, start) {
      start = start || 0;

      return nums.reduce(fns[operation], start);
    };
  },
  loop: function loop(operation) {
    return function(nums, start) {
      start = start || 0;

      for (let i = nums.length - 1; i >= 0; i--) {
        start = fns[operation](start, nums[i]);
      }

      return start;
    };
  },
};

/**
 * Return the result of adding an array of numbers (sum)
 * @function
 * @param {array} array Array of numbers
 * @returns {number} Sum
 */
export const add = compute[fnType]('add');

/**
* Return the result of subtracting an array of numbers (difference)
* @function
* @param {array} array Array of numbers
* @returns {number} Difference
*/
export const subtract = compute[fnType]('subtract');

/**
* Return the result of multiplying an array of numbers (product)
* @function
* @param {array} array Array of numbers
* @returns {number} Product
*/
export const multiply = compute[fnType]('multiply');

/**
* Return the result of dividing an array of numbers (quotient)
* @function
* @param {array} array Array of numbers
* @returns {number} Quotient
*/
export const divide = compute[fnType]('divide');

/**
* Return the remainder after dividing two numbers (modulo)
* @function
* @param {number|array} dividend A number representing the dividend OR an array of [dividend, divisor]
* @param {number} [divisor] Number representing the divisor if the first argument is a number
* @returns {number} Remainder
*/
export const mod = function mod(dividend, divisor) {
  // Allow for either two numbers or an array of two numbers
  if (arguments.length === 1 && typeof dividend === 'object' && dividend.length === 2) {
    return dividend[0] % dividend[1];
  }

  // @ts-ignore
  return dividend % divisor;
};

const numberSorter = (a, b) => {
  return a - b;
};

/**
 * Return the average of an array of numbers
 * @function
 * @param {array} nums Array of numbers
 * @returns {number} Average
 */
export const average = (nums) => {
  return add(nums) / nums.length;
};

/**
* Return the median of an array of numbers
* @function
* @param {array} nums Array of numbers
* @returns {number} Median
*/
export const median = (nums) => {
  if (nums.length < 2) {
    return nums.length === 1 ? nums[0] : 0;
  }

  const halfIndex = Math.floor(nums.length / 2);
  const sorted = [...nums].sort(numberSorter);

  // Odd numbers:
  if (nums.length % 2) {
    return sorted[halfIndex];
  }

  // Even numbers:
  const under = halfIndex - 1;

  return (sorted[under] + sorted[halfIndex]) / 2;
};

/**
 * Return the number with the lowest value from an array of numbers
 * @function
 * @param {array} nums Array of numbers
 * @returns {number} Minimum value
 */
export const min = (nums) => {
  const sorted = [...nums].sort(numberSorter);

  return sorted.shift();
};

/**
* Return the number with the highest value from an array of numbers
* @function
* @param {array} nums Array of numbers
* @returns {number} Maximum value
*/
export const max = (nums) => {
  const sorted = [...nums].sort(numberSorter);

  return sorted.pop();
};
