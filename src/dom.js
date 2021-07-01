// @ts-nocheck
/**
 * @module dom
 * @summary
 * ES6 Import Example:
 * ```js
 * import {addClass} from '@bamf-health/bamfjs';
 *
 * // or:
 * import {addClass} from '@bamf-health/bamfjs/dom.js';
 * ```
 *
 */

import {isArray} from './array.js';

const isNodeList = (els) => {
  return NodeList.prototype.isPrototypeOf(els);
};


const isNode = (obj) => {
  return obj instanceof Node || obj && obj.nodeType >= 1;
};

// Return either a DOM element or null
const normalizeContext = (el) => {
  // If no el is passed in, default is document:
  if (typeof el === 'undefined') {
    return document;
  }

  // If the element doesn't exist (and it's not undefined), bail early
  if (!el) {
    return null;
  }
  // If it's an element, we use it
  if (isNode(el)) {
    return el;
  }

  // If string is passed, return the element in the DOM if we can find it
  if (typeof el === 'string') {
    return document.querySelector(el);
  }

  // Could be a collection of nodes, in which case, return the first one
  // Otherwise, we've pretty much exhausted our search, so null it is
  return el.length && isNode(el[0]) && el[0] || null;
};

/**
 * Converts a selector string, DOM element, or collection of DOM elements into an array of DOM elements
 * @function toNodes
 * @param {Element|NodeList|array|string} element(s) The selector string, element, or collection of elements (NodeList, HTMLCollection, Array, etc)
 * @returns {array} An array of DOM elements

*/
export const toNodes = (element) => {
  if (typeof element === 'string') {
    return [...document.querySelectorAll(element)];
  }

  if (!element) {
    return [];
  }

  if (isNode(element)) {
    return [element];
  }

  return element.length && [...element].filter((item) => isNode(item)) || [];
};

/**
* Return an array of DOM Nodes within the document or provided element/nodelist
* @function $
* @param {string} selector The CSS selector of the DOM elements
* @param {Element|NodeList|array|string} [context = document] The selector string, element, or collection of elements (NodeList, HTMLCollection, Array, etc) representing one or more elements within which to search for `selector`
* @returns {Array} Array of DOM nodes matching the selector within the context
*/
export const $ = (selector, context) => {
  if (typeof context !== 'undefined' && !context) {
    return [];
  }
  const contexts = !context ? [document] : toNodes(context);

  return contexts.reduce((arr, ctx) => {
    arr.push(...ctx.querySelectorAll(selector));

    return arr;
  }, []);
};

/**
* Return the first found DOM Element within the document or provided element/nodelist/HTMLCollection
* @function $1
* @param {string} selector Selector string for finding the DOM element
* @param {Element|NodeList|array|string} [context = document] The selector string, element, or collection of elements (NodeList, HTMLCollection, Array, etc) representing one or more elements within which to search for `selector`
* @returns {Element} First DOM Element matching the selector within the context
*/
export const $1 = (selector, context) => {
  if (typeof context === 'undefined' || isNode(context)) {

    return (context || document).querySelector(selector);
  }

  const ctx = toNodes(context);

  // Find the first element matched by selector within each context element.
  // Then, filter the array to include only the items that matched
  // Finally, return the first one
  return ctx
  .map((el) => el.querySelector(selector))
  .filter((el) => !!el)
  [0];
};

const rTrim = /^\s+|\s$/g;

// Class functions:

/**
 * Add one or more classes to an element
 * @function addClass
 * @param  {Element} el - DOM element for which to add the class
 * @param {string} className class to add to the DOM element
 * @param {...string} [classNameN] one or more additional className arguments representing classes to add to the element
 * @returns {string} the resulting class after classes have been removed
 */
export const addClass = (() => {
  if (document.body.classList) {
    return (el, ...classNames) => {
      el.classList.add(...classNames);

      return el.className;
    };
  }

  return (el, ...names) => {
    let classes = ` ${el.className} `;

    if (names && names.length) {
      for (let i = 0; i < names.length; i++) {
        if (classes.indexOf(` ${names[i]} `) === -1) {
          classes += `${names[i]} `;
        }
      }

      el.className = classes.replace(rTrim, '');
    }

    return el.className;
  };
})();

