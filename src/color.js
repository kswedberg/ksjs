/**
* @module color
* @summary
* ES6 Import Example
* ```js
* import {rgb2Hex} from 'fmjs'
*
* // or:
* import {rgb2Hex} from 'fmjs/color.js'
* ```
*
* CJS Require Example
* ```js
* const {rgb2Hex} = require('fmjs/cjs/color.js');
* ```
*/

const getLongHex = (hex) => {
  const parts = hex.split('');

  if (parts.length > 4) {
    return parts.slice(0, 6).join('');
  }

  return parts.slice(0, 3).map((part) => `${part}${part}`).join('');
};

const normalizeHex = (hex) => {
  const rawColor = `${hex}`.replace(/^#/, '');
  const len = rawColor.length;
  const color = getLongHex(rawColor);


  if (len % 3 === 0) {
    return {
      color,
      alpha: 1,
    };
  }

  // Handle hex with alpha
  if (len % 4 === 0) {
    const parts = rawColor.split('');
    const alpha = len === 4 ? [...parts.slice(-1), ...parts.slice(-1)] : parts.slice(-2);

    return {
      color,
      // First convert from hex number to 0-255, then get 0-1:
      alpha: parseInt(alpha.join(''), 16) / 255,
    };
  }

  throw new Error(`Broken color: ${rawColor}`);
};

const hex2RgbArray = (hex) => {
  const {color, alpha}  = normalizeHex(hex);
  const colorParts = color.split('');
  const rgb = ['r', 'g', 'b'].map((_, i) => {
    return parseInt(colorParts.slice(i * 2, i * 2 + 2).join(''), 16);
  });

  if (alpha !== 1) {
    rgb.push(alpha);
  }

  return rgb;
};


/**
* Convert a hex value to an rgb or rgba value
* @param {string} hex Hex color code in shorthand format (e.g. #333, #333a) or longhand (e.g. #333333, #333333aa)
* @param {number} [alpha] Optional number from 0 to 1 to be used with 3- or 6-character hex format
*/
export const hex2Rgb = (hex, alpha) => {
  const rgb = hex2RgbArray(hex);

  if (typeof alpha !== 'undefined') {
    rgb.push(alpha);
  }

  const name = rgb.length === 4 ? 'rgba' : 'rgb';

  return `${name}(${rgb.join(', ')})`;
};

const rgbString2Array = (str) => {
  if (typeof str !== 'string') {
    return str;
  }

  const color = str.trim().replace(/^rgba?\(([^)]+)\)/, '$1');

  return color.split(/\s*,\s*/)
  .map((c) => parseFloat(c) || 0);
};

/**
* Convert an rgb value to a 6-digit hex value. If an *rgba* value is passed, the opacity is ignored
* @function rgb2Hex
* @param {string|array} rgb either an rgb string such as `'rgb(255, 120, 10)'` or an rgb array such as `[255, 120, 10]`
* @returns {string} Hex value (e.g. `#ff780a`)
* @example
* rgb2Hex('rgb(255, 136, 0)')
* // => '#ff8800'
*
* rgb2Hex([255, 136, 0])
* // => '#ff8800'
*
* rgb2Hex('rgba(255, 136, 0, .8)')
* // => '#ff8800'
*/
export const rgb2Hex = (rgb) => {
  const colorParts = typeof rgb === 'string' ? rgbString2Array(rgb) : rgb;
  const hex = colorParts.slice(0, 3).map((item) => {
    return item < 16 ? `0${item.toString(16)}` : item.toString(16);
  });

  return `#${hex.join('')}`;
};

/**
* Convert an rgba value to an 8-digit hex value, or an rgb value to a 6-digit hex value
* @function rgba2Hex
* @param {string|array} rgba either an rgba string such as `'rgba(255, 120, 10, .5)'` or an rgba array such as `[255, 120, 10, .5]`
* @returns {string} Hex value (e.g. `#ff780a80`)
* @example
* rgba2Hex('rgba(255, 136, 0, .8)')
* // => '#ff8800cc'
*
* rgba2Hex([255, 136, 0, .8])
* // => '#ff8800cc'
*
* rgba2Hex('rgb(255, 136, 0)')
* // => '#ff8800'
*/
export const rgba2Hex = (rgba) => {
  const colorParts = typeof rgba === 'string' ? rgbString2Array(rgba) : rgba;
  const hex = colorParts.map((part, i) => {
    const item = i === 3 ? Math.round(part * 255) : part;

    return item < 16 ? `0${item.toString(16)}` : item.toString(16);
  });

  return `#${hex.join('')}`;
};

/**
* Convert an RGB color to a luminance value. You probably don't want to use this on its own
* @function rgb2Luminance
* @param {string|array} rgb RGB value represented as a string (e.g. `rgb(200, 100, 78)`) or an array (e.g. `[200, 100, 78]`)
* @see [getContrastColor()]{@link #module_color..getContrastColor}
* @see [StackOverflow]{@link https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors} for more information
* @returns {number} The luminance value
*/
export const rgb2Luminance = (rgb) => {
  const colors = typeof rgb === 'string' ? rgbString2Array(rgb) : rgb;
  const lumParts = colors.map((color) => {
    const col = color / 255;

    if (col <= 0.03928) {
      return col / 12.92;
    }

    return ((col + 0.055) / 1.055) ** 2.4;
  });

  return [0.2126, 0.7152, 0.0722].reduce((sum, curr, i) => {
    return sum + (curr * lumParts[i]);
  }, 0);
};

/**
* Return darkColor if bgColor is light and lightColor if bgColor is dark. "Light" and "dark" are determined by the [rgb2Luminance]{@link #module_color..rgb2Luminance} algorithm
* @function getContrastColor
* @param {string} bgColor hex code (e.g. #daf or #3d31c2) of the color to contrast
* @param {string} [darkColor = '#000'] The dark color to return if `bgColor` is considered light
* @param {string} [lightColor = '#fff'] The light color to return if `bgColor` is considered dark
* @returns {string} Contrasting color
* @warning untested
*/
export const getContrastColor = (bgColor, darkColor = '#000', lightColor = '#fff') => {
  const rgb = hex2RgbArray(bgColor);
  const luminance = rgb2Luminance(rgb);

  return luminance > 0.179 ? darkColor : lightColor;
};


export const simpleContrast = (bgColor, darkColor = '#000', lightColor = '#fff') => {
  const rgb = hex2RgbArray(bgColor);
  const simpleLuminance = [0.299, 0.587, 0.114].reduce((sum, curr, i) => {
    return sum + (curr * rgb[i]);
  }, 0);

  return simpleLuminance > 186 ? darkColor : lightColor;
};
