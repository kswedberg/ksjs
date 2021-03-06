/**
 * @module timer
 * @summary ES6 Import Example:
 * ```js
 * import {debounce} from 'fmjs';
 *
 * // or:
 * import {debounce} from 'fmjs/timer.js';
 * ```
 *
 * CommonJS Require Example:
 * ```js
 * const {debounce} = require('fmjs/cjs/timer.js');
 * ```
 *
 */

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
/**
 * Constant representing the number of milliseconds in an hour
 * @const {number} HOUR
 */
export const HOUR = MINUTE * 60;
/**
* Constant representing the number of milliseconds in a day
* @const {number} DAY
*/
export const DAY = HOUR * 24;
/**
* Constant representing the number of milliseconds in a year
* @const {number} YEAR
*/
export const YEAR = DAY * 365;

/**
 * Set up a function to be called once at the end of repeated potential calls within a given delay
 * @function debounce
 * @param {function} fn The function to trigger once at the end of a series of potential calls within `delay`
 * @param {number} [timerDelay = 200] Number of milliseconds to delay before firing once at the end
 * @param {Element} [ctx = this] The context in which to call `fn`
 * @example
 * const scrollLog = function(event) {
 * console.log('Started resizing the window!');
 * };
 *
 * window.addEventListener('resize', debounce(scrollLog));
 */
export const debounce = function debounce(fn, timerDelay, ctx) {
  const delay = timerDelay === undefined ? 200 : timerDelay;
  let timeout;

  return function(...args) {
    ctx = ctx || this;

    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      fn.apply(ctx, args);
      timeout = ctx = args = null;
    }, delay);
  };
};

/**
* Set up a function to be called once at the end of repeated potential calls within a given delay
* @function unbounce
* @param {function} fn The function to trigger once at the beginning of a series of potential calls within `delay`
* @param {number} [timerDelay = 200] Number of milliseconds within which to avoid calling the same function
* @param {Element} [ctx = this] The context in which to call `fn`
* @example
* const scrollLog = function(event) {
* console.log('Started resizing the window!');
* };
*
* window.addEventListener('resize', debounce(scrollLog));
*/
export const unbounce = function unbounce(fn, timerDelay, ctx) {
  const delay = timerDelay === undefined ? 200 : timerDelay;
  let timeout;

  return function(...args) {
    if (!timeout) {
      fn.apply(ctx || this, args);
    }

    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      timeout = null;
    }, delay);
  };
};

/**
* Set up a function to be called no more than once every `timerDelay` milliseconds
* @function throttle
* @param {function} fn The function to throttle
* @param {number} [timerDelay = 200] Number of milliseconds to throttle the function calls
* @param {Element} [context = this] The context in which to call `fn`
*/
export const throttle = function(fn, timerDelay, context) {
  const delay = timerDelay === undefined ? 200 : timerDelay;
  let previous = 0;
  let timedFn;

  return function(...args) {
    let ctx = context || this;
    const now = +new Date();

    if (!previous) {
      fn.apply(ctx, args);
      previous = now;
    } else {
      clearTimeout(timedFn);
      timedFn = setTimeout(() => {
        const then = +new Date();

        if (then - previous >= delay) {
          fn.apply(ctx, args);
          previous = then;
        }
      }, delay - (now - previous));
    }
  };
};

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik M??ller. fixes from Paul Irish and Tino Zijdel

// MIT license

const setupRaf = function() {
  let lastTime = 0;
  const vendors = ['ms', 'moz', 'webkit', 'o'];

  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
    window.cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`] ||
      window[`${vendors[x]}CancelRequestAnimationFrame`];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(() => {
        callback(currTime + timeToCall);
      }, timeToCall);

      lastTime = currTime + timeToCall;

      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
};


/**
* Set up a function to be called immediately before the next repaint using `requestAnimationFrame()`
* @function raf
* @param {function} fn The function to call
* @param {Element} [context = this] The context in which to call `fn`
*/
export const raf = function(fn, context) {
  let timer;

  return function(...args) {
    const ctx = context || this;

    if (typeof window === 'undefined') {
      throw new TypeError('window is not defined: fmjs/timer.js ln 178');
    }

    if (!window.requestAnimationFrame) {
      setupRaf();
    }

    if (timer) {
      window.cancelAnimationFrame(timer);
    }

    timer = window.requestAnimationFrame(() => {
      fn.apply(ctx, args);
    });
  };
};