/**
 * Remove one or more classes from an element
 * @function removeClass
 * @param  {Element} el DOM element from which to remove the class
 * @param {string} className class to remove from the DOM element
 * @param {...string} [classNameN] one or more additional className arguments representing classes to remove from the element
 * @returns {string} the resulting class after classes have been removed
 */
export const removeClass = (() => {
  if (document.body.classList) {
    return (el, ...names) => {
      el.classList.remove(...names);

      return el.className;
    };
  }

  return (el, ...names) => {
    let classes = ` ${el.className} `;

    if (names && names.length) {
      for (let i = 0; i < names.length; i++) {
        if (classes.indexOf(` ${names[i]} `) !== -1) {
          classes = classes.replace(`${names[i]} `, '');
        }
      }
    }
    el.className = classes.replace(rTrim, '');

    return el.className;
  };
})();

/**
 * Add a class if it's not present (or if toggle is true); remove the class if it is present (or if toggle is false)
 * @function toggleClass
 * @param {Element} el Element on which to toggle the class
 * @param {string} className The class name to either add or remove
 * @param {boolean} [toggle] Optional boolean argument to indicate whether className is to be added (true) or removed (false)
 * @returns {string} The `className` property of the element after the class has been toggled
 */
export const toggleClass = (() => {
  let div = document.createElement('div');
  // Check for *full* toggle support, including 2nd "toggle/force" argument

  const hasClassListToggle = div.classList && div.classList.toggle && div.classList.toggle('a', 0) === false;

  div = null;

  if (hasClassListToggle) {
    return (el, className, toggle) => {
      el.classList.toggle(className, toggle);

      return el.className;
    };
  }

  return (el, className, toggle) => {
    const classes = ` ${el.className} `;

    if (toggle || (typeof toggle === 'undefined' && classes.indexOf(` ${className} `) === -1)) {
      return addClass(el, className);
    }

    return removeClass(el, className);
  };
})();

/**
 * Replace oldClass with newClass
 * @function replaceClass
 * @param {Element} el DOM element for which you want to replace oldClass with newClass
 * @param {string} oldClass The class name you want to get rid of
 * @param {string} newClass The class name you want to add in place of oldClass
 * @returns {string} The `className` property of the element after the class has been replaced
 */
export const replaceClass = (el, oldClass, newClass) => {
  if (el.classList) {
    el.classList.replace(oldClass, newClass);

    return el.className;
  }

  const classes = el.className.replace(rTrim).split(/\s+/);

  el.className = classes
  .map((item) => {
    return item === oldClass ? newClass : item;
  })
  .filter((item, i, arr) => {
    return arr.indexOf(item) === i;
  })
  .join(' ');

  return el.className;
};

/**
 * Get the top and left distance to the element (from the top of the document)
 * @function getOffset
 * @param {Element} el Element for which to get the offset
 * @warning untested
 * @returns {{top: number, left: number, scrollTop: number, scrollLeft: number}} Object with `top` and `left` properties representing the top and left offset of the element
 */
export const getOffset = (el) => {
  if (!el) {
    return {top: null, left: null, scrollTop: null, scrollLeft: null};
  }
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {top: rect.top + scrollTop, left: rect.left + scrollLeft, scrollTop, scrollLeft};
};

const booleanAttrs = [
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'formnovalidate',
  'frameborder',
  'hidden',
  'indeterminate',
  'ismap',
  'loop',
  'multiple',
  'muted',
  'novalidate',
  'open',
  'readonly',
  'required',
  'reversed',
  'scoped',
  'selected',
];

/**
* Set one or more styles on an element.
* @function setStyles
* @param {Element} el element on which to add styles
* @param {Object.<string, string|number>} styles object of styles and their values to add to the element
* @returns {Element} The original element, with the styles set
*/
export const setStyles = (el, styles) => {
  if (!el || !styles) {
    return el;
  }
  Object.keys(styles || {}).forEach((key) => {
    el.style[key] = styles[key];
  });

  return el;
};

