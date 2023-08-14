/* eslint-disable dot-notation */
/**
 * @module jsonp
 * @summary
 * ESM Import Example:
 * ```js
 * import {getJSONP} from 'ksjs';
 *
 * // or:
 * import {getJSONP} from 'ksjs/jsonp.mjs';
 * // or:
 * import {getJSONP} from 'ksjs/jsonp.js';
 * ```
 *
 */

let getOpts = function getOpts(options, cb) {
  let opts = typeof options === 'string' ? {url: options} : options;

  opts.complete = typeof cb === 'function' ? cb : opts.complete || function() {/* intentionally empty */};
  opts.data = opts.data || {};

  return opts;
};

let head = document.getElementsByTagName('head')[0];

window['jsonp'] = {};

/**
 * Function for those times when you just need to make a "jsonp" request (and you can't set up CORS on the server). In other words, x-site script grabbing.
 * @function getJSONP
 * @param {Object} options
 * @param {string} options.url URL of the jsonp endpoint
 * @param {Object} [options.data] Optional data to include with the request
 * @param {string} [options.data.callback = jsonp.[timestamp]] Optional value of the callback query-string parameter to append to the script's `src`
 * @param {function} callback(json) Function to be called when request is complete. A json object is passed to it.
 * @warning untested
 * @warning requires setup on server side
 * @warning not entirely safe
 * @example
 * getJSONP({url: 'https://example.com/api/'})
 */
export let getJSONP = function(options, callback) {
  let opts = getOpts(options, callback);
  let hasJSON = typeof window.JSON !== 'undefined';
  let src = opts.url + (opts.url.indexOf('?') > -1 ? '&' : '?');

  let newScript = document.createElement('script');
  let params = [];
  let cb = `j${new Date().getTime()}`;

  opts.data.callback = opts.data.callback || `jsonp.${cb}`;

  // This function will be called in the other server's response
  window['jsonp'][cb] = function(json) {

    if (!hasJSON) {
      json = {error: 'Your browser is too old and unsafe for this.'};
    } else if (typeof json === 'object') {
      let s = JSON.stringify(json);

      json = JSON.parse(s);
    } else if (typeof json === 'string') {
      json = JSON.parse(json);
    }

    // Callback function defined in options.complete
    // called after json is parsed.
    opts.complete(json);

    window['jsonp'][callback] = null;
  };

  for (let key in opts.data) {
    params.push(`${key}=${encodeURIComponent(opts.data[key])}`);
  }
  src += params.join('&');

  newScript.src = src;

  // if (this.currentScript) head.removeChild(currentScript);
  head.appendChild(newScript);
  newScript.src = null;
};
