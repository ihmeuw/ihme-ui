/* global window */

/**
 * Axis utils
 * @module
 */
import {
  find,
  get,
  isEmpty,
  map,
  mapValues,
  mergeWith,
  reduce,
  set
} from 'lodash';

import {
  takeSkipping
} from './array';

import {
  getRenderedStringWidth,
  sizeOfLongestRotatedString,
} from './strings';

export const DEFAULT_AXIS_PROPERTIES = {
  axisLabelFontSize: 11,
  height: 100,
  tickHeight: 10,
  tickLabelFontFamily: 'Helvetica',
  tickLabelFontSize: 10,
  tickLabelFormat: null,
  width: 230,
};

export const AXIS_ORIENTATION_OPTIONS = ['top', 'right', 'bottom', 'left'];

const ADDITIONAL_LABEL_PADDING = '10px';

/**
 * Calculate translate based on axis orientation.
 * @param {string} orientation - Orientation of the axis. One of ['top', 'bottom', 'left', 'right']
 * @param {number} width - Width of axis container.
 * @param {number} height - Height of axis container.
 * @returns {{x: number, y: number}}
 */
export function calcAxisTranslate(orientation, width = 0, height = 0) {
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

/**
 * Calculate the number of ticks that fit into a specified width based on text styles.
 * @param {Array} ticks - Array of tick values.
 * @param {Object} styles - Object consisting of axis container width and font styles.
 * @param {Number} styles.tickFontSize - Supplied tick font size.
 * @param {String} styles.tickFontFamily - Supplied tick font family.
 * @param {Function} styles.tickFormat - Supplied callback for tick string formatting.
 * @param {Number} styles.width - Supplied width of axis container.
 * @returns {Number} Number of ticks that fit (without overlap) into available width.
 */
function calcNumTicksThatFit(ticks, {
  tickLabelFontSize,
  tickLabelFontFamily,
  tickLabelFormat,
  width
}) {
  let widestTickLabelLength;

  try {
    /* eslint-disable max-len */
    const canvasContext = window && window.document.createElement('canvas').getContext('2d');
    widestTickLabelLength = reduce(map(ticks, tickLabelFormat), (widest, tick) =>
      Math.max(
        widest,
        getRenderedStringWidth(String(tick), `${tickLabelFontSize}px ${tickLabelFontFamily}`, canvasContext),
      )
    , 0);
    /* eslint-enable max-len */
  } catch (err) {
    widestTickLabelLength = reduce(map(ticks, tickLabelFormat), (widest, tick) =>
      Math.max(widest, String(tick).length * tickLabelFontSize)
    , 0);
  }

  return Math.floor(width / widestTickLabelLength);
}

/**
 * Evenly filter tick values based on available width (for horizontal axis/axes).
 * @param {Array} ticks - Array of tick values.
 * @param {Object} styles - Object consisting of axis container width and font styles.
 * @param {Number} styles.width - Supplied width of axis container.
 * @param {Number} styles.tickFontSize - Supplied tick font size.
 * @returns {Array} Tick values evenly filtered based on available width.
 */
export function filterTickValuesByWidth(ticks, axisProperties) {
  const numTicksThatFit = calcNumTicksThatFit(ticks, axisProperties);
  return takeSkipping(ticks, numTicksThatFit);
}

/**
 * Evenly filter tick values based on available height (for vertical axis/axes).
 * @param {Array} ticks - Array of tick values.
 * @param {Object} styles - Object consisting of axis container height and font styles.
 * @param {Number} styles.height - Supplied height of axis container.
 * @param {Number} styles.tickFontSize - Supplied tick font size.
 * @returns {Array} Tick values evenly filtered based on available height.
 */
export function filterTickValuesByHeight(ticks, { height, tickFontSize }) {
  const numTicksThatFit = Math.floor(height / tickFontSize);
  return takeSkipping(ticks, numTicksThatFit);
}

/**
 * Given an array of React children components, find the axis components that contain labels for the specified axis orientation.
 * @param {Array} children - Opaque data structure as a flat array with keys assigned to each child.
 * @param {String} axisOrientation - Position of axis line (one of: "top", bottom").
 * @returns {Object|Boolean} React node as object. False if not found.
 */
function findAxisComponentsByCondition(children, conditions) {
  return reduce(
    AXIS_ORIENTATION_OPTIONS,
    (result, axisOrientation) => {
      const validConditions = {
        orientationExists: (child) => child.props.orientation === axisOrientation,
        labelExists: (child) => !isEmpty(child.props.label)
      };
      return set(
        result,
        axisOrientation,
        find(children,
          (child) => reduce(
            conditions,
            (acc, condition) => validConditions[condition](child)
          ) || false
        )
      );
    }, {});
}

/**
 * Calculate the amount of total padding needed if tick values require rotation to fit into the available width.
 * @param {Object} - Variables on which padding is dependent.
 * @returns {[Object, Boolean]} Resultant padding and boolean indicating whether tick rotation is necessary.
 */
export function calcPaddingFromTicks(
  xTickValues,
  yTickValues,
  width,
  height,
  style,
  children
) {
  let autoRotate;
  let padding;
  const {
    top: topAxis,
    right: rightAxis,
    bottom: bottomAxis,
    left: leftAxis } = findAxisComponentsByCondition(children, ['orientationExists']);
  const numTicksThatFit = calcNumTicksThatFit(
    xTickValues,
    { ...DEFAULT_AXIS_PROPERTIES, width, height }
  );
  const tickLabelHeight = xTickValues.length
    ? style && style.fontSize || DEFAULT_AXIS_PROPERTIES.tickLabelFontSize
    : 0;

  // TOP/BOTTOM: If ticks overlap, calculate the rotated length (i.e., at -45 deg.), but also subtract tick height.
  // RIGHT/LEFT: Ticks cannot overlap. Simply calculate the length of the string (i.e., at 90 deg.)
  // TODO: Need to figure out how to get the actual formatted tick labels (d3 & React are making this difficult)
  if (numTicksThatFit < xTickValues.length) {
    autoRotate = true;
    padding = {
      top: topAxis ? sizeOfLongestRotatedString(xTickValues, -45) - tickLabelHeight : 0,
      right: rightAxis ? sizeOfLongestRotatedString(yTickValues, 90) : 0,
      bottom: bottomAxis ? sizeOfLongestRotatedString(xTickValues, -45) - tickLabelHeight : 0,
      left: leftAxis ? sizeOfLongestRotatedString(yTickValues, 90) : 0
    };
  } else {
    autoRotate = false;
    padding = {
      top: topAxis ? tickLabelHeight : 0,
      right: rightAxis ? sizeOfLongestRotatedString(yTickValues, 90) : 0,
      bottom: bottomAxis ? tickLabelHeight : 0,
      left: leftAxis ? sizeOfLongestRotatedString(yTickValues, 90) : 0
    };
  }
  return [mapValues(padding, (val) => val + DEFAULT_AXIS_PROPERTIES.tickHeight), autoRotate];
}

/**
 * Given an axis component w/ label, determine the padding needed for the label (based on font height and additional buffer).
 * @param {Array} orientedAxisWithLabel - Opaque data structure as a flat array with keys assigned to each child.
 * @returns {{top: Number, right: Number, bottom: Number, left: Number}} Padding offset from label.
 */
function labelPaddingByOrientation(orientedAxisWithLabel) {
  return parseFloat((get(
    orientedAxisWithLabel,
    ['props', 'style', 'fontSize'],
    `${DEFAULT_AXIS_PROPERTIES.axisLabelFontSize}px`
  )))
  + parseFloat(ADDITIONAL_LABEL_PADDING);
}

/**
 * Given an array of React children components, find the axes components (if exist) and calculate the padding required for each label (if exists).
 * @param {Array} children - Opaque data structure as a flat array with keys assigned to each child.
 * @returns {{top: Number, right: Number, bottom: Number, left: Number}} Padding offsets for each label.
 */
export function calcPaddingFromLabel(children) {
  const {
    top: topAxis,
    right: rightAxis,
    bottom: bottomAxis,
    left: leftAxis
  } = findAxisComponentsByCondition(children, ['orientationExists', 'labelExists']);

  return {
    top: (topAxis ? labelPaddingByOrientation(topAxis) : 0),
    right: (rightAxis ? labelPaddingByOrientation(rightAxis) : 0),
    bottom: (bottomAxis ? labelPaddingByOrientation(bottomAxis) : 0),
    left: (leftAxis ? labelPaddingByOrientation(leftAxis) : 0),
  };
}

/**
 * Combine two paddings according to a customizer.
 * @param {Array} paddings - Array of padding objects.
 * @param {Function} customizer - Function by which to customize assigned values.
 * @returns {{top: Number, right: Number, bottom: Number, left: Number}} Resultant padding.
 */
export function mergePaddingsBy(paddings, customizer) {
  return reduce(
    paddings,
    (resultantPadding, currentPadding) => mergeWith(
      resultantPadding,
      currentPadding,
      customizer
    ), {});
}

/**
 * Calculate total padding and determine if rotation is needed.
 * @param {Object} - Variables on which padding is dependent.
 * @returns {[Object, Boolean]} Resultant padding and boolean indicating whether tick rotation is necessary.
 */
export function calcPadding({ children, xDomain, yDomain, width, height, style, initialPadding }) {
  const paddingFromLabel = calcPaddingFromLabel(children);
  const [paddingFromTicks, autoRotateTickLabels] = calcPaddingFromTicks(
    xDomain,
    yDomain,
    width,
    height,
    style,
    children
  );
  // Add padding needed for labels to padding needed for ticks.
  const summedPaddings = mergePaddingsBy(
    [paddingFromLabel, paddingFromTicks],
    (originalProperty = 0, revisedProperty = 0) => originalProperty + revisedProperty
  );
  // Take largest padding property value from summed paddings (above) and user-specified padding
  // (i.e., still allow the ability to pad the chart more than what is auto-calculated).
  const mergedPaddings = mergePaddingsBy(
    [initialPadding, summedPaddings],
    (originalProperty = 0, revisedProperty = 0) => Math.max(originalProperty, revisedProperty)
  );

  return [mergedPaddings, autoRotateTickLabels];
}

/**
 * Calculate width and height of chart portion of SVG by subtracting out the padding from each side.
 * @param {Number} width - SVG Width.
 * @param {Number} height - SVG Height.
 * @param {{top: Number, right: Number, bottom: Number, left: Number}} padding - Chart padding accounting for axes labels and tick formatting.
 * @returns {{width: Number, height: Number}} Chart width and height offset by padding.
 */
export function calcChartDimensions(width, height, padding) {
  return {
    width: width - (padding.left + padding.right),
    height: height - (padding.top + padding.bottom),
  };
}
