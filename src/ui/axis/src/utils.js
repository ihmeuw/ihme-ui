/* global window */

/**
 * Axis utils
 * @module
 */
import {
  map,
  reduce,
} from 'lodash';

import {
  getRenderedStringWidth,
  takeSkipping,
} from '../../../utils';

/**
 * Calculate translate based on axis orientation.
 * @param {string} orientation - Orientation of the axis. One of ['top', 'bottom', 'left', 'right']
 * @param {number} width - Width of axis container.
 * @param {number} height - Height of axis container.
 * @returns {{x: number, y: number}}
 */
export function calcTranslate(orientation, width = 0, height = 0) {
  if (orientation === 'bottom') {
    return {
      x: 0,
      y: height,
    };
  } else if (orientation === 'right') {
    return {
      x: width,
      y: 0,
    };
  }
  return {
    x: 0,
    y: 0,
  };
}

/**
 * Calculate label position and rotation based on orientation.
 * @param {string} orientation - Orientation of the axis. One of ['top', 'bottom', 'left', 'right']
 * @param {{x: number, y: number}} translate - Supplied translate for the axis.
 * @param {{top: number, bottom: number, left: number, right: number}} padding - Supplied padding for the axis.
 * @param {number} center - Calculated center of the axis.
 * @returns {{x: number, y: number, dX: number, dY: number, rotate: number }} Position and rotation of label. Shape: { x, y, dx, dy, rotate }
 */
export function calcLabelPosition(orientation, translate, padding, center) {
  switch (orientation) {
    case 'top':
      return {
        x: translate.x,
        y: translate.y - padding.top,
        dX: center,
        dY: '1em',
      };
    case 'bottom':
      return {
        x: translate.x,
        y: translate.y + padding.bottom,
        dX: center,
        dY: '-0.2em',
      };
    case 'left':
      return {
        x: translate.y,
        y: translate.x - padding.left,
        dX: -center,
        dY: '1em',
        rotate: 270,
      };
    case 'right':
      return {
        x: translate.y,
        y: -(translate.x + padding.right),
        dX: center,
        dY: '1em',
        rotate: 90,
      };
    default:
      return {
        x: translate.x,
        y: translate.y,
        dX: 0,
        dY: 0,
      };
  }
}

export function filterTickValuesByWidth(ticks, {
  tickFontSize,
  tickFontFamily,
  tickFormat,
  width
}) {
  let widestTickLabelLength;

  try {
    /* eslint-disable max-len */
    const canvasContext = window && window.document.createElement('canvas').getContext('2d');
    widestTickLabelLength = reduce(map(ticks, tickFormat), (widest, tick) =>
        Math.max(
          widest,
          getRenderedStringWidth(String(tick), `${tickFontSize}px ${tickFontFamily}`, canvasContext),
        )
      , 0);
    /* eslint-enable max-len */
  } catch (err) {
    widestTickLabelLength = reduce(map(ticks, tickFormat), (widest, tick) =>
        Math.max(widest, String(tick).length * tickFontSize)
      , 0);
  }

  const numTicksThatFit = Math.floor(width / widestTickLabelLength);
  return takeSkipping(ticks, numTicksThatFit);
}

export function filterTickValuesByHeight(ticks, { height, tickFontSize }) {
  const numTicksThatFit = Math.floor(height / tickFontSize);
  return takeSkipping(ticks, numTicksThatFit);
}
