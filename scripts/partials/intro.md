# bamfjs

<!-- [![view on npm](http://img.shields.io/npm/v/bamfjs.svg)](https://www.npmjs.org/package/bamfjs) -->

This repo contains a bunch of plain JavaScript functions that I used a lot in projects at [Fusionary](https://fusionary.com) and elsewhere. They are mostly provided as ES6 modules, but a subset of them are also offered as CommonJS modules so they can easily be used in a node.js environment.

## Install

If you want to install bamfjs via npm or yarn, go ahead:

```bash
npm install bamfjs
```

```bash
yarn add bamfjs
```

## ES6 Modules

If your bundler supports ES6 module tree shaking, you can import any function like this:

```js
import {$, debounce, deepCopy} from 'bamfjs';
```

**Note**: For Webpack, you probably need to configure it to treat bamfjs as ES6.

Otherwise, for any of the [modules](#modules), you can do this:

```js
import {example1, example2} from '@bamf-health/bamfjs/example.js'

example1('foo');
example2('bar');
```

or this (not recommended):

```js
import * as examples from '@bamf-health/bamfjs/example'

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
const {example1} = require('@bamf-health/bamfjs/cjs/example');

example1('foo');
```

or like so:

```js
const examples = require('@bamf-health/bamfjs/cjs/example');

examples.example1('foo');
```

<a id="modules"></a>

---
