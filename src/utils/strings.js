/* global window */

import memoize from 'lodash/memoize';

const getCanvasContext = memoize(() => {
  if (!window) {
    return false;
  }

  return window.document.createElement('canvas').getContext('2d');
});

/**
 * Measure rendered string dimentions
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

  const context = canvasContext;

  context.font = font;

  // see https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
  return context.measureText(str);
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

/**
 * Measure rendered height of string
 * @param {String} str -> the string to measure
 * @param {String} font -> https://developer.mozilla.org/en-US/docs/Web/CSS/font
 * @param {CanvasRenderingContext2D} [canvasContext]
 * @return {number}
 */
export const getRenderedStringHeight = (
  str = '',
  font = '10px Helvetica',
  canvasContext = getCanvasContext(),
) => {
  const { height } = getRenderedStringDimensions(str, font, canvasContext);
  return Math.ceil(height);
};

export const sizeOfLongestRotatedString = (
  values,
  rotationAngle = -45,
) => values.reduce((result, label) => {
  const width = Math.floor(getRenderedStringWidth(label)) + 5;
  const height = 10;
  const size = Math.ceil(
    (height * Math.abs(Math.cos(rotationAngle))) + (width * Math.abs(Math.sin(rotationAngle)))
  );
  return size > result ? size : result;
}, 0);
