/* global window */

import memoize from 'lodash/memoize';

/** Due to difficulties in measuring font height, canvasContext.measureText() does not
 * return a height value. By comparing various rendered SVG text element heights with
 * their specified font-size, 1.15 is a reasonable scaling factor to
 * approximate text height.
 * https://videlais.com/2014/03/16/the-many-and-varied-problems-with-measuring-font-height-for-html5-canvas/
*/
export const FONT_HEIGHT_SCALING_FACTOR = 1.15;

const getCanvasContext = memoize(() => {
  if (!window) {
    return false;
  }

  return window.document.createElement('canvas').getContext('2d');
});

/**
 * Measure rendered string dimensions
 * @param {String} str -> the string to measure
 * @param {String} font -> https://developer.mozilla.org/en-US/docs/Web/CSS/font
 * @param {CanvasRenderingContext2D} [canvasContext]
 * @return {object}
 */
export const getRenderedStringDimensions = (
  str = '',
  font = '10px Helvetica',
  canvasContext = getCanvasContext(),
) => {
  if (!canvasContext && !window) {
    return 0;
  }

  // eslint-disable-next-line no-param-reassign
  canvasContext.font = font;

  // see https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
  return canvasContext.measureText(str);
};

/**
 * Measure rendered width of string
 * @param {String} str -> the string to measure
 * @param {String} font -> https://developer.mozilla.org/en-US/docs/Web/CSS/font
 * @param {CanvasRenderingContext2D} [canvasContext]
 * @return {number}
 */
export const getRenderedStringWidth = (
  str = '',
  font = '10px Helvetica',
  canvasContext = getCanvasContext(),
) => {
  const { width } = getRenderedStringDimensions(str, font, canvasContext);
  return Math.ceil(width);
};

export const sizeOfLongestRotatedString = (
  values,
  height, // tickLabelHeight
  rotationAngle = -45,
) => values.reduce((result, label) => {
  const width = Math.floor(getRenderedStringWidth(label));
  const scaledHeight = height * FONT_HEIGHT_SCALING_FACTOR;
  const size = Math.ceil(
    (scaledHeight * Math.abs(Math.cos(rotationAngle))) + (width * Math.abs(Math.sin(rotationAngle)))
  );
  return size > result ? size : result;
}, 0);

export function camelToKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}