/**
 * Set one or more attributes on an element. For boolean attributes ('async', 'required', etc.), set the element's property to either `true` or `false`
 * @function setAttrs
 * @param {Element} el element on which to add attributes
 * @param {Object.<string, string|boolean|number>} attrs object of attributes and their values to add to the element
 * @returns {Element} The original element, with the attributes set
 */
export const setAttrs = (el, attrs) => {
  if (!el || !attrs) {
    return el;
  }

  const mappedProps = {
    class: 'className',
    className: 'className',
    for: 'htmlFor',
    htmlFor: 'htmlFor',
  };

  Object.keys(attrs).forEach((key) => {
    const val = attrs[key];

    if (mappedProps[key]) {
      el[mappedProps[key]] = val;
    } else if (booleanAttrs.indexOf(key) !== -1) {
      if (val) {
        el.setAttribute(key, '');
      } else {
        el.removeAttribute(key);
      }
    } else {
      el.setAttribute(key, val === true ? '' : val);
    }
  });

  return el;
};

/**
 * Given an array of attribute names, get an object containing attribute names/values for an element
 * @function getAttrs
 * @param {Element} el DOM Element. If NodeList is provided, uses the first element in the list
 * @param {Array.<string>} attrs Array of attribute names
 * @returns {Object} Object of attribute names along with their values
 */
export const getAttrs = (el, attrs = []) => {
  const element = toNodes(el)[0];

  if (!element) {
    return {};
  }

  return attrs.reduce((obj, key) => {
    obj[key] = element.getAttribute(key);

    return obj;
  }, {});
};

/**
 * Add an attribute to an element if it's not present (or if toggle is `true`); remove the attribute if it is present (or if toggle is `false`)
 * @function toggleAttr
 * @param {Element} el Element on which to toggle the attribute
 * @param {string} attribute The attribute to either add or remove
 * @param {boolean} [toggle] Optional boolean argument to indicate whether the attribute is to be added (true) or removed (false) *
 * @returns {string} The attribute name if it has been added, `undefined` if it has been removed
 */

export const toggleAttr = (el, attribute, toggle) => {
  const attr = attribute;

  if (!el || !attr) {
    return;
  }
  const hasAttr = el.hasAttribute(attr);

  if (!hasAttr && (typeof toggle === 'undefined' || toggle)) {
    el.setAttribute(attr, '');

    return attr;
  }

  if (hasAttr && (typeof toggle === 'undefined' || !toggle)) {
    el.removeAttribute(attr);
  }

  return el.hasAttribute(attr) && attr || undefined;
};
const traversals = {
  afterbegin: 'firstChild',
  afterend: 'nextSibling',
  beforebegin: 'previousSibling',
  beforeend: 'lastChild',
};
/**
 *
 * @param {Element} element html element
 * @param {string} position position for insertion
 * @param {string} toInsert html string to insert
 */
const insertHTML = (element, position, toInsert) => {
  let els = toNodes(element);
  const traversalProp = traversals[position];
  const insertMethod = typeof toInsert === 'string' ? 'insertAdjacentHTML' : 'insertAdjacentElement';

  return els
  .map((el) => {
    el[insertMethod](position, toInsert);

    return el[traversalProp];
  });
};

/**
 * Insert an element as the first child of `el`
 * @function prepend
 * @param {Element} el Reference element
 * @param {Element|string} toInsert DOM element or HTML string to insert as the first child of `el`
 * @returns {Element} The inserted element
 */
export const prepend = (el, toInsert) => {
  if (typeof toInsert === 'string') {
    return insertHTML(el, 'afterbegin', toInsert);
  }

  if (el.childNodes) {
    el.insertBefore(el.firstChild, toInsert);
  } else {
    el.appendChild(toInsert);
  }

  return el.firstChild;
};

