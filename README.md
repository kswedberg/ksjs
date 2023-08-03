# bamfjs

<!-- [![view on npm](http://img.shields.io/npm/v/bamfjs.svg)](https://www.npmjs.org/package/bamfjs) -->

This repo contains a bunch of plain JavaScript functions that could come in handy while working on BAMF projects. They are mostly provided as ES modules, but a subset of them are also offered as CommonJS modules so they can easily be used in an older node.js environment.

## Install

If you want to install bamfjs via npm or yarn, you'll need to add the following lines to your .npmrc file after creating a personal access token in GitHub (search Confluence or ask Karl for instructions):

```bash
# Replace xxxxxxxxxxxxxxx with the actual auth token
//npm.pkg.github.com/:_authToken=xxxxxxxxxxxxxxx
@bamf-health:registry=https://npm.pkg.github.com
```

Then run the usual command:

```bash
npm install @bamf-health/bamfjs
```

or

```bash
yarn add @bamf-health/bamfjs
```

## ES Modules

**Preferred**: For any of the [modules](#modules), you can import functions like so:

```js
import {example1, example2} from '@bamf-health/bamfjs/example.mjs'
// Depending on your project, ES modules are available in
// files with the .js extension, too. For example:
// import {example1, example2} from '@bamf-health/bamfjs/example.js'

example1('foo');
example2('bar');
```

**Not recommended**: If your bundler supports ES module tree shaking, you might be able to import functions from various files like so (for Webpack, you might need to configure it to treat bamfjs as ES6+):

```js
import {$, debounce, deepCopy} from 'bamfjs';
```

## CommonJS Modules

The following [modules](#modules) &amp; their corresponding functions can be used in a node.js environment:

* array
* color
* math
* object
* promise
* string
* timer
* url

**Preferred**: You can require them from their respective files with the `.cjs` extension, like so:

```js
const {example1} = require('@bamf-health/bamfjs/example.cjs');

example1('foo');
```

or like so:

```js
const examples = require('@bamf-health/bamfjs/example.cjs');

examples.example1('foo');
```

**Otherwise**: You could require them from the `cjs` directory, like so (Note the ".js" extension here):

```js
const {example1} = require('@bamf-health/bamfjs/cjs/example.js');

example1('foo');
```

or like so:

```js
const examples = require('@bamf-health/bamfjs/cjs/example.js');

examples.example1('foo');
```

<a id="modules"></a>

---

## Modules

* <a href="#module_ajax">ajax</a>
* <a href="#module_array">array</a>
* <a href="#module_color">color</a>
* <a href="#module_cookie">cookie</a>
* <a href="#module_dom">dom</a>
* <a href="#module_event">event</a>
* <a href="#module_form">form</a>
* <a href="#module_jsonp">jsonp</a>
* <a href="#module_math">math</a>
* <a href="#module_object">object</a>
* <a href="#module_promise">promise</a>
* <a href="#module_selection">selection</a>
* <a href="#module_storage">storage</a>
* <a href="#module_string">string</a>
* <a href="#module_timer">timer</a>
* <a href="#module_url">url</a>
<a name="module_ajax"></a>

## ajax
ESM Import Example:
```js
import {getJSON} from '@bamf-health/bamfjs';

// or:
import {getJSON} from '@bamf-health/bamfjs/ajax.js';
// or:
import {getJSON} from '@bamf-health/bamfjs/ajax.mjs';
```


* [ajax](#module_ajax)
  * [ajax([url], options)](#module_ajax..ajax) ⇒ <code>Promise</code>
  * [getJSON([url], [options])](#module_ajax..getJSON) ⇒ <code>Promise</code>
  * [postJSON([url], [options])](#module_ajax..postJSON) ⇒ <code>Promise</code>
  * [postFormData([url], [options])](#module_ajax..postFormData) ⇒ <code>Promise</code>

<a name="module_ajax..ajax"></a>

### ajax([url], options) ⇒ <code>Promise</code>

Low-level ajax request

**Returns**: <code>Promise</code> - A resolved or rejected Promise from the server<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [url] | <code>string</code> | <code>location.href</code> | The URL of the resource |
| options | <code>object</code> |  |  |
| [options.dataType] | <code>string</code> |  | One of 'json', 'html', 'xml', 'form', 'formData'. Used for setting the `Content-Type` request header (e.g. `multipart/form-data` when 'formData`) and processing the response (e.g. calling JSON.parse() on a string response when 'json'); |
| [options.data] | <code>Object</code> \| <code>string</code> |  | Data to send along with the request. If it's a GET request and `options.data` is an object, the object is converted to a query string and appended to the URL. |
| [options.method] | <code>string</code> | <code>&quot;GET&quot;</code> | One of 'GET', 'POST', etc. |
| [options.cache] | <code>boolean</code> | <code>true</code> | If set to `false`, will not let server use cached response |
| [options.memcache] | <code>boolean</code> | <code>false</code> | If set to `true`, and a previous request sent to the same url was successful, will circumvent request and use the previous response |
| [options.headers] | <code>Object</code> | <code>{}</code> | **Advanced**: Additional headers to send with the request. If headers such as 'Accept', 'Content-Type', 'Cache-Control', 'X-Requested-With', etc.,  are set here, they will override their respective headers set automatically based on other options such as `options.dataType` and `options.cache`. |
| [options.form] | <code>HTMLFormElement</code> |  | An optional form element |

<a name="module_ajax..getJSON"></a>

### getJSON([url], [options]) ⇒ <code>Promise</code>

Send a GET request and return parsed JSON response from the resolved Promise

**Returns**: <code>Promise</code> - A resolved or rejected Promise from the server<br />

**See**: [ajax](#module_ajax..ajax)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [url] | <code>string</code> | <code>location.href</code> | The URL of the resource |
| [options] | <code>Object</code> | <code>{}</code> | See [ajax](#module_ajax..ajax) for details |

<a name="module_ajax..postJSON"></a>

### postJSON([url], [options]) ⇒ <code>Promise</code>

Send a POST request and return parsed JSON response from the resolved Promise

**Returns**: <code>Promise</code> - A resolved or rejected Promise from the server<br />

**See**: [ajax](#module_ajax..ajax)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [url] | <code>string</code> | <code>location.href</code> | The URL of the resource |
| [options] | <code>Object</code> | <code>{}</code> | See [ajax](#module_ajax..ajax) for details |

<a name="module_ajax..postFormData"></a>

### postFormData([url], [options]) ⇒ <code>Promise</code>

Send a POST request with `FormData` derived from form element provided by `options.form`

**Returns**: <code>Promise</code> - A resolved or rejected Promise from the server<br />

**See**: [ajax](#module_ajax..ajax)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [url] | <code>string</code> | <code>location.href</code> | The URL of the resource |
| [options] | <code>Object</code> | <code>{}</code> | See [ajax](#module_ajax..ajax) for details |

<a name="module_array"></a>

## array
ESM Import Example:
```js
import {isArray} from '@bamf-health/bamfjs';

// or:
import {isArray} from '@bamf-health/bamfjs/array.mjs';
// or:
import {isArray} from '@bamf-health/bamfjs/array.js';
```

CommonJS Require Example:
```js
const {isArray} = require('@bamf-health/bamfjs/array.cjs');
// or:
const {isArray} = require('@bamf-health/bamfjs/cjs/array.js');
```


* [array](#module_array)
  * [isArray(arr)](#module_array..isArray) ⇒ <code>boolean</code>
  * [inArray(el, arr)](#module_array..inArray) ⇒ <code>boolean</code>
  * [objectToArray(obj)](#module_array..objectToArray) ⇒ <code>array</code>
  * [makeArray(value, [delimiter], [wrapObject])](#module_array..makeArray) ⇒ <code>array</code>
  * [randomItem(arr)](#module_array..randomItem) ⇒ <code>any</code>
  * [pluck(arr, prop)](#module_array..pluck) ⇒ <code>array</code>
  * [shuffle(els)](#module_array..shuffle) ⇒ <code>array</code>
  * [merge(...arrays)](#module_array..merge) ⇒ <code>array</code>
  * ~~[collapse()](#module_array..collapse)~~
  * [intersect(array1, array2, [prop])](#module_array..intersect) ⇒ <code>array</code>
  * [unique(arr, [prop])](#module_array..unique) ⇒ <code>array</code>
  * [diff(array1, array2, [prop])](#module_array..diff) ⇒ <code>array</code>
  * [chunk(arr, n)](#module_array..chunk) ⇒ <code>array</code>
  * [range(a, [b])](#module_array..range) ⇒ <code>array</code>
  * [pad(arr, size, value)](#module_array..pad) ⇒ <code>array</code>
  * [sort(arr, [prop], [options])](#module_array..sort) ⇒ <code>array</code>

<a name="module_array..isArray"></a>

### isArray(arr) ⇒ <code>boolean</code>

Determine whether "arr" is a true array

**Returns**: <code>boolean</code> - `true` if arr is array, `false` if not<br />


| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | item to determine whether it's an array |

**Example**  
```js
import {isArray} from '@bamf-health/bamfjs/array.js';

if (isArray(window.foo)) {
  window.foo.push('bar');
}
```
<a name="module_array..inArray"></a>

### inArray(el, arr) ⇒ <code>boolean</code>

Determine whether item "el" is in array "arr"

**Returns**: <code>boolean</code> - Boolean (`true` if el is in array, `false` if not)<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>any</code> | An item to test against the array |
| arr | <code>array</code> | The array to test against |

<a name="module_array..objectToArray"></a>

### objectToArray(obj) ⇒ <code>array</code>

Convert an object to an array of objects with name and value properties

**Returns**: <code>array</code> - An array of objects with name and value properties<br />


| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | The object to convert |

**Example**  
```js
import {objectToArray} from '@bamf-health/bamfjs/array.js';

const obj = {
  foo: 'bar',
  baz: 'qux'
};

const arr = objectToArray(obj);
 // arr = [
//   {name: 'foo', value: 'bar'},
//   {name: 'baz', value: 'qux'}
// ];
```
<a name="module_array..makeArray"></a>

### makeArray(value, [delimiter], [wrapObject]) ⇒ <code>array</code>

Return an array based on the given value:
a) Strings are split by a delimiter (defaults to /\s+/).
b) Plain objects are converted to an array of objects with name and value properties.
b2) …unless wrapObject is true in which case they are just wrapped in an array
c) Undefined and null are returned as an empty array.
d) Arrays are returned as is.
e) Anything else is wrapped in an array.

**Returns**: <code>array</code> - The value converted to an array<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>any</code> |  | The value to convert to an array |
| [delimiter] | <code>string</code> \| <code>RegExp</code> | <code>&quot;&#x3D; /\\s+/&quot;</code> | A string or regular expression to use for splitting a string into an array (defaults to /\s+/) |
| [wrapObject] | <code>Boolean</code> |  | Whether to simply wrap an object in an array (true) or  convert to array of objects with name/value properties |

**Example**  
```js
import {makeArray} from '@bamf-health/bamfjs/array.js';
const foo = makeArray('one two three');
// foo is now ['one', 'two', 'three']

const bar = makeArray('one,two,three', ',');
// bar is now ['one', 'two', 'three']

const baz = makeArray(['one', 'two', 'three']);
// baz is still ['one', 'two', 'three']

const quz = makeArray({foo: 'bar'});
// quz is now [{name: 'foo': value: 'bar'}]

const quuz = makeArray(null);
// quuz is now []
```
<a name="module_array..randomItem"></a>

### randomItem(arr) ⇒ <code>any</code>

Return a random item from the provided array

**Returns**: <code>any</code> - A random element from the provided array<br />


| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | An array of elements |

<a name="module_array..pluck"></a>

### pluck(arr, prop) ⇒ <code>array</code>

Take an array of objects and a property and return an array of values of that property

**Returns**: <code>array</code> - Array of values of the property (if the value is `undefined`, returns `null` instead)<br />


| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | Array from which to pluck |
| prop | <code>string</code> | Property to pluck |

**Example**  
```js
import {pluck} from '@bamf-health/bamfjs/array.js';

let family = [
  {
    id: 'dad',
    name: 'Karl'
  },
  {
    id: 'mom',
    name: 'Sara',
    color: 'blue'
  },
  {
    id: 'son',
    name: 'Ben',
    color: 'green'
  },
  {
    id: 'daughter',
    name: 'Lucy'
  }
];

let names = pluck(family, 'name');
let ids = pluck(family, 'id');
let colors = pluck(family, 'color');

console.log(names);
// Logs: ['Karl', 'Sara', 'Ben', 'Lucy']

console.log(ids);
// Logs: ['dad', 'mom', 'son', 'daughter']

console.log(colors);
// Logs: [null, 'blue', 'green', null]
```
<a name="module_array..shuffle"></a>

### shuffle(els) ⇒ <code>array</code>

Fisher-Yates (aka Knuth) shuffle. Takes an array of elements and returns the same array, but with its elements shuffled

**Returns**: <code>array</code> - The array passed to `arr`, shuffled<br />

**See**: [knuth-shuffle](https://github.com/coolaj86/knuth-shuffle)

| Param | Type | Description |
| --- | --- | --- |
| els | <code>array</code> | Array to be shuffled |

<a name="module_array..merge"></a>

### merge(...arrays) ⇒ <code>array</code>

Merge two or more arrays into a single, new array.

**Returns**: <code>array</code> - A new merged array<br />


| Param | Type | Description |
| --- | --- | --- |
| ...arrays | <code>array</code> | 2 or more arrays to collapse |

<a name="module_array..collapse"></a>

### ~~collapse()~~
***Deprecated***


**See**: [merge](#module_array..merge) instead
<a name="module_array..intersect"></a>

### intersect(array1, array2, [prop]) ⇒ <code>array</code>

Return a subset of `array1`, only including elements from `array2` that are also in `array1`.
* If `prop` is provided, only that property of an element needs to match for the two arrays to be considered intersecting at that element

**Returns**: <code>array</code> - A new filtered array<br />


| Param | Type | Description |
| --- | --- | --- |
| array1 | <code>array</code> | First array |
| array2 | <code>array</code> | Second array |
| [prop] | <code>any</code> | Optional property to compare in each element of the array |

**Example**  
```js
const array1 = [{name: 'Foo', id: 'a'}, {name: 'Bar', id: 'b'}];
const array2 = [{name: 'Foo', id: 'z'}, {name: 'Zippy', id: 'b'}];

console.log(intersect(array1, array2, 'name'));
// Logs [{name: 'Foo', id: 'a'}]

console.log(intersect(array1, array2, 'id'));
// Logs [{name: 'Bar', id: 'b'}]
```
<a name="module_array..unique"></a>

### unique(arr, [prop]) ⇒ <code>array</code>

Take an array of elements and return an array containing unique elements.
If an element is an object or array:
* when `prop` is *undefined*, uses `JSON.stringify()` when checking the elements
* when `prop` is *provided*, only that property needs to match for the element to be considered a duplicate and thus excluded from the returned array

**Returns**: <code>array</code> - A new filtered array<br />


| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | Array to be filtered by uniqueness of elements (or property of elements) |
| [prop] | <code>any</code> | Optional property to be tested if an element in `arr` is an object or array |

**Example**  
```js
const array1 = [1, 2, 3, 2, 5, 1];
const uniq = unique(array1);
console.log(uniq);
// Logs: [1, 2, 3, 5]
```
<a name="module_array..diff"></a>

### diff(array1, array2, [prop]) ⇒ <code>array</code>

Return a subset of `array1`, only including elements that are NOT also in `array2`. The returned array won't include any elements from `array2`.
If an element is an object or array:
* when `prop` is *undefined*, uses `JSON.stringify()` when performing the comparison on an object or array
* when `prop` is *provided*, only that property needs to match for the item to be excluded fom the returned array

**Returns**: <code>array</code> - A filtered array<br />


| Param | Type | Description |
| --- | --- | --- |
| array1 | <code>array</code> | Array for which to return a subset |
| array2 | <code>array</code> | Array to use as a comparison |
| [prop] | <code>string</code> | Optional property to be tested if an element in `array1` is an object or array |

**Example**  
```js
const array1 = [1, 2, 3, 4];
const array2 = [2, 3, 5, 6, -1];
console.log(diff(array1, array2));
// Logs: [1, 4]
```
<a name="module_array..chunk"></a>

### chunk(arr, n) ⇒ <code>array</code>

From an array passed into the first argument, create an array of arrays, each one consisting of `n` items. (The final nested array may have fewer than `n` items.)

**Returns**: <code>array</code> - A new, chunked, array<br />


| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | Array to be chunked. This array itself will not be modified. |
| n | <code>number</code> | Number of elements per chunk |

<a name="module_array..range"></a>

### range(a, [b]) ⇒ <code>array</code>

Create an array of numbers from 0 to `a` - 1 (if `b` not provided) or from `a` to `b` (if `b` is provided).

**Returns**: <code>array</code> - A new array of numbers<br />


| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> | The length of the 0-based array to be returned if `b` is NOT provided; the first number in the array if `b` IS provided. |
| [b] | <code>number</code> | The (optional) last number of the array. |

<a name="module_array..pad"></a>

### pad(arr, size, value) ⇒ <code>array</code>

Pad an array with `value` until its length equals `size`

**Returns**: <code>array</code> - The array passed to `arr`, padded<br />


| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | Array to pad |
| size | <code>number</code> | Total length of the array after padding it |
| value | <code>any</code> | Value to use for each "padded" element of the array |

<a name="module_array..sort"></a>

### sort(arr, [prop], [options]) ⇒ <code>array</code>

Sort an array with sensible defaults: numbers (or numeric strings) before letters and case and diacritics ignored

**Returns**: <code>array</code> - The sorted array<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arr | <code>array</code> |  | Array to sort |
| [prop] | <code>string</code> |  | If dealing with an array of objects, the property by which to sort |
| [options] | <code>object</code> |  | Object indicating options to override defaults (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#options) |
| [options.sensitivity] | <code>string</code> | <code>&quot;base&quot;</code> | One of 'base', 'accent', 'case', 'variant'. Default is 'base' |
| [options.numeric] | <code>boolean</code> | <code>true</code> | Whether to treat numeric strings as numbers. Default is true |
| [options[...rest]] | <code>any</code> |  | Other options (besides sensitivity:'base' and numeric: true) per the spec for `Intl.Collator.prototype.compare` |

<a name="module_color"></a>

## color
ESM Import Example
```js
import {rgb2Hex} from '@bamf-health/bamfjs'

// or:
import {rgb2Hex} from '@bamf-health/bamfjs/color.mjs'
// or:
import {rgb2Hex} from '@bamf-health/bamfjs/color.js'
```

CJS Require Example
```js
const {rgb2Hex} = require('@bamf-health/bamfjs/color.cjs');
// or:
const {rgb2Hex} = require('@bamf-health/bamfjs/cjs/color.js');
```


* [color](#module_color)
  * _static_
    * [hex2Rgb](#module_color.hex2Rgb)
  * _inner_
    * [rgb2Hex(rgb)](#module_color..rgb2Hex) ⇒ <code>string</code>
    * [rgba2Hex(rgba)](#module_color..rgba2Hex) ⇒ <code>string</code>
    * [rgb2Luminance(rgb)](#module_color..rgb2Luminance) ⇒ <code>number</code>
    * [getContrastColor(bgColor, [darkColor], [lightColor])](#module_color..getContrastColor) ⇒ <code>string</code>

<a name="module_color.hex2Rgb"></a>

### hex2Rgb

Convert a hex value to an rgb or rgba value



| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | Hex color code in shorthand format (e.g. #333, #333a) or longhand (e.g. #333333, #333333aa) |
| [alpha] | <code>number</code> | Optional number from 0 to 1 to be used with 3- or 6-character hex format |

<a name="module_color..rgb2Hex"></a>

### rgb2Hex(rgb) ⇒ <code>string</code>

Convert an rgb value to a 6-digit hex value. If an *rgba* value is passed, the opacity is ignored

**Returns**: <code>string</code> - Hex value (e.g. `#ff780a`)<br />


| Param | Type | Description |
| --- | --- | --- |
| rgb | <code>string</code> \| <code>array</code> | either an rgb string such as `'rgb(255, 120, 10)'` or an rgb array such as `[255, 120, 10]` |

**Example**  
```js
rgb2Hex('rgb(255, 136, 0)')
// => '#ff8800'

rgb2Hex([255, 136, 0])
// => '#ff8800'

rgb2Hex('rgba(255, 136, 0, .8)')
// => '#ff8800'
```
<a name="module_color..rgba2Hex"></a>

### rgba2Hex(rgba) ⇒ <code>string</code>

Convert an rgba value to an 8-digit hex value, or an rgb value to a 6-digit hex value

**Returns**: <code>string</code> - Hex value (e.g. `#ff780a80`)<br />


| Param | Type | Description |
| --- | --- | --- |
| rgba | <code>string</code> \| <code>array</code> | either an rgba string such as `'rgba(255, 120, 10, .5)'` or an rgba array such as `[255, 120, 10, .5]` |

**Example**  
```js
rgba2Hex('rgba(255, 136, 0, .8)')
// => '#ff8800cc'

rgba2Hex([255, 136, 0, .8])
// => '#ff8800cc'

rgba2Hex('rgb(255, 136, 0)')
// => '#ff8800'
```
<a name="module_color..rgb2Luminance"></a>

### rgb2Luminance(rgb) ⇒ <code>number</code>

Convert an RGB color to a luminance value. You probably don't want to use this on its own

**Returns**: <code>number</code> - The luminance value<br />

**See**

- [getContrastColor()](#module_color..getContrastColor)
- [StackOverflow](https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors) for more information


| Param | Type | Description |
| --- | --- | --- |
| rgb | <code>string</code> \| <code>array</code> | RGB value represented as a string (e.g. `rgb(200, 100, 78)`) or an array (e.g. `[200, 100, 78]`) |

<a name="module_color..getContrastColor"></a>

### getContrastColor(bgColor, [darkColor], [lightColor]) ⇒ <code>string</code>

Return darkColor if bgColor is light and lightColor if bgColor is dark. "Light" and "dark" are determined by the [rgb2Luminance](#module_color..rgb2Luminance) algorithm

**Returns**: <code>string</code> - Contrasting color<br />

* **Warning**: untested


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bgColor | <code>string</code> |  | hex code (e.g. #daf or #3d31c2) of the color to contrast |
| [darkColor] | <code>string</code> | <code>&quot;&#x27;#000&#x27;&quot;</code> | The dark color to return if `bgColor` is considered light |
| [lightColor] | <code>string</code> | <code>&quot;&#x27;#fff&#x27;&quot;</code> | The light color to return if `bgColor` is considered dark |

<a name="module_cookie"></a>

## cookie
ESM Import Example:
```js
import {getCookie} from '@bamf-health/bamfjs';

// or:
import {getCookie} from '@bamf-health/bamfjs/cookie.mjs';
// or:
import {getCookie} from '@bamf-health/bamfjs/cookie.js';
```


* [cookie](#module_cookie)
  * [getCookie(name)](#module_cookie..getCookie) ⇒ <code>string</code>
  * [setCookie(name, value, [options])](#module_cookie..setCookie) ⇒ <code>string</code>
  * [removeCookie(name, [path])](#module_cookie..removeCookie)

<a name="module_cookie..getCookie"></a>

### getCookie(name) ⇒ <code>string</code>

Get the value of a cookie

**Returns**: <code>string</code> - value The value of the cookie<br />


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the cookie whose value you wish to get |

<a name="module_cookie..setCookie"></a>

### setCookie(name, value, [options]) ⇒ <code>string</code>

Set the value of a cookie. Use either expires or maxAge (or max-age). NOT BOTH.

**Returns**: <code>string</code> - The new cookie<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | Name of the cookie |
| value | <code>string</code> |  | Value of the cookie |
| [options] | <code>object</code> |  | Optional object |
| [options.path] | <code>string</code> | <code>&quot;&#x27;/&#x27;&quot;</code> | Path within which the cookie can be read. Default is '/'. |
| [options.domain] | <code>string</code> |  | If not specified, browser defaults to host portion of current location. If domain specified, subdomains always included. (Note: don't use leading "."). Default is undefined. |
| [options.expires] | <code>number</code> |  | Number of days after which the cookie should expire. Default is undefined. |
| [options.maxAge] | <code>number</code> |  | Number of seconds after which the cookie should expire. Default is undefined. |
| [options.samesite] | <code>string</code> |  | One of 'strict' or 'lax'. Default is undefined. |
| [options.secure] | <code>boolean</code> |  | If `true`, cookie can only be sent over secure protocol (e.g. https). Default is undefined. |

<a name="module_cookie..removeCookie"></a>

### removeCookie(name, [path])

Remove a cookie



| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the cookie to remove |
| [path] | <code>string</code> | Optional path of the cookie to remove. If not provided, all `name` cookies in `location.pathname` or any of its parents will be removed. |

<a name="module_dom"></a>

## dom
ESM Import Example:
```js
import {addClass} from '@bamf-health/bamfjs';

// or:
import {addClass} from '@bamf-health/bamfjs/dom.mjs';
// or:
import {addClass} from '@bamf-health/bamfjs/dom.js';
```


* [dom](#module_dom)
  * [toNodes(element(s))](#module_dom..toNodes) ⇒ <code>array</code>
  * [\$(selector, [context])](#module_dom..$) ⇒ <code>Array</code>
  * [\$1(selector, [context])](#module_dom..$1) ⇒ <code>Element</code>
  * [addClass(el, className, [...classNameN])](#module_dom..addClass) ⇒ <code>string</code>
  * [removeClass(el, className, [...classNameN])](#module_dom..removeClass) ⇒ <code>string</code>
  * [toggleClass(el, className, [toggle])](#module_dom..toggleClass) ⇒ <code>string</code>
  * [replaceClass(el, oldClass, newClass)](#module_dom..replaceClass) ⇒ <code>string</code>
  * [getOffset(el)](#module_dom..getOffset) ⇒ <code>Object</code>
  * [setStyles(el, styles)](#module_dom..setStyles) ⇒ <code>Element</code>
  * [setAttrs(el, attrs)](#module_dom..setAttrs) ⇒ <code>Element</code>
  * [getAttrs(el, attrs)](#module_dom..getAttrs) ⇒ <code>Object</code>
  * [toggleAttr(el, attribute, [toggle])](#module_dom..toggleAttr) ⇒ <code>string</code>
  * [insertHTML(element, position, toInsert)](#module_dom..insertHTML)
  * [prepend(el, toInsert)](#module_dom..prepend) ⇒ <code>Element</code>
  * [append(el, toInsert)](#module_dom..append) ⇒ <code>Element</code>
  * [before(el, toInsert)](#module_dom..before) ⇒ <code>Element</code>
  * [after(el, toInsert)](#module_dom..after) ⇒ <code>Element</code>
  * [createTree(options)](#module_dom..createTree) ⇒ <code>Element(s)</code>
  * [createHTML(options)](#module_dom..createHTML) ⇒ <code>Element(s)</code>
  * [remove(el)](#module_dom..remove) ⇒ <code>Element</code>
  * [empty(el)](#module_dom..empty) ⇒ <code>Element</code>
  * [replace(oldEl, replacement)](#module_dom..replace)
  * [loadScript(options)](#module_dom..loadScript) ⇒ <code>Promise</code>

<a name="module_dom..toNodes"></a>

### toNodes(element(s)) ⇒ <code>array</code>

Converts a selector string, DOM element, or collection of DOM elements into an array of DOM elements

**Returns**: <code>array</code> - An array of DOM elements<br />


| Param | Type | Description |
| --- | --- | --- |
| element(s) | <code>Element</code> \| <code>NodeList</code> \| <code>array</code> \| <code>string</code> | The selector string, element, or collection of elements (NodeList, HTMLCollection, Array, etc) |

<a name="module_dom..$"></a>

### $(selector, [context]) ⇒ <code>Array</code>

Return an array of DOM Nodes within the document or provided element/nodelist

**Returns**: <code>Array</code> - Array of DOM nodes matching the selector within the context<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> |  | The CSS selector of the DOM elements |
| [context] | <code>Element</code> \| <code>NodeList</code> \| <code>array</code> \| <code>string</code> | <code>document</code> | The selector string, element, or collection of elements (NodeList, HTMLCollection, Array, etc) representing one or more elements within which to search for `selector` |

<a name="module_dom..$1"></a>

### $1(selector, [context]) ⇒ <code>Element</code>

Return the first found DOM Element within the document or provided element/nodelist/HTMLCollection

**Returns**: <code>Element</code> - First DOM Element matching the selector within the context<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>string</code> |  | Selector string for finding the DOM element |
| [context] | <code>Element</code> \| <code>NodeList</code> \| <code>array</code> \| <code>string</code> | <code>document</code> | The selector string, element, or collection of elements (NodeList, HTMLCollection, Array, etc) representing one or more elements within which to search for `selector` |

<a name="module_dom..addClass"></a>

### addClass(el, className, [...classNameN]) ⇒ <code>string</code>

Add one or more classes to an element

**Returns**: <code>string</code> - the resulting class after classes have been removed<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | DOM element for which to add the class |
| className | <code>string</code> | class to add to the DOM element |
| [...classNameN] | <code>string</code> | one or more additional className arguments representing classes to add to the element |

<a name="module_dom..removeClass"></a>

### removeClass(el, className, [...classNameN]) ⇒ <code>string</code>

Remove one or more classes from an element

**Returns**: <code>string</code> - the resulting class after classes have been removed<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | DOM element from which to remove the class |
| className | <code>string</code> | class to remove from the DOM element |
| [...classNameN] | <code>string</code> | one or more additional className arguments representing classes to remove from the element |

<a name="module_dom..toggleClass"></a>

### toggleClass(el, className, [toggle]) ⇒ <code>string</code>

Add a class if it's not present (or if toggle is true); remove the class if it is present (or if toggle is false)

**Returns**: <code>string</code> - The `className` property of the element after the class has been toggled<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | Element on which to toggle the class |
| className | <code>string</code> | The class name to either add or remove |
| [toggle] | <code>boolean</code> | Optional boolean argument to indicate whether className is to be added (true) or removed (false) |

<a name="module_dom..replaceClass"></a>

### replaceClass(el, oldClass, newClass) ⇒ <code>string</code>

Replace oldClass with newClass

**Returns**: <code>string</code> - The `className` property of the element after the class has been replaced<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | DOM element for which you want to replace oldClass with newClass |
| oldClass | <code>string</code> | The class name you want to get rid of |
| newClass | <code>string</code> | The class name you want to add in place of oldClass |

<a name="module_dom..getOffset"></a>

### getOffset(el) ⇒ <code>Object</code>

Get the top and left distance to the element (from the top of the document)

**Returns**: <code>Object</code> - Object with `top` and `left` properties representing the top and left offset of the element<br />

* **Warning**: untested


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | Element for which to get the offset |

<a name="module_dom..setStyles"></a>

### setStyles(el, styles) ⇒ <code>Element</code>

Set one or more styles on an element.

**Returns**: <code>Element</code> - The original element, with the styles set<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | element on which to add styles |
| styles | <code>Object.&lt;string, (string\|number)&gt;</code> | object of styles and their values to add to the element |

<a name="module_dom..setAttrs"></a>

### setAttrs(el, attrs) ⇒ <code>Element</code>

Set one or more attributes on an element. For boolean attributes ('async', 'required', etc.), set the element's property to either `true` or `false`

**Returns**: <code>Element</code> - The original element, with the attributes set<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | element on which to add attributes |
| attrs | <code>Object.&lt;string, (string\|boolean\|number)&gt;</code> | object of attributes and their values to add to the element |

<a name="module_dom..getAttrs"></a>

### getAttrs(el, attrs) ⇒ <code>Object</code>

Given an array of attribute names, get an object containing attribute names/values for an element

**Returns**: <code>Object</code> - Object of attribute names along with their values<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | DOM Element. If NodeList is provided, uses the first element in the list |
| attrs | <code>Array.&lt;string&gt;</code> | Array of attribute names |

<a name="module_dom..toggleAttr"></a>

### toggleAttr(el, attribute, [toggle]) ⇒ <code>string</code>

Add an attribute to an element if it's not present (or if toggle is `true`); remove the attribute if it is present (or if toggle is `false`)

**Returns**: <code>string</code> - The attribute name if it has been added, `undefined` if it has been removed<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | Element on which to toggle the attribute |
| attribute | <code>string</code> | The attribute to either add or remove |
| [toggle] | <code>boolean</code> | Optional boolean argument to indicate whether the attribute is to be added (true) or removed (false) * |

<a name="module_dom..insertHTML"></a>

### insertHTML(element, position, toInsert)


| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | html element |
| position | <code>string</code> | position for insertion |
| toInsert | <code>string</code> | html string to insert |

<a name="module_dom..prepend"></a>

### prepend(el, toInsert) ⇒ <code>Element</code>

Insert an element as the first child of `el`

**Returns**: <code>Element</code> - The inserted element<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | Reference element |
| toInsert | <code>Element</code> \| <code>string</code> | DOM element or HTML string to insert as the first child of `el` |

<a name="module_dom..append"></a>

### append(el, toInsert) ⇒ <code>Element</code>

Insert an element as the last child of `el`

**Returns**: <code>Element</code> - The inserted element<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | Reference element |
| toInsert | <code>Element</code> \| <code>string</code> | DOM element or HTML string to insert as the last child of `el` |

<a name="module_dom..before"></a>

### before(el, toInsert) ⇒ <code>Element</code>

Insert an element as the previous sibling of `el`

**Returns**: <code>Element</code> - The inserted element<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | Reference element |
| toInsert | <code>Element</code> \| <code>string</code> | DOM element or HTML string to insert as the previous sibling of `el` |

<a name="module_dom..after"></a>

### after(el, toInsert) ⇒ <code>Element</code>

Insert an element as the next sibling of `el`

**Returns**: <code>Element</code> - The inserted element<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | Reference element |
| toInsert | <code>Element</code> \| <code>string</code> | DOM element or HTML string to insert as the next sibling of `el` |

<a name="module_dom..createTree"></a>

### createTree(options) ⇒ <code>Element(s)</code>

Provide an object, along with possible child objects, to create a node tree ready to be inserted into the DOM.

**Returns**: <code>Element(s)</code> - The created Element node tree<br />


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| [options.tag] | <code>string</code> | Optional tag name for the element. If none provided, a document fragment is created instead |
| [options.text] | <code>string</code> | Optional inner text of the element. |
| [options.children] | <code>Array.&lt;Object&gt;</code> | Optional array of objects, with each object representing a child node |
| [...options[attr]] | <code>string</code> | One or more optional attributes to set on the element |

<a name="module_dom..createHTML"></a>

### createHTML(options) ⇒ <code>Element(s)</code>

Provide an object, along with possible child objects, to create an HTML string that can be inserted into the DOM.

**Returns**: <code>Element(s)</code> - The created Element node tree<br />


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| [options.tag] | <code>string</code> | Optional tag name for the element. If none provided, a document fragment is created instead |
| [options.text] | <code>string</code> | Optional inner text of the element. |
| [options.children] | <code>Array.&lt;Object&gt;</code> | Optional array of objects, with each object representing a child node |
| [...options[attr]] | <code>string</code> | One or more optional attributes to set on the element |

<a name="module_dom..remove"></a>

### remove(el) ⇒ <code>Element</code>

Remove an element from the DOM

**Returns**: <code>Element</code> - DOM element removed from the DOM<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | DOM element to be removed |

<a name="module_dom..empty"></a>

### empty(el) ⇒ <code>Element</code>

Empty an element's children from the DOM

**Returns**: <code>Element</code> - DOM element provided by `el` argument<br />


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | DOM element to clear of all children |

<a name="module_dom..replace"></a>

### replace(oldEl, replacement)

Replace a DOM element with one or more other elements



| Param | Type | Description |
| --- | --- | --- |
| oldEl | <code>Element</code> | The element to be replaced |
| replacement | <code>Element</code> \| <code>Array.&lt;Element&gt;</code> | An element, or an array of elements, to insert in place of `oldEl` |

<a name="module_dom..loadScript"></a>

### loadScript(options) ⇒ <code>Promise</code>

Insert a script into the DOM with reasonable default properties, returning a promise. If `options.id` is set, will avoid loading  script if the id is already in the DOM.

**Returns**: <code>Promise</code> - Promise that is either resolved or rejected. If `options.id` is NOT provided or if no element exists with id of `options.id`, promise is resolved when script is loaded. If `options.id` IS provided and element with same id exists, promise is resolved or rejected (depending on `options.onDuplicateId`) with no attempt to load new script.<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | An object of options for loading the script. All except `complete` and `completeDelay` will be set as properties on the script element before it is inserted. |
| [options.src] | <code>string</code> |  | The value of the script's `src` property. Required if `options.textContent` not set |
| [options.textContent] | <code>string</code> |  | The text content of the script. Ignored if `options.src` set. Required if `options.src` NOT set. |
| [options.async] | <code>boolean</code> | <code>true</code> | The value of the script's `async` property. Default is `true`. |
| [options.completeDelay] | <code>number</code> | <code>0</code> | Number of milliseconds to wait when the script has loaded before resolving the Promise to account for time it might take for the script to be parsed |
| [options.id] | <code>string</code> |  | String representing a valid identifier to set as the script element's `id` property. If set, the script will not be loaded if an element with the same id already appears in the DOM |
| [options.onDuplicateId] | <code>string</code> | <code>&quot;resolve&quot;</code> | One of 'resolve' or 'reject'. Whether to return a resolved or rejected promise when a script with an id matching the provided `options.id` is already in the DOM. Either way, the function will not attempt to load the script again and the resolved/rejected promise will be passed an object with `{duplicate: true}`. |
| [...options[scriptProperties]] | <code>boolean</code> \| <code>string</code> |  | Any other values to be set as properties of the script element |

<a name="module_event"></a>

## event
ESM Import Example:
```js
import {addEvent} from '@bamf-health/bamfjs';

// or:
import {addEvent} from '@bamf-health/bamfjs/event.mjs';
// or:
import {addEvent} from '@bamf-health/bamfjs/event.js';
```


* [event](#module_event)
  * [addEvent(el, type, handler(event), [options])](#module_event..addEvent)
  * [removeEvent(el, type, [handler], [options])](#module_event..removeEvent)
  * [triggerEvent(el, type, detail)](#module_event..triggerEvent)

<a name="module_event..addEvent"></a>

### addEvent(el, type, handler(event), [options])

A wrapper around `addEventListener` that deals with browser inconsistencies (e.g. `capture`, `passive`, `once` props on `options` param; see param documentation below for details) and handles window load similar to how jQuery handles document ready by triggering  handler immediately if called *after* the event has already fired.
For triggering window load, this file MUST be imported before window.load occurs.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| el | <code>Window</code> \| <code>Element</code> |  | DOM element to which to attach the event handler |
| type | <code>string</code> |  | Event type |
| handler(event) | <code>function</code> |  | Handler function. Takes `event` as its argument |
| [options] | <code>Object</code> \| <code>boolean</code> | <code>false</code> | Optional object or boolean. If boolean, indicates whether the event should be in "capture mode" rather than starting from innermost element and bubbling out. Default is `false`. If object, and browser does not support object, argument is set to capture property if provided |
| [options.capture] | <code>boolean</code> | <code>false</code> | Indicates if the event should be in "capture mode" rather than starting from innermost element and bubbling out. Default is `false`. |
| [options.passive] | <code>boolean</code> |  | If `true`, uses passive mode to reduce jank. **This is automatically set to `true`** for supported browsers if not explicitly set to `false` for the following event types: touchstart, touchmove, wheel, mousewheel. Ignored if not supported. |
| [options.once] | <code>boolean</code> |  | If `true`, removes listener after it is triggered once on the element. |

<a name="module_event..removeEvent"></a>

### removeEvent(el, type, [handler], [options])

A wrapper around `removeEventListener` that naïvely deals with oldIE inconsistency.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| el | <code>Element</code> |  | DOM element to which to attach the event handler |
| type | <code>string</code> |  | Event type. |
| [handler] | <code>function</code> |  | Handler function to remove. |
| [options] | <code>Object</code> \| <code>boolean</code> | <code>false</code> | Optional object or boolean. If boolean, indicates whether event to be removed was added in "capture mode". Important: non-capturing here only removes non-capturing added event and vice-versa. |
| [options.capture] | <code>boolean</code> |  | Indicates whether event to be removed was added in "capture mode" |

<a name="module_event..triggerEvent"></a>

### triggerEvent(el, type, detail)

Trigger a custom event on an element for which a listener has been set up

Derived from emitEvent(): (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com



| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | DOM element on which to trigger the event |
| type | <code>string</code> | Name representing the custom event type |
| detail | <code>Object</code> | Object to make available as the `detail` property of the event handler's `event` argument |

**Example**  
```js
// Using this module's addEvent() function
// Add a custom event handler
addEvent(document.body, 'myCustomEvent', (event) => console.log(event.detail.weather));

// Later…
// Trigger the custom event
triggerEvent(document.body, 'myCustomEvent', {weather: 'sunshine'});
// Logs: 'sunshine'
```
<a name="module_form"></a>

## form
ESM Import Example:
```js
import {getFormData} from '@bamf-health/bamfjs';

// or:
import {getFormData} from '@bamf-health/bamfjs/form.mjs';
// or:
import {getFormData} from '@bamf-health/bamfjs/form.js';
```


* [form](#module_form)
  * [getFormData](#module_form..getFormData) ⇒ <code>any</code>
  * [valuesToFormData(values)](#module_form..valuesToFormData) ⇒ <code>FormData</code>

<a name="module_form..getFormData"></a>

### getFormData ⇒ <code>any</code>

Return the set of successful form controls of the provided `form` element in one of four types: object, string, formData, or array.

**Returns**: <code>any</code> - The set of successful form controls as the provided `type`<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| form | <code>Element</code> |  | The form element |
| [type] | <code>string</code> | <code>&quot;object&quot;</code> | One of 'object', 'string', 'formData', or 'array' |

**Methods**

| Name | Type | Description |
| --- | --- | --- |
| .object(form) | <code>function</code> | Return form data as an object of key/value pairs |
| .string(form) | <code>function</code> | Return form data as a query string |
| .formData(form) | <code>function</code> | Return a `FormData` instance |
| .array(form) | <code>function</code> | Return form data as an array of objects with `name` and `value` properties |

**Example**  
```js
const myform = document.getElementById('myform');

console.log(getFormData.object(myform));
// Logs:
// {
//    email: 'name@example.com',
//    gender: 'female',
//    meals: ['breakfast', 'dinner']
// }
```
**Example**  
```js
const myform = document.getElementById('myform');

console.log(getFormData.string(myform));
// Logs:
// email=name%40example.com&gender=female&meals[]=breakfast&meals[]=dinner
```
**Example**  
```js
const myform = document.getElementById('myform');

console.log(getFormData.array(myform));
// Logs:
// [
//    {
//      name: 'email',
//      value: 'name@example.com'
//    },
//    {
//      name: 'gender',
//      value: 'femail'
//    },
//    {
//      name: 'meals[]',
//      value: 'breakfast'
//    },
//    {
//      name: 'meals[]',
//      value: 'dinner'
//    }
// ]
```
<a name="module_form..valuesToFormData"></a>

### valuesToFormData(values) ⇒ <code>FormData</code>

Note: if the value of a key is an object with a `files` property, each file in the files array will be appended to the FormData object.

**Returns**: <code>FormData</code> - The form data object<br />


| Param | Type | Description |
| --- | --- | --- |
| values | <code>Object</code> \| <code>Array</code> | The object or array of objects to convert |

<a name="module_jsonp"></a>

## jsonp
ESM Import Example:
```js
import {getJSONP} from '@bamf-health/bamfjs';

// or:
import {getJSONP} from '@bamf-health/bamfjs/jsonp.mjs';
// or:
import {getJSONP} from '@bamf-health/bamfjs/jsonp.js';
```

<a name="module_jsonp..getJSONP"></a>

### getJSONP(options, callback(json))

Function for those times when you just need to make a "jsonp" request (and you can't set up CORS on the server). In other words, x-site script grabbing.


* **Warning**: untested
* **Warning**: requires setup on server side
* **Warning**: not entirely safe


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.url | <code>string</code> |  | URL of the jsonp endpoint |
| [options.data] | <code>Object</code> |  | Optional data to include with the request |
| [options.data.callback] | <code>string</code> | <code>&quot;jsonp.[timestamp]&quot;</code> | Optional value of the callback query-string parameter to append to the script's `src` |
| callback(json) | <code>function</code> |  | Function to be called when request is complete. A json object is passed to it. |

**Example**  
```js
getJSONP({url: 'https://example.com/api/'})
```
<a name="module_math"></a>

## math
ESM Import Example:
```js
import {median} from '@bamf-health/bamfjs';

// or:
import {median} from '@bamf-health/bamfjs/math.mjs';
// or:
import {median} from '@bamf-health/bamfjs/math.js';
```

CommonJS Require Example:
```js
const {median} = require('@bamf-health/bamfjs/math.cjs');
// or:
const {median} = require('@bamf-health/bamfjs/cjs/math.js');
```


* [math](#module_math)
  * [add(array)](#module_math.add) ⇒ <code>number</code>
  * [subtract(array)](#module_math.subtract) ⇒ <code>number</code>
  * [multiply(array)](#module_math.multiply) ⇒ <code>number</code>
  * [divide(array)](#module_math.divide) ⇒ <code>number</code>
  * [mod(dividend, [divisor])](#module_math.mod) ⇒ <code>number</code>
  * [average(nums)](#module_math.average) ⇒ <code>number</code>
  * [median(nums)](#module_math.median) ⇒ <code>number</code>
  * [min(nums)](#module_math.min) ⇒ <code>number</code>
  * [max(nums)](#module_math.max) ⇒ <code>number</code>

<a name="module_math.add"></a>

### add(array) ⇒ <code>number</code>

Return the result of adding an array of numbers (sum)

**Returns**: <code>number</code> - Sum<br />


| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | Array of numbers |

<a name="module_math.subtract"></a>

### subtract(array) ⇒ <code>number</code>

Return the result of subtracting an array of numbers (difference)

**Returns**: <code>number</code> - Difference<br />


| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | Array of numbers |

<a name="module_math.multiply"></a>

### multiply(array) ⇒ <code>number</code>

Return the result of multiplying an array of numbers (product)

**Returns**: <code>number</code> - Product<br />


| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | Array of numbers |

<a name="module_math.divide"></a>

### divide(array) ⇒ <code>number</code>

Return the result of dividing an array of numbers (quotient)

**Returns**: <code>number</code> - Quotient<br />


| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | Array of numbers |

<a name="module_math.mod"></a>

### mod(dividend, [divisor]) ⇒ <code>number</code>

Return the remainder after dividing two numbers (modulo)

**Returns**: <code>number</code> - Remainder<br />


| Param | Type | Description |
| --- | --- | --- |
| dividend | <code>number</code> \| <code>array</code> | A number representing the dividend OR an array of [dividend, divisor] |
| [divisor] | <code>number</code> | Number representing the divisor if the first argument is a number |

<a name="module_math.average"></a>

### average(nums) ⇒ <code>number</code>

Return the average of an array of numbers

**Returns**: <code>number</code> - Average<br />


| Param | Type | Description |
| --- | --- | --- |
| nums | <code>array</code> | Array of numbers |

<a name="module_math.median"></a>

### median(nums) ⇒ <code>number</code>

Return the median of an array of numbers

**Returns**: <code>number</code> - Median<br />


| Param | Type | Description |
| --- | --- | --- |
| nums | <code>array</code> | Array of numbers |

<a name="module_math.min"></a>

### min(nums) ⇒ <code>number</code>

Return the number with the lowest value from an array of numbers

**Returns**: <code>number</code> - Minimum value<br />


| Param | Type | Description |
| --- | --- | --- |
| nums | <code>array</code> | Array of numbers |

<a name="module_math.max"></a>

### max(nums) ⇒ <code>number</code>

Return the number with the highest value from an array of numbers

**Returns**: <code>number</code> - Maximum value<br />


| Param | Type | Description |
| --- | --- | --- |
| nums | <code>array</code> | Array of numbers |

<a name="module_object"></a>

## object
ESM Import Example:
```js
import {deepCopy} from '@bamf-health/bamfjs';

// or:
import {deepCopy} from '@bamf-health/bamfjs/object.mjs';
// or:
import {deepCopy} from '@bamf-health/bamfjs/object.js';
```

CommonJS Require Example:
```js
import {deepCopy} from '@bamf-health/bamfjs/object.cjs';
// or:
const {deepCopy} = require('@bamf-health/bamfjs/cjs/object.js');
```


* [object](#module_object)
  * [isObject(obj)](#module_object..isObject)
  * [isPlainObject(obj)](#module_object..isPlainObject)
  * [clone(obj)](#module_object..clone) ⇒ <code>Object</code>
  * [deepCopy(obj, [forceFallback], [cache])](#module_object..deepCopy) ⇒ <code>Object</code>
  * [extend(target, ...objects)](#module_object..extend) ⇒ <code>Object</code>
  * [getProperty(root, properties, fallbackValue)](#module_object..getProperty) ⇒ <code>\*</code>
  * [getLastDefined(root, properties)](#module_object..getLastDefined) ⇒ <code>\*</code>
  * [isEmptyObject(obj)](#module_object..isEmptyObject) ⇒ <code>boolean</code>
  * [setProperty(root, properties, value)](#module_object..setProperty) ⇒ <code>Object</code>
  * [forEachValue(obj, fn)](#module_object..forEachValue) ⇒ <code>void</code>
  * [getObject(obj, options)](#module_object..getObject)
  * [pick(obj, props, [options])](#module_object..pick) ⇒ <code>Object</code>
  * [omit(obj, props, [options])](#module_object..omit) ⇒ <code>Object</code>

<a name="module_object..isObject"></a>

### isObject(obj)

Indicate if the provided argument is an object/array



| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The argument that will be checked to see if it is an object |

<a name="module_object..isPlainObject"></a>

### isPlainObject(obj)

Indicate if the provided argument is a plain object
Derived from lodash _.isPlainObject



| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The argument that will be checked to see if it is a plain object |

<a name="module_object..clone"></a>

### clone(obj) ⇒ <code>Object</code>

Deep copy an object (alternative to deepCopy), using graph theory and new Map(). Avoids circular refs and infinite loops.

**Returns**: <code>Object</code> - A copy of the object<br />

**See**: [Cloning JavaScript objects with Graph Theory](https://andreasimonecosta.dev/posts/cloning-javascript-objects-with-graph-theory/)

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="module_object..deepCopy"></a>

### deepCopy(obj, [forceFallback], [cache]) ⇒ <code>Object</code>

Deep copy an object, avoiding circular references and the infinite loops they might cause.

**Returns**: <code>Object</code> - A copy of the object<br />


| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object to copy |
| [forceFallback] | <code>Boolean</code> | If set to `true`, doesn't try to use native `structuredClone` function first. |
| [cache] | <code>Array.&lt;Object&gt;</code> | Used internally to avoid circular references |

<a name="module_object..extend"></a>

### extend(target, ...objects) ⇒ <code>Object</code>

Deep merge two or more objects in turn, with right overriding left

Heavily influenced by/mostly ripped off from jQuery.extend

**Returns**: <code>Object</code> - The merged object<br />


| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | The target object that will be mutated. Use `{}` to create new object |
| ...objects | <code>Object</code> | One or more objects to merge into the first |

**Example**  
```js
const foo = {
  one: 'singular',
  two: 'are better'
};

const bar = {
  one: 'taste',
  choco: 'hershey',
  saloon: 'wild west',
};

const merged = extend(foo, bar);

// merged is now:
// {
//  one: 'taste',
//  two: 'are better',
//  choco: 'hershey',
//  saloon: 'wild west',
// }


// because foo was mutated, it is also:
// {
//  one: 'taste',
//  two: 'are better',
//  choco: 'hershey',
//  saloon: 'wild west',
// }
```
<a name="module_object..getProperty"></a>

### getProperty(root, properties, fallbackValue) ⇒ <code>\*</code>

Get a nested property of an object in a safe way

**Returns**: <code>\*</code> - The value of the nested property, or `undefined`, or the designated fallback value<br />


| Param | Type | Description |
| --- | --- | --- |
| root | <code>Object</code> | The root object |
| properties | <code>Array.&lt;String&gt;</code> \| <code>String</code> | Either an array of properties or a dot-delimited string of properties |
| fallbackValue | <code>any</code> | A value to assign if it's otherwise undefined |

**Example**  
```js
const foo = {
  could: {
   keep: {
    going: 'but will stop'
  }
};

console.log(getProperty(foo, 'could.keep.going'))
// Logs: 'but will stop'

console.log(getProperty(foo, ['could', 'keep', 'going']))
// Logs: 'but will stop'

console.log(getProperty(foo, ['broken', 'not', 'happening']))
// Logs: undefined
};
```
<a name="module_object..getLastDefined"></a>

### getLastDefined(root, properties) ⇒ <code>\*</code>

Get a nested property of an object in a safe way

**Returns**: <code>\*</code> - The value of the last nested property referenced in `properties` arg that has a defined value<br />


| Param | Type | Description |
| --- | --- | --- |
| root | <code>Object</code> | The root object |
| properties | <code>Array.&lt;String&gt;</code> \| <code>String</code> | Either an array of properties or a dot-delimited string of properties |

**Example**  
```js
const foo = {
  could: {
   keep: {
    going: 'but will stop'
  },
  shortStop: 'ride ends here'
};

console.log(getLastDefined(foo, 'could.keep.going'))
// Logs: 'but will stop'

console.log(getLastDefined(foo, ['shortStop', 'stops', 'short']))
// Logs: 'ride ends here'
};
```
<a name="module_object..isEmptyObject"></a>

### isEmptyObject(obj) ⇒ <code>boolean</code>

Determine whether an object (or array) is "empty"

**Returns**: <code>boolean</code> - `true` if object has no keys or array no elements<br />


| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> \| <code>array</code> | The object to test |

<a name="module_object..setProperty"></a>

### setProperty(root, properties, value) ⇒ <code>Object</code>

Set a nested property of an object in a safe way

**Returns**: <code>Object</code> - The modified root object<br />


| Param | Type | Description |
| --- | --- | --- |
| root | <code>Object</code> | The root object |
| properties | <code>Array.&lt;String&gt;</code> \| <code>String</code> | Either an array of properties or a dot-delimited string of properties |
| value | <code>any</code> | The value to set for the nested property |

<a name="module_object..forEachValue"></a>

### forEachValue(obj, fn) ⇒ <code>void</code>

Loop through an object, calling a function for each element (like forEach, but for an object)



| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object to iterate over |
| fn | <code>function</code> | A function to be called for each member of the object. The function takes two parameters: the member's value and the member's key, respectively |

<a name="module_object..getObject"></a>

### getObject(obj, options)

INTERNAL: Return either the same object passed in first parameter or a deep copy of the object, depending on the deep option.



| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object to return |
| options | <code>Object</code> | Options object |
| options.deep | <code>boolean</code> | Whether to deep-clone the object or not before returning it |

<a name="module_object..pick"></a>

### pick(obj, props, [options]) ⇒ <code>Object</code>

Return a new object containing only the properties included in the props array.

**Returns**: <code>Object</code> - A copy of the object, containing only the `props` properties<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>Object</code> |  | The object from which to get properties |
| props | <code>array.&lt;string&gt;</code> |  | Properties to get from the object |
| [options] | <code>Object</code> |  | Options object |
| [options.deep] | <code>boolean</code> | <code>true</code> | Whether to deep-clone the object before assigning its properties to the new object |

<a name="module_object..omit"></a>

### omit(obj, props, [options]) ⇒ <code>Object</code>

Return a new object, excluding the properties in the props array.

**Returns**: <code>Object</code> - A modified copy of the object<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>Object</code> |  | The object from which to get properties |
| props | <code>array</code> |  | Properties to exclude from the object |
| [options] | <code>Object</code> |  | Options object |
| [options.deep] | <code>boolean</code> | <code>true</code> | Whether to deep-clone the object before assigning its properties to the new object |

<a name="module_promise"></a>

## promise
ESM Import Example:
```js
import {peach} from '@bamf-health/bamfjs';

// or:
import {peach} from '@bamf-health/bamfjs/promise.mjs';
// or:
import {peach} from '@bamf-health/bamfjs/promise.js';
```

CommonJS Require Example:
```js
import {peach} from '@bamf-health/bamfjs/promise.cjs';
// or:
const {peach} = require('@bamf-health/bamfjs/cjs/promise.js');
```


* [promise](#module_promise)
  * [peach(arr, fn)](#module_promise..peach) ⇒ <code>Array.&lt;Promise&gt;</code>
  * [pmap(arr, fn, [order])](#module_promise..pmap) ⇒ <code>Promise</code>
  * [pfilter(arr, fn(item,index,array), [order])](#module_promise..pfilter) ⇒ <code>Promise</code>
  * [ArrayCallback](#module_promise..ArrayCallback) ⇒ <code>Promise</code>

<a name="module_promise..peach"></a>

### peach(arr, fn) ⇒ <code>Array.&lt;Promise&gt;</code>

"Promised `each()`" for iterating over an array of items, calling a function that returns a promise for each one. So, each one waits for the previous one to resolve before being called

**Returns**: <code>Array.&lt;Promise&gt;</code> - Array of promises<br />


| Param | Type | Description |
| --- | --- | --- |
| arr | <code>array</code> | Array to iterate over |
| fn | <code>ArrayCallback</code> | Function that is called for each element in the array, each returning a promise |

<a name="module_promise..pmap"></a>

### pmap(arr, fn, [order]) ⇒ <code>Promise</code>

"Promised `map()`" for iterating over an array of items sequentially (or in parallel), calling a function that returns either the Promise of a modified item or the modified item itself, ultimately returning a single resolved Promise containing the modified array.

**Returns**: <code>Promise</code> - A resolved Promise, fulfilled with an array containing the mapped items of `arr`<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arr | <code>array</code> |  | Array to iterate over |
| fn | <code>ArrayCallback</code> |  | Function that is called for each element in the array, each returning a modified result |
| [order] | <code>string</code> | <code>&quot;sequence&quot;</code> | Whether to call the callback for each item sequentially (`'sequence'`, default) or at the same time (`'parallel'`). |

**Example**  
```js
import {pmap} from '@bamf-health/bamfjs/promise.js';

const fruits = ['apple', 'banana', 'pear'];

const indexedFruits = pmap(fruits, (fruit, i) => {

});
```
<a name="module_promise..pfilter"></a>

### pfilter(arr, fn(item,index,array), [order]) ⇒ <code>Promise</code>

"Promised `filter()`" to iterate over an array of items sequentially (or in parallel), which acts just like `Array.prototype.filter()` but allows the callback function to return either a Promise containing a truthy/falsy value or the truthy/falsy value itself. Returns a single resolved Promise containing the filtered array.

**Returns**: <code>Promise</code> - A resolved Promise, fulfilled with an array containing the mapped items of `arr`<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| arr | <code>array</code> |  | Array to iterate over |
| fn(item,index,array) | <code>ArrayCallback</code> |  | Function that is called for each element in the array, each returning a modified result |
| [order] | <code>string</code> | <code>&quot;sequence&quot;</code> | Whether to call the callback for each item sequentially (`'sequence'`, default) or at the same time (`'parallel'`). |

**Example**  
```js
import {pmap} from '@bamf-health/bamfjs/promise.js';

const fruits = ['apple', 'banana', 'pear'];

const indexedFruits = pmap(fruits, (fruit, i) => {

});
```
<a name="module_promise..ArrayCallback"></a>

### ArrayCallback ⇒ <code>Promise</code>


| Param | Type |
| --- | --- |
| item | <code>any</code> | 
| [index] | <code>number</code> | 
| [array] | <code>array</code> | 

<a name="module_selection"></a>

## selection
ESM Import Example:
```js
import {getSelection} from '@bamf-health/bamfjs';

// or:
import {getSelection} from '@bamf-health/bamfjs/selection.mjs';
// or:
import {getSelection} from '@bamf-health/bamfjs/selection.js';
```


* [selection](#module_selection)
  * [replaceSelection](#module_selection.replaceSelection) ⇒ <code>Object</code>
  * [setSelection(elem, [startPos], [endPos])](#module_selection.setSelection)
  * [setSelectionAll(el)](#module_selection.setSelectionAll)
  * [getSelection(el)](#module_selection.getSelection)

<a name="module_selection.replaceSelection"></a>

### replaceSelection ⇒ <code>Object</code>

Replace the selected text in a given element with the provided text

**Returns**: <code>Object</code> - Selection object containing the following properties: `{start, end, length, text}`<br />


| Param | Type | Description |
| --- | --- | --- |
| elem | <code>Element</code> | Element containing the selected text |
| replaceString | <code>string</code> | String to replace the selected text |

<a name="module_selection.setSelection"></a>

### setSelection(elem, [startPos], [endPos])

Set the selection of an element's contents.
NOTE: If startPos and/or endPos are used on a non-input element,
only the first text node within the element will be used for selection



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| elem | <code>Element</code> |  | The element for which to set the selection |
| [startPos] | <code>number</code> | <code>0</code> | The start position of the selection. Default is 0. |
| [endPos] | <code>number</code> |  | The end position of the selection. Default is the last index of the element's contents. |

<a name="module_selection.setSelectionAll"></a>

### setSelectionAll(el)

Sets the selection of **all** of the element's contents (including all of its children)


* **Warning**: untested


| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | The element for which to select all content |

<a name="module_selection.getSelection"></a>

### getSelection(el)

Return an object with the following properties related to the selected text within the element:
* `start`: 0-based index of the start of the selection
* `end`: 0-based index of the end of the selection
* `length`: the length of the selection
* `text`: the selected text within the element



| Param | Type | Description |
| --- | --- | --- |
| el | <code>Element</code> | An element with selected text |

<a name="module_storage"></a>

## storage
ESM Import Example:
```js
import {Storage} from '@bamf-health/bamfjs';

// or:
import {Storage} from '@bamf-health/bamfjs/storage.mjs';
// or:
import {Storage} from '@bamf-health/bamfjs/storage.js';
```


* [storage](#module_storage)
  * _instance_
    * [getLength()](#module_storage+getLength) ⇒ <code>number</code>
    * [get(key)](#module_storage+get) ⇒ <code>any</code>
    * [set(key, value)](#module_storage+set) ⇒ <code>string</code>
    * [remove(key)](#module_storage+remove)
    * [clear()](#module_storage+clear)
    * [getAll()](#module_storage+getAll) ⇒ <code>Object</code>
    * [keys()](#module_storage+keys) ⇒ <code>array</code>
  * _inner_
    * [Storage](#module_storage..Storage)
      * [new Storage([type], [ns])](#new_module_storage..Storage_new)

<a name="module_storage+getLength"></a>

### getLength() ⇒ <code>number</code>

Get the number of items in the storage

**Returns**: <code>number</code> - The number of items<br />

<a name="module_storage+get"></a>

### get(key) ⇒ <code>any</code>

Get and JSON.parse the value of the storage item identified by `key`

**Returns**: <code>any</code> - The JSON.parsed value of the storage item<br />


| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the storage item |

<a name="module_storage+set"></a>

### set(key, value) ⇒ <code>string</code>

Set the JSON.stringified value of the storage item identified by `key`

**Returns**: <code>string</code> - The stringified value that is set<br />


| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the storage item |
| value | <code>any</code> | The value to be set for `key` |

<a name="module_storage+remove"></a>

### remove(key)

Remove the storage item identified by `key`



| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the storage item to remove |

<a name="module_storage+clear"></a>

### clear()

Remove all storage items


<a name="module_storage+getAll"></a>

### getAll() ⇒ <code>Object</code>

Get an object of key/value pairs of all storage items

**Returns**: <code>Object</code> - All storage items<br />

<a name="module_storage+keys"></a>

### keys() ⇒ <code>array</code>

Loop through all storage items and return an array of their keys

**Returns**: <code>array</code> - Array of the keys of all storage items<br />

<a name="module_storage..Storage"></a>

### Storage

<a name="new_module_storage..Storage_new"></a>

#### Storage([type], [ns])

Constructor for storage functions.

**Returns**: this<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [type] | <code>string</code> | <code>&quot;local&quot;</code> | Type of storage: either 'local' or 'session' |
| [ns] | <code>string</code> | <code>&quot;bamf&quot;</code> | Namespace for keys to prevent potenial collisions with storage items used by libraries, etc. |

<a name="module_string"></a>

## string
ESM Import Example:
```js
import {slugify} from '@bamf-health/bamfjs';

// or:
import {slugify} from '@bamf-health/bamfjs/string.mjs';
// or:
import {slugify} from '@bamf-health/bamfjs/string.js';
```

CommonJS Require Example:
```js
import {slugify} from '@bamf-health/bamfjs/string.cjs';
// or:
const {slugify} = require('@bamf-health/bamfjs/cjs/string.js');
```


* [string](#module_string)
  * _static_
    * [pluralize(str, num, [ending])](#module_string.pluralize) ⇒ <code>string</code>
    * [changeCase(str, type, [options])](#module_string.changeCase) ⇒ <code>string</code>
    * [slugify(str)](#module_string.slugify) ⇒ <code>string</code>
    * [truncate(string, options)](#module_string.truncate) ⇒ <code>string</code>
    * [rot13(string)](#module_string.rot13) ⇒ <code>string</code>
    * [hashCode(str, [prefix])](#module_string.hashCode) ⇒ <code>number</code> \| <code>string</code>
    * [base64Encode(str)](#module_string.base64Encode) ⇒ <code>string</code>
    * [base64Decode(str)](#module_string.base64Decode) ⇒ <code>string</code>
    * [randomString([sep], [prefix])](#module_string.randomString) ⇒ <code>string</code>
  * _inner_
    * [parseStringTemplate(str, obj)](#module_string..parseStringTemplate) ⇒ <code>string</code>
    * [stringTo(value, [type], [options])](#module_string..stringTo) ⇒ <code>Boolean</code> \| <code>Number</code> \| <code>Array</code>
    * [stripTags(str)](#module_string..stripTags) ⇒ <code>string</code>

<a name="module_string.pluralize"></a>

### pluralize(str, num, [ending]) ⇒ <code>string</code>

Converts a singular word to a plural

**Returns**: <code>string</code> - Pluralized string<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| str | <code>string</code> |  | Word to pluralize |
| num | <code>number</code> |  | Number of items |
| [ending] | <code>string</code> | <code>&quot;s&quot;</code> | Optional ending of the pluralized word |

<a name="module_string.changeCase"></a>

### changeCase(str, type, [options]) ⇒ <code>string</code>

Changes the case of the provided words according to the `type`.

**Returns**: <code>string</code> - Converted string<br />


| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String that will be cased as determined by `type` |
| type | <code>string</code> | One of 'title|sentence|caps|camel|pascal|slug|snake' |
| [options] | <code>object</code> | Optional options object. Its use depends on the type of case change |

**Example**  
```js
const oldMan = 'the old man and the sea';

console.log(changeCase(oldMan, 'title'));
// Logs: 'The Old Man and the Sea'

console.log(changeCase(oldMan, 'sentence'));
// Logs: 'The old man and the sea'

console.log(changeCase('the-old-man-and-the-sea', 'sentence', {unslugify: true}));
// Logs: 'The old man and the sea'

console.log(changeCase(oldMan, 'camel'));
// Logs: 'theOldManAndTheSea'
```
<a name="module_string.slugify"></a>

### slugify(str) ⇒ <code>string</code>

Slugify a string by lowercasing it and replacing white spaces and non-alphanumerics with dashes.

**Returns**: <code>string</code> - "Slugified" string<br />


| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to be converted to a slug |

**Example**  
```js
console.log(slugify('Hello there, how are you?'));
// Logs: 'hello-there-how-are-you'

console.log(slugify('  You? & Me<3* '));
// Logs: 'you-me-3'
```
<a name="module_string.truncate"></a>

### truncate(string, options) ⇒ <code>string</code>
**Returns**: <code>string</code> - The truncated string, or the full string if it's shorter than the total amount to truncate<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| string | <code>str</code> |  | The string to be truncated |
| options | <code>object</code> |  | Options object. |
| [options.start] | <code>int</code> |  | The number of characters to keep at the start of the string. If falsy, no truncation will occur at the start. |
| [options.end] | <code>int</code> |  | The number of characters to keep at the end of the string. If falsy, no truncation will occur at the end. |
| [options.separator] | <code>string</code> | <code>&quot;&#x27;...&#x27;&quot;</code> | The separator to use when truncating the string. Defaults to '...' |

**Example**  
```js
const str = 'Collaboratively administrate empowered markets';

console.log(truncate(str, {start: 10}));
// Logs: 'Collaborat...'

console.log(truncate(str, {start: 10, separator: ''}));
// Logs: 'Collaborat'

console.log(truncate(str, {end: 10}));
// Logs: '...ed markets'

console.log(truncate(str, {start: 10, end: 10}));
// Logs: 'Collaborat...ed markets'

console.log(truncate(str, {start: 50, end: 50}));
// Logs: 'Collaboratively administrate empowered markets'
```
<a name="module_string.rot13"></a>

### rot13(string) ⇒ <code>string</code>

ROT13 encode/decode a string

**Returns**: <code>string</code> - The encoded (or decoded) string<br />


| Param | Type | Description |
| --- | --- | --- |
| string | <code>string</code> | String to be converted to or from ROT13 |

<a name="module_string.hashCode"></a>

### hashCode(str, [prefix]) ⇒ <code>number</code> \| <code>string</code>

Convert a string to Java-like numeric hash code

**Returns**: <code>number</code> \| <code>string</code> - The converted hash code as numeral (or string, if prefix is provided)<br />

**See**: http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to be converted |
| [prefix] | <code>string</code> | Optional prefix to the hash |

<a name="module_string.base64Encode"></a>

### base64Encode(str) ⇒ <code>string</code>

Return a base64-encoded string based on the provided string.
If the browser does not support this type of encoding, returns the string unchanged.

**Returns**: <code>string</code> - base64-encoded string<br />


| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to be base4 encoded |

<a name="module_string.base64Decode"></a>

### base64Decode(str) ⇒ <code>string</code>

Return a decoded string based on the provided base64-encoded string.
If the browser does not support this type of encoding, returns the string unchanged.

**Returns**: <code>string</code> - decoded string<br />


| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | base4-encoded string |

<a name="module_string.randomString"></a>

### randomString([sep], [prefix]) ⇒ <code>string</code>

Return a pseudo-random string consisting of two base-36 strings, separated by the optional provided `sep` argument.
The first number is derived from a random 11-digit number
The second number is derived from the current date, including milliseconds
The string can begin with an optional `prefix`



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [sep] | <code>string</code> | <code>&quot;.&quot;</code> | Optional separator for the two base-36 strings, Default is "." |
| [prefix] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Optional prefix for the string |

<a name="module_string..parseStringTemplate"></a>

### parseStringTemplate(str, obj) ⇒ <code>string</code>
**Returns**: <code>string</code> - String with tokens replaced with values<br />

**See**: https://stackoverflow.com/a/59084440

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String with tokens ( `${example}` ) to parse |
| obj | <code>object</code> | Object of properties with values to be used when replacing tokens |

<a name="module_string..stringTo"></a>

### stringTo(value, [type], [options]) ⇒ <code>Boolean</code> \| <code>Number</code> \| <code>Array</code>

Casts a value to the specified `type` or to best guess at a type if none given



| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | Value to cast |
| [type] | <code>function</code> | (Boolean|Number|Array) |
| [options] | <code>object</code> |  |

<a name="module_string..stripTags"></a>

### stripTags(str) ⇒ <code>string</code>

Strip tags from a string

**Returns**: <code>string</code> - Stripped string<br />


| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | String to be stripped of tags |

**Example**  
```js
console.log(stripTags('<p>Hello</p>'));
// Logs: 'Hello'

console.log(stripTags('<p>Hello</p><p>World</p>'));
// Logs: 'HelloWorld'
```
<a name="module_timer"></a>

## timer
ESM Import Example:
```js
import {debounce} from '@bamf-health/bamfjs';

// or:
import {debounce} from '@bamf-health/bamfjs/timer.mjs';
// or:
import {debounce} from '@bamf-health/bamfjs/timer.js';
```

CommonJS Require Example:
```js
import {debounce} from '@bamf-health/bamfjs/timer.cjs';
// or:
const {debounce} = require('@bamf-health/bamfjs/cjs/timer.js');
```


* [timer](#module_timer)
  * [HOUR](#module_timer..HOUR) : <code>number</code>
  * [DAY](#module_timer..DAY) : <code>number</code>
  * [YEAR](#module_timer..YEAR) : <code>number</code>
  * [debounce(fn, [timerDelay], [ctx])](#module_timer..debounce)
  * [unbounce(fn, [timerDelay], [ctx])](#module_timer..unbounce)
  * [throttle(fn, [timerDelay], [context])](#module_timer..throttle)
  * [raf(fn, [context])](#module_timer..raf)
  * [idle(fn, [context])](#module_timer..idle)
  * [deadline(promise, ms, exception)](#module_timer..deadline) ⇒ <code>any</code>
  * [delay(timeout)](#module_timer..delay)

<a name="module_timer..HOUR"></a>

### HOUR : <code>number</code>

Constant representing the number of milliseconds in an hour


<a name="module_timer..DAY"></a>

### DAY : <code>number</code>

Constant representing the number of milliseconds in a day


<a name="module_timer..YEAR"></a>

### YEAR : <code>number</code>

Constant representing the number of milliseconds in a year


<a name="module_timer..debounce"></a>

### debounce(fn, [timerDelay], [ctx])

Set up a function to be called once at the end of repeated potential calls within a given delay



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fn | <code>function</code> |  | The function to trigger once at the end of a series of potential calls within `delay` |
| [timerDelay] | <code>number</code> | <code>200</code> | Number of milliseconds to delay before firing once at the end |
| [ctx] | <code>Element</code> | <code>this</code> | The context in which to call `fn` |

**Example**  
```js
const scrollLog = function(event) {
console.log('Started resizing the window!');
};

window.addEventListener('resize', debounce(scrollLog));
```
<a name="module_timer..unbounce"></a>

### unbounce(fn, [timerDelay], [ctx])

Set up a function to be called once at the end of repeated potential calls within a given delay



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fn | <code>function</code> |  | The function to trigger once at the beginning of a series of potential calls within `delay` |
| [timerDelay] | <code>number</code> | <code>200</code> | Number of milliseconds within which to avoid calling the same function |
| [ctx] | <code>Element</code> | <code>this</code> | The context in which to call `fn` |

**Example**  
```js
const scrollLog = function(event) {
console.log('Started resizing the window!');
};

window.addEventListener('resize', debounce(scrollLog));
```
<a name="module_timer..throttle"></a>

### throttle(fn, [timerDelay], [context])

Set up a function to be called no more than once every `timerDelay` milliseconds



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fn | <code>function</code> |  | The function to throttle |
| [timerDelay] | <code>number</code> | <code>200</code> | Number of milliseconds to throttle the function calls |
| [context] | <code>Element</code> | <code>this</code> | The context in which to call `fn` |

<a name="module_timer..raf"></a>

### raf(fn, [context])

Set up a function to be called immediately before the next repaint using `requestAnimationFrame()`



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fn | <code>function</code> |  | The function to call |
| [context] | <code>Element</code> | <code>this</code> | The context in which to call `fn` |

<a name="module_timer..idle"></a>

### idle(fn, [context])

Set up a function to be called when the UI thread is idle by using `requestIdleCallback()`.
Falls back to using `requestAnimationFrame (or an rAF polyfill) if `requestIdleCallback()` is not supported.



| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fn | <code>function</code> |  | The function to call |
| [context] | <code>Element</code> | <code>this</code> | The context in which to call `fn` |

<a name="module_timer..deadline"></a>

### deadline(promise, ms, exception) ⇒ <code>any</code>
**Returns**: <code>any</code> - The result of the promise if it is resolved or the exception if it is rejected<br />


| Param | Type | Description |
| --- | --- | --- |
| promise | <code>Promise</code> | A promise to be resolved |
| ms | <code>number</code> | The number of milliseconds to wait for the promise to be resolved before rejecting |
| exception | <code>any</code> | An optional exception to be thrown if the promise is rejected |

<a name="module_timer..delay"></a>

### delay(timeout)

Like setTimeout, but with a promise that resolves when the timeout has expired.



| Param | Type | Description |
| --- | --- | --- |
| timeout | <code>number</code> | The number of ms to wait before resolving the promise |

<a name="module_url"></a>

## url
ESM Import Example:
```js
import {serialize} from '@bamf-health/bamfjs';

// or:
import {serialize} from '@bamf-health/bamfjs/url.mjs';
// or:
import {serialize} from '@bamf-health/bamfjs/url.js';
```

CommonJS Require Example:
```js
import {serialize} from '@bamf-health/bamfjs/url.cjs';
// or:
const {serialize} = require('@bamf-health/bamfjs/cjs/url.js');
```


* [url](#module_url)
  * [pathname([obj])](#module_url..pathname) ⇒ <code>string</code>
  * [basename([obj], [ext])](#module_url..basename) ⇒ <code>string</code>
  * [segments([obj])](#module_url..segments) ⇒ <code>array</code>
  * [segment(index, [obj])](#module_url..segment) ⇒ <code>array</code>
  * [serialize(data, [options])](#module_url..serialize) ⇒ <code>string</code>
  * [unserialize([string], [options])](#module_url..unserialize) ⇒ <code>Object</code>

<a name="module_url..pathname"></a>

### pathname([obj]) ⇒ <code>string</code>

Return a normalized `pathname` (old IE doesn't include initial "/" for `this.pathname`) of a passed object if it has an `href` property, or return the derived path name from string representing a URL

**Returns**: <code>string</code> - pathname<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [obj] | <code>Object</code> \| <code>Location</code> \| <code>string</code> | <code>window.location</code> | An object with a `pathname` propety or a string representing a URL |

<a name="module_url..basename"></a>

### basename([obj], [ext]) ⇒ <code>string</code>

Return the basename of an object with `pathname` property or a string. Similar to node.js `path.basename()`

**Returns**: <code>string</code> - basename<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [obj] | <code>Object</code> \| <code>string</code> | <code>window.location</code> | An object with a `pathname` property, or a string representing a URL |
| [ext] | <code>string</code> |  | Extension (e.g. '.html') to remove from the end of the basename) |

<a name="module_url..segments"></a>

### segments([obj]) ⇒ <code>array</code>

Return an array consisting of each segment of a URL path

**Returns**: <code>array</code> - Array of segments<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [obj] | <code>Object</code> \| <code>string</code> | <code>window.location</code> | An object with a `pathname` property, or a string representing a URL |

<a name="module_url..segment"></a>

### segment(index, [obj]) ⇒ <code>array</code>

Return the `index`th segment of a URL path

**Returns**: <code>array</code> - A segment of the path derived from `obj` at `index`<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| index | <code>number</code> |  | Index of the segment to return. If < 0, works like `[].slice(-n)` |
| [obj] | <code>Object</code> \| <code>string</code> | <code>window.location</code> | An object with a `pathname` property, or a string representing a URL |

<a name="module_url..serialize"></a>

### serialize(data, [options]) ⇒ <code>string</code>

Convert an object to a serialized string

**Returns**: <code>string</code> - A query string<br />


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Plain object to be serialized |
| [options] | <code>Object</code> | Optional settings |
| [options.raw] | <code>boolean</code> | If `true`, property values are NOT url-decoded |
| [options.prefix] | <code>string</code> | If set, and `data` is an array, sets as if prefix were the name of the array |
| [options.arrayToString] | <code>boolean</code> | If `true`, calls .toString() on arrays. So `{foo: ['won', 'too']}` becomes `foo=won%2Ctoo`. Used in conjunction with `{raw: true}`, the same object becomes `foo=won,too` |
| [options.indexed] | <code>boolean</code> | If `true` (and `options.arrayToString` is NOT `true`), arrays take the form of `foo[0]=won&foo[1]=too`; otherwise, `foo[]=won&foo[]=too` |

**Example**  
```js
console.log(serialize({foo: 'yes', bar: 'again}));
// Logs: 'foo=yes&bar=again'
```
**Example**  
```js
console.log(serialize({foo: ['yes', 'again']}, {arrayToString: true}));
// Logs: 'foo=yes,again'
console.log(serialize({foo: ['yes', 'again']}));
// Logs: 'foo[]=yes&foo[]=again'

console.log(serialize({foo: ['yes', 'again']}, {indexed: true}));
// Logs: 'foo[0]=yes&foo[1]=again'

console.log(serialize(['yes', 'again'], {prefix: 'foo'}));
// Logs: 'foo[0]=yes&foo[1]=again'

console.log(serialize(['yes', 'again'], {prefix: 'foo', indexed: false}));
// Logs: 'foo[]=yes&foo[]=again'
```
<a name="module_url..unserialize"></a>

### unserialize([string], [options]) ⇒ <code>Object</code>

Convert a serialized string to an object

**Returns**: <code>Object</code> - An object of key/value pairs representing the query string parameters<br />


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [string] | <code>string</code> | <code>&quot;location.search&quot;</code> | Query string |
| [options] | <code>Object</code> |  | Optional options |
| [options.raw] | <code>boolean</code> | <code>false</code> | If `true`, param values will NOT be url-decoded |
| [options.empty] | <code>any</code> | <code>true</code> | The returned value of a param with no value (e.g. `?foo&bar&baz`). Typically, this would be either `true` or `''` |
| [options.splitValues] | <code>Boolean</code> \| <code>RegExp</code> \| <code>String</code> | <code>false</code> | If NOT `false`, splits converts to an array all values with one or more matches of the `splitValues` option. If `true`, splits on commas (`/,/`). So, `?foo=bar,baz` becomes `{foo: ['bar', 'baz']}` |
| [options.shallow] | <code>boolean</code> | <code>false</code> | If `true`, does NOT attempt to build nested object |

