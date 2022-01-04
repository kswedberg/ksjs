import {readdirSync} from 'fs-extra';
import minimist from 'minimist';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
// import buble from '@rollup/plugin-buble';
// import {terser} from 'rollup-plugin-terser';
import eslint from '@rollup/plugin-eslint';
// import banner from 'rollup-plugin-banner';

const argv = minimist(process.argv.slice(2));
const addSrc = (f) => `src/${f}`;
const esFiles = readdirSync('./src/').map(addSrc);

const cjsFiles = [
  'array.js',
  'color.js',
  'index.js',
  'math.js',
  'object.js',
  'promise.js',
  'string.js',
  'timer.js',
  'url.js',
].map(addSrc);

const nodeEnv = process.env.NODE_ENV;
const testEnv = process.env.TEST_ENV;
const plugins = {
  main: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.TEST_ENV': JSON.stringify(testEnv),
    }),
    // Strip debugger, console.*, assert.* statements
    strip(),
      // Convert commonjs modules
    commonjs(),
  ],
  qunit: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.TEST_ENV': JSON.stringify(testEnv),
    }),
  ],
  mocha: [],

};

const buildFormats = [];

// Customize configs for individual targets

if (!argv.format || argv.format === 'es') {
  const esConfig = {
    preserveModules: true,
    input: esFiles,
    output: {
      dir: './',
      format: 'esm',
      exports: 'named',
    },
    plugins: [
      eslint({
        fix: true,
      }),
      ...plugins.main,
    ],
  };

  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'cjs') {
  const cjsConfig = {
    preserveModules: true,
    input: cjsFiles,
    output: {
      esModule: false,
      dir: 'cjs',
      format: 'cjs',
      exports: 'named',
    },
    plugins: [
      ...plugins.main,
    ],
  };

  buildFormats.push(cjsConfig);
}


// Test files:
['mocha', 'qunit'].forEach((test) => {
  if (!argv.format || argv.format === test) {
    const testConfig = {
      input: `test/test-${test}.js`,
      output: {
        format: test === 'mocha' ? 'cjs' : 'umd',
        file: `test/${test}/test.js`,
      },
      plugins: plugins[test],
    };

    buildFormats.push(testConfig);
  }
});

// Export config
export default buildFormats;
