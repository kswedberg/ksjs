/**
 * @module object
 * @summary ESM Import Example:
 * ```js
 * import {deepCopy} from '@bamf-health/bamfjs';
 *
 * // or:
 * import {deepCopy} from '@bamf-health/bamfjs/object.mjs';
 * // or:
 * import {deepCopy} from '@bamf-health/bamfjs/object.js';
 * ```
 *
 * CommonJS Require Example:
 * ```js
 * import {deepCopy} from '@bamf-health/bamfjs/object.cjs';
 * // or:
 * const {deepCopy} = require('@bamf-health/bamfjs/cjs/object.js');
 * ```
 *
 */

import {isArray} from './array.js';

const ObjectProto = Object.prototype;
const fnProtoToString = Function.prototype.toString;

/**
 * Indicate if the provided argument is an object/array
 * @function isObject
 * @param {Object} obj The argument that will be checked to see if it is an object
 */
export const isObject = function isObject(obj) {
  const isWindow = typeof window !== 'undefined' && obj === window;

  return typeof obj === 'object' && obj !== null && !obj.nodeType && !isWindow;
};

/**
* Indicate if the provided argument is a plain object
* Derived from lodash _.isPlainObject
* @function isPlainObject
* @param {Object} obj The argument that will be checked to see if it is a plain object
*/
export const isPlainObject = function(obj) {
  // If it doesn't immediately look like an object, it isn't one
  if (obj == null || typeof obj !== 'object' || ObjectProto.toString.call(obj) !== '[object Object]') {
    return false;
  }

  // Safe way to get obj's prototype, casting it to an object first, so hasOwnProperty doesn't throw error
  const objProto = Object.getPrototypeOf(Object(obj));

  // For object created with Object.create(null)
  if (objProto === null) {
    return true;
  }

  // Get the constructor of obj's prototype
  const Ctor = ObjectProto.hasOwnProperty.call(objProto, 'constructor') && objProto.constructor;

  return typeof Ctor == 'function' &&
    Ctor instanceof Ctor &&
    fnProtoToString.call(Ctor) === fnProtoToString.call(Object);
};

const getAdjacentNodes = function(obj) {
  return Object.entries(obj)
  .filter(([, v]) => isObject(v));
};

const cloneNonObjectProperties = function(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => !isObject(v))
  );
};

const cloneNode = function(obj, helperMap) {
  // If we've already seen this node, just return its clone
  if (helperMap.has(obj)) {
    return helperMap.get(obj);
  }

  // Otherwise, start by cloning non-object properties
  const clonedNode = cloneNonObjectProperties(obj);

  // And set clonedNode as the obj's clone
  helperMap.set(obj, clonedNode);

  // Then recursively clone each object reachable by the current node
  for (const [k, n] of getAdjacentNodes(obj)) {
    const clonedAdjacentNode = cloneNode(n, helperMap);

    // Set the reference
    clonedNode[k] = clonedAdjacentNode;
  }

  return clonedNode;
};


/**
 * Deep copy an object (alternative to deepCopy), using graph theory and new Map(). Avoids circular refs and infinite loops.
 * @function clone
 * @see [Cloning JavaScript objects with Graph Theory]{@link https://andreasimonecosta.dev/posts/cloning-javascript-objects-with-graph-theory/}
 * @param {Object} obj
 * @returns {Object} A copy of the object
 */

export const clone = function(obj) {
  return cloneNode(obj, new Map());
};

/**
* Deep copy an object, avoiding circular references and the infinite loops they might cause.
* @function deepCopy
* @param {Object} obj The object to copy
* @param {Boolean} [forceFallback] If set to `true`, doesn't try to use native `structuredClone` function first.
* @param {Array<Object>} [cache] Used internally to avoid circular references
* @returns {Object} A copy of the object
*/
export const deepCopy = function deepCopy(obj, forceFallback, cache = []) {

  // just return if obj is immutable or primitive value
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (typeof structuredClone !== 'undefined' && forceFallback !== true) {
    try {
      // eslint-disable-next-line no-undef
      const clone = structuredClone(obj);

      return clone;
    } catch (err) {
      // silently fall back on error
    }

  }

  // if obj is hit, it is in circular structure
  const hit = cache.find((c) => c.original === obj);

  if (hit) {
    return hit.copy;
  }

  const copy = isArray(obj) ? [] : {};

  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy,
  });

  Object.keys(obj).forEach((key) => {
    if ((key === 'constructor' && typeof obj[key] === 'function') || key === '__proto__') {
      return;
    }

    // If we've made it here, we're already using the fallback, so we should continue doing so
    copy[key] = deepCopy(obj[key], true, cache);
  });

  return copy;
};

