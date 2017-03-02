/**
 * Measures rendered width of string
 * caches a canvas 2d context for reuse
 * note that this function cannot be tested with jsdom without canvas/cairo
 * because of additional complexity of installing/managing Cairo across environments,
 * this function is without unit tests
 * @returns {Function} function(<String>, <String>, <CanvasRenderingContext2D>) {...}
 */
const getStringWidth = (() => {
  let context;

  /**
   * @param {String} str -> the string to measure
   * @param {String} font -> https://developer.mozilla.org/en-US/docs/Web/CSS/font
   * @param {CanvasRenderingContext2D} canvasContext
   * @return {Number}
   */
  return function stringWidth(str = '', font = '12px Verdana', canvasContext = null) {
    // if a canvas context is not passed in and one isn't cached, create one
    if (!canvasContext || !context) {
      // if not in a browser or browser like environment,
      // return arbitrary number
      if (!window) return 20;

      // otherwise, create canvas element, get its 2d context and cache it
      context = window.document.createElement('canvas').getContext('2d');
    }

    // if a canvas context was passed in, cache it
    if (canvasContext) context = canvasContext;

    context.font = font;

    // see https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
    const metrics = context.measureText(str);
    return Math.ceil(metrics.width);
  };
})();

export default getStringWidth;
