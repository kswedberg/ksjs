import {deepCopy, clone, extend, setProperty, getProperty, pick, omit, isPlainObject} from '../src/object.js';

const assert = require('assert');

describe('Object', () => {

  describe('deepCopy', () => {
    let original = {
      foo: {
        bar: {
          baz: 'Hello',
        },
        flotsam: ['Meet George Jetsam', 'Jude, his wife'],
      },
      bar: 'hello',
      firstName: 'Jane',
      lastName: 'Doe',
      cb: function() {
        return 'hello';
      },
    };

    const copy = deepCopy(original);

    copy.bar = 'goodbye';
    original.firstName = 'G.I.';

    it('copies deeply nested object', () => {
      assert.strictEqual(original.foo.bar.baz, copy.foo.bar.baz);
    });

    it('preserves original when copy is mutated & vice versa', () => {
      assert.notStrictEqual(original.bar, copy.bar);
      assert.notStrictEqual(original.firstName, copy.firstName);
    });
  });

  describe('clone', () => {
    let original = {
      foo: {
        bar: {
          baz: 'Hello',
        },
        flotsam: ['Meet George Jetsam', 'Jude, his wife'],
      },
      bar: 'hello',
      firstName: 'Jane',
      lastName: 'Doe',
      cb: function() {
        return 'hello';
      },
    };

    const copy = clone(original);

    const origArray = [
      {
        foo: 'bar',
        b: 'c',
      },
      {
        bar: 'quiggle',
      },
    ];
    const copyArray = clone(origArray);

    copy.bar = 'goodbye';
    original.firstName = 'G.I.';
    original.foo.flotsam.push('nocopy');

    origArray[1].bar = 'glixon';

    it('copies deeply nested object', () => {
      assert.strictEqual(original.foo.bar.baz, copy.foo.bar.baz);
    });
    it('copies arrays properly', () => {
      assert.strictEqual(original.foo.flotsam[0], copy.foo.flotsam[0]);
      assert.strictEqual(copy.foo.flotsam[1], 'Jude, his wife');
      assert.strictEqual(original.foo.flotsam[2], 'nocopy');
      assert.strictEqual(copy.foo.flotsam[2], undefined);
      assert.strictEqual(origArray[0].foo, copyArray[0].foo);

    });
    it('preserves original when copy is mutated & vice versa', () => {
      assert.notStrictEqual(original.bar, copy.bar);
      assert.notStrictEqual(original.firstName, copy.firstName);
      assert.notStrictEqual(origArray[1].bar, copyArray[1].bar);
      assert.strictEqual(origArray[1].bar, 'glixon');
    });
  });

  describe('Extend', () => {
    let target = {
      foo: {
        bar: {
          baz: 'Hello, I am a baz',
        },
        flotsam: ['Meet George Jetsam', 'Jude, his wife'],
      },
      cb: function() {
        return 'hello';
      },
    };

    let targetArray = [
      {
        foo: 'bar',
        name: {
          first: 'karl',
          last: 'swedberg',
        },
        cb: function() {
          return 'hello';
        },
      },
    ];

    describe('extend: array of objects', () => {
      let b = extend([], targetArray);

      targetArray[0].name.first = 'dean';

      it('should Extend copies property', () => {
        assert.equal(b[0].foo, 'bar');
      });

      it('should Extend does not copy by reference', () => {
        assert.equal(b[0].name.first, 'karl');
      });

      it('should Extend copies function', () => {
        assert.equal(b[0].cb(), 'hello');
      });

    });

    describe('extend: object into empty', () => {

      let a = target;

      let b = extend({}, a);

      a.foo.flotsam[0] = 'Meet me in the middle';

      // assert.expect(3);
      it('Extend copies nested property', () => {
        assert.equal(b.foo.bar.baz, 'Hello, I am a baz');
      });

      it('Extend does not copy by reference', () => {
        assert.equal(b.foo.flotsam[0], 'Meet George Jetsam');
      });

      it('Extend copies function', () => {
        assert.equal(b.cb(), 'hello');
      });
    });

    describe('extend: deep copy target when no other arguments', () => {
      const a = {foo: 'bar', baz: 'yo'};
      const b = extend(a);
      const c = b;

      it('Extend makes a copy of an object', () => {
        assert.notEqual(a, b);
        assert.equal(b, c);
        assert.deepEqual(a, b);
      });
    });

    describe('extend: 2 objects into target', () => {

      let a = extend({}, target);

      let b = {
        foo: {
          bar: {
            baz: 'I am Baz, the Magnificent!',
          },
        },
        baz: 'nope',
        name: {
          first: 'tim',
          middle: 'johann',
        },
      };

      let c = {
        baz: 'yep',
      };

      extend(a, b, c);

      it('Adds property', () => {
        assert.equal(a.baz, 'yep', '');
      });
      it('Overwrites nested property', () => {
        assert.equal(a.foo.bar.baz, 'I am Baz, the Magnificent!', '');
      });
      it('Adds nested property', () => {
        assert.equal(a.name.middle, 'johann', '');
      });
      it('source object keeps prop when target prop changes', () => {
        a.baz = 'diff';
        assert.equal(b.baz, 'nope', '');
      });
    });
  });

  describe('getProperty', () => {
    let target = {
      foo: {
        bar: {
          baz: 'Hello, I am a baz',
        },
        flotsam: ['Meet George Jetsam', 'Jude, his wife'],
      },
      arr: [{foo: 'bar'}, 0],
      cb: function() {
        return 'hello';
      },
    };

    let targetArray = [
      {
        foo: 'bar',
        name: {
          first: 'karl',
          last: 'swedberg',
        },
        cb: function() {
          return 'hello';
        },
      },
    ];

    let stringStyle = getProperty(target, 'foo.bar.baz');
    let arrayStyle = getProperty(target, ['foo', 'bar', 'baz']);
    let undef = getProperty(target, ['foo', 'bar', 'nothere']);
    let undefEarly = getProperty(target, ['nothere', 'bar', 'baz']);
    let undefRoot = getProperty(window.foo, 'foo.bar');
    let defaultVal = getProperty(target, ['foo', 'bar', 'nothere'], 'defaultzee');
    let defaultEarly = getProperty(target, ['nothere', 'bar', 'baz'], 'defaultearly');
    let nestedArray = getProperty(target, ['arr', 0, 'foo']);
    let zeroVal = getProperty(target, ['arr', 1]);

    it('target.foo.bar.baz == "Hello", i am a baz', () => {
      assert.equal(stringStyle, 'Hello, I am a baz');
    });
    it('target.foo.bar.baz == "Hello", i am a baz', () => {
      assert.equal(arrayStyle, 'Hello, I am a baz');
    });
    it('target.foo.bar.nothere == undefined', () => {
      assert.equal(undef, null);
    });
    it('target.nothere.bar.baz == undefined', () => {
      assert.equal(undefEarly, undefined);
    });
    it('root param is undefined', () => {
      assert.equal(undefRoot, undefined);
    });

    it('default value returned when prop not here', () => {
      assert.equal(defaultVal, 'defaultzee');
    });
    it('default value returned when prop undefined early', () => {
      assert.equal(defaultEarly, 'defaultearly');
    });

    it('gets prop in nested array', () => {
      assert.equal(nestedArray, 'bar');
    });

    it('gets correct falsey value', () => {
      assert.equal(zeroVal, 0);
      assert.ok(zeroVal === 0);
    });
  });

  describe('setProperty', () => {
    let original = {
      foo: {
        bar: {
          baz: 'Hello',
        },
        flotsam: ['Meet George Jetsam', 'Jude, his wife'],
      },
      bar: 'hello',
      firstName: 'Jane',
      lastName: 'Doe',
      cb: function() {
        return 'hello';
      },
    };
    const empty = {};

    setProperty(original, 'foo.bar.shizz', 'yes!');
    setProperty(empty, 'foo.bar.shizz', 'yes!');

    it('sets deeply nested property on existing object', () => {
      assert.equal(original.foo.bar.shizz, 'yes!');
    });

    it('sets deeply nested property on empty object', () => {
      assert.equal(empty.foo.bar.shizz, 'yes!');
    });
  });

  describe('isPlainObject', () => {
    it('Identifies null object as plain object', () => {
      assert.equal(isPlainObject(Object.create(null)), true);
    });

    it('Identifies empty object as plain object', () => {
      assert.equal(isPlainObject({}), true);
    });

    it('null is not plain object', () => {
      assert.equal(isPlainObject(null), false);
    });

    it('array is not plain object', () => {
      assert.equal(isPlainObject([]), false);
    });
  });

  describe('pick', () => {
    let original = {
      foo: {
        bar: {
          baz: 'Hello',
        },
        flotsam: ['Meet George Jetsam', 'Jude, his wife'],
      },
      bar: 'hello',
      firstName: 'Jane',
      lastName: 'Doe',
      cb: function() {
        return 'hello';
      },
    };


    const name = pick(original, ['firstName', 'lastName']);
    const second = pick(original, ['foo']);

    it('has name props', () => {
      assert.equal(name.firstName, 'Jane');
      assert.equal(name.lastName, 'Doe');
    });

    it('Does not have non-name props', () => {
      assert.equal(original.bar, 'hello');
      assert.equal(name.bar, undefined);
    });

    it('Does not screw with original object', () => {
      name.firstName = 'John';
      assert.equal(original.firstName, 'Jane');
      assert.equal(original.bar, 'hello');
    });

    it('Original object does not screw with picked obj', () => {
      original.foo.bar.baz = 'Goodbye';
      original.foo.no = 'noooo';

      assert.equal(second.foo.bar.baz, 'Hello');
      assert.equal(second.foo.no, undefined);
    });
  });

  describe('omit', () => {
    let original = {
      foo: {
        bar: {
          baz: 'Hello',
        },
        flotsam: ['Meet George Jetsam', 'Jude, his wife'],
      },
      bar: 'hello',
      firstName: 'Jane',
      lastName: 'Doe',
      cb: function() {
        return 'hello';
      },
    };

    const noname = omit(original, ['firstName', 'lastName']);
    const second = omit(original, ['foo']);

    it('has noname props', () => {
      assert.equal(original.bar, 'hello');
      assert.equal(noname.bar, 'hello');
      assert.equal(typeof noname.cb, 'function');
    });

    it('Does not have non-name props', () => {
      assert.equal(original.firstName, 'Jane');
      assert.equal(noname.firstName, undefined);
      assert.equal(noname.lastName, undefined);
    });
  });
});
