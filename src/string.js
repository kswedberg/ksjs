/**
 * @module string
 * @summary ES6 Import Example:
 * ```js
 * import {slugify} from '@bamf-health/bamfjs';
 *
 * // or:
 * import {slugify} from '@bamf-health/bamfjs/string.js';
 * ```
 *
 * CommonJS Require Example:
 * ```js
 * const {slugify} = require('@bamf-health/bamfjs/cjs/string.js');
 * ```
 *
 */

const rTrim = /^\s+|\s$/g;

// charMap courtesy of https://github.com/simov/slugify/blob/master/slugify.js
const charMaps = {
  // alpha
  alpha: {
    À: 'A', Á: 'A', Â: 'A', Ã: 'A', Ä: 'A', Å: 'A', Æ: 'AE', Ç: 'C', È: 'E', É: 'E', Ê: 'E', Ë: 'E', Ì: 'I', Í: 'I', Î: 'I', Ï: 'I', Ð: 'D', Ñ: 'N', Ò: 'O', Ó: 'O', Ô: 'O', Õ: 'O', Ö: 'O', Ø: 'O', Ù: 'U', Ú: 'U', Û: 'U', Ü: 'U', Ý: 'Y', Þ: 'TH', ß: 'ss',
    à: 'a', á: 'a', â: 'a', ã: 'a', ä: 'a', å: 'a', æ: 'ae', ç: 'c', è: 'e', é: 'e', ê: 'e', ë: 'e', ì: 'i', í: 'i', î: 'i', ï: 'i', ð: 'd', ñ: 'n', ò: 'o', ó: 'o', ô: 'o', õ: 'o', ö: 'o', ø: 'o', ù: 'u', ú: 'u', û: 'u', ü: 'u', ý: 'y', þ: 'th', ÿ: 'y',
    Ā: 'A', ā: 'a', Ă: 'A', ă: 'a', Ą: 'A', ą: 'a', Ć: 'C', ć: 'c', Č: 'C', č: 'c', Ď: 'D', ď: 'd', Đ: 'DJ', đ: 'dj', Ē: 'E', ē: 'e', Ė: 'E', ė: 'e', Ę: 'e', ę: 'e', Ě: 'E', ě: 'e', Ğ: 'G', ğ: 'g', Ģ: 'G', ģ: 'g', Ĩ: 'I', ĩ: 'i', Ī: 'i', ī: 'i', Į: 'I', į: 'i', İ: 'I', ı: 'i', Ķ: 'k', ķ: 'k', Ļ: 'L', ļ: 'l', Ľ: 'L', ľ: 'l', Ł: 'L', ł: 'l', Ń: 'N', ń: 'n', Ņ: 'N', ņ: 'n', Ň: 'N', ň: 'n', Ő: 'O', ő: 'o', Œ: 'OE', œ: 'oe', Ŕ: 'R', ŕ: 'r', Ř: 'R', ř: 'r', Ś: 'S', ś: 's', Ş: 'S', ş: 's', Š: 'S', š: 's', Ţ: 'T', ţ: 't', Ť: 'T', ť: 't', Ũ: 'U', ũ: 'u', Ū: 'u', ū: 'u', Ů: 'U', ů: 'u', Ű: 'U', ű: 'u', Ų: 'U', ų: 'u', Ŵ: 'W', ŵ: 'w', Ŷ: 'Y', ŷ: 'y', Ÿ: 'Y', Ź: 'Z', ź: 'z', Ż: 'Z', ż: 'z', Ž: 'Z', ž: 'z', ƒ: 'f', Ơ: 'O', ơ: 'o', Ư: 'U', ư: 'u', ǈ: 'LJ', ǉ: 'lj', ǋ: 'NJ', ǌ: 'nj', Ș: 'S', ș: 's', Ț: 'T', ț: 't', '˚': 'o',
    Ά: 'A', Έ: 'E', Ή: 'H', Ί: 'I', Ό: 'O', Ύ: 'Y', Ώ: 'W', ΐ: 'i',
    Α: 'A', Β: 'B', Γ: 'G', Δ: 'D', Ε: 'E', Ζ: 'Z', Η: 'H', Θ: '8', Ι: 'I', Κ: 'K', Λ: 'L', Μ: 'M', Ν: 'N', Ξ: '3', Ο: 'O', Π: 'P', Ρ: 'R', Σ: 'S', Τ: 'T', Υ: 'Y', Φ: 'F', Χ: 'X', Ψ: 'PS', Ω: 'W', Ϊ: 'I', Ϋ: 'Y',
    ά: 'a', έ: 'e', ή: 'h', ί: 'i', ΰ: 'y', α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'h', θ: '8', ι: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: '3', ο: 'o', π: 'p', ρ: 'r', ς: 's', σ: 's', τ: 't', υ: 'y', φ: 'f', χ: 'x', ψ: 'ps', ω: 'w', ϊ: 'i', ϋ: 'y', ό: 'o', ύ: 'y', ώ: 'w', Ё: 'Yo', Ђ: 'DJ', Є: 'Ye', І: 'I', Ї: 'Yi', Ј: 'J', Љ: 'LJ', Њ: 'NJ', Ћ: 'C', Џ: 'DZ',
    А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ж: 'Zh', З: 'Z', И: 'I', Й: 'J', К: 'K', Л: 'L', М: 'M', Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F', Х: 'H', Ц: 'C', Ч: 'Ch', Ш: 'Sh', Щ: 'Sh', Ъ: 'U', Ы: 'Y', Ь: '', Э: 'E', Ю: 'Yu', Я: 'Ya',
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sh', ъ: 'u', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya', ё: 'yo', ђ: 'dj', є: 'ye', і: 'i', ї: 'yi', ј: 'j', љ: 'lj', њ: 'nj', ћ: 'c', ѝ: 'u', џ: 'dz', Ґ: 'G', ґ: 'g', Ғ: 'GH', ғ: 'gh', Қ: 'KH', қ: 'kh', Ң: 'NG', ң: 'ng', Ү: 'UE', ү: 'ue', Ұ: 'U', ұ: 'u', Һ: 'H', һ: 'h',
    Ә: 'AE', ә: 'ae', Ө: 'OE', ө: 'oe', '฿': 'baht', ა: 'a', ბ: 'b', გ: 'g', დ: 'd', ე: 'e', ვ: 'v', ზ: 'z', თ: 't', ი: 'i', კ: 'k', ლ: 'l', მ: 'm', ნ: 'n', ო: 'o', პ: 'p', ჟ: 'zh', რ: 'r', ს: 's', ტ: 't', უ: 'u', ფ: 'f', ქ: 'k', ღ: 'gh', ყ: 'q', შ: 'sh', ჩ: 'ch', ც: 'ts', ძ: 'dz', წ: 'ts', ჭ: 'ch', ხ: 'kh', ჯ: 'j', ჰ: 'h', Ẁ: 'W', ẁ: 'w', Ẃ: 'W', ẃ: 'w', Ẅ: 'W', ẅ: 'w', // ẞ: 'SS',
    Ạ: 'A', ạ: 'a', Ả: 'A', ả: 'a', Ấ: 'A', ấ: 'a', Ầ: 'A', ầ: 'a', Ẩ: 'A', ẩ: 'a', Ẫ: 'A', ẫ: 'a', Ậ: 'A', ậ: 'a', Ắ: 'A', ắ: 'a', Ằ: 'A', ằ: 'a', Ẳ: 'A', ẳ: 'a', Ẵ: 'A', ẵ: 'a', Ặ: 'A', ặ: 'a', Ẹ: 'E', ẹ: 'e', Ẻ: 'E', ẻ: 'e', Ẽ: 'E', ẽ: 'e', Ế: 'E', ế: 'e', Ề: 'E', ề: 'e', Ể: 'E', ể: 'e', Ễ: 'E', ễ: 'e', Ệ: 'E', ệ: 'e', Ỉ: 'I', ỉ: 'i', Ị: 'I', ị: 'i', Ọ: 'O', ọ: 'o', Ỏ: 'O', ỏ: 'o', Ố: 'O', ố: 'o', Ồ: 'O', ồ: 'o', Ổ: 'O', ổ: 'o', Ỗ: 'O', ỗ: 'o', Ộ: 'O', ộ: 'o', Ớ: 'O', ớ: 'o', Ờ: 'O', ờ: 'o', Ở: 'O', ở: 'o', Ỡ: 'O', ỡ: 'o', Ợ: 'O', ợ: 'o', Ụ: 'U', ụ: 'u', Ủ: 'U', ủ: 'u', Ứ: 'U', ứ: 'u', Ừ: 'U', ừ: 'u', Ử: 'U', ử: 'u', Ữ: 'U', ữ: 'u', Ự: 'U', ự: 'u', Ỳ: 'Y', ỳ: 'y', Ỵ: 'Y', ỵ: 'y', Ỷ: 'Y', ỷ: 'y', Ỹ: 'Y', ỹ: 'y',
  },
  // currencies
  currency: {
    $: 'dollar', '¢': 'cent', '£': 'pound', '¤': 'currency', '¥': 'yen', '₣': 'french franc', '₤': 'lira', '₥': 'mill', '₦': 'naira', '₧': 'peseta', '₨': 'rupee', '₩': 'won', '₪': 'new shequel', '₫': 'dong', '€': 'euro', '₭': 'kip', '₮': 'tugrik', '₯': 'drachma', '₰': 'penny', '₱': 'peso', '₲': 'guarani', '₳': 'austral', '₴': 'hryvnia', '₵': 'cedi', '₸': 'kazakhstani tenge', '₹': 'indian rupee', '₽': 'russian ruble', '₿': 'bitcoin', 元: 'yuan', 円: 'yen', '﷼': 'rial',
  },
  // other
  misc: {
    '℠': 'sm', '™': 'tm', '∂': 'd', '∆': 'delta', '∑': 'sum', '∞': 'infinity', '♥': 'love', '‘': '\'', '’': '\'', '“': '\\"', '”': '\\"', '†': '+', '•': '*', '…': '...', '%': 'percent', '&': 'and', '©': '(c)', ª: 'a', '®': '(r)', º: 'o',
  },
};

