/**
 * @module ajax
 * @summary
 * ESM Import Example:
 * ```js
 * import {getJSON} from '@bamf-health/bamfjs';
 *
* // or:
 * import {getJSON} from '@bamf-health/bamfjs/ajax.js';
 * // or:
 * import {getJSON} from '@bamf-health/bamfjs/ajax.mjs';
 * ```
 *
 */

import {serialize, unserialize} from './url.js';

const caches = {};

const appendQs = (url, rawData) => {
  const urlParts = url.split('?');
  const glue = urlParts.length === 2 ? '&' : '?';

  if (!rawData) {
    return url;
  }

  const data = typeof rawData === 'string' ? rawData : serialize(rawData);

  return data ? `${url}${glue}${data}` : url;
};

const setHeaders = (xhr, headers = {}) => {
  for (let h in headers) {
    xhr.setRequestHeader(h, headers[h]);
  }
};

const setNoCache = (xhr, options) => {
  const {cache, headers} = options;
  const addHeaders = {};
  const testHeaders = {
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
    'If-Modified-Since': 'Sat, 1 Jan 2000 00:00:00 GMT',
  };

  if (cache !== false) {
    return;
  }

  for (let h in testHeaders) {
    if (!headers[h]) {
      addHeaders[h] = testHeaders[h];
    }
  }

  setHeaders(xhr, addHeaders);
};

const setContentType = (xhr, dataType) => {
  const types = {
    json: {'Content-Type': 'application/json'},
    form: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    formData: {'Content-Type': 'multipart/form-data'},
  };

  if (!dataType || !types[dataType]) {
    return;
  }

  setHeaders(xhr, types[dataType]);
};

const getResponseHeaders = function getResponseHeaders(xhr) {
  const allHeaders = xhr.getAllResponseHeaders().split('\r\n');
  const headers = {};

  allHeaders.forEach((item) => {
    // '\u003a\u0020' is ': '
    const headerParts = item.split('\u003a\u0020');

    if (headerParts < 2) {
      return;
    }

    const key = headerParts.shift();

    headers[key] = headerParts.join(' ');
  });

  return headers;
};

const processResponse = (xhr, opts) => {
  if (opts.dataType === 'json' && typeof xhr.response === 'string') {
    xhr.response = JSON.parse(xhr.response);
  }

  const response = {
    xhr: xhr,
    headers: getResponseHeaders(xhr),
    timestamp: +new Date(),
  };

  const responseKeys = [
    'response',
    'responseText',
    'responseType',
    'responseURL',
    'responseXML',
    'status',
    'statusText',
    'timeout',
  ];

  responseKeys.forEach((item) => {
    try {
      response[item] = xhr[item];
    } catch (e) {
      response[item] = null;
    }

  });

  return response;
};

const removeListeners = (xhr, events, handlers) => {
  events.forEach((event) => {
    xhr.removeEventListener(event, handlers[event]);
  });
};

/**
* Low-level ajax request
* @function ajax
* @param {string} [url = location.href] The URL of the resource
* @param {object} options
* @param {string}  [options.dataType] One of 'json', 'html', 'xml', 'form', 'formData'. Used for setting the `Content-Type` request header (e.g. `multipart/form-data` when 'formData`) and processing the response (e.g. calling JSON.parse() on a string response when 'json');
* @param {Object|string} [options.data] Data to send along with the request. If it's a GET request and `options.data` is an object, the object is converted to a query string and appended to the URL.
* @param {string} [options.method = GET] One of 'GET', 'POST', etc.
* @param {boolean} [options.cache=true] If set to `false`, will not let server use cached response
* @param {boolean} [options.memcache=false] If set to `true`, and a previous request sent to the same url was successful, will circumvent request and use the previous response
* @param {Object} [options.headers = {}] **Advanced**: Additional headers to send with the request. If headers such as 'Accept', 'Content-Type', 'Cache-Control', 'X-Requested-With', etc.,  are set here, they will override their respective headers set automatically based on other options such as `options.dataType` and `options.cache`.
* @param {HTMLFormElement} [options.form] An optional form element
* @returns {Promise} A resolved or rejected Promise from the server
*/
export const ajax = function(url = location.href, options = {}) {
  const opts = Object.assign({
    method: 'GET',
    dataType: '',
    headers: {},
  }, options);
  const events = ['load', 'error', 'abort'];
  const isGet = /GET/i.test(opts.method);

  url = isGet ? appendQs(url, opts.data) : url;

  return new Promise((resolve, reject) => {
    let sendData;
    const xhr = new XMLHttpRequest();

    const handlers = {
      error: function(err) {
        removeListeners(xhr, events, handlers);
        reject(err);
      },
      abort: function() {
        removeListeners(xhr, events, handlers);
        reject(new Error('request aborted'));
      },
      load: function() {
        removeListeners(xhr, events, handlers);

        if (xhr.status >= 400 || xhr.status < 200) {
          return reject(xhr);
        }

        let processedResponse = processResponse(xhr, opts);

        if (opts.memcache) {
          caches[url] = processedResponse;
        }

        return resolve(processedResponse);
      },
    };

    if (opts.memcache && caches[url]) {
      return resolve(caches[url]);
    }

    events.forEach((event) => {
      xhr.addEventListener(event, handlers[event]);
    });

    // @ts-ignore
    xhr.responseType = opts.dataType;
    xhr.open(opts.method.toUpperCase(), url);

    // Must set headers after xhr.open();
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    if (isGet) {
      if (opts.dataType === 'json') {
        xhr.setRequestHeader('Accept', 'application/json');
      }
    } else {
      const dataType = opts.form ? '' : opts.dataType || 'form';

      sendData = opts.data;
      setContentType(xhr, dataType);
    }

    setHeaders(xhr, opts.headers);
    setNoCache(xhr, opts);

    xhr.send(sendData);
  });
};

