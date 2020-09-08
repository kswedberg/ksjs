import * as colors from '../src/color.js';

const assert = require('assert');

describe('Color', () => {
  const r2h = [
    {
      method: 'rgb2Hex',
      input: 'rgb(255, 136, 0)',
      output: '#ff8800',
    },
    {
      method: 'rgb2Hex',
      input: 'rgba(255, 136, 0, .8)',
      output: '#ff8800',
    },
    {
      method: 'rgba2Hex',
      input: 'rgba(255, 136, 0, .8)',
      output: '#ff8800cc',
    },
    {
      method: 'rgba2Hex',
      input: 'rgb(255, 136, 0)',
      output: '#ff8800',
    },
  ];

  describe('rgb(a) to hex', () => {
    r2h.forEach(({method, input, output}, i) => {
      it(`${i + 1} ${method}`, () => {
        assert.equal(colors[method](input), output);
      });
    });
  });

  const h2r = [

    {
      name: 'long hex',
      method: 'hex2Rgb',
      input: '#ff8800',
      output: 'rgb(255, 136, 0)',
    },
    {
      name: 'short hex',
      method: 'hex2Rgb',
      input: '#f80',
      output: 'rgb(255, 136, 0)',
    },
    {
      name: 'short hex with alpha',
      method: 'hex2Rgb',
      // This gets spread into two args for the assertion
      input: ['#f80', .2],
      output: 'rgba(255, 136, 0, 0.2)',
    },
    {
      name: 'long hexa',
      method: 'hex2Rgb',
      input: '#ff880033',
      output: 'rgba(255, 136, 0, 0.2)',
    },
    {
      name: 'short hexa',
      method: 'hex2Rgb',
      input: '#f80c',
      output: 'rgba(255, 136, 0, 0.8)',
    },
  ];


  describe('hex to rgb(a)', () => {
    h2r.forEach(({name, method, input, output}) => {
      const args = typeof input === 'string' ? [input] : input;

      it(`${method} (${name})`, () => {
        assert.equal(colors[method](...args), output);
      });
    });
  });
});
