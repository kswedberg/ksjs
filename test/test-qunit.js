/* global QUnit: true */
import * as events from '../src/event';
import * as doms from '../src/dom';
import * as selections from '../src/selection';
import * as forms from '../src/form.js';
import {ajax, asyncBrowserOnly} from './ajax-fake';
import {Storage} from '../src/storage.js';
import {getCookie, setCookie, removeCookie} from '../src/cookie.js';

// TODO: TESTS FOR THE FOLLOWING…
// jsonp.js: getJSONP
// selection.js: wrapSelection


QUnit.module('event');

QUnit.test('addEvent', (assert) => {
  assert.expect(2);
  const done = assert.async();
  const bail = setTimeout(done, 1500);

  events.addEvent(window, 'load', () => {
    assert.ok(window.BAMF.windowLoaded, 'window loaded');
    events.addEvent(window, 'load', () => {
      assert.ok(window.BAMF.windowLoaded, 'window load triggered immediately when called after window loaded');
      done();
      clearTimeout(bail);
    });
  });

});

// const onScroll = () => {
//   console.log('scrolling!');
// };

// events.addEvent(window, 'scroll', timers.raf(onScroll));

QUnit.test('triggerEvent', (assert) => {
  assert.expect(1);
  const done = assert.async();
  const bail = setTimeout(done, 1500);

  events.addEvent(document.body, 'myCustom', (event) => {
    assert.equal(event.detail.foo, 'bar', 'triggered custom event with detail');
    done();
    clearTimeout(bail);
  });

  setTimeout(() => {
    events.triggerEvent(document.body, 'myCustom', {foo: 'bar'});
  }, 500);

});
QUnit.module('dom');

QUnit.test('insertion', (assert) => {
  const form = document.getElementById('dom-form');

  assert.expect(4);
  doms.append(form, '<span id="appendHTML">appended</span>');
  doms.after(form, '<div class="imafter">yo</div>');

  assert.equal(document.querySelectorAll('#appendHTML').length, 1, '#appendHTML was inserted');
  assert.equal(doms.$('#appendHTML').length, document.querySelectorAll('#appendHTML').length, 'use $ to find element by id');
  assert.equal(form.nextSibling.className, 'imafter', 'div.imafter inserted after form');
  assert.equal(document.getElementById('appendHTML'), doms.$1('#appendHTML'));
});

QUnit.test('replace class', (assert) => {
  const findMe = doms.$1('.find-me');

  doms.replaceClass(findMe, 'replace-me', 'replaced-haha');
  assert.equal(findMe.className, 'find-me replaced-haha touch-me');
});

QUnit.test('toggle class', (assert) => {
  const findMe = doms.$1('.find-me');

  doms.toggleClass(findMe, 'touch-me');
  assert.equal(findMe.className.indexOf('touch-me'), -1, 'no touch-me');
  doms.toggleClass(findMe, 'touch-me', false);
  assert.equal(findMe.className.indexOf('touch-me'), -1, 'still no touch-me');
  doms.toggleClass(findMe, 'touch-me', true);
  assert.equal(findMe.className.includes('touch-me'), true, 'touch-me again');
  doms.toggleClass(findMe, 'touch-me', true);
  doms.toggleClass(findMe, 'touch-me', true);
  assert.equal(findMe.className.split(/\s+/).filter((c) => c === 'touch-me').length, 1, 'touch-me only once');
});

QUnit.test('element selection', (assert) => {
  const elSelector = doms.$1('.el-selector');
  const elsSelector = doms.$('.el-selector');
  const divInForm = doms.$1('div', '.dom-form');
  const divsInForm = doms.$('div', '.dom-form');
  const li = doms.$1('li:nth-child(2)', '.el-selector');
  const liNotHere = doms.$1('li:nth-child(2)', '.nope');
  const lisNotHere = doms.$('li:nth-child(2)', document.getElementById('nope'));

  assert.expect(8);

  assert.equal(elSelector.id, 'container', 'first .el-selector element has id of container');
  assert.equal(elsSelector.length, 3, 'found 3 elements with "el-selector" class');
  assert.equal(divInForm.className, 'hey el-selector', 'found the div in the form');
  assert.equal(divsInForm.length, 1, 'found 1 div in the form');
  assert.equal(divsInForm[0].className, 'hey el-selector', 'found the right div in the form');
  assert.equal(li && li.className, 'li-two', 'found the right li in the within .el-selector');
  assert.equal(liNotHere, null, 'returned null when $1() element not found');
  assert.equal(lisNotHere && lisNotHere.length, 0, 'returned empty array when $() element not found');
});

