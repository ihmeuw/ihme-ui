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
