import {readdirSync} from 'fs';
import minimist from 'minimist';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
// import {terser} from 'rollup-plugin-terser';
import eslint from '@rollup/plugin-eslint';
// import banner from 'rollup-plugin-banner';

const argv = minimist(process.argv.slice(2));
const addSrc = (f) => `src/${f}`;
const esFiles = readdirSync('./src/').map(addSrc);

const cjsFileNames = [
  'array.js',
  'color.js',
  'index.js',
  'math.js',
  'object.js',
  'promise.js',
  'string.js',
  'timer.js',
  'url.js',
];
const cjsFiles = cjsFileNames.map(addSrc);

const nodeEnv = process.env.NODE_ENV;
const testEnv = process.env.TEST_ENV;
const plugins = {
  main: [
    replace({
      values: {
        'process.env.NODE_ENV': JSON.stringify(nodeEnv),
        'process.env.TEST_ENV': JSON.stringify(testEnv),
      },
      preventAssignment: true,
    }),
    // Strip debugger, console.*, assert.* statements
    strip(),
      // Convert commonjs modules
    commonjs(),
  ],
  qunit: [
    replace({
      values: {
        'process.env.NODE_ENV': JSON.stringify(nodeEnv),
        'process.env.TEST_ENV': JSON.stringify(testEnv),
      },
      preventAssignment: true,
    }),
  ],
  mocha: [],

};

const buildFormats = [];

// Customize configs for individual targets

if (!argv.format || argv.format === 'es') {
  const esConfig = {
    input: esFiles,
    output: {
      dir: './',
      format: 'esm',
      exports: 'named',
      preserveModules: true,
    },
    plugins: [
      eslint({
        fix: true,
      }),
      ...plugins.main,
    ],
  };

  console.log('esm');
  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'cjs') {
  const cjsConfig = {
    input: cjsFiles,
    output: {
      esModule: false,
      dir: 'cjs',
      format: 'cjs',
      exports: 'named',
      preserveModules: true,
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

    console.log('building', test);
    buildFormats.push(testConfig);
  }
});

export {cjsFileNames};
// Export config
export default buildFormats;
