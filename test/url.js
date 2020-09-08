import * as urls from '../src/url.js';

const assert = require('assert');
const safeLocation = location.href !== 'about:blank' ? location : {
  hash: '',
  host: 'localhost:8001',
  hostname: 'localhost',
  href: 'http://localhost:8001/test/index.html',
  origin: 'http://localhost:8001',
  pathname: '/test/index.html',
  port: '8001',
  protocol: 'http:',
  search: '',
};

describe('URL', () => {
  describe('location', () => {

    let loc1 = 'http://www.example.com/path/to/file/?skippy=jif#foooooo';
    let expect1 = {
      href: 'http://www.example.com/path/to/file/?skippy=jif#foooooo',
      protocol: 'http:',
      host: 'www.example.com',
      hostname: 'www.example.com',
      port: '',
      pathname: '/path/to/file/',
      basename: '',
      search: '?skippy=jif',
      hash: '#foooooo',
    };
    let loc2 = '//example.com/path/to/file#foooooo';
    let expect2 = {
      href: 'http://example.com/path/to/file#foooooo',
      protocol: '',
      host: 'example.com',
      hostname: 'example.com',
      port: '',
      pathname: '/path/to/file',
      basename: 'file',
      search: '',
      hash: '#foooooo',
    };

    let loc3 = '/path/to/file';
    let expect3 = {
      href: 'http://localhost:8001/path/to/file',
      protocol: '',
      host: 'localhost:8001',
      hostname: 'localhost',
      port: '8001',
      pathname: '/path/to/file',
      basename: 'file',
      search: '',
      hash: '',
    };
    let loc4 = {};

    ['pathname', 'host', 'hostname', 'protocol', 'port', 'search', 'hash'].forEach((part) => {
      loc4[part] = safeLocation[part];
    });
    let expect4 = {
      pathname: '/test/index.html',
      host: 'localhost:8001',
      hostname: 'localhost',
      basename: 'index.html',
      port: '8001',
      protocol: 'http:',
      search: '',
      hash: '',
    };

    it('1 from full href, no basename', () => {
      assert.deepEqual(urls.loc(loc1), expect1);
    });

    // Commenting because mocha injects about:// when using protocol-relative
    // it('2 from fully href, no hash or search', function() {
    //   assert.deepEqual(urls.loc(loc2), expect2);
    // });

    // if (safeLocation.hostname === 'localhost') {
    //   // Test 3 and 4 only if running from command line (grunt test)
    //   it('3 from pathname only', function() {
    //     assert.deepEqual(urls.loc(loc3), expect3);
    //   });
    //
    //   it('4 location parts for window.location', function() {
    //     assert.deepEqual(urls.loc(loc4), expect4);
    //   });
    // }
  });

  describe('pathname', () => {
    let path1 = safeLocation;
    let path2 = 'http://www.example.com/path/to/file/?skippy=jif#foooooo';
    let path3 = '//www.example.com/path/to/file/yummy.html?skippy=jif#foooooo';
    let path4 = 'https://www.example.com/path/to/file/?skippy=jif#foooooo';

    it('pathname from location', () => {
      assert.equal(urls.pathname(path1), '/test/index.html');
    });

    it('pathname from full href string', () => {
      assert.equal(urls.pathname(path2), '/path/to/file/');
    });

    // it('pathname from protocol-relative href string', function() {
    //   assert.equal(urls.pathname(path3), '/path/to/file/yummy.html');
    // });

    it('pathname from https href string', () => {
      assert.equal(urls.pathname(path4), '/path/to/file/');
    });
  });

  describe('segments', () => {
    let path2 = 'http://www.example.com/path/to/file/?skippy=jif#foooooo';

    it('segments from location.pathname', () => {
      assert.deepEqual(urls.segments(safeLocation), ['test', 'index.html']);
    });
    it('segments from full href string and trailing slash', () => {
      assert.deepEqual(urls.segments(path2), ['path', 'to', 'file']);
    });
  });

  describe('segment', () => {
    let path1 = 'http://www.example.com/path/to/file/?skippy=jif#foooooo';

    it('first segment from location.pathname', () => {
      assert.equal(urls.segment(0, safeLocation), 'test');
    });

    it('2nd segment from location.pathname', () => {
      assert.equal(urls.segment(1, safeLocation), 'index.html');
    });

    it('3rd segment from location.pathname', () => {
      assert.equal(urls.segment(2, safeLocation), '');
    });

    it('last segment from location.pathname', () => {
      assert.equal(urls.segment(-1, safeLocation), 'index.html');
    });

    it('penultimate segment from location.pathname', () => {
      assert.equal(urls.segment(-2, safeLocation), 'test');
    });

    it('non-existent segment from location.pathname', () => {
      assert.equal(urls.segment(-59, safeLocation), '');
    });

    it('2nd segment from full href string and trailing slash', () => {
      assert.equal(urls.segment(1, path1), 'to');
    });

    it('last segment from full href string and trailing slash', () => {
      assert.equal(urls.segment(-1, path1), 'file');
    });
    it('penultimate segment from full href string and trailing slash', () => {
      assert.equal(urls.segment(-2, path1), 'to');
    });
  });

  describe('basename', () => {
    let path1 = safeLocation;
    let path2 = 'http://www.example.com/path/to/file/?skippy=jif#foooooo';
    let path3 = 'http://www.example.com/path/to/file?skippy=jif#foooooo';
    let path4 = '//www.example.com/path/to/file/yummy.html?skippy=jif#foooooo';
    let path5 = 'https://www.example.com/path/to/file/yummy.html?skippy=jif#foooooo';
    let path6 = '/path/to/file.foo.js';

    it('basename from location', () => {
      assert.equal(urls.basename(path1), 'index.html');
    });

    it('basename from full href string', () => {
      assert.equal(urls.basename(path2), '');
    });

    it('basename from full href string, no trailing slash', () => {
      assert.equal(urls.basename(path3), 'file');
    });

    it('basename from protocol-relative href string', () => {
      assert.equal(urls.basename(path4), 'yummy.html');
    });

    it('basename from href string, stripping .html extension', () => {
      assert.equal(urls.basename(path5, '.html'), 'yummy');
    });

    it('basename from pathname string, stripping .js extension but preserving rest of file name with dot', () => {
      assert.equal(urls.basename(path6, '.js'), 'file.foo');
    });
  });

  describe('hashSanitize', () => {
    let hash1 = '#foo.bar';
    let hash2 = '#foo<script>alert("sucka!")</script>';

    it('escaped dot in hash', () => {
      assert.equal(urls.hashSanitize(hash1), '#foo\\.bar');
    });

    it('removed injected script', () => {
      assert.equal(urls.hashSanitize(hash2), '#fooscriptalertsucka!/script');
    });

  });

  describe('unserialize', () => {
    let qs1 = '?foo=bar&yoyo&baz=xyxxy';
    let qs2 = 'foo[]=1&foo[]=2';
    let qs3 = 'foo[bar]=baz&foo[yummy]=food';
    let qs4 = 'foo[bar][]=baz&foo[bar][]=food';
    let qs5 = 'foo=bar,baz';
    let qs6 = 'foo[bar][baz]=qux';
    let qs7 = 'foo[bar][baz]=qux&foo[bar][bing]=bam';

    it('unserialized correctly', () => {
      assert.deepEqual(urls.unserialize(qs1), {foo: 'bar', yoyo: true, baz: 'xyxxy'});
    });

    it('unserialized correctly, with empty option', () => {
      assert.deepEqual(urls.unserialize(qs1, {empty: ''}), {foo: 'bar', yoyo: '', baz: 'xyxxy'});
    });

    it('unserialized correctly, with array param', () => {
      assert.deepEqual(urls.unserialize(qs2), {foo: ['1', '2']});
    });

    it('unserialized correctly, with obj param', () => {
      assert.deepEqual(urls.unserialize(qs3), {foo: {bar: 'baz', yummy: 'food'}});
    });

    it('unserialized correctly, with nested array param', () => {
      assert.deepEqual(urls.unserialize(qs4), {foo: {bar: ['baz', 'food']}});
    });

    it('shallow unserialized correctly', () => {
      assert.deepEqual(urls.unserialize(qs3, {shallow: true}), {'foo[bar]': 'baz', 'foo[yummy]': 'food'});
    });

    it('unserialized correctly, with comma-delimited value', () => {
      assert.deepEqual(urls.unserialize(qs5, {splitValues: true}), {foo: ['bar', 'baz']});
    });

    it('unserialized correctly, with nested object param', () => {
      assert.deepEqual(urls.unserialize(qs6), {foo: {bar: {baz: 'qux'}}});
    });
    it('unserialized correctly, with nested multi object param', () => {
      assert.deepEqual(urls.unserialize(qs7), {foo: {bar: {baz: 'qux', bing: 'bam'}}});
    });
  });

  describe('serialize', () => {
    let obj1 = {
      foo: 'yes',
      bar: 'again',
    };
    let obj2 = {
      foo: ['yes', 'again'],
    };
    let obj3 = {
      foo: {
        bar: ['one', 'two'],
      },
    };
    let obj4 = {
      foo: {
        bar: 'yes I can',
      },
    };
    let obj5 = {
      foo: undefined,
      bar: '',
      baz: 0,
      yum: null,
    };

    let array1 = [
      'oh',
      'won',
      'too',
    ];

    let arrayOpts = {prefix: 'foo'};

    it('serialized string', () => {
      assert.equal(urls.serialize(obj1), 'foo=yes&bar=again');
    });

    it('serialized array', () => {
      assert.equal(urls.serialize(obj2), 'foo[]=yes&foo[]=again');
    });
    it('serialized array, to string', () => {
      assert.equal(urls.serialize(obj2, {arrayToString: true, raw: true}), 'foo=yes,again');
    });

    it('serialized object with nested array', () => {
      assert.equal(urls.serialize(obj3), 'foo[bar][]=one&foo[bar][]=two');
    });

    it('serialized object', () => {
      assert.equal(urls.serialize(obj4), 'foo[bar]=yes+I+can');
    });

    it('serialized object, NOT urlencoded (raw)', () => {
      assert.equal(urls.serialize(obj4, {raw: true}), 'foo[bar]=yes I can');
    });

    it('serialized string with falsy values', () => {
      assert.equal(urls.serialize(obj5), 'foo=&bar=&baz=0&yum=null');
    });

    it('serialized string from array with prefix option', () => {
      assert.equal(urls.serialize(array1, arrayOpts), 'foo[0]=oh&foo[1]=won&foo[2]=too');
    });
  });
});
