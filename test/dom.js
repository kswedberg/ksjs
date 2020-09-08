import * as doms from '../src/dom.js';

const assert = require('assert');

describe('DOM', () => {

  describe('class functions', () => {
    it('adds foobar class to body once', () => {
      doms.addClass(document.body, 'foobar');
      doms.addClass(document.body, 'foobar');
      assert.equal(document.body.className, 'foobar');

    });
    it('removes foobar class and adds bzzz', () => {
      doms.addClass(document.body, 'bzzz');
      doms.removeClass(document.body, 'foobar');
      assert.equal(document.body.className, 'bzzz');
    });

    it('toggles a class', () => {
      doms.toggleClass(document.body, 'bzzz', false);
      doms.toggleClass(document.body, 'brrr', true);
      assert.equal(document.body.className, 'brrr');
    });

    it('replaces a class', () => {
      doms.replaceClass(document.body, 'brrr', 'yahoo');
      assert.equal(document.body.className, 'yahoo');

      doms.addClass(document.body, 'bzzz');
      doms.replaceClass(document.body, 'yahoo', 'brrr');
      assert.equal(document.body.className, 'brrr bzzz');
    });

    it('adds/removes multiple classes at once', () => {
      document.body.className = '';

      doms.addClass(document.body, 'foo', 'bar');
      assert.equal(document.body.className, 'foo bar');

      doms.addClass(document.body, 'bar', 'foo');
      assert.equal(document.body.className, 'foo bar');

      doms.removeClass(document.body, 'bar', 'foo');
      assert.equal(document.body.className, '');
    });
  });


  describe('insertion functions', () => {
    it('inserts DOM elements inside body', () => {
      const el = document.createElement('div');

      el.id = 'appendEl';

      doms.append(document.body, el);

      assert.equal(document.querySelectorAll('#appendEl').length, 1);
      assert.equal(document.getElementById('appendEl'), doms.$1('#appendEl'));
    });
    it('inserts DOM elements from HTML', () => {
      doms.append(document.body, '<span id="appendHTML">appended</span>');

      assert.equal(document.querySelectorAll('#appendHTML').length, 1);
      assert.equal(document.getElementById('appendHTML'), doms.$1('#appendHTML'));
    });
  });
});
