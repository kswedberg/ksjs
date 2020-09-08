import {Storage} from '../src/storage.js';

const assert = require('assert');
let localStorage = window.localStorage;
let storage = new Storage(null, 'fm-');
let beforeEach = function() {
  localStorage.clear();
  localStorage.setItem('dummy', 'hello');
  storage.set('item', {foo: 'bar', welp: 'yippee', yay: {deep: 'yes', shallow: 'no'}});
  storage.set('item2', {bar: 'baz'});
};

describe('Storage', () => {

  describe('storage.get()', () => {
    beforeEach();
    let item = storage.get('item');

    it('storage item prop was set', () => {
      assert.equal(item.foo, 'bar');
    });

    it('correctly indicates length of namespaced items', () => {
      assert.equal(storage.length, 2);
    });
  });

  describe('storage.keys()', () => {
    beforeEach();
    let items = storage.keys();

    it('first item key', () => {
      assert.equal(items[0], 'item');
    });
    it('second item key', () => {
      assert.equal(items[1], 'item2');
    });
  });

  describe('storage.getAll()', () => {
    beforeEach();
    let items = storage.getAll();

    it('first item prop', () => {
      assert.equal(items.item.foo, 'bar');
    });

    it('second item prop', () => {
      assert.equal(items.item2.bar, 'baz');
    });

  });

  describe('storage.toArray()', () => {
    beforeEach();
    let items = storage.toArray();

    it('first item key', () => {
      assert.equal(items[0].key, 'item');
    });

    it('second item key', () => {
      assert.equal(items[1].key, 'item2');
    });

    it('first item prop', () => {
      assert.equal(items[0].foo, 'bar');
    });

    it('second item prop', () => {
      assert.equal(items[1].bar, 'baz');
    });
  });

  describe('storage.map()', () => {
    beforeEach();
    let items = storage.map((key, val) => {
      val.keey = key;

      return val;
    });

    it('first item key', () => {
      assert.equal(items.item.keey, 'item');
    });

    it('second item key', () => {
      assert.equal(items.item2.keey, 'item2');
    });
  });

  describe('storage.filter()', () => {
    beforeEach();
    let items = storage.filter((key, val) => {
      return key === 'item';
    });

    it('first item foo', () => {
      assert.equal(items.item.foo, 'bar');
    });

    it('second item filtered out', () => {
      assert.equal(!!items.item2, false);
    });
  });

  describe('storage.filterToArray()', () => {
    beforeEach();
    let items = storage.filterToArray((key, val) => {
      return key === 'item';
    });

    it('first item foo', () => {
      assert.equal(items[0].foo, 'bar');
    });

    it('second item filtered out', () => {
      assert.equal(items.length, 1);
    });
  });

  describe('storage.merge()', () => {
    beforeEach();
    let options = {
      hello: 'goodbye',
      welp: 'skippy',
      yay: {
        shallow: 'no way',
      },
    };

    let item = storage.merge(true, 'item', options);

    it('foo is bar', () => {
      assert.equal(item.foo, 'bar');
    });

    it('hello is goodbye', () => {
      assert.equal(item.hello, 'goodbye');
    });

    it('welp is skippy', () => {
      assert.equal(item.welp, 'skippy');
    });

    it('yay.deep is still yes', () => {
      assert.equal(item.yay.deep, 'yes');
    });

    it('yay.shallow is no way', () => {
      assert.equal(item.yay.shallow, 'no way');
    });
  });
});

if (process.env.TEST_ENV !== 'node') {
  describe('Storage removals', () => {
    describe('storage.remove()', () => {
      beforeEach();
      storage.remove('item2');

      it('item2 removed', () => {
        assert.equal(!!storage.get('item2'), false);
      });

      it('length updated', () => {
        assert.equal(storage.length, 1);
      });
    });

    describe('storage.clear()', () => {
      beforeEach();
      storage.clear();

      it('item removed', () => {
        assert.equal(!!storage.get('item'), false);
      });

      it('all items removed', () => {
        assert.equal(storage.length, 0);
      });

      it('dummy item preserved', () => {
        assert.equal(localStorage.getItem('dummy'), 'hello');
      });
    });

  });
}