QUnit.test('set/get/toggle attributes', (assert) => {
  const el = document.querySelector('.el-selector');

  doms.setAttrs(el, {
    hidden: true,
    'data-foo': '',
  });

  assert.ok(el.hasAttribute('hidden'), 'hidden attr set');
  assert.ok(el.hasAttribute('data-foo'), 'data-foo attr set');

  const attrs = doms.getAttrs(el, ['hidden', 'data-foo']);

  assert.equal(attrs.hidden, '', 'got hidden attribute');
  assert.equal(attrs['data-foo'], '', 'got data-foo attribute');

  doms.toggleAttr(el, 'hidden');
  assert.ok(!el.hasAttribute('hidden'), 'hidden attr removed by toggle');

  doms.toggleAttr(el, 'hidden', false);
  assert.ok(!el.hasAttribute('hidden'), 'hidden attr still removed by toggle true');

  doms.toggleAttr(el, 'data-foo', false);
  assert.ok(!el.hasAttribute('data-foo'), 'data-foo attr removed by toggle false');

  doms.toggleAttr(el, 'data-foo', true);
  assert.ok(el.hasAttribute('data-foo'), 'data-foo attr added by toggle true');

  doms.toggleAttr(el, 'data-bar');
  assert.ok(el.hasAttribute('data-bar'), 'data-foo attr added by toggle');

});

QUnit.test('insert and remove elements', (assert) => {
  const children = [
    {tag: 'div', children: [{tag: 'span', text: 'hi mom!'}]},
    {tag: 'div'},
    {tag: 'div'},
  ].map((item, i) => {
    return {id: `treediv-${i}`, ...item};
  });
  const tree = doms.createTree({children});
  const container = document.getElementById('container');

  container.appendChild(tree);

  assert.equal(container.childNodes.length, 3, '3 sibling divs inserted');
  assert.equal(container.firstChild.id, 'treediv-0', 'id', 'first inserted div has correct id');
  assert.equal(container.firstChild.firstChild.innerText, 'hi mom!', 'inserted nested span has correct text');

  const treediv0 = document.getElementById('treediv-0');

  assert.equal(treediv0.childNodes.length, 1, 'first treediv has one child element');
  doms.empty(treediv0);
  assert.equal(treediv0.childNodes.length, 0, 'first treediv was emptied of children');
  assert.equal(treediv0.id, 'treediv-0', 'first treediv still there');

  let removed = doms.remove(treediv0);

  assert.equal(container.childNodes.length, 2, '2 sibling divs remain');
  assert.equal(container.firstChild.id, 'treediv-1', 'second inserted div is now first child');
  assert.equal(removed.id, 'treediv-0', 'removed div still has id');
  assert.equal(removed.nodeName, 'DIV', 'removed div still captured in variable');

  removed = null;
});

QUnit.test('loadScript', (assert) => {
  assert.expect(1);
  const done = assert.async();
  const bail = setTimeout(done, 1500);

  window.BAMF.stubbed = null;

  doms.loadScript({
    src: 'stub.js',
    id: 'loadstub',
  })
  .then(() => {
    assert.ok(window.BAMF.stubbed === true, 'stub.js loaded and executed');
    done();
    clearTimeout(bail);
  });
});

QUnit.test('loadScript with completeDelay', (assert) => {
  assert.expect(1);
  const done = assert.async();
  const bail = setTimeout(done, 1500);

  window.BAMF.stubbed = null;

  doms.loadScript({
    src: 'stub.js',
    id: 'loadstub2',
    completeDelay: 100,
  })
  .then(() => {
    assert.ok(window.BAMF.stubbed === true, 'stub.js loaded and executed');
    done();
    clearTimeout(bail);
  });
});

QUnit.test('loadScript with duplicate id', (assert) => {
  assert.expect(2);
  const done = assert.async();
  const bail = setTimeout(done, 1500);

  window.BAMF.stubbed = null;
  doms.loadScript({
    src: 'stub.js',
    id: 'loadstub2',
  })
  .then((res) => {
    assert.ok(window.BAMF.stubbed === null, 'stub.js loaded and executed');
    assert.equal(res.duplicate, true, 'Return object with duplicate property');
    done();
    clearTimeout(bail);
  });
});

QUnit.test('loadScript with duplicate id rejected', (assert) => {
  assert.expect(2);
  const done = assert.async();
  const bail = setTimeout(done, 1500);

  window.BAMF.stubbed = null;

  doms.loadScript({
    src: 'stub.js',
    id: 'loadstub2',
    onDuplicateId: 'reject',
    defer: true,
  })
  .catch((res) => {
    assert.equal(window.BAMF.stubbed, null, 'stub.js loaded and executed');
    assert.equal(res.duplicate, true, 'Return object with duplicate property');
    done();
    clearTimeout(bail);
  });
});

