/**
 * @module url
 * @summary ES6 Import Example:
 * ```js
 * import {serialize} from '@bamf-health/bamfjs';
 *
 * // or:
 * import {serialize} from '@bamf-health/bamfjs/url.js';
 * ```
 *
 * CommonJS Require Example:
 * ```js
 * const {serialize} = require('@bamf-health/bamfjs/cjs/url.js');
 * ```
 *
 */

import {extend} from './object.js';

let getObjectType = function getObjectType(obj) {
  const type = Object.prototype.toString.call(obj);

  if (type === '[object Array]') {
    return 'array';
  } else if (type === '[object Object]') {
    return 'object';
  }

  return null;
};

const buildParams = function buildParams(prefix, obj, options, add) {
  let val, valType;
  let objType = getObjectType(obj);
  let l = obj && obj.length;

  if (objType === 'array') {
    if (options.arrayToString) {
      add(prefix, obj.toString());

    } else {
      for (let i = 0; i < l; i++) {
        // Serialize array item.
        val = obj[i];
        valType = getObjectType(val);
        buildParams(`${prefix}[${valType || options.indexed ? i : ''}]`, val, options, add);
      }
    }

  } else if (objType === 'object') {
    // Serialize object item.
    for (let name in obj) {
      buildParams(`${prefix}[${name}]`, obj[ name ], options, add);
    }

  } else {
    // Serialize scalar item.
    if (typeof obj === 'undefined') {
      obj = '';
    }
    add(prefix, obj);
  }
};

const r20 = /%20/g;
const rPlus = /\+/g;

/**
 * Return a normalized `pathname` (old IE doesn't include initial "/" for `this.pathname`) of a passed object if it has an `href` property, or return the derived path name from string representing a URL
 * @function pathname
 * @param {Object|Location|string} [obj = window.location]  An object with a `pathname` propety or a string representing a URL
 * @returns {string} pathname
 */

