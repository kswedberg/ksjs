import * as maths from '../src/math';

const assert = require('assert');

describe('Math', () => {
  describe('add', () => {
    it('Simple addition', () => {
      assert.equal(maths.add([3, 4]), 7);
    });
    it('Add three numbers', () => {
      assert.equal(maths.add([3, 4, 6]), 13);
    });
    it('Add four numbers, starting with 3', () => {
      assert.equal(maths.add([3, 4, 6, 4], 3), 20);
    });
  });

  // This is just to make sure the "functional" nature of fm.math.js is working as expected.
  // If this works, then fm.divide() and fm.multiply() will work, as well
  describe('subtract', () => {
    it('Simple subtraction', () => {
      assert.equal(maths.subtract([20, 4]), -24);
    });
    it('Subtract three numbers', () => {
      assert.equal(maths.subtract([30, 4, 6]), -40);
    });
    it('Subtract four numbers, starting with 40', () => {
      assert.equal(maths.subtract([3, 4, 6, 4], 40), 23);
    });
  });

  describe('modulo', () => {
    it('Get remainder (mod) of array of two numbers', () => {
      assert.equal(maths.mod([4, 3]), 1);
    });
    it('Get remainder (mod) of two numbers', () => {
      assert.equal(maths.mod(85, 60), 25);
    });
  });

  const numbers = [21, 16, 10, 12, 2];

  describe('median', () => {
    const even = [...numbers, 1];

    it('Get median of a set of numbers with odd length', () => {
      assert.equal(maths.median(numbers), 12);
    });

    it('Get median of a set of numbers with even length', () => {
      assert.equal(maths.median(even), 11);
    });
  });

  describe('min/max', () => {
    const nums = [...numbers, 5];
    const negs = [...numbers, -40, -2, -101];

    it('Get min value of a set of numbers', () => {
      assert.equal(maths.min(nums), 2);
    });
    it('Get min value of a set of numbers with negatives', () => {
      assert.equal(maths.min(negs), -101);
    });

    it('Get max value of a set of numbers', () => {
      assert.equal(maths.max(nums), 21);
    });
    it('Get max value of a set of numbers with negatives', () => {
      assert.equal(maths.max(nums), 21);
    });
  });
});
