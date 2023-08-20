# ksjs

This repo contains a bunch of plain JavaScript functions that come in handy while working on various projects. They are mostly provided as ES modules, but a subset of them are also offered as CommonJS modules so they can easily be used in an older node.js environment.

## Install

From the command line, run:

```bash
npm install ksjs
```

or

```bash
yarn add ksjs
```

## ES Modules

**Preferred**: For any of the [modules](#modules), you can import functions like so:

```js
import {example1, example2} from 'ksjs/example.mjs'
// Depending on your project, ES modules are available in
// files with the .js extension, too. For example:
// import {example1, example2} from 'ksjs/example.js'

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
const {example1} = require('ksjs/example.cjs');

example1('foo');
```

or like so:

```js
const examples = require('ksjs/example.cjs');

examples.example1('foo');
```

**Otherwise**: You could require them from the `cjs` directory, like so (Note the ".js" extension here):

```js
const {example1} = require('ksjs/cjs/example.js');

example1('foo');
```

or like so:

```js
const examples = require('ksjs/cjs/example.js');

examples.example1('foo');
```

<a id="modules"></a>

---
