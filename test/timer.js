import {throttle, debounce, unbounce, idle} from '../src/timer.js';

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
      assert.strictEqual(logs.length, 1);
      // This shouldn't get called either
      setTimeout(() => {
        throttled('never');
      }, 25);
      setTimeout(() => {
        assert.strictEqual(logs.length, 1);
        done();
      }, 125);
    });

    it('called throttled function with proper args', (done) => {
      setTimeout(() => {
        // ***This WILL get called, because it's the last one within the first 200ms
        throttled('eventually!');

        setTimeout(() => {
          assert.strictEqual(logs.join(''), 'yeseventually!');
          assert.strictEqual(logs.length, 2);

          // ** This WILL get called, too, because another 200ms has started
          throttled('yahoo');
          setTimeout(() => {
            ['yes', 'eventually!', 'yahoo'].forEach((item, i) => {
              assert.strictEqual(logs[i], item);
            });
            assert.strictEqual(logs.length, 3);
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
            assert.strictEqual(repeated.length, 20, 'Attempted 20 times');
            assert.strictEqual(debounced.length, 1, 'Called only once');
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
            assert.strictEqual(repeated.length, 20, 'Attempted 20 times');
            assert.strictEqual(unbounced.length, 1, 'Called only once');
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

// This test is a little dumb, but just want to make sure the function gets called
describe('idle', () => {
  const logs = [];
  let times = 20;

  const logit = (num) => {
    logs.push(num);
  };

  it('logs on idle', (done) => {
    const logOnIdle = idle(logit);

    for (let i = 0; i < times; i++) {
      logOnIdle(i);
    }
    idle(() => {
      assert.strictEqual(logs.length, times, 'Called 20 times');
      assert.strictEqual(logs[logs.length - 1], 19, 'Last call\'s argument was 19');
      done();
    })();
  });
});