QUnit.module('ajax');

QUnit.test('ajax', (assert) => {
  assert.expect(1);
  asyncBrowserOnly(assert, (done) => {
    const bail = setTimeout(done, 1500);

    ajax('stub.json', {dataType: 'json'})
    .then((result) => {
      assert.equal(result.response.status, 'success', 'fetched and parsed json');
      done();
      clearTimeout(bail);
    })
    .catch((xhr) => {
      console.log(JSON.stringify(xhr, null, 2));
      clearTimeout(bail);
      done();
    });
  });
});

QUnit.test('ajax.getJson', (assert) => {
  assert.expect(1);
  asyncBrowserOnly(assert, (done) => {
    const bail = setTimeout(done, 1500);

    ajax.getJson('stub.json', {cache: false})
    .then((result) => {
      assert.equal(result.response.status, 'success', 'fetched and parsed json');
      clearTimeout(bail);
      done();
    })
    .catch((xhr) => {
      console.log(JSON.stringify(xhr, null, 2));
      clearTimeout(bail);
      done();
    });
  });

});

QUnit.test('ajax.getJson memcached', (assert) => {
  assert.expect(1);
  asyncBrowserOnly(assert, (done) => {
    const bail = setTimeout(done, 1500);

    ajax.getJson('stub.json', {memcache: true})
    .then((first) => {
      return ajax.getJson('stub.json', {memcache: true})
      .then((second) => {
        assert.equal(first.timestamp, second.timestamp, 'memcached second request same as first');
        clearTimeout(bail);
        done();
      })
      .catch((xhr) => {
        console.log(JSON.stringify(xhr, null, 2));
        clearTimeout(bail);
        done();
      });
    });
  });
});

QUnit.test('ajax.getJson not memcached', (assert) => {
  assert.expect(1);

  asyncBrowserOnly(assert, (done) => {
    const bail = setTimeout(done, 1500);

    ajax.getJson('stub.json')
    .then((first) => {

      ajax.getJson('stub.json')
      .then((second) => {
        assert.notEqual(first.timestamp, second.timestamp, 'Non-memcached second request different from first');
        clearTimeout(bail);
        done();
      })
      .catch((xhr) => {
        console.log(JSON.stringify(xhr, null, 2));
        clearTimeout(bail);
        done();
      });
    });
  });
});

QUnit.module('storage', {
  beforeEach: function() {
    this.storage = new Storage(null, 'fm-');
    localStorage.setItem('dummy', 'hello');
    this.storage.set('item', {foo: 'bar', welp: 'yippee', yay: {deep: 'yes', shallow: 'no'}});
    this.storage.set('item2', {bar: 'baz'});
  },
  afterEach: function() {
    localStorage.clear();
  },
});

QUnit.test('storage.get()', function(assert) {
  const item = this.storage.get('item');

  assert.equal(item.foo, 'bar', 'storage item prop was set');
  assert.equal(this.storage.length, 2, 'correctly indicates length of namespaced items');

});
QUnit.test('storage.keys()', function(assert) {
  const items = this.storage.keys();

  assert.equal(items[0], 'item', 'first item key');
  assert.equal(items[1], 'item2', 'second item key');
});

QUnit.test('storage.getAll()', function(assert) {
  const items = this.storage.getAll();

  assert.equal(items.item.foo, 'bar', 'first item prop');
  assert.equal(items.item2.bar, 'baz', 'second item prop');
});

QUnit.test('storage.toArray()', function(assert) {
  const items = this.storage.toArray();

  assert.equal(items[0].key, 'item', 'first item key');
  assert.equal(items[1].key, 'item2', 'second item key');
  assert.equal(items[0].foo, 'bar', 'first item prop');
  assert.equal(items[1].bar, 'baz', 'second item prop');
});

QUnit.test('storage.map()', function(assert) {
  const items = this.storage.map((key, val) => {
    val.keey = key;

    return val;
  });

  assert.equal(items.item.keey, 'item', 'first item key');
  assert.equal(items.item2.keey, 'item2', 'second item key');
});

QUnit.test('storage.filter()', function(assert) {
  const items = this.storage.filter((key, val) => {
    return key === 'item';
  });

  assert.equal(items.item.foo, 'bar', 'first item foo');
  assert.equal(!!items.item2, false, 'second item filtered out');
});