/**
 * Compare two items for equality, recursing through nested objects or arrays
 * @function isDeepEqual
 * @param {*} objectA The first item to compare
 * @param {*} objectB The second item to compare
 * @returns {Boolean} True if the items are deeply equal, false otherwise
 */
export const isDeepEqual = function isDeepEqual(objectA, objectB) {
  // If it's the same object, or the two items are primitives, then they are equal
  if (objectA === objectB) {
    return true;
  }

  if (!(objectA instanceof Object)) {
    return objectA === objectB;
  }
  const objectAKeys = Object.keys(objectA);

  // If different number of props, then NOT equal
  if (objectAKeys.length !== Object.keys(objectB).length) {
    return false;
  }

  for (const key of objectAKeys) {
    // second object does not have the same key as first object, NOT equal
    if (objectB[key] === undefined) {
      return false;
    }

    // Recursively call isDeepEqual on the property's values
    if (!isDeepEqual(objectA[key], objectB[key])) {
      return false;
    }
  }

  return true;
};

/**
 * Deep merge two or more objects in turn, with right overriding left
 *
 * Heavily influenced by/mostly ripped off from jQuery.extend
 * @function extend
 * @param  {Object} target The target object that will be mutated. Use `{}` to create new object
 * @param  {...Object} objects One or more objects to merge into the first
 * @returns {Object} The merged object
 * @example
 * const foo = {
 *   one: 'singular',
 *   two: 'are better'
 * };
 *
 * const bar = {
 *   one: 'taste',
 *   choco: 'hershey',
 *   saloon: 'wild west',
 * };
 *
 * const merged = extend(foo, bar);
 *
 * // merged is now:
 * // {
 * //  one: 'taste',
 * //  two: 'are better',
 * //  choco: 'hershey',
 * //  saloon: 'wild west',
 * // }
 *
 *
 * // because foo was mutated, it is also:
 * // {
 * //  one: 'taste',
 * //  two: 'are better',
 * //  choco: 'hershey',
 * //  saloon: 'wild west',
 * // }
 */
export const extend = function extend(target, ...objects) {
  let tgt = Object(target);
  let arg, prop, targetProp, copyProp;
  const hasOwn = Object.prototype.hasOwnProperty;

  if (!objects.length) {
    return deepCopy(tgt);
  }

  for (let i = 0; i < objects.length; i++) {
    arg = objects[i];

    if (isObject(arg)) {
      for (prop in arg) {
        targetProp = tgt[prop];
        copyProp = arg[prop];

        if ((prop === 'constructor' && typeof copyProp === 'function') || prop === '__proto__') {
          continue;
        }
        if (targetProp === copyProp) {
          continue;
        }

        if (isObject(copyProp) && hasOwn.call(arg, prop)) {
          if (isArray(copyProp)) {
            targetProp = isArray(targetProp) ? targetProp : [];
          } else {
            targetProp = isObject(targetProp) ? targetProp : {};
          }

          tgt[prop] = extend(targetProp, copyProp);
        } else if (typeof copyProp !== 'undefined') {
          tgt[prop] = copyProp;
        }
      }
    }
  }

  return tgt;
};

const getCtx = () => {
  if (typeof window !== 'undefined') {
    return window;
  }

  return typeof global !== 'undefined' ? global : {};
};

const ensureArray = (properties) => {
  return typeof properties === 'string' ? properties.split(/\./) : properties || [];
};

/**
 * Get a nested property of an object in a safe way
 * @function getProperty
 * @param  {Object} root The root object
 * @param {Array.<String>|String} properties Either an array of properties or a dot-delimited string of properties
 * @param {any} fallbackValue A value to assign if it's otherwise undefined
 * @returns {*} The value of the nested property, or `undefined`, or the designated fallback value
 * @example
 * const foo = {
 *   could: {
 *    keep: {
 *     going: 'but will stop'
 *   }
 * };
 *
 * console.log(getProperty(foo, 'could.keep.going'))
 * // Logs: 'but will stop'
 *
 * console.log(getProperty(foo, ['could', 'keep', 'going']))
 * // Logs: 'but will stop'
 *
 * console.log(getProperty(foo, ['broken', 'not', 'happening']))
 * // Logs: undefined
};
 */
