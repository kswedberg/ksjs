import * as strings from '../src/string';

const assert = require('assert');

describe('String', () => {

  describe('changeCase', () => {
    let forWhom = 'for whom the bell tolls';
    let oldMan = 'the old man and the sea';
    let heAte = 'he ate his sandwich';

    it('Converts a string to title case', () => {
      assert.equal(strings.changeCase(forWhom, 'title'), 'For Whom the Bell Tolls');
      assert.equal(strings.changeCase(oldMan, 'title'), 'The Old Man and the Sea');
      assert.equal(strings.changeCase(heAte, 'title'), 'He Ate his Sandwich');
    });

    it('Converts a string to sentence case', () => {
      assert.equal(strings.changeCase(forWhom, 'sentence'), 'For whom the bell tolls');
      assert.equal(strings.changeCase(oldMan, 'sentence'), 'The old man and the sea');
      assert.equal(strings.changeCase(heAte, 'sentence'), 'He ate his sandwich');
    });

    it('Converts a string to camel case', () => {
      assert.equal(strings.changeCase(forWhom, 'camel'), 'forWhomTheBellTolls');
      assert.equal(strings.changeCase(oldMan, 'camel'), 'theOldManAndTheSea');
      assert.equal(strings.changeCase(heAte, 'camel'), 'heAteHisSandwich');
    });
  });

  describe('hashCode', () => {
    it('Converts string to numeric hashCode', () => {
      assert.equal(strings.hashCode('a'), 97);
    });

    it('Converts string to numeric hashCode', () => {
      assert.equal(strings.hashCode('a*a'), 94616);
    });

  });

  describe('rot13', () => {
    let rot13 = {
      original: 'Karl Swedberg',
      expect: 'Xney Fjrqoret',
    };

    rot13.encoded = strings.rot13(rot13.original);
    rot13.decoded = strings.rot13(rot13.encoded);

    it(`${rot13.original} is rot13 encoded to ${rot13.encoded}`, () => {
      assert.equal(rot13.encoded, rot13.expect);
    });
    it('String is base64 encoded, then decoded to original value', () => {
      assert.equal(rot13.original, rot13.decoded);
    });
  });

  describe('base64', () => {
    let base64 = {
      original: 'Hello there, how are you?',
    };

    base64.encoded = strings.base64Encode(base64.original);
    base64.decoded = strings.base64Decode(base64.encoded);

    it('String is base64 encoded', () => {
      assert.notEqual(base64.original, base64.encoded);
    });

    it('String is base64 encoded, then decoded to original value', () => {
      assert.equal(base64.original, base64.decoded);
    });
  });

  describe('slugify', () => {

    let slugs = [
      {
        pre: 'Hello there, how are you?',
        expected: 'hello-there-how-are-you',
      },
      {
        pre: '  You? & Me<3* ',
        expected: 'you-and-me-3',
      },
      {
        pre: '-Hey---this should work*I think--',
        expected: 'hey-this-should-work-i-think',
      },
      {
        pre: 'Preemptive ♥: ♥ anyway™.',
        expected: 'preemptive-love-love-anywaytm',
      },
      {
        pre: `I've got
        "some" “apostrophes” here, y’all!`,
        expected: 'ive-got-some-apostrophes-here-yall',
      },
      // {
      //   pre: 'Iлｔèｒｎåｔïｏｎɑｌíƶａｔï߀ԉ ąćęłńóśźżäöüß',
      //   expected: 'internationalization-acelnoszzaouss',
      // },
    ];

    slugs.forEach((item) => {
      let slugged = strings.slugify(item.pre);

      it(`${item.pre} is slugified to ${slugged}`, () => {
        assert.equal(slugged, item.expected);
      });
    });
  });

});
