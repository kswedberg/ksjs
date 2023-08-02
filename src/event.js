/**
 * @module event
 * @summary
 * ES6 Import Example:
 * ```js
 * import {addEvent} from '@bamf-health/bamfjs';
 *
 * // or:
 * import {addEvent} from '@bamf-health/bamfjs/event.js';
 * ```
 *
 */

const listener = {
  prefix: '',
};

let BAMF = typeof window !== 'undefined' && window.BAMF || {};

BAMF.windowLoaded = typeof document !== 'undefined' && document.readyState === 'complete';

// See passive test: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
let supportsObject = false;

try {
  const options = {
    // This function is called when the browser attempts to access the capture property
    get capture() {
      supportsObject = true;

      return false;
    },
  };

  window.addEventListener('test', null, options);
  window.removeEventListener('test', null, options);
} catch (err) {
  supportsObject = false;
}

let hasAttachEvent = function() {
  const doc = typeof window !== 'undefined' && window.document || {};

  return doc.attachEvent === 'function' || typeof doc.attachEvent == 'object';
};

if (typeof addEventListener === 'function') {
  listener.type = 'addEventListener';
} else if (hasAttachEvent()) {
  listener.type = 'attachEvent';
  listener.prefix = 'on';
} else {
  listener.prefix = 'on';
}

const normalizeOptions = (options) => {
  return typeof options === 'object' ?
    options :
    {
      capture: !!options.capture,
    };
};
let removeEvent;

/**
 * A wrapper around `addEventListener` that deals with browser inconsistencies (e.g. `capture`, `passive`, `once` props on `options` param; see param documentation below for details) and handles window load similar to how jQuery handles document ready by triggering  handler immediately if called *after* the event has already fired.
 * For triggering window load, this file MUST be imported before window.load occurs.
 * @function addEvent
 * @param {Window|Element} el DOM element to which to attach the event handler
 * @param {string} type Event type
 * @param {function} handler(event) Handler function. Takes `event` as its argument
 * @param {Object|boolean} [options = false] Optional object or boolean. If boolean, indicates whether the event should be in "capture mode" rather than starting from innermost element and bubbling out. Default is `false`. If object, and browser does not support object, argument is set to capture property if provided
 * @param {boolean} [options.capture = false] Indicates if the event should be in "capture mode" rather than starting from innermost element and bubbling out. Default is `false`.
 * @param {boolean} [options.passive] If `true`, uses passive mode to reduce jank. **This is automatically set to `true`** for supported browsers if not explicitly set to `false` for the following event types: touchstart, touchmove, wheel, mousewheel. Ignored if not supported.
 * @param {boolean} [options.once] If `true`, removes listener after it is triggered once on the element.
*/
export let addEvent = function(el, type, handler, options = false) {
  // Call immediately if window already loaded and calling addEvent(window, 'load', handler)
  if (BAMF.windowLoaded && type === 'load' && el === window) {
    return handler.call(window, {windowLoaded: true, type: 'load', target: window});
  }
  const opts = normalizeOptions(options);

  if (!supportsObject) {
    const fun = !opts.once ?
      handler :
      function(event) {
        handler(event);
        removeEvent(type, fun, opts.capture);
      };

    return el[ listener.type ](listener.prefix + type, fun, opts.capture);
  }

  const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];

  if (passiveEvents.indexOf(type) !== -1 && opts.passive !== false) {
    opts.passive = true;
  }

  return el[listener.type] && el[listener.type](listener.prefix + type, handler, opts);
};

// Modify addEvent for REALLY OLD browsers that have neither addEventListener nor attachEvent
if (!listener.type) {
  addEvent = function(el, type, fn) {
    el[listener.prefix + type] = fn;
  };
}

/**
* A wrapper around `removeEventListener` that naïvely deals with oldIE inconsistency.
* @function removeEvent
* @param {Element} el DOM element to which to attach the event handler
* @param {string} type Event type.
* @param {function} [handler] Handler function to remove.
* @param {Object|boolean} [options = false] Optional object or boolean. If boolean, indicates whether event to be removed was added in "capture mode". Important: non-capturing here only removes non-capturing added event and vice-versa.
* @param {boolean} [options.capture] Indicates whether event to be removed was added in "capture mode"
*/
removeEvent = function(el, type, handler, options = false) {
  const listenerType = typeof window.removeEventListener === 'function' ? 'removeEventListener' : document.detachEvent && 'detachEvent';
  const opts = normalizeOptions(options);

  if (listenerType) {
    return el[ listenerType ](listener.prefix + type, handler, opts.capture);
  }

  el[listener.prefix + type] = null;
};

export {removeEvent};

if (typeof window !== 'undefined') {
  window.BAMF = Object.assign(window.BAMF || {}, BAMF);

  // call addEvent on window load
  if (!BAMF.windowLoaded) {
    addEvent(window, 'load', () => {
      BAMF.windowLoaded = true;
      if (window.BAMF) {
        window.BAMF.windowLoaded = true;
      }
    });
  }
}

// Based on https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
const customEvent = (type, options) => {
  const event = document.createEvent('CustomEvent');

  event.initCustomEvent(type, options.bubbles, options.cancelable, options.detail);

  return event;
};

customEvent.prototype = window.Event.prototype;
window.CustomEvent = typeof window.CustomEvent === 'function' ? window.CustomEvent : customEvent;

/**
 * Trigger a custom event on an element for which a listener has been set up
 *
 * Derived from emitEvent(): (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @function triggerEvent
 * @param {Element} el DOM element on which to trigger the event
 * @param {string} type Name representing the custom event type
 * @param {Object} detail Object to make available as the `detail` property of the event handler's `event` argument
 * @example
 * // Using this module's addEvent() function
 * // Add a custom event handler
 * addEvent(document.body, 'myCustomEvent', (event) => console.log(event.detail.weather));
 *
 * // Later…
 * // Trigger the custom event
 * triggerEvent(document.body, 'myCustomEvent', {weather: 'sunshine'});
 * // Logs: 'sunshine'
 */
export const triggerEvent = (el, type, detail = {}) => {
  if (!el || !type) {
    return;
  }

  const event = new CustomEvent(type, {
    bubbles: true,
    cancelable: true,
    detail,
  });

  el.dispatchEvent(event);
};