export const getProperty = (function(ctx) {

  return function(obj, properties, defaultVal = null) {
    const root = obj || ctx;
    const props = ensureArray(properties);

    return props.reduce((acc, val) => {
      return acc && typeof acc[val] !== 'undefined' ? acc[val] : defaultVal;
    }, root);
  };
})(getCtx());

/**
 * Get a nested property of an object in a safe way
 * @function getLastDefined
 * @param  {Object} root The root object
 * @param {Array.<String>|String} properties Either an array of properties or a dot-delimited string of properties
 * @returns {*} The value of the last nested property referenced in `properties` arg that has a defined value
 * @example
 * const foo = {
 *   could: {
 *    keep: {
 *     going: 'but will stop'
 *   },
 *   shortStop: 'ride ends here'
 * };
 *
 * console.log(getLastDefined(foo, 'could.keep.going'))
 * // Logs: 'but will stop'
 *
 * console.log(getLastDefined(foo, ['shortStop', 'stops', 'short']))
 * // Logs: 'ride ends here'
};
 */
export const getLastDefined = function(root, properties) {
  const props = ensureArray(properties);

  if (typeof root === 'undefined') {
    return root;
  }

  return props.reduce((prev, curr) => {
    return prev && typeof prev[curr] !== 'undefined' ? prev[curr] : prev;
  }, root);
};


/**
 * Determine whether an object (or array) is "empty"
 * @function isEmptyObject
 * @param  {object|array} obj The object to test
 * @returns {boolean} `true` if object has no keys or array no elements
 */
export const isEmptyObject = (obj) => {
  if (typeof obj !== 'object' || obj == null) {
    throw new TypeError(`Argument ${obj} is not an object`);
  }

  return isArray(obj) ? !obj.length : !Object.keys(obj).length;
};

/**
 * Set a nested property of an object in a safe way
 * @function setProperty
 * @param  {Object} root The root object
 * @param {Array.<String>|String} properties Either an array of properties or a dot-delimited string of properties
 * @param {any} value The value to set for the nested property
 * @returns {Object} The modified root object
 */
export const setProperty = (function(ctx) {

  return function(obj, properties, value) {
    const root = obj || ctx;
    const props = ensureArray(properties);

    return props.reduce((acc, val, i) => {
      if (i === props.length - 1) {
        acc[val] = value;

        return root;
      }

      if (!acc[val]) {
        acc[val] = {};
      }

      return acc[val];
    }, root);

  };
})(getCtx());

/**
 * Loop through an object, calling a function for each element (like forEach, but for an object)
 * @function forEachValue
 * @param  {Object}   obj The object to iterate over
 * @param  {function} fn  A function to be called for each member of the object.
 * The function takes two parameters: the member's value and the member's key, respectively
 * @returns {void}
 */
export const forEachValue = function(obj, fn) {
  return Object.keys(obj).forEach((key) => fn(obj[key], key));
};

/**
 * INTERNAL: Return either the same object passed in first parameter or a deep copy of the object, depending on the deep option.
 * @function getObject
 * @param {Object} obj The object to return
 * @param {Object} options Options object
 * @param {boolean} options.deep Whether to deep-clone the object or not before returning it
 */
const getObject = (obj, options = {}) => {
  const settings = Object.assign({deep: true}, options);

  return settings.deep ? deepCopy(obj) : obj;
};

/**
 * Return a new object containing only the properties included in the props array.
 * @function pick
 * @param {Object} obj The object from which to get properties
 * @param {array<string>} props Properties to get from the object
 * @param {Object} [options] Options object
 * @param {boolean} [options.deep = true]  Whether to deep-clone the object before assigning its properties to the new object
 * @returns {Object} A copy of the object, containing only the `props` properties
 */

export const pick = function(obj, props = [], options) {
  const copy = getObject(obj, options);

  return props.reduce((prev, prop) => {
    if (prop in copy) {
      prev[prop] = copy[prop];
    }

    return prev;
  }, {});
};

/**
 * Return a new object, excluding the properties in the props array.
 * @function omit
 * @param {Object} obj The object from which to get properties
 * @param {array} props Properties to exclude from the object
 * @param {Object} [options] Options object
 * @param {boolean} [options.deep = true] Whether to deep-clone the object before assigning its properties to the new object
 * @returns {Object} A modified copy of the object
 */

export const omit = function(obj, props = [], options) {
  const copy = getObject(obj, options);

  return Object.keys(copy).reduce((prev, prop) => {
    if (!props.includes(prop)) {
      prev[prop] = copy[prop];
    }

    return prev;
  }, {});
};
