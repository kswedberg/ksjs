import * as strings from '../src/string';

const assert = require('assert');

describe('String', () => {

  describe('parseStringTemplate', () => {
    const path1 = '/patients/${patient_id}';
    const path2 = '/patients/${patient_id}/encounters/${encounter_id}/observations/${observation_id}';
    const obj = {
      patient_id: '12345',
      encounter_id: '67890',
      observation_id: 'abcde',
    };
    const greeting = 'Hello, my name is ${first} ${last}';
    const greeting2 = 'Hola, mi tio ${first} ${last} está ${age} años.';
    const name = {
      first: 'Jörn',
      last: 'Zångström',
      age: '42',
    };

    it('Parses a simple string with one or more tokens', () => {
      assert.strictEqual(strings.parseStringTemplate(path1, obj), '/patients/12345');
      assert.strictEqual(strings.parseStringTemplate(path2, obj), '/patients/12345/encounters/67890/observations/abcde');
    });
    it('Returns a greeting that includes diacritics', () => {
      assert.strictEqual(strings.parseStringTemplate(greeting, name), 'Hello, my name is Jörn Zångström');
      assert.strictEqual(strings.parseStringTemplate(greeting2, name), 'Hola, mi tio Jörn Zångström está 42 años.');
    });
  });

  describe('changeCase', () => {
    let forWhom = 'for whom the bell tolls';
    let oldMan = 'the old man and the sea';
    let oldManSluggedAndSnaked = '_the__old-man--- and-the sea';
    let heAte = 'he ate his sandwich';

    it('Converts a string to title case', () => {
      assert.strictEqual(strings.changeCase(forWhom, 'title'), 'For Whom the Bell Tolls');
      assert.strictEqual(strings.changeCase(oldMan, 'title'), 'The Old Man and the Sea');
      assert.strictEqual(strings.changeCase(oldManSluggedAndSnaked, 'title', {unslugify: true}), 'The Old Man and the Sea');
      assert.strictEqual(strings.changeCase(heAte, 'title'), 'He Ate his Sandwich');
    });

    it('Converts a string to sentence case', () => {
      assert.strictEqual(strings.changeCase(forWhom, 'sentence'), 'For whom the bell tolls');
      assert.strictEqual(strings.changeCase(oldMan, 'sentence'), 'The old man and the sea');
      assert.strictEqual(strings.changeCase(oldManSluggedAndSnaked, 'sentence', {unslugify: true}), 'The old man and the sea');
      assert.strictEqual(strings.changeCase(heAte, 'sentence'), 'He ate his sandwich');
    });

    it('Converts a string to camel case', () => {
      assert.strictEqual(strings.changeCase(forWhom, 'camel'), 'forWhomTheBellTolls');
      assert.strictEqual(strings.changeCase(oldMan, 'camel'), 'theOldManAndTheSea');
      assert.strictEqual(strings.changeCase(heAte, 'camel'), 'heAteHisSandwich');
    });

    it('Converts a string to pascal case', () => {
      assert.strictEqual(strings.changeCase(forWhom, 'pascal'), 'ForWhomTheBellTolls');
      assert.strictEqual(strings.changeCase(oldMan, 'pascal'), 'TheOldManAndTheSea');
      assert.strictEqual(strings.changeCase(heAte, 'pascal'), 'HeAteHisSandwich');
    });

    let snakes = [
      {
        pre: 'Hello there, how are you?',
        expected: 'hello_there_how_are_you',
      },
      {
        pre: '  You? & Me<3* ',
        expected: 'you_and_me_3',
      },
      {
        pre: '_Hey___this should work*I think--',
        expected: 'hey_this_should_work_i_think',
      },
      {
        pre: 'Preemptive ♥: ♥ anyway™.',
        expected: 'preemptive_love_love_anywaytm',
      },
      {
        pre: `I've got
        "some" “apostrophes” here, y’all!`,
        expected: 'ive_got_some_apostrophes_here_yall',
      },
    ];

    snakes.forEach((item) => {
      const snaked = strings.changeCase(item.pre, 'snake');

      it(`${item.pre} is snake-cased to ${snaked}`, () => {
        assert.strictEqual(snaked, item.expected);
      });
    });
  });

  describe('hashCode', () => {
    it('Converts string to numeric hashCode', () => {
      assert.strictEqual(strings.hashCode('a'), 97);
    });

    it('Converts string to numeric hashCode', () => {
      assert.strictEqual(strings.hashCode('a*a'), 94616);
    });

  });

  describe('truncate', () => {
    const shortString = 'Override the digital';
    const longString = 'Collaboratively administrate empowered markets via plug-and-play networks. Dynamically procrastinate B2C users after installed base benefits. Dramatically visualize customer directed convergence without revolutionary ROI.';

    const notrunc1 = strings.truncate(shortString, {start: 20});
    const notrunc2 = strings.truncate(shortString, {end: 20});
    const notrunc3 = strings.truncate(shortString, {start: 20, end: 20});

    const trunc1 = strings.truncate(longString, {start: 10});
    const trunc1b = strings.truncate(longString, {start: 10, separator: ''});
    const trunc2 = strings.truncate(longString, {end: 10});
    const trunc3 = strings.truncate(longString, {start: 10, end: 10});

    it('Does not truncate a string that is shorter than the "start" option', () => {
      assert.strictEqual(notrunc1, shortString);
    });
    it('Does not truncate a string that is shorter than the "end" option', () => {
      assert.strictEqual(notrunc2, shortString);
    });

    it('Does not truncate a string that is shorter than the sum of the "start" and "end" options', () => {
      assert.strictEqual(notrunc3, shortString);
    });

    it('Truncates string to the first 10 characters', () => {
      assert.strictEqual(trunc1, 'Collaborat...');
      assert.strictEqual(trunc1b, 'Collaborat');
    });
    it('Truncates string to the last 10 characters', () => {
      assert.strictEqual(trunc2, '...onary ROI.');
    });
    it('Truncates string to the last 10 characters', () => {
      assert.strictEqual(trunc3, 'Collaborat...onary ROI.');
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
      assert.strictEqual(rot13.encoded, rot13.expect);
    });
    it('String is base64 encoded, then decoded to original value', () => {
      assert.strictEqual(rot13.original, rot13.decoded);
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
      assert.strictEqual(base64.original, base64.decoded);
    });
  });

  describe('slugify', () => {

    const slugs = [
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
        assert.strictEqual(slugged, item.expected);
      });
    });
  });

  describe('randomString', () => {
    // Generate random strings and make sure each one is unique
    const unique = new Set();
    const total = 10000;

    for (let i = 0; i < total; i++) {
      const rando = strings.randomString();

      unique.add(rando);
    }

    it(`Set has ${total} unique items`, () => {
      assert.strictEqual(unique.size, total);
    });
  });
});
