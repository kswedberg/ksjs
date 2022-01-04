import * as arrays from '../src/array';

const assert = require('assert');

describe('Array', () => {
  describe('isArray', () => {
    it('[1,2,4] is an array', () => {
      assert.ok(arrays.isArray([1, 2, 4]));
    });
    it('{0: "one", length: 1} is NOT an array', () => {
      assert.ok(!arrays.isArray({0: 'one', length: 1}));
    });
  });

  describe('inArray', () => {
    it('3 is in array [3, 2, 1]', () => {
      assert.ok(arrays.inArray(3, [3, 2, 1]));
    });
    it('"2" is NOT in array [3, 2, 1]', () => {
      assert.ok(!arrays.inArray('2', [3, 2, 1]));
    });
  });

  describe('makeArray', () => {
    const str1 = 'one two three';
    const str2 = 'one,two, three';
    const arr = [1, 2, 3];
    const obj = {uno: 'one', dos: 'two', tres: 'three'};
    let nothing;
    const num = 0;

    it('converts space-delimited string to array', () => {
      assert.deepStrictEqual(arrays.makeArray(str1), ['one', 'two', 'three']);
    });
    it('converts custom-delimited string to array', () => {
      assert.deepStrictEqual(arrays.makeArray(str2, /,\s*/), ['one', 'two', 'three']);
    });
    it('returns an array unchanged', () => {
      assert.deepStrictEqual(arrays.makeArray(arr), [1, 2, 3]);
    });
    it('converts an object to an array of objects with name and value properties', () => {
      assert.deepStrictEqual(arrays.makeArray(obj), [{name: 'uno', value: 'one'}, {name: 'dos', value: 'two'}, {name: 'tres', value: 'three'}]);
    });
    it('returns an empty array from an undefined variable', () => {
      assert.deepStrictEqual(arrays.makeArray(nothing), []);
    });
    it('wraps the number in an array', () => {
      assert.deepStrictEqual(arrays.makeArray(num), [num]);
    });
  });

  describe('randomItem', () => {
    let arr = [3, 2, 1];

    it('Random item is in array [3, 2, 1]', () => {
      assert.ok(arrays.inArray(arrays.randomItem(arr), arr));
    });
    it('Random item is in array [3, 2, 1]', () => {
      assert.ok(arrays.inArray(arrays.randomItem(arr), arr));
    });
    it('Random item is in array [3, 2, 1]', () => {
      assert.ok(arrays.inArray(arrays.randomItem(arr), arr));
    });
    it('Random item is in array [3, 2, 1]', () => {
      assert.ok(arrays.inArray(arrays.randomItem(arr), arr));
    });
    it('Random item is in array [3, 2, 1]', () => {
      assert.ok(arrays.inArray(arrays.randomItem(arr), arr));
    });
  });

  describe('pluck', () => {
    let family = [
      {
        name: 'Karl',
        color: 'orange',
      },
      {
        name: 'Sara',
        color: 'yellow',
        id: 'mom',
      },
      {
        name: 'Ben',
        color: 'blue',
        id: 'son',
      },
      {
        name: 'Lucy',
        color: 'green',
      },
    ];
    let names = arrays.pluck(family, 'name');
    let colors = arrays.pluck(family, 'color');
    let ids = arrays.pluck(family, 'id');

    it('Plucked names out of family', () => {
      assert.deepStrictEqual(names, ['Karl', 'Sara', 'Ben', 'Lucy']);
    });
    it('Plucked colors out of family', () => {
      assert.deepStrictEqual(colors, ['orange', 'yellow', 'blue', 'green']);
    });
    it('Plucked ids out of 2 family members', () => {
      assert.deepStrictEqual(ids, [null, 'mom', 'son', null]);
    });

  });

  let family1 = [
    {
      id: 'dad',
      name: 'Karl',
    },
    {
      id: 'mom',
      name: 'Sara',
      color: 'blue',
    },
    {
      id: 'son',
      name: 'Ben',
      color: 'green',
    },
    {
      id: 'daughter',
      name: 'Lucy',
    },
  ];

  let family2 = [
    {
      id: 'dad',
      name: 'George',
    },
    {
      id: 'mom',
      name: 'Martha',
      color: 'blue',
    },
    {
      id: 'son',
      name: 'Ben',
      color: 'orange',
    },
    {
      id: 'daughter',
      name: 'Lucy',
    },
  ];

  describe('unique', () => {
    let array1 = [1, 2, 3, 4, 3, 2, 6];
    let array2 = [2, 3, 5, 6, -1];


    it('unique merged elements in array', () => {
      let uniq = arrays.unique(array1);

      assert.deepStrictEqual(uniq, [1, 2, 3, 4, 6]);
    });

    it('uniquely merged two arrays', () => {
      let uniqueMerge = arrays.unique(arrays.merge(array1, array2));

      assert.deepStrictEqual(uniqueMerge, [1, 2, 3, 4, 6, 5, -1]);
    });
  });

  describe('intersect', () => {
    let array1 = [1, 2, 3, 4];
    let array2 = [2, 3, 5, 6, -1];

    it('returns array1 intersected with array2', () => {
      let arrayIntersect = arrays.intersect(array1, array2);

      assert.deepStrictEqual(arrayIntersect, [2, 3]);
    });

    it('returns intersected array of objects', () => {
      let arrayIntersect = arrays.intersect(family1, family2);

      let expectIntersect = [
        {
          id: 'daughter',
          name: 'Lucy',
        },
      ];

      assert.deepStrictEqual(arrayIntersect, expectIntersect);
    });

    it('returns intersected array of objects, checking for "name" property', () => {
      let arrayIntersect = arrays.intersect(family1, family2, 'name');
      let expectIntersect = [
        {
          id: 'son',
          name: 'Ben',
          color: 'green',
        },
        {
          id: 'daughter',
          name: 'Lucy',
        },
      ];

      assert.deepStrictEqual(arrayIntersect, expectIntersect);
    });
  });

  describe('diff', () => {
    let array1 = [1, 2, 3, 4];
    let array2 = [2, 3, 5, 6, -1];

    it('returns a diffed array1', () => {
      let arrayDiff = arrays.diff(array1, array2);

      assert.deepStrictEqual(arrayDiff, [1, 4]);
    });

    it('returns a differed array of objects', () => {
      let arrayDiff = arrays.diff(family1, family2);

      let expectDiff = [
        {
          id: 'dad',
          name: 'Karl',
        },
        {
          id: 'mom',
          name: 'Sara',
          color: 'blue',
        },
        {
          id: 'son',
          name: 'Ben',
          color: 'green',
        },
      ];

      assert.deepStrictEqual(arrayDiff, expectDiff);
    });

    it('returns a differed array of objects, checking for "name" property', () => {
      let arrayDiff = arrays.diff(family1, family2, 'name');
      let expectDiff = [
        {
          id: 'dad',
          name: 'Karl',
        },
        {
          id: 'mom',
          name: 'Sara',
          color: 'blue',
        },
      ];

      assert.deepStrictEqual(arrayDiff, expectDiff);
    });
  });

  describe('range', () => {
    const array1 = arrays.range(4);
    const array2 = arrays.range(1, 4);
    const array3 = arrays.range(10, 0);
    const array4 = arrays.range(3, -2);

    it('returns the expected range', () => {
      assert.deepStrictEqual(array1, [0, 1, 2, 3]);
      assert.deepStrictEqual(array2, [1, 2, 3, 4]);
      assert.deepStrictEqual(array3, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
      assert.deepStrictEqual(array4, [3, 2, 1, 0, -1, -2]);
    });
  });

  describe('pad', () => {
    const array1 = [1, 2, 3, 4];
    const array2 = [2, 3, 5, 6, -1];
    const array3 = [1, 2, 3, 4];

    arrays.pad(array1, 8, 0);
    arrays.pad(array2, 7, 'foo');
    arrays.pad(array3, 2, 0);
    it('pads arrays appropriately', () => {
      assert.deepStrictEqual(array1, [1, 2, 3, 4, 0, 0, 0, 0]);
      assert.deepStrictEqual(array2, [2, 3, 5, 6, -1, 'foo', 'foo']);
      assert.deepStrictEqual(array3, [1, 2, 3, 4]);
    });
  });
});
