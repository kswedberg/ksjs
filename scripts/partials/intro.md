# ksjs

<!-- [![view on npm](http://img.shields.io/npm/v/ksjs.svg)](https://www.npmjs.org/package/ksjs) -->

This repo contains a bunch of plain JavaScript functions that could come in handy. They are mostly provided as ES6 modules, but a subset of them are also offered as CommonJS modules so they can easily be used in a node.js environment.

## Install

If you want to install ksjs via npm or yarn, go ahead:

```bash
npm install ksjs
```

```bash
yarn add ksjs
```

## ES6 Modules

If your bundler supports ES6 module tree shaking, you can import any function like this:

```js
import {$, debounce, deepCopy} from 'ksjs';
```

**Note**: For Webpack, you probably need to configure it to treat ksjs as ES6.

Otherwise, for any of the [modules](#modules), you can do this:

```js
import {example1, example2} from 'ksjs/example.js'

example1('foo');
example2('bar');
```

or this (not recommended):

```js
import * as examples from 'ksjs/example'

examples.example1('foo');
examples.example2('bar');
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

You can require them from their respective files in the `cjs` directory, like so:

```js
const {example1} = require('ksjs/cjs/example');

example1('foo');
```

or like so:

```js
const examples = require('ksjs/cjs/example');

examples.example1('foo');
```

<a id="modules"></a>

---
