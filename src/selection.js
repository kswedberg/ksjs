/**
 * @module selection
 * @summary
 * ES6 Import Example:
 * ```js
 * import {getSelection} from 'fmjs';
 *
 * // or:
 * import {getSelection} from 'fmjs/selection.js';
 * ```
 *
 */

// Use these functions for oldIE
const normalizeCharLength = function(slicedChars, allChars) {
  let chr = '';
  let adjust = 0;

  for (let i = 0; i < slicedChars.length; i++) {
    chr = slicedChars[i];

    if (chr === '\r' && allChars[i + 1] === '\n') {
      adjust -= 1;
    }
  }

  return adjust;
};

const ieSetSelection = function ieSetSelection(elem, chars, startPos, endPos) {
  elem.focus();
  let textRange = elem.createTextRange();

  // Fix IE from counting the newline characters as two seperate characters
  let startChars = chars.slice(0, startPos);
  let endChars = chars.slice(startPos, endPos - startPos);
  let chr = '';
  let i = 0;

  for (i = 0; i < startChars.length; i++) {
    chr = startChars[i];

    if (chr === '\r' && chars[i + 1] === '\n') {
      startPos -= 1;
    }
  }
  startPos += normalizeCharLength(startChars, chars);
  endPos += normalizeCharLength(endChars, chars);

  textRange.moveEnd('textedit', -1);
  textRange.moveStart('character', startPos);
  textRange.moveEnd('character', endPos - startPos);
  textRange.select();
};

const ieGetSelection = function ieGetSelection(elem, val) {
  elem.focus();
  let range = document.selection.createRange();
  let textRange = elem.createTextRange();
  let textRangeDupe = textRange.duplicate();

  textRangeDupe.moveToBookmark(range.getBookmark());
  textRange.setEndPoint('EndToStart', textRangeDupe);

  // bail if nothing selected
  if (range == null || textRange == null) {
    return {
      start: val.length,
      end: val.length,
      length: 0,
      text: '',
    };
  }

  // For some reason IE doesn't always count the \n and \r in the length
  let textPart = range.text.replace(/[\r\n]/g, '.');
  let textWhole = val.replace(/[\r\n]/g, '.');
  let textStart = textWhole.indexOf(textPart, textRange.text.length);

  return {
    start: textStart,
    end: textStart + textPart.length,
    length: textPart.length,
    text: range.text,
  };
};


/**
 * Set the selection of an element's contents.
 * NOTE: If startPos and/or endPos are used on a non-input element,
 * only the first text node within the element will be used for selection
 * @function
 * @param {Element} elem The element for which to set the selection
 * @param {number} [startPos = 0] The start position of the selection. Default is 0.
 * @param {number} [endPos] The end position of the selection. Default is the last index of the element's contents.
 */
export const setSelection = function setSelection(elem, startPos, endPos) {
  startPos = startPos || 0;

  let val = elem.value || elem.textContent || elem.innerText;
  let chars = val.split('');
  let selection, range, textNode;

  if (typeof endPos === 'undefined') {
    endPos = chars.length;
  }

  // only for inputs
  if (elem.nodeName === 'INPUT' && typeof elem.selectionStart !== 'undefined') {
    elem.focus();
    elem.selectionStart = startPos;
    elem.selectionEnd = endPos;

    return this;
  }

  if (window.getSelection) {
    selection = window.getSelection();
    range = document.createRange();

    if (startPos === 0 && endPos === chars.length) {
      range.selectNodeContents(elem);
    } else {
      textNode = elem;

      while (textNode && textNode.nodeType !== 3) {
        textNode = textNode.firstChild;
      }
      range.setStart(textNode, startPos);
      range.setEnd(textNode, endPos);
    }

    if (selection.rangeCount) {
      selection.removeAllRanges();
    }

    selection.addRange(range);

    return this;
  }

  // oldIE
  if (typeof elem.createTextRange !== 'undefined') {
    ieSetSelection(elem, chars, startPos, endPos);
  }

  return this;
};

/**
 * Sets the selection of **all** of the element's contents (including all of its children)
 * @function
 * @param {Element} el The element for which to select all content
 * @warning untested
 */
export const setSelectionAll = function setSelectionAll(el) {
  window.getSelection().selectAllChildren(el);

  return el;
};

/**
 * Return an object with the following properties related to the selected text within the element:
 * * `start`: 0-based index of the start of the selection
 * * `end`: 0-based index of the end of the selection
 * * `length`: the length of the selection
 * * `text`: the selected text within the element
 * @function
 * @param {Element} el An element with selected text
 */
export const getSelection = function getSelection(el) {
  let userSelection, length;
  const elem = el || document;
  const val = elem.value || elem.textContent || elem.innerText;

  // Modern browsers

  // Inputs
  if (elem.nodeName === 'INPUT' && typeof elem.selectionStart !== 'undefined') {
    length = elem.selectionEnd - elem.selectionStart;

    return {
      start: elem.selectionStart,
      end: elem.selectionEnd,
      length: elem.selectionEnd - elem.selectionStart,
      text: elem.value.slice(elem.selectionStart, length),
    };
  }

  // Other elements
  if (window.getSelection) {
    userSelection = window.getSelection();

    return {
      start: userSelection.anchorOffset,
      end: userSelection.focusOffset,
      length: userSelection.focusOffset - userSelection.anchorOffset,
      text: userSelection.toString(),
    };
  }

  // oldIE
  if (document.selection) {
    return ieGetSelection(elem, val);
  }

  // Browser not supported
  return {
    start: val.length,
    end: val.length,
    length: 0,
    text: '',
  };

};

/**
 * Replace the selected text in a given element with the provided text
 * @param {Element} elem Element containing the selected text
 * @param {string} replaceString String to replace the selected text
 * @returns {Object} Selection object containing the following properties: `{start, end, length, text}`
 */
export const replaceSelection = function replaceSelection(elem, replaceString) {
  let selection = getSelection(elem);
  let startPos = selection.start;
  let endPos = startPos + replaceString.length;
  let props = ['value', 'textContent', 'innerText'];
  let prop = '';

  for (let i = 0; i < props.length; i++) {
    if (typeof elem[ props[i] ] !== 'undefined') {
      prop = props[i];
      break;
    }
  }

  elem[prop] = elem[prop].slice(0, startPos) + replaceString + elem[prop].slice(selection.end, elem[prop].length);

  setSelection(elem, startPos, endPos);

  return {
    start: startPos,
    end: endPos,
    length: replaceString.length,
    text: replaceString,
  };
};

export const wrapSelection = function wrapSelection(elem, options) {
  let selectedText = getSelection(elem).text;
  let selection =  replaceSelection(elem, options.before + selectedText + options.after);

  if (options.offset !== undefined && options.length !== undefined) {
    selection = setSelection(elem, selection.start + options.offset, selection.start + options.offset + options.length);
  } else if (!selectedText) {
    selection = setSelection(elem, selection.start + options.before.length, selection.start + options.before.length);
  }

  return selection;
};
