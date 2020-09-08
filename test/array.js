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

  describe('inArray', () => {
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
      assert.deepEqual(names, ['Karl', 'Sara', 'Ben', 'Lucy']);
    });
    it('Plucked colors out of family', () => {
      assert.deepEqual(colors, ['orange', 'yellow', 'blue', 'green']);
    });
    it('Plucked ids out of 2 family members', () => {
      assert.deepEqual(ids, [null, 'mom', 'son', null]);
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

      assert.deepEqual(uniq, [1, 2, 3, 4, 6]);
    });

    it('uniquely merged two arrays', () => {
      let uniqueMerge = arrays.unique(arrays.merge(array1, array2));

      assert.deepEqual(uniqueMerge, [1, 2, 3, 4, 6, 5, -1]);
    });
  });

  describe('intersect', () => {
    let array1 = [1, 2, 3, 4];
    let array2 = [2, 3, 5, 6, -1];

    it('returns array1 intersected with array2', () => {
      let arrayIntersect = arrays.intersect(array1, array2);

      assert.deepEqual(arrayIntersect, [2, 3]);
    });

    it('returns intersected array of objects', () => {
      let arrayIntersect = arrays.intersect(family1, family2);

      let expectIntersect = [
        {
          id: 'daughter',
          name: 'Lucy',
        },
      ];

      assert.deepEqual(arrayIntersect, expectIntersect);
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

      assert.deepEqual(arrayIntersect, expectIntersect);
    });
  });

  describe('diff', () => {
    let array1 = [1, 2, 3, 4];
    let array2 = [2, 3, 5, 6, -1];

    it('returns a diffed array1', () => {
      let arrayDiff = arrays.diff(array1, array2);

      assert.deepEqual(arrayDiff, [1, 4]);
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

      assert.deepEqual(arrayDiff, expectDiff);
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

      assert.deepEqual(arrayDiff, expectDiff);
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
      assert.deepEqual(array1, [1, 2, 3, 4, 0, 0, 0, 0]);
      assert.deepEqual(array2, [2, 3, 5, 6, -1, 'foo', 'foo']);
      assert.deepEqual(array3, [1, 2, 3, 4]);
    });
  });
});
