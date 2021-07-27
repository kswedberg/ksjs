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
import {isArray} from './array.js';

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


const formElements = (elements) => {
  return [...elements]
  .filter(filterSuccessfulControl)
  .map((elem) => {
    return {
      name: elem.name,
      value: elem.nodeName === 'SELECT' ? selectVal(elem) : elem.value,
    };
  });
};

const arrayToFormData = (arr = []) => {
  const elems = formElements(arr);
  let formData = new FormData();

  elems.forEach((elem) => {
    const value = elem.value;

    if (isArray(value.files)) {
      value.files.forEach((file) => {
        formData.append(elem.name, file.file, file.filename);
      });

      return;
    }

    formData.append(decodeURIComponent(elem.name), decodeURIComponent(value));
    if (elem.type === 'file') {
      elem.files.forEach((item) => {
        formData.append(elem.name, item);
      });
    }
  });

  return formData;
};

const objectToArray = (object) => {
  const array = [];

  for (let key in object) {
    const value = object[key];

    array.push({
      name: key,
      value: value,
    });
  }

  return array;
};

/**
 * Change an object of key-value pairs, or an array of objects with `name` and `value` properties, into a formData object.
 * @description Note: if the value of a key is an object with a `files` property, each file in the files array will be appended to the formData object.
 * @function valuesToFormData
 * @param {Object|Array} values The object or array of objects to convert
 * @returns {FormData} The form data object
 */

export const valuesToFormData = (values) => {
  const elems = isArray(values) ? values : objectToArray(values);

  return arrayToFormData(elems);
};

const formDataMethods = {
  string: (form) => {
    const elems = formElements(form.elements)
    .map((elem) => {
      return `${encodeURIComponent(elem.name)}=${encodeURIComponent(elem.value)}`;
    });

    return elems.join('&').replace(/%20/g, '+');
  },

  array: (form) => {
    return formElements(form.elements);
  },

  object: (form) => {
    return unserialize(formDataMethods.string(form));
  },

  formData: (form) => {
    if (!isForm(form)) {
      return null;
    }

    return arrayToFormData(form.elements);
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
