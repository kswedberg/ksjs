import {throttle, debounce, unbounce, idle, deadline, delay} from '../src/timer.js';

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
        }, 155);

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

  describe('deadline', () => {
    it('should resolve with return value before deadline', async() => {
      const succeed = new Promise((resolve) => {
        return setTimeout(() => resolve('success'), 20);
      });

      try {
        const res = await deadline(succeed, 50);

        assert.equal(res, 'success', 'resolves with success');
      } catch (err) {
        assert.equal('success', 'failed', 'resolves with success');
      }
    });

    it('should reject in try/catch with error after deadline', async() => {

      const fail = new Promise((resolve) => {
        return setTimeout(() => resolve('fail'), 80);
      });

      const timeoutError = Symbol();

      try {
        await deadline(fail, 20, timeoutError);
      } catch (err) {
        assert.equal(timeoutError, err, 'rejects with timeoutError');
      }

    });
    it('should reject in promise.catch() with error after deadline', () => {

      const fail = new Promise((resolve) => {
        return setTimeout(() => resolve('fail'), 80);
      });

      return deadline(fail, 40)
      .then(() => {
        assert.fail('should not resolve');
      })
      .catch((err) => {
        assert.equal('timeout', err.message, 'rejects with default "timeout" error message');
      });
    });
  });

  describe('delay', () => {
    it('should wait before executing', (done) => {
      const now = +new Date();

      delay(100)
      .then(() => {
        assert.ok(+new Date() - now >= 100, 'Delayed 100ms');
        done();
      });
    });
  });
});
