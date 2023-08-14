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