/**
 * Send a GET request and return parsed JSON response from the resolved Promise
 * @function getJSON
 * @param {string} [url=location.href] The URL of the resource
 * @param {{data: Object|string, cache: boolean, memcache: boolean, headers: Object}} [options = {}] See [ajax]{@link #module_ajax..ajax} for details
 * @see [ajax]{@link #module_ajax..ajax}
 * @returns {Promise} A resolved or rejected Promise from the server
 */
export const getJSON = (url, options = {data: {}, cache: true, memcache: false, headers: {}}) => {
  const opts = Object.assign({}, options, {
    dataType: 'json',
    method: 'GET',
  });

  return ajax(url, opts);
};

/**
 * Send a POST request and return parsed JSON response from the resolved Promise
 * @function postJSON
 * @param {string} [url=location.href] The URL of the resource
 * @param {{data: Object|string, cache: boolean, memcache: boolean, headers: Object}} [options = {}] See [ajax]{@link #module_ajax..ajax} for details
 * @see [ajax]{@link #module_ajax..ajax}
 * @returns {Promise} A resolved or rejected Promise from the server
 */
export const postJSON = (url, options = {data: {}, cache: true, memcache: false, headers: {}}) => {
  let opts = Object.assign({
    dataType: 'json',
    method: 'POST',
  }, options);

  if (typeof opts.data === 'object') {
    opts.data = JSON.stringify(opts.data);
  }

  return ajax(url, opts);
};

/**
 * Send a POST request with `FormData` derived from form element provided by `options.form`
 * @function postFormData
 * @param {string} [url=location.href] The URL of the resource
 * @param {{form: HTMLFormElement, cache: boolean, memcache: boolean, headers: Object}} [options = {}] See [ajax]{@link #module_ajax..ajax} for details
 * @see [ajax]{@link #module_ajax..ajax}
 * @returns {Promise} A resolved or rejected Promise from the server
 */
export const postFormData = (url, options = {form: null, cache: true, memcache: false, headers: {}}) => {
  let opts = Object.assign({
    data: new FormData(options.form),
    method: 'POST',
    dataType: '',
  }, options);

  return ajax(url, opts);
};

/**
 * Fetch an HTML document and return the html string (or a subset of it) from the resolved Promise
 * @function fetchHTML
 * @param {string} url  The URL of the resource to fetch
 * @param {string} selector A selector specifying the html content in the resource to return
 * @returns {Promise} A resolved or rejected Promise, resolving to an HTML string
 */
export const fetchHTML = (url, selector) => {

  // For old browsers that do not support fetch,
  // just set the href to the url instead (using server navigation)
  if (typeof fetch !== 'function') {
    location.href = url;

    return Promise.reject(new Error('Fetch API not supported. Loading new page from browser.'));
  }

  return fetch(url)
  .then((response) => response.text())
  .then((html) => {

    if (!selector) {
      return html;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const primaryContent = doc.querySelector(selector);

    return primaryContent ? primaryContent.innerHTML : '';
  });
};
