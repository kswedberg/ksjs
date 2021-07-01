/* eslint-disable no-param-reassign */
import {extend} from './object.js';

/**
 * @module storage
 * @summary
 * ES6 Import Example:
 * ```js
 * import {Storage} from '@bamf-health/bamfjs';
 *
 * // or:
 * import {Storage} from '@bamf-health/bamfjs/storage.js';
 * ```
 *
 */

const rNormalizeNs = /([^\w$_-])+/g;
const nsReplace = function(namespace, key) {
  const ns = (namespace || '').replace(rNormalizeNs, '');

  return key.replace(ns, '');
};

/**
 * Constructor for storage functions.
 * @class Storage
 * @param {string} [type = local] Type of storage: either 'local' or 'session'
 * @param {string} [ns = bamf] Namespace for keys to prevent potenial collisions with storage items used by libraries, etc.
 * @returns this
 */
const Storage = function Storage(type, ns) {
  let namespace = ns;

  if (!(this instanceof Storage)) {
    return new Storage(type, ns);
  }

  if (type === 'session') {
    this.store = window.sessionStorage;
  } else {
    this.store = window.localStorage;
  }

  namespace = (namespace || 'bamf').replace(rNormalizeNs, '');
  this.namespace = namespace;
  this.length = this.getLength();

  return this;
};

/**
 * Get the number of items in the storage
 * @function getLength
 * @instance
 * @returns {number} The number of items
 */
Storage.prototype.getLength = function getLength() {
  if (!this.namespace) {
    return this.store.length;
  }

  return Object.keys(this.store).filter((item) => {
    return item.indexOf(this.namespace) === 0;
  }).length;
};

/**
 * Get and JSON.parse the value of the storage item identified by `key`
 * @function get
 * @instance
 * @param {string} key The key of the storage item
 * @returns {any} The JSON.parsed value of the storage item
 */
Storage.prototype.get = function get(key) {
  key = this.namespace + key;
  let data = this.store.getItem(key);

  return JSON.parse(data);
};

/**
* Set the JSON.stringified value of the storage item identified by `key`
* @function set
* @instance
* @param {string} key The key of the storage item
* @param {any} value The value to be set for `key`
* @returns {string} The stringified value that is set
*/
Storage.prototype.set = function set(key, value) {
  key = this.namespace + key;
  let data = JSON.stringify(value);

  this.store.setItem(key, data);
  this.length = this.getLength();

  return data;
};

/**
 * Remove the storage item identified by `key`
 * @function remove
 * @instance
 * @param {string} key The key of the storage item to remove
 */
Storage.prototype.remove = function remove(key) {
  key = this.namespace + key;
  this.store.removeItem(key);
  this.length = this.getLength();
};

/**
 * Remove all storage items
 * @function clear
 * @instance
 */
Storage.prototype.clear = function clear() {
  if (!this.namespace) {
    this.store.clear();
  } else {
    this.keys().forEach((key) => {
      this.remove(key);
    });
  }

  this.length = 0;
};

/**
 * Get an object of key/value pairs of all storage items
 * @function getAll
 * @instance
 * @returns {Object} All storage items
 */
Storage.prototype.getAll = function getAll() {
  let data = {};

  this.keys().forEach((key) => {
    data[key] = JSON.parse(this.store.getItem(this.namespace + key));
  });

  return data;
};


/**
 * Loop through all storage items and return an array of their keys
 * @function keys
 * @instance
 * @returns {array} Array of the keys of all storage items
 */
Storage.prototype.keys = function keys() {
  let data = [];

  for (let i = 0, len = this.store.length; i < len; i++) {
    let key = this.store.key(i);

    if (!this.namespace) {
      data.push(key);
    } else if (key.indexOf(this.namespace) === 0) {
      key = nsReplace(this.namespace, key);
      data.push(key);
    }
  }

  return data;
};

// Loop through all storage items, calling the callback for each one
Storage.prototype.each = function each(callback) {
  let len = this.store.length;
  let stores = this.getAll();

  for (let key in stores) {
    let ret = callback(key, stores[key]);

    if (ret === false) {
      return;
    }
  }
};

Storage.prototype.map = function map(callback) {
  let stores = this.getAll();
  let data = {};

  for (let key in stores) {
    let ret = callback(key, stores[key]);

    data[key] = ret;
  }

  return data;
};

Storage.prototype.mapToArray = function mapToArray(callback) {
  let stores = this.getAll();
  let data = [];

  for (let key in stores) {
    let ret = callback(key, stores[key]);

    data.push(ret);
  }

  return data;
};

//
Storage.prototype.filter = function filter(callback) {
  let data = {};
  let keys = this.keys();

  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i];
    let val = JSON.parse(this.store.getItem(this.namespace + key));

    if (callback(key, val, i)) {
      data[key] = val;
    }
  }

  return data;
};

// Assuming multiple storage items, with each one an object…
// Loop through all storage items and turn them into an array of objects
// with each object given a `key` property with value being the storage item's key
Storage.prototype.toArray = function toArray() {
  let data = [];

  return this.keys().map((key) => {
    let val = JSON.parse(this.store.getItem(this.namespace + key));

    val.key = key;

    return val;
  });
};

// Loop through all storage items, like .toArray()
// and filter them with a callback function with return value true/false
Storage.prototype.filterToArray = function filterToArray(callback) {
  let data = [];

  this.each((key, val) => {
    let include = callback(key, val);

    if (include) {
      val.key = key;
      data.push(val);
    }
  });

  return data;
};

// Merge object into a stored object (referenced by 'key')
Storage.prototype.merge = function merge(deep, key, value) {
  let data = this.get(deep === true ? key : deep) || {};

  if (deep === true) {
    // deep extend
    data = extend(data, value);
  } else {
    // shallow, so need to rearrange args, then do a shallow copy of props
    value = key;
    key = deep;

    for (let k in value) {
      if (value.hasOwnProperty(k)) {
        data[k] = value[k];
      }
    }
  }

  this.set(key, data);

  return data;
};

export {Storage};
