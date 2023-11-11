import {ajax as ajaxReal} from '../src/ajax';

export let ajax = !process.env.NODE_ENV ?
  ajaxReal :
  function(url, options) {
    console.log('\n\n******Using fake ajax. Run in browser for real ajax test.\n\n');

    return new Promise((resolve, reject) => {
      let response = {success: true, status: 'success'};

      resolve({response});
    });
  };

export let asyncBrowserOnly = function(assert, cb) {
  const done = assert.async();

  if (process.env.NODE_ENV) {
    assert.ok(true, 'Browser Only: skipped test in node.js');

    return done();
  }

  return cb(done);
};
