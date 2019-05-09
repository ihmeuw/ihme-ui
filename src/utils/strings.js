/* global window */

/**
 * Measure rendered width of string
 * @param {String} str -> the string to measure
 * @param {String} font -> https://developer.mozilla.org/en-US/docs/Web/CSS/font
 * @param {CanvasRenderingContext2D} [canvasContext]
 * @return {number}
 */
export const getRenderedStringWidth = (str = '', font = '12px Verdana', canvasContext) => {
  if (!canvasContext && !window) {
    return 0;
  }

  const context = canvasContext || window.document.createElement('canvas').getContext('2d');

  context.font = font;

  // see https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
  const metrics = context.measureText(str);
  return Math.ceil(metrics.width);
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