/**
 * Insert an element as the last child of `el`
 * @function append
 * @param {Element} el Reference element
 * @param {Element|string} toInsert DOM element or HTML string to insert as the last child of `el`
 * @returns {Element} The inserted element
 */
export const append = (el, toInsert) => {
  if (typeof toInsert === 'string') {
    return insertHTML(el, 'beforeend', toInsert);
  }

  el.appendChild(toInsert);

  return el.lastChild;
};

/**
 * Insert an element as the previous sibling of `el`
 * @function before
 * @param {Element} el Reference element
 * @param {Element|string} toInsert DOM element or HTML string to insert as the previous sibling of `el`
 * @returns {Element} The inserted element
 */
export const before = (el, toInsert) => {
  if (typeof toInsert === 'string') {
    return insertHTML(el, 'beforebegin', toInsert);
  }

  el.parentNode.insertBefore(el, toInsert);

  return el.previousSibling;
};

/**
 * Insert an element as the next sibling of `el`
 * @function after
 * @param {Element} el Reference element
 * @param {Element|string} toInsert DOM element or HTML string to insert as the next sibling of `el`
 * @returns {Element} The inserted element
 */
export const after = (el, toInsert) => {
  if (typeof toInsert === 'string') {
    return insertHTML(el, 'afterend', toInsert);
  }

  if (el.nextSibling) {
    el.parentNode.insertBefore(el.nextSibling, toInsert);
  } else {
    el.parentNode.appendChild(toInsert);
  }

  return el.nextSibling;
};

/**
 * Provide an object, along with possible child objects, to create a node tree ready to be inserted into the DOM.
 * @function createTree
 * @param {object} options
 * @param {string} [options.tag] Optional tag name for the element. If none provided, a document fragment is created instead
 * @param {string} [options.text] Optional inner text of the element.
 * @param {Array<Object>} [options.children] Optional array of objects, with each object representing a child node
 * @param {string} [...options[attr]] One or more optional attributes to set on the element
 * @returns {Element(s)} The created Element node tree
 */
export const createTree = function({tag, text, children = [], ...attrs}) {
  let el;

  if (tag) {
    el = document.createElement(tag || 'div');
    setAttrs(el, attrs);
  } else {
    el = document.createDocumentFragment();
  }

  if (text) {
    el.appendChild(document.createTextNode(text));
  }

  children.forEach((child) => {
    el.appendChild(createTree(child));
  });

  return el;
};

// Remove as many event handlers as possible from element, as well as its children
// Currently only works with handlers attached as attributes
const cleanHandlers = (el) => {
  const attrs = el.attributes;

  // Clean event handlers attached as an attribute (e.g. <div onclick="function() {}")
  if (attrs && attrs.length) {
    for (let i = attrs.length - 1; i >= 0; i--) {
      const name = attrs[i].name;

      // Null out event handlers:
      if (typeof el[name] === 'function') {
        el[name] = null;
      }
    }
  }

  const children = el.childNodes;

  if (children && children.length) {
    const len = children.length;

    for (let i = 0; i < len; i++) {
      cleanHandlers(el.childNodes[i]);
    }
  }
};

/**
 * Remove an element from the DOM
 * @function remove
 * @param {Element} el DOM element to be removed
 * @returns {Element} DOM element removed from the DOM
 */
export const remove = (el) => {
  if (!el || !el.nodeName) {
    return;
  }

  cleanHandlers(el);

  if (typeof el.remove === 'function') {
    el.remove();
  } else if (el.parentNode) {
    el.parentNode.removeChild(el);
  }

  return el;
};

/**
 * Empty an element's children from the DOM
 * @function empty
 * @param {Element} el DOM element to clear of all children
 * @returns {Element} DOM element provided by `el` argument
 */
export const empty = (el) => {
  if (!el || !el.nodeName) {
    return;
  }

  while (el.firstChild) {
    cleanHandlers(el.firstChild);
    el.removeChild(el.firstChild);
  }

  return el;
};