QUnit.test('storage.filterToArray()', function(assert) {
  const items = this.storage.filterToArray((key, val) => {
    return key === 'item';
  });

  assert.equal(items[0].foo, 'bar', 'first item foo');
  assert.equal(items.length, 1, 'second item filtered out');
});

QUnit.test('storage.merge()', function(assert) {
  const options = {
    hello: 'goodbye',
    welp: 'skippy',
    yay: {
      shallow: 'no way',
    },
  };

  const item = this.storage.merge(true, 'item', options);

  assert.equal(item.foo, 'bar', 'foo is bar');
  assert.equal(item.hello, 'goodbye', 'hello is goodbye');
  assert.equal(item.welp, 'skippy', 'welp is skippy');
  assert.equal(item.yay.deep, 'yes', 'yay.deep is still yes');
  assert.equal(item.yay.shallow, 'no way', 'yay.shallow is no way');
});

QUnit.test('storage.remove()', function(assert) {
  this.storage.remove('item2');

  assert.equal(!!this.storage.get('item2'), false, 'item2 removed');
  assert.equal(this.storage.length, 1, 'length updated');
});

QUnit.test('storage.clear()', function(assert) {
  this.storage.clear();

  assert.equal(!!this.storage.get('item'), false, 'item removed');
  assert.equal(this.storage.length, 0, 'all items removed');
  assert.equal(localStorage.getItem('dummy'), 'hello', 'dummy item preserved');
});

QUnit.module('selection');

QUnit.test('set & get text selection', (assert) => {
  let selection, text, partial;
  const el = document.getElementById('selection-container');

  selections.setSelection(el, 0);
  selection = selections.getSelection(el);

  text = selection.text.replace(/^[\s\n]+|[\s\n]+$/g, '');

  selections.setSelection(el, 5, 11);
  partial = selections.getSelection(el);

  assert.equal(text, 'test markup', '"test markup" was selected');
  assert.equal(partial.text.trim(), 'markup', 'partial "markup" was selected');
});

QUnit.test('set & get input selection', (assert) => {
  let selection;
  const el = document.getElementById('select-input');

  selections.setSelection(el);
  selection = selections.getSelection(el);

  assert.equal(selection.text, 'test value', '"test markup" was selected');
});

QUnit.test('set & replace text selection', (assert) => {
  let selection;
  const el = document.getElementById('qunit-fixture');

  selections.setSelection(el);
  selections.replaceSelection(el, 'hello there!');

  selection = selections.getSelection(el);

  assert.equal(selection.text, 'hello there!', 'selection was set and text replaced');
});

QUnit.module('cookie');

QUnit.test('set, get, and remove session cookie', (assert) => {
  assert.expect(5);

  assert.equal(document.cookie.includes('foocook'), false, 'starts with no foocook cookie');
  setCookie('foocook', 'hithere');
  assert.equal(getCookie('foocook'), 'hithere', 'sets empty string and gets it');
  assert.equal(document.cookie.includes('foocook'), true, 'set foocook cookie');
  removeCookie('foocook');
  assert.equal(getCookie('foocook'), undefined, 'removes cookie and gets undefined');
  assert.equal(document.cookie.includes('foocook'), false, 'set foocook cookie');
});

QUnit.test('getCookie matches document.cookie', (assert) => {
  assert.expect(1);
  const hasCookie = !!document.cookie.includes('foocook');
  const getsCookie = !!getCookie('foocook');

  assert.ok(hasCookie === getsCookie, 'getCookie matches');
});

QUnit.test('get and remove cookie', (assert) => {
  assert.expect(8);

  setCookie('foocook', 'yes', {expires: 1});
  assert.equal(getCookie('foocook'), 'yes', 'sets "yes" string and gets it');
  assert.equal(getCookie('foocoo'), undefined, 'partial name does not get cookie');

  setCookie('foocook', '', {expires: 1});
  assert.equal(getCookie('foocook'), '', 'sets empty string and gets it');

  removeCookie('foocook');
  assert.equal(getCookie('foocook'), undefined, 'removes cookie and gets undefined');
  assert.equal(document.cookie.includes('foocook'), false, 'no cookie in document.cookie');

  setCookie('barcook', 'yes', {expires: 2, path: '/test/'});
  assert.equal(getCookie('barcook'), 'yes', 'sets "yes" string and gets it');

  removeCookie('barcook');
  assert.equal(getCookie('barcook'), undefined, 'removes cookie and gets undefined');
  assert.equal(document.cookie.includes('barcook'), false, 'no barcook cookie in document.cookie');
});

