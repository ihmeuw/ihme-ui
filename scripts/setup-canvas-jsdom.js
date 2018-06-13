/**
 * Amends mock support in `document.createElement` for canvas elements in js-dom
 * @param {createElement} originalCreateElement - createElement method of jsdom api on `document`.
 * @param {string} tagName - tagName of Element to create
 * @return {Element}
 */
export function createElementMock(originalCreateElement, tagName) {
  const initialElement = originalCreateElement(tagName);

  if (tagName === 'canvas') {
    return {
      ...initialElement,
      getContext: () => ({
        measureText: text => ({ width: text.length }),
      }),
    };
  }

  return initialElement;
}

/**
 * @function createElement
 * @description Intended to be used as the jsdom emulation of `document.createElement`, which is an
 * [HTML document method that creates the HTML element specified by tagName.](https://developer.mozilla.org/en-US/docs/Web/API/Element)
 * @param {string} tagName - specifies the type of element to be created
 * @returns {Element}
 */