const replaceWith = (oldEl, newEls) => {
  if (Element.prototype.replaceWith) {
    return oldEl.replaceWith(...newEls);
  }
  const parentEl = oldEl.parentNode;
  const len = newEls.length;

  for (let i = 0; i < len; i++) {
    let currentEl = typeof newEls[i] === 'string' ? document.createTextNode(newEls[i]) : newEls[i];

    if (currentEl.parentNode) {
      currentEl.parentNode.removeChild(currentEl);
    }

    parentEl.insertBefore(currentEl, oldEl);
  }
  parentEl.removeChild(oldEl);
};

/**
 * Replace a DOM element with one or more other elements
 * @function replace
 * @param {Element} oldEl The element to be replaced
 * @param {Element|Array<Element>} replacement An element, or an array of elements, to insert in place of `oldEl`
 */
export const replace = (oldEl, replacement) => {

  if (!oldEl || !oldEl.parentNode) {
    return null;
  }
  if (!replacement) {
    return remove(oldEl);
  }

  cleanHandlers(oldEl);

  const newStuff = typeof replacement === 'string' ? document.createTextNode(replacement) : replacement;

  return isArray(newStuff) ? replaceWith(oldEl, newStuff) : oldEl.parentNode.replaceChild(newStuff, oldEl);
};

/**
 * Insert a script into the DOM with reasonable default properties, returning a promise. If `options.id` is set, will avoid loading  script if the id is already in the DOM.
 * @function loadScript
 * @param {object} options An object of options for loading the script. All except `complete` and `completeDelay` will be set as properties on the script element before it is inserted.
 * @param {string} [options.src] The value of the script's `src` property. Required if `options.textContent` not set
 * @param {string} [options.textContent] The text content of the script. Ignored if `options.src` set. Required if `options.src` NOT set.
 * @param {boolean} [options.async=true] The value of the script's `async` property. Default is `true`.
 * @param {number} [options.completeDelay=0] Number of milliseconds to wait when the script has loaded before resolving the Promise to account for time it might take for the script to be parsed
 * @param {string} [options.id] String representing a valid identifier to set as the script element's `id` property. If set, the script will not be loaded if an element with the same id already appears in the DOM
 * @param {string} [options.onDuplicateId = resolve] One of 'resolve' or 'reject'. Whether to return a resolved or rejected promise when a script with an id matching the provided `options.id` is already in the DOM. Either way, the function will not attempt to load the script again and the resolved/rejected promise will be passed an object with `{duplicate: true}`.
 * @param {boolean|string} [...options[scriptProperties]] Any other values to be set as properties of the script element
 * @returns {Promise} Promise that is either resolved or rejected. If `options.id` is NOT provided or if no element exists with id of `options.id`, promise is resolved when script is loaded. If `options.id` IS provided and element with same id exists, promise is resolved or rejected (depending on `options.onDuplicateId`) with no attempt to load new script.
 *
 */
export const loadScript = function(options = {async: true, complete: () => {/* empty */}}) {
  const settings = Object.assign({
    async: true,
    id: `s-${new Date().getTime()}`,
  }, options);
  const {onDuplicateId, completeDelay = 10, ...props} = settings;

  if (!props.src && !props.textContent) {
    return Promise.reject(new Error('Either src or textContent must be supplied as property of options parameter'));
  }

  let script = document.createElement('script');
  let script0 = document.getElementsByTagName('script')[0];
  let done = false;

  if (document.getElementById(props.id)) {
    const promiseMethod = ['resolve', 'reject'].find((m) => m === onDuplicateId) || 'resolve';

    script = script0 = null;

    return Promise[promiseMethod]({duplicate: true});
  }

  Object.keys(props).forEach((key) => {
    script[key] = props[key];
  });

  // NOTE: script may not be parsed by the time the promise resolves.
  return new Promise((resolve, reject) => {
    script.onload = function() {
      if (!done) {
        done = true;
        window.setTimeout(resolve, completeDelay);
        script.onload = null;
      }

    };

    if (!document.getElementById(props.id)) {
      script0.parentNode.insertBefore(script, script0);
    }
  });
};
