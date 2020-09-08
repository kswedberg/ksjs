import {throttle, debounce, unbounce} from '../src/timer.js';

const assert = require('assert');

describe('Timer', () => {
  describe('throttle', () => {
    const logs = [];
    const times = [];
    const triggerDelay = (times) => {
      return times.reduce((prev, curr, i) => {
        if (i === 0) {
          prev.push(0);
        } else {
          prev.push(curr - times[i - 1]);
        }

        return prev;
      }, []);
    };
    let start = +new Date();

    const logit = (text) => {
      logs.push(text);
      times.push(+new Date() - start);
    };

    const throttled = throttle(logit, 200);

    // Only the first one of these three should get called
    // because they're happening one right after the other
    // and more will be called within the 200ms threshold
    throttled('yes');
    throttled('no');
    throttled('nope');

    it('throttled function calls', (done) => {
      assert.equal(logs.length, 1);
      // This shouldn't get called either
      setTimeout(() => {
        throttled('never');
      }, 25);
      setTimeout(() => {
        assert.equal(logs.length, 1);
        done();
      }, 125);
    });

    it('called throttled function with proper args', (done) => {
      setTimeout(() => {
        // ***This WILL get called, because it's the last one within the first 200ms
        throttled('eventually!');

        setTimeout(() => {
          assert.equal(logs.join(''), 'yeseventually!');
          assert.equal(logs.length, 2);

          // ** This WILL get called, too, because another 200ms has started
          throttled('yahoo');
          setTimeout(() => {
            ['yes', 'eventually!', 'yahoo'].forEach((item, i) => {
              assert.equal(logs[i], item);
            });
            assert.equal(logs.length, 3);
            console.log(logs);
            console.log(times);
            done();
          }, 300);
        }, 125);

      }, 25);
    });

  });

  describe('debounce', () => {
    let debounced = [];
    let repeated = [];
    let times = 20;
    const debouncer = debounce(() => {
      debounced.push(+new Date());
    });

    it('triggered only once at the end of repeated calls', (done) => {
      const repeater = () => {
        setTimeout(() => {
          if (times-- > 0) {
            debouncer();
            repeated.push(+new Date());

            return repeater();
          }

          setTimeout(() => {
            assert.equal(repeated.length, 20, 'Attempted 20 times');
            assert.equal(debounced.length, 1, 'Called only once');
            assert.ok(+new Date() - debounced[debounced.length - 1] < 50, 'Called at the end');
            // console.log('time diff', );
            done();
          }, 200);

        }, 20);
      };

      repeater();
    });
  });
  describe('unbounce', () => {
    let unbounced = [];
    let repeated = [];
    let times = 20;
    let firstTime;
    const unbouncer = unbounce(() => {
      unbounced.push(+new Date());
    });

    it('triggered only once at the end of repeated calls', (done) => {
      const repeater = () => {
        setTimeout(() => {
          if (times === 20) {
            firstTime = +new Date();
          }
          if (times-- > 0) {
            unbouncer();
            repeated.push(+new Date());

            return repeater();
          }

          setTimeout(() => {
            assert.equal(repeated.length, 20, 'Attempted 20 times');
            assert.equal(unbounced.length, 1, 'Called only once');
            assert.ok(firstTime - unbounced[unbounced.length - 1] < 50, 'Called at the start');
            // console.log('time diff', );
            done();
          }, 200);

        }, 20);
      };

      repeater();
    });
  });
});
