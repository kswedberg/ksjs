/**
 * @module cookie
 * @summary
 * ES6 Import Example:
 * ```js
 * import {getCookie} from '@bamf-health/bamfjs';
 *
 * // or:
 * import {getCookie} from '@bamf-health/bamfjs/cookie.js';
 * ```
 *
 */

const rIsLocalhost = /^(?:localhost|(?:(?:127|0)\.0\.0\.[01]))$/;
const rIsHttps = /^https/;

const day = 1000 * 60 * 60 * 24;
const toNumber = (val) => {
  const value = parseInt(val, 10);

  return isNaN(value) ? undefined : value;
};
const daysToDate = (val) => {
  const number = toNumber(val);
  const d = new Date();

  if (!number) {
    return;
  }

  d.setTime(d.getTime() + (number * day));

  return d.toUTCString();
};

const defaults = [
  {
    name: 'path',
    value: '/',
  },
  {
    name: 'domain',
  },
  {
    name: 'expires',
    sanitize: daysToDate,
  },
  {
    name: 'max-age',
    alias: 'maxAge',
    sanitize: toNumber,
  },
  {
    name: 'secure',
    sanitize: (val) => {
      return !val || (!rIsHttps.test(location.protocol) && rIsLocalhost.test(location.hostname)) ? undefined : '';
    },
  },
  {
    name: 'samesite',
  },
];

const mergeOptions = (options) => {
  return defaults
  .map((item) => {
    const key = item.name;
    const value = options[key] || options[item.alias] || item.value;
    const sanitized = item.sanitize ? item.sanitize(value) : value;

    return typeof sanitized !== 'undefined' ? `${key}=${sanitized}` : false;
  })
  .filter((_) => _ !== false);
};

/**
 * Get the value of a cookie
 * @function getCookie
 * @param {string} name The name of the cookie whose value you wish to get
 * @returns {string} value The value of the cookie
 */
export const getCookie = (name) => {
  if (!document) {
    return null;
  }
  const rEqual = /\s*=\s*/;
  const cookies = document.cookie.split(/\s*;\s*/);

  const theCookie = cookies.find((item) => item.split(rEqual)[0] === name);

  if (theCookie) {
    return theCookie.split(rEqual)[1] || '';
  }

  return undefined;
};

/**
 * Set the value of a cookie. Use either expires or maxAge (or max-age). NOT BOTH.
 * @function setCookie
 * @param {string} name Name of the cookie
 * @param {string} value Value of the cookie
 * @param {object} [options] Optional object
 * @param {string} [options.path = '/']  Path within which the cookie can be read. Default is '/'.
 * @param {string} [options.domain]  If not specified, browser defaults to host portion of current location. If domain specified, subdomains always included. (Note: don't use leading "."). Default is undefined.
 * @param {number} [options.expires]  Number of days after which the cookie should expire. Default is undefined.
 * @param {number} [options.maxAge]  Number of seconds after which the cookie should expire. Default is undefined.
 * @param {string} [options.samesite] One of 'strict' or 'lax'. Default is undefined.
 * @param {boolean} [options.secure] If `true`, cookie can only be sent over secure protocol (e.g. https). Default is undefined.
 * @returns {string} The new cookie
 */
export const setCookie = (name, value, options = {}) => {
  if (!document) {
    return;
  }
  const cookie = [
    `${name}=${encodeURIComponent(value)}`,
    ...mergeOptions(options),
  ];

  const addCookie = `${cookie.join(';')};`;

  document.cookie = addCookie;

  return addCookie;
};

/**
 * Remove a cookie
 * @function removeCookie
 * @param {string} name Name of the cookie to remove
 * @param {string} [path] Optional path of the cookie to remove. If not provided, all `name` cookies in `location.pathname` or any of its parents will be removed.
 */
export const removeCookie = (name, path) => {
  if (!document) {
    return;
  }

  if (path) {
    return setCookie(name, '', {expires: -1, path});
  }

  const segments = location.pathname.split('/');

  for (let i = segments.length; i > 0; i--) {
    const segs = segments.slice(0, i);
    const path = segs.join('/');

    setCookie(name, '', {expires: -1, path});
  }
};
