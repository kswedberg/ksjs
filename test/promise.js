import {peach, pmap, pfilter} from '../src/promise.js';

const assert = require('assert');

describe('Promise', () => {

  describe('peach', () => {

    it('returns an array', (done) => {
      const msgs = [];
      const arr = [
        Promise.resolve('one'),
        'two',
        new Promise((resolve) => {
          setTimeout(resolve, 50, 'three');
        }),
      ];

      peach(arr, (item, i) => {
        msgs.push(item);

        return item;
      })
      .then((items) => {
        assert.equal(items.length, 3, 'Items returned as expected array');
        assert.equal(items[2], 'three', 'Last promised element return value is correct');
        done();
      })
      .catch(done);
    });
  });

  describe('pmap', () => {
    it('maps array with function returning promise', (done) => {
      const fruits = ['apple', 'banana', 'pear'];

      pmap(fruits, (fruit, i) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(`${fruit}-${i}`), 10);
        });
      })
      .then((indexedFruits) => {
        assert.equal(indexedFruits.length, 3, 'array length matches');
        assert.equal(indexedFruits[2], 'pear-2', 'last item value matches');
        done();
      })
      .catch(done);

    });

    it('maps array with async/await', async() => {
      const fruits = ['apple', 'banana', 'pear'];

      const indexedFruits = await pmap(fruits, (fruit, i) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(`${fruit}-${i}`), 10);
        });
      });

      assert.equal(indexedFruits.length, 3, 'array length matches');
      assert.equal(indexedFruits[2], 'pear-2', 'last item value matches');
    });

    it('maps array with function returning either promise or string', async() => {
      const fruits = ['apple', 'banana', 'pear'];

      const indexedFruits = await pmap(fruits, (fruit, i) => {
        const output = `${fruit}-${i}`;

        return i % 2 === 1 ? output : new Promise((resolve) => {
          setTimeout(() => resolve(output), 10);
        });
      });

      assert.equal(indexedFruits.length, 3, 'array length matches');

      assert.deepEqual(indexedFruits, ['apple-0', 'banana-1', 'pear-2'], 'all array items match');

    });
  });

  describe('pfilter', () => {
    it('filters array in parallel with function returning promise', (done) => {
      const fruits = ['apple', 'banana', 'pear'];

      pfilter(fruits, (fruit, i) => {
        const keep = i % 2 === 0;

        return new Promise((resolve) => {
          setTimeout(() => resolve(keep), 10);
        });
      }, 'parallel')
      .then((filteredFruits) => {
        assert.equal(filteredFruits.length, 2, 'array length matches');
        assert.equal(filteredFruits[1], 'pear', 'last item value matches');
        done();
      })
      .catch(done);
    });

    it('filters array sequentially with function returning promise', (done) => {
      const fruits = ['apple', 'banana', 'pear'];

      pfilter(fruits, (fruit, i) => {
        const keep = i % 2 === 0;

        return new Promise((resolve) => {
          setTimeout(() => resolve(keep), 10);
        });
      })
      .then((filteredFruits) => {
        assert.equal(filteredFruits.length, 2, 'array length matches');
        assert.equal(filteredFruits[1], 'pear', 'last item value matches');
        done();
      })
      .catch(done);
    });
  });
});