export const pathname = function(obj) {
  let el = obj || window.location;
  let pathParts = [];
  let path = el.pathname || '';

  if (typeof el === 'string') {
    // convert any URL-y string to a pathname
    if (el.indexOf('//') === 0) {
      el = location.protocol + el;
    }
    // remove "#..." and "?..."
    path = el.replace(/#.*$/, '').replace(/\?.*$/, '');
    // remove protocol, domain, etc.
    if (/^https?:\/\//.test(path)) {
      pathParts = path.split(/\//).slice(3);
      path = pathParts.join('/');
    }
  }

  path = `/${path.replace(/^\//, '')}`;

  return path;
};

/**
 * Return the basename of an object with `pathname` property or a string. Similar to node.js `path.basename()`
 * @function basename
 * @param {Object|string} [obj = window.location] An object with a `pathname` property, or a string representing a URL
 * @param {string} [ext] Extension (e.g. '.html') to remove from the end of the basename)
 * @returns {string} basename
 */
export const basename = function(obj, ext) {
  let rExt;
  let path = pathname(obj).split(/\//).pop() || '';

  if (ext) {
    ext = ext.replace(/\./g, '\\.');
    rExt = new RegExp(`${ext}$`);
    path = path.replace(rExt, '');
  }

  return path;
};

/**
 * Return an array consisting of each segment of a URL path
 * @function segments
 * @param {Object|string} [obj = window.location] An object with a `pathname` property, or a string representing a URL
 * @returns {array} Array of segments
 */
export const segments = function segments(obj) {
  let path = pathname(obj).replace(/^\/|\/$/g, '');

  return path.split('/') || [];
};

/**
 * Return the `index`th segment of a URL path
 * @function segment
 * @param {number} index Index of the segment to return. If < 0, works like `[].slice(-n)`
 * @param {Object|string} [obj = window.location] An object with a `pathname` property, or a string representing a URL
 * @returns {array} A segment of the path derived from `obj` at `index`
 */
export const segment = function segment(index, obj) {
  let idx = Number(index);
  let segs = segments(obj);
  let seg = segs[idx] || '';

  if (idx < 0) {
    idx *= -1;

    // Avoid ridiculously large number for idx grinding things to a halt
    idx = Math.min(idx, segs.length + 1);

    while (idx-- > 0) {
      seg = segs.pop() || '';
    }
  }

  return seg;
};

export const loc = function loc(el) {
  let locat = {
    pathname: pathname(el),
    basename: basename(el),
  };
  let href, segment, host, protocol;
  let hrefParts = ['host', 'pathname', 'search', 'hash'];
  let parts = {hash: '#', search: '?'};

  if (typeof el === 'string') {

    for (let part in parts) {
      segment = el.split(parts[part]);
      locat[part] = '';

      if (segment.length === 2 && segment[1].length) {
        locat[part] = parts[part] + segment[1];
        el = segment[0];
      }
    }

    protocol = el.split(/\/\//);
    locat.protocol = protocol.length === 2 ? protocol[0] : '';
    el = protocol.pop();
    locat.host = el === locat.pathname ? location && location.host || '' : el.split('/')[0];
    host = locat.host.split(':');
    locat.hostname = host[0];
    locat.port = host.length > 1 ? host[1] : '';

    href = `${locat.protocol || 'http:'}//`;

    for (let i = 0; i < hrefParts.length; i++) {
      href += locat[ hrefParts[i] ];
    }
    locat.href = href;
  } else {
    el = el || {};

    for (let key in el) {
      if (typeof locat[key] === 'undefined') {
        locat[key] = el[key];
      }
    }
  }

  return locat;
};

// Remove potentially harmful characters from hash and escape dots
export const hashSanitize = function hashSanitize(hash) {
  hash = hash || '';

  return hash.replace(/[^#_\-\w\d.!/]/g, '').replace(/\./g, '\\.');
};

//
// options: raw, prefix, indexed
/**
 * Convert an object to a serialized string
 * @function serialize
 * @param {Object} data Plain object to be serialized
 * @param {Object} [options] Optional settings
 * @param {boolean} [options.raw] If `true`, property values are NOT url-decoded
 * @param {string} [options.prefix] If set, and `data` is an array, sets as if prefix were the name of the array
 * @param {boolean} [options.arrayToString] If `true`, calls .toString() on arrays. So `{foo: ['won', 'too']}` becomes `foo=won%2Ctoo`. Used in conjunction with `{raw: true}`, the same object becomes `foo=won,too`
 * @param {boolean} [options.indexed] If `true` (and `options.arrayToString` is NOT `true`), arrays take the form of `foo[0]=won&foo[1]=too`; otherwise, `foo[]=won&foo[]=too`
 * @returns {string} A query string
 * @example
 * console.log(serialize({foo: 'yes', bar: 'again}));
 * // Logs: 'foo=yes&bar=again'
 * @example
 * console.log(serialize({foo: ['yes', 'again']}, {arrayToString: true}));
 * // Logs: 'foo=yes,again'
 * console.log(serialize({foo: ['yes', 'again']}));
 * // Logs: 'foo[]=yes&foo[]=again'
 *
 * console.log(serialize({foo: ['yes', 'again']}, {indexed: true}));
 * // Logs: 'foo[0]=yes&foo[1]=again'
 *
 * console.log(serialize(['yes', 'again'], {prefix: 'foo'}));
 * // Logs: 'foo[0]=yes&foo[1]=again'
 *
 * console.log(serialize(['yes', 'again'], {prefix: 'foo', indexed: false}));
 * // Logs: 'foo[]=yes&foo[]=again'
 */
export const serialize = function serialize(data, options) {
  options = options || {};
  let obj = {};
  const serial = [];
  const add = function(key, value) {
    const item = options.raw ? value : encodeURIComponent(value);

    serial[ serial.length ] = `${key}=${item}`;
  };

  if (options.prefix) {
    obj[options.prefix] = data;
  } else {
    obj = data;
  }

  // If options.prefix is set, assume we want arrays to have indexed notation (foo[0]=won)
  // Unless options.indexed is explicitly set to false
  options.indexed = options.indexed || (options.prefix && options.indexed !== false);

  if (getObjectType(obj)) {
    for (let prefix in obj) {
      buildParams(prefix, obj[prefix], options, add);
    }
  }

  return serial.join('&').replace(r20, '+');
};

const getParamObject = function getParamObject(param, opts) {
  let paramParts = param.split('=');
  const key = opts.raw ? paramParts[0] : decodeURIComponent(paramParts[0]);
  let val;

  if (paramParts.length === 2) {
    // First replace all '+' characters with ' '; then decode it
    val = opts.raw ? paramParts[1] : decodeURIComponent(paramParts[1].replace(rPlus, ' '));
  } else {
    val = opts.empty;
  }

  return {key, val};
};

const createNestedObject = function(root, keys, val) {
  // Pop the last key off and keept it for the end
  let lastKey = keys.pop();

  if (lastKey === '') {
    lastKey = keys.pop();
  }

  for (let i = 0; i < keys.length; i++) {
    root = root[keys[i]] = root[keys[i]] || {};
  }

  root = root[lastKey] = val;

  // I don't think this is needed, since it's only the last value
  return root;
};

/**
 * Convert a serialized string to an object
 * @function unserialize
 * @param {string} [string = location.search] Query string
 * @param {Object} [options] Optional options
 * @param {boolean} [options.raw = false] If `true`, param values will NOT be url-decoded
 * @param {any} [options.empty = true] The returned value of a param with no value (e.g. `?foo&bar&baz`). Typically, this would be either `true` or `''`
 * @param {Boolean|RegExp|String} [options.splitValues = false] If NOT `false`, splits converts to an array all values with one or more matches of the `splitValues` option. If `true`, splits on commas (`/,/`). So, `?foo=bar,baz` becomes `{foo: ['bar', 'baz']}`
 * @param {boolean} [options.shallow = false] If `true`, does NOT attempt to build nested object
 * @returns {Object} An object of key/value pairs representing the query string parameters
 */
export const unserialize = function unserialize(string, options) {

  if (typeof string === 'object') {
    options = string;
    string = location && location.search || '';
  } else {
    string = string || location && location.search || '';
  }

  const opts = extend({
    // if true, param values will NOT be urldecoded
    raw: false,
    // the value of param with no value (e.g. ?foo&bar&baz )
    // typically, this would be either true or ''
    empty: true,
    // if true, does not attempt to build nested object
    shallow: false,
    // either Boolean, string, or regular expression
    splitValues: false,
  }, options || {});

  string = string.replace(/^\?/, '');
  let keyParts, keyRoot, keyEnd, val;
  const splitValues = opts.splitValues === true ? /,/ : opts.splitValues;
  let obj = {};
  // var hasBrackets = /^(.+)(\[([^\]]*)\])+$/;
  const rIsArray = /\[\]$/;

  if (!string) {
    return obj;
  }

  // First, convert to an object, so we can combine array values
  const params = string.split(/&/)
  .reduce((obj, curr) => {
    const {key, val} = getParamObject(curr, opts);

    if (rIsArray.test(key)) {
      if (obj[key]) {
        obj[key].push(val);
      } else {
        obj[key] = [val];
      }
    } else {
      obj[key] = val;
    }

    return obj;
  }, {});

  // Now loop through the
  for (let el in params) {
    if (!params.hasOwnProperty(el)) {
      continue;
    }

    let key = el;
    let val = params[el];

    // Set shallow key/val pair
    if (opts.shallow) {
      if (rIsArray.test(key)) {
        key = key.replace(rIsArray, '');
        obj[key] = obj[key] || [];
        obj[key].push(val);
      } else {
        obj[key] = val;
      }

      continue;
    }

    if (splitValues) {
      const arr = val.split(splitValues);

      obj[key] = arr.length === 1 ? val : arr;

      continue;
    }

    // Split on brackets
    keyParts = key.replace(/\]/g, '').split('[');

    createNestedObject(obj, keyParts, val);
  }

  return obj;
};