QUnit.module('form', {
  beforeEach: function() {
    this.domForm = document.getElementById('dom-form');
    this.checkbox = document.getElementById('checkme');
    this.checkbox.click();

    this.form = document.createElement('form');
    this.form.innerHTML = `
      <input type="text" name="one" value="oneval" />
      <input type="text" name="one-disabled" value="one disable no val" disabled />
      <input type="radio" name="two" value="checked radio" checked />
      <input type="radio" name="two" value="not checked radio" />
      <input type="checkbox" name="three[]" value="checked 1 checkbox" checked />
      <input type="checkbox" name="three[]" value="checked 2 checkbox" checked />
      <input type="checkbox" name="three[]" value="not checked checkbox" />
    `;
  },
  afterEach: function() {
    this.checkbox.click();
    this.form = this.domForm = this.checkbox = null;
  },
});

QUnit.test('valuesToFormData', (assert) => {
  const values = {
    name: 'Karl',
    email: 'karl@example.com',
    list: ['1', '2'],
  };
  const expectedKeys = Object.keys(values);
  const formDataKeys = [];
  const formData = forms.valuesToFormData(values);

  for (let keyVal of formData.entries()) {
    let key = keyVal[0];
    const val = keyVal[1];
    let expectedVal = values[key];

    formDataKeys.push(key);

    assert.ok(expectedKeys.includes(key), `formData key ${key} is in expected keys`);
    assert.equal(val, expectedVal, `value ${val} for key ${key} is correct`);
  }

  expectedKeys.forEach((key) => {
    assert.ok(formDataKeys.includes(key), `expected key ${key} is in formData keys`);
  });
});

QUnit.test('getFormData - formData', function(assert) {
  const formData = forms.getFormData(this.form, 'formData');
  const expected = {
    one: 'oneval',
    two: 'checked radio',
    three: ['checked 1 checkbox', 'checked 2 checkbox'],
  };
  const rBracketed = /^(.+)\[\]$/;
  const expectedKeys = Object.keys(expected);
  const formDataKeys = [];
  let checkIndex = 0;

  for (const keyVal of formData.entries()) {
    let key = keyVal[0];
    const val = keyVal[1];
    let expectedVal = expected[key];
    const bracketKey = rBracketed.exec(key);

    if (bracketKey) {
      key = bracketKey[1];
      expectedVal = expected[key][checkIndex++];
    }

    formDataKeys.push(key);

    assert.ok(expectedKeys.includes(key), `formData key ${key} is in expected keys`);
    assert.equal(val, expectedVal, `value ${val} for key ${key} is correct`);
  }

  expectedKeys.forEach((key) => {
    assert.ok(formDataKeys.includes(key), `expected key ${key} is in formData keys`);
  });
});

QUnit.test('getFormData - string', function(assert) {
  const serial = forms.getFormData(this.form, 'string');
  const serial2 = forms.getFormData.string(this.form);

  const expected = 'one=oneval&two=checked+radio&three%5B%5D=checked+1+checkbox&three%5B%5D=checked+2+checkbox';

  assert.equal(serial, expected, 'getFormData with string arg works');
  assert.equal(serial2, expected, 'getFormData.string works');
});

QUnit.test('getFormData - array', function(assert) {
  const obj = forms.getFormData(this.form, 'array');
  const objProp = forms.getFormData.array(this.form);
  const expected = [
    {
      name: 'one',
      value: 'oneval',
    },
    {
      name: 'two',
      value: 'checked radio',
    },
    {
      name: 'three[]',
      value: 'checked 1 checkbox',
    },
    {
      name: 'three[]',
      value: 'checked 2 checkbox',
    },
  ];

  assert.deepEqual(obj, expected, 'form to object works');
});

QUnit.test('getFormData - object', function(assert) {
  const obj = forms.getFormData(this.form);
  const expected = {
    one: 'oneval',
    two: 'checked radio',
    three: ['checked 1 checkbox', 'checked 2 checkbox'],
  };

  assert.deepEqual(obj, expected, 'form to object works');
});

QUnit.test('getFormData - object, from DOM', function(assert) {
  assert.expect(3);

  const obj = forms.getFormData(this.domForm, 'object');
  const objImplicit = forms.getFormData(this.domForm);
  const objProp = forms.getFormData.object(this.domForm);
  const expected = {
    'select-single': 'bar',
    'radio-input': 'radio checked',
    'checkbox-input': 'programmatic checked',
  };

  assert.deepEqual(obj, expected, 'getFormData with "object" arg works');
  assert.deepEqual(objImplicit, expected, 'getFormData with implicit "object" arg works');
  assert.deepEqual(objProp, expected, 'getFormData.object works');
});