charMaps.all = Object.assign({}, charMaps.alpha, charMaps.currency, charMaps.misc);

const normalize = (chars, map) => {
  const charMap = charMaps[map || 'all'];

  return (chars || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').split('')
  .reduce((str, char) => {
    return str + (charMap[char] || char);
  }, '');
};

const stringToImplicit = function(value, options) {
  const str = value.toString();
  const lc = str.toLowerCase();

  // Number (Can go first, because 1/0 are truthy/falsey)
  if (!isNaN(value)) {
    return Number(value);
  }

  // Boolean: true
  if (options.trueValues.includes(lc)) {
    return true;
  }

  // Boolean: false
  if (options.falseValues.includes(lc)) {
    return false;
  }

  // Array
  if (options.splitPattern.test(str)) {
    return str.split(options.splitPattern);
  }

  // Object
  if (typeof value === 'string' && /^(?:\{|\[\s)+"/.test(str)) {
    try {
      const val = JSON.parse(value);

      return val;
    } catch (err) {
      return value;
    }
  }

  // No change
  return value;
};


/**
 * @function parseStringTemplate
 * @param {string} str String with tokens ( `${example}` ) to parse
 * @param {object} obj Object of properties with values to be used when replacing tokens
 * @returns {string} String with tokens replaced with values
 * @see https://stackoverflow.com/a/59084440
 */
export const parseStringTemplate = (str, obj) => {
  const rText = /\$\{(?!\d)[\w\p{L}]*\}/u;
  const rVars = /[^}{]+(?=})/g;

  const textParts = str.split(rText);
  const args = str.match(rVars) || [];
  const params = args.map((item) => obj[item] || (obj[item] === undefined ? '' : obj[item]));

  return String.raw({raw: textParts}, ...params);
};

/**
 * Casts a value to the specified `type` or to best guess at a type if none given
 * @function stringTo
 * @param {string} value Value to cast
 * @param {function} [type] (Boolean|Number|Array)
 * @param {object} [options]
 * @returns {Boolean|Number|Array}
 */
export const stringTo = function(value, type, options = {}) {
  const opts = Object.assign({
    falseValues: ['false', '0', 'no', 'off', 'null', 'undefined'],
    trueValues: ['true', '1', 'yes', 'on'],
    splitPattern: /\s*[,|]\s*/,
  }, options);

  if (!type) {
    return stringToImplicit(value, opts);
  }

  const str = value.toString();
  const lc = str.toLowerCase();

  // Boolean
  if (type === Boolean) {
    return opts.trueValues.includes(lc);
  }

  // Number
  // @ts-ignore
  if (!isNaN(value)) {
    return Number(value);
  }

  // Array
  if (type === Array) {
    return value.split(opts.splitPattern);
  }
};


/**
 * Converts a singular word to a plural
 * @function
 * @param {string} str Word to pluralize
 * @param {number} num Number of items
 * @param {string} [ending = s] Optional ending of the pluralized word
 * @returns {string} Pluralized string
 */
export const pluralize = function pluralize(str, num, ending) {
  num = num * 1;

  if (ending === undefined) {
    ending = 's';
  }

  if (num !== 1) {
    str += ending;
  }

  return str;
};

const capWord = (word) => {
  const keepLower = ['and', 'or', 'a', 'an', 'the', 'her', 'his', 'its', 'our', 'your', 'their', 'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around', 'at', 'before', 'behind', 'between', 'beyond', 'but', 'by', 'concerning', 'despite', 'down', 'during', 'except', 'following', 'for', 'from', 'in', 'including', 'into', 'like', 'near', 'of', 'off', 'on', 'out', 'over', 'since', 'through', 'throughout', 'to', 'toward', 'towards', 'under', 'until', 'up', 'upon', 'with', 'within', 'without'];
  const rBaseWord = /^([a-zA-Z]+).*$/;
  const baseWord = word.replace(rBaseWord, '$1');

  if (keepLower.includes(baseWord)) {
    return word;
  }

  return word.slice(0, 1).toUpperCase() + word.slice(1);
};

const caseChanges = {
  sentence: (str, options) => {
    if (!str) {
      return '';
    }
    let sentence = options.unslugify ? str.replace(/[_-]+/g, ' ') : str;

    // Trim string and normalize spaces
    sentence = sentence.replace(rTrim, '').replace(/\s\s+/g, ' ');

    return sentence.slice(0, 1).toUpperCase() + sentence.slice(1);
  },

  title: (str, options) => {
    // Start with sentence case
    const words = caseChanges.sentence(str, options).split(/\s+/);

    // Preserve first word: it's always capitalized, even if it's a preposition or article, etc.
    const firstWord = words.shift();
    const moreWords = words.map(capWord);

    return [firstWord, ...moreWords].join(' ');
  },

  caps: (str) => {
    return (str || '').toUpperCase();
  },

  camel: (str) => {
    if (!str) {
      return '';
    }

    // Start by removing/replacing diacritics, ligatures etc
    return normalize(str)
    // Lowercase the whole thing
    .toLowerCase()
    // Split on anything Not alphanumeric
    .split(/[^a-z0-9]+/)
    // Make all but first one initial cap
    .map((item, i) => {
      return i ? item.slice(0, 1).toUpperCase() + item.slice(1) : item;
    })
    // Reassemble
    .join('');
  },

  pascal: (str) => {
    const camel = caseChanges.camel(str);

    return `${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
  },

  slug: (str) => {
    if (!str) {
      return '';
    }

    return normalize(str)
    .toLowerCase()
    .replace(/['"`)(\]]/g, '')
    // replace non-alphanumeric with dash
    .replace(/[^a-z0-9]+/g, '-')
    // replace repeating dashes with a single dash
    .replace(/--+/g, '-')
    // remove leading and trailing dashes
    .replace(/^-|-$/g, '') || str;
  },
  snake: (str) => {
    if (!str) {
      return '';
    }

    return normalize(str)
    .toLowerCase()
    .replace(/['"`)(\]]/g, '')
    // replace non-alphanumeric with underscore
    .replace(/[^a-z0-9]+/g, '_')
    // replace repeating dashes with a single underscore
    .replace(/--+/g, '_')
    // remove leading and trailing underscores
    .replace(/^_|_$/g, '') || str;
  },
  camelToSnake: (str) => {
    return str
    .trim()
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
  },
};

/**
 * Changes the case of the provided words according to the `type`.
 * @function
 * @param {string} str String that will be cased as determined by `type`
 * @param {string} type One of 'title|sentence|caps|camel|pascal|slug|snake'
 * @param {object} [options] Optional options object. Its use depends on the type of case change
 * @returns {string} Converted string
 * @example
 * const oldMan = 'the old man and the sea';
 *
 *console.log(changeCase(oldMan, 'title'));
 * // Logs: 'The Old Man and the Sea'
 *
 * console.log(changeCase(oldMan, 'sentence'));
 * // Logs: 'The old man and the sea'
 *
 * console.log(changeCase('the-old-man-and-the-sea', 'sentence', {unslugify: true}));
 * // Logs: 'The old man and the sea'
 *
 * console.log(changeCase(oldMan, 'camel'));
 * // Logs: 'theOldManAndTheSea'
 */
export const changeCase = (str, type, options) => {
  if (!caseChanges[type]) {
    return str;
  }

  return caseChanges[type](str, options || {});
};

/**
 * Slugify a string by lowercasing it and replacing white spaces and non-alphanumerics with dashes.
 * @function
 * @param {string} str String to be converted to a slug
 * @returns {string} "Slugified" string
 * @example
 * console.log(slugify('Hello there, how are you?'));
 * // Logs: 'hello-there-how-are-you'
 *
 * console.log(slugify('  You? & Me<3* '));
 * // Logs: 'you-me-3'
 */
export const slugify = function slugify(str) {
  return caseChanges.slug(str);
};

/**
 * @function
 * @param {str} string The string to be truncated
 * @param {object} options Options object.
 * @param {int} [options.start] The number of characters to keep at the start of the string. If falsy, no truncation will occur at the start.
 * @param {int} [options.end] The number of characters to keep at the end of the string. If falsy, no truncation will occur at the end.
 * @param {string} [options.separator = '...'] The separator to use when truncating the string. Defaults to '...'
 * @returns {string} The truncated string, or the full string if it's shorter than the total amount to truncate
 * @example
 * const str = 'Collaboratively administrate empowered markets';
 *
 * console.log(truncate(str, {start: 10}));
 * // Logs: 'Collaborat...'
 *
* console.log(truncate(str, {start: 10, separator: ''}));
 * // Logs: 'Collaborat'
 *
 * console.log(truncate(str, {end: 10}));
 * // Logs: '...ed markets'
 *
 * console.log(truncate(str, {start: 10, end: 10}));
 * // Logs: 'Collaborat...ed markets'
 *
 * console.log(truncate(str, {start: 50, end: 50}));
 * // Logs: 'Collaboratively administrate empowered markets'
 */
export const truncate = function truncate(str, options = {}) {
  const {start, end, separator = '...'} = options;

  if (typeof str !== 'string' || (!start && !end)) {
    return str;
  }
  const len = str.length;

  if (!end) {
    return len <= start ? str : str.slice(0, start) + separator;
  }
  if (!start) {
    return len <= end ? str : separator + str.slice(-end);
  }

  // both start and end
  return len <= start + end ? str : str.slice(0, start) + separator + str.slice(-end);
};

/**
 * ROT13 encode/decode a string
 * @function
 * @param {string} string String to be converted to or from ROT13
 * @returns {string} The encoded (or decoded) string
 */
export const rot13 = function rot13(string) {
  const str = string.replace(/[a-zA-Z]/g, (c) => {
    let cplus = c.charCodeAt(0) + 13;

    return String.fromCharCode((c <= 'Z' ? 90 : 122) >= cplus ? cplus : cplus - 26);
  });

  return str;
};

/**
 * Convert a string to Java-like numeric hash code
 * @function
 * @param {string} str String to be converted
 * @param {string} [prefix] Optional prefix to the hash
 * @returns {number|string} The converted hash code as numeral (or string, if prefix is provided)
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
export const hashCode = function hashCode(str, prefix) {
  let hash = 0;
  let chr;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    // Convert to 32bit integer
    hash |= 0;
  }

  hash = hash >= 0 ? hash : hash * -1;

  if (prefix) {
    return prefix + hash;
  }

  return hash;
};

/**
 * Return a base64-encoded string based on the provided string.
 * If the browser does not support this type of encoding, returns the string unchanged.
 * @function
 * @param {string} str String to be base4 encoded
 * @returns {string} base64-encoded string
 */
export const base64Encode = function base64Encode(str) {
  if (typeof btoa === 'undefined') {
    return str;
  }

  return btoa(encodeURIComponent(str));
};

/**
* Return a decoded string based on the provided base64-encoded string.
* If the browser does not support this type of encoding, returns the string unchanged.
* @function
* @param {string} str base4-encoded string
* @returns {string} decoded string
*/
export const base64Decode = function base64Decode(str) {
  if (typeof atob === 'undefined') {
    return str;
  }

  return decodeURIComponent(atob(str));
};

/**
 * Return a pseudo-random string consisting of two base-36 strings, separated by the optional provided `sep` argument.
* The first number is derived from a random 11-digit number
* The second number is derived from the current date, including milliseconds
* The string can begin with an optional `prefix`
 * @function
 * @param {string} [sep = .] Optional separator for the two base-36 strings, Default is "."
 * @param {string} [prefix = ''] Optional prefix for the string
 * @returns {string}
 */
export const randomString = function(sep, prefix) {
  const pow = 10 ** 10;
  const separator = sep == null ? '.' : sep;
  const randoNum = Math.round(Math.random() * pow);
  const date36 = (+new Date()).toString(36);

  const parts = [randoNum.toString(36), date36];

  if (prefix) {
    parts.unshift(prefix);
  }

  return parts.join(separator);
};

/**
 * Strip tags from a string
 * @function stripTags
 * @param {string} str String to be stripped of tags
 * @returns {string} Stripped string
 * @example
 * console.log(stripTags('<p>Hello</p>'));
 * // Logs: 'Hello'
 *
 * console.log(stripTags('<p>Hello</p><p>World</p>'));
 * // Logs: 'HelloWorld'
 *
 */
export const stripTags = function stripTags(str) {
  return str.replace(/<\/?[a-z0-9]+\b[^>]*>/g, '');
};
