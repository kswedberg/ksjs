/**
 * @module form
 * @summary
 * ES6 Import Example:
 * ```js
 * import {getFormData} from '@bamf-health/bamfjs';
 *
 * // or:
 * import {getFormData} from '@bamf-health/bamfjs/form.js';
 * ```
 *
 */
import {unserialize} from './url.js';

const selectVal = function(select) {
  let val = '';
  const index = select.selectedIndex;
  const options = select.options || [];
  const selected = options[index];

  if (index < 0 || selected.disabled) {
    return select.type === 'select-one' ? null : [];
  }

  val = selected.value;

  if (val == null) {
    val = selected.text;
  }

  return val ? val.replace(/\s\s+/g, ' ').trim() : val;
};

const isForm = (form) => {
  return typeof form === 'object' && form.nodeName === 'FORM';
};

const filterSuccessfulControl = (elem) => {
  const unchecked = /radio|checkbox/.test(elem.type) && !elem.checked;

  return elem.name && !elem.disabled && !/reset|submit|button/.test(elem.type) && !unchecked;
};


const formElements = (form) => {
  if (!isForm(form)) {
    return [];
  }

  return [...form.elements]
  .filter(filterSuccessfulControl)
  .map((elem) => {
    return {
      name: elem.name,
      value: elem.nodeName === 'SELECT' ? selectVal(elem) : elem.value,
    };
  });
};

const formDataMethods = {
  string: (form) => {
    const elems = formElements(form)
    .map((elem) => {
      return `${encodeURIComponent(elem.name)}=${encodeURIComponent(elem.value)}`;
    });

    return elems.join('&').replace(/%20/g, '+');
  },

  array: (form) => {
    return formElements(form);
  },

  object: (form) => {
    return unserialize(formDataMethods.string(form));
  },

  formData: (form) => {
    if (!isForm(form)) {
      return null;
    }

    let formData = new FormData();
    const elems = [...form.elements];

    elems
    .filter(filterSuccessfulControl)
    .forEach((elem) => {
      let val = elem.value;

      if (elem.nodeName === 'SELECT') {
        val = selectVal(elem);
      }

      formData.append(decodeURIComponent(elem.name), decodeURIComponent(elem.value));

      if (elem.type === 'file') {
        formData.append(elem.name, elem.files[0]);
      }
    });

    return formData;
  },
};


/**
 * Return the set of successful form controls of the provided `form` element in one of four types: object, string, formData, or array.
 * @namespace
 * @name getFormData
 * @param {Element} form The form element
 * @param {string} [type = object] One of 'object', 'string', 'formData', or 'array'
 * @property {function} .object(form) Return form data as an object of key/value pairs
 * @property {function} .string(form) Return form data as a query string
 * @property {function} .formData(form) Return a `FormData` instance
 * @property {function} .array(form) Return form data as an array of objects with `name` and `value` properties
 * @returns {any} The set of successful form controls as the provided `type`
 * @example
 * const myform = document.getElementById('myform');
 *
 * console.log(getFormData.object(myform));
 * // Logs:
 * // {
 * //    email: 'name@example.com',
 * //    gender: 'female',
 * //    meals: ['breakfast', 'dinner']
 * // }
 * @example
 * const myform = document.getElementById('myform');
 *
 * console.log(getFormData.string(myform));
 * // Logs:
 * // email=name%40example.com&gender=female&meals[]=breakfast&meals[]=dinner
 * @example
 * const myform = document.getElementById('myform');
 *
 * console.log(getFormData.array(myform));
 * // Logs:
 * // [
 * //    {
 * //      name: 'email',
 * //      value: 'name@example.com'
 * //    },
 * //    {
 * //      name: 'gender',
 * //      value: 'femail'
 * //    },
 * //    {
 * //      name: 'meals[]',
 * //      value: 'breakfast'
 * //    },
 * //    {
 * //      name: 'meals[]',
 * //      value: 'dinner'
 * //    }
 * // ]
 */
const getFormData = (form, type = 'object') => {
  if (!formDataMethods[type]) {
    throw new Error(`type ${type} not found in formDataMethods`);
  }

  return formDataMethods[type](form);
};

Object.keys(formDataMethods).forEach((key) => {
  getFormData[key] = formDataMethods[key];
});

export {getFormData};
