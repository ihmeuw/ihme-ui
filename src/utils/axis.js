/* global window */

/**
 * Axis utils
 * @module
 */
import {
  filter,
  find,
  get,
  isEmpty,
  map,
  mapValues,
  mergeWith,
  reduce,
  set as setValue
} from 'lodash';

import {
  takeSkipping
} from './array';

import {
  getRenderedStringWidth,
  sizeOfLongestRotatedString,
  FONT_HEIGHT_SCALING_FACTOR,
} from './strings';

export const DEFAULT_AXIS_PROPERTIES = {
  axisLabelFontSize: 16,
  height: 100,
  tickHeight: 10,
  tickFontFamily: 'sans-serif',
  tickFontSize: 10,
  tickFormat: null,
  width: 230,
};

export const ALLOWED_SCALE_TYPES_FOR_AUTOFORMAT = ['point', 'ordinal', 'band'];

const AXIS_ORIENTATION_OPTIONS = ['top', 'right', 'bottom', 'left'];

const ADDITIONAL_LABEL_PADDING = '3px';

const TICK_LABEL_ROTATION_ANGLE = -45;


/**
 * Determine if auto-formatting can be applied based on d3 scale type(s).
 * Returns true if at least one scale passed in can be auto-formatted.
 * @param {...string} scaleTypes - d3 scale type(s)
 * @returns {Boolean}
 */
export function canAutoFormatAxes(...scaleTypes) {
  return scaleTypes.some(scaleType => ALLOWED_SCALE_TYPES_FOR_AUTOFORMAT.includes(scaleType));
}

/**
 * Calculate translation based on axis orientation.
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
        dY: '1em', // Text baseline is positioned at top edge of SVG. Shift down 1em.
        rotate: 0,
      };
    case 'bottom':
      return {
        x: translate.x,
        y: translate.y + padding.bottom,
        dX: center,
        dY: '-0.25em', // Shift text baseline up .25em to account for characters w/ descenders
        rotate: 0,
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
      // eslint-disable-next-line max-len
      throw new Error('Invalid axis orientation. Must be one of "top", "right", "bottom", or "left"');
  }
}

/**
 * Calculate the widest string length from supplied array of strings.
 * @param {Array} ticks - Array of tick values.
 * @param {Object} styles - Object consisting of axis container width and font styles.
 * @param {Number} styles.tickFontSize - Supplied tick font size.
 * @param {String} styles.tickFontFamily - Supplied tick font family.
 * @param {Function} styles.tickFormat - Supplied callback for tick string formatting.
 * @returns {Number} Number of ticks that fit (without overlap) into available width.
 */
function calcLengthOfLongestTickLabel(ticks, {
  tickFontSize,
  tickFontFamily,
  tickFormat,
}) {
  /* eslint-disable max-len */
  const formattedTicks = map(ticks, tickFormat);
  return reduce(formattedTicks, (widest, tick) =>
    Math.max(
      widest,
      getRenderedStringWidth(String(tick), `${tickFontSize}px ${tickFontFamily}`),
    )
  , 0);
}

/**
 * Calculate the number of ticks that fit into a specified width based on text styles.
 * @param {Number} widestTickLabelLength - Length of longest tick value.
 * @param {Number} availableWidth - Supplied width of axis container.
 * @returns {Number} Number of ticks that fit (without overlap) into available width.
 */
function calcNumTicksThatFit(widestTickLabelLength, availableWidth) {
  return Math.floor(availableWidth / widestTickLabelLength);
}

/**
 * Evenly filter tick values based on available width (for horizontal axis/axes).
 * @param {Array} ticks - Array of tick values.
 * @param {Object} axisProperties - Object consisting of axis container width and font styles.
 * @returns {Array} Tick values evenly filtered based on available width.
 */
export function filterTickValuesByWidth(ticks, axisProperties) {
  const widestTickLabelLength = calcLengthOfLongestTickLabel(ticks, axisProperties);
  const numTicksThatFit = calcNumTicksThatFit(widestTickLabelLength, get(axisProperties, 'width'));
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
 * Given an array of React children components, create mapping of axis components with their respective
 * orientation.
 * @param {Array} children - Opaque data structure as a flat array with keys assigned to each child.
 * @returns {Object} React axis components keyed by their respective orientation (i.e., top, right, etc.)
 */
function getAxesByOrientation(children) {
  return reduce(
    AXIS_ORIENTATION_OPTIONS,
    (result, axisOrientation) => setValue(
      result,
      axisOrientation,
      find(children, (child) => child.props.orientation === axisOrientation),
    ),
    {},
  );
}

/**
 * Apply formatting, if any, to tick values for each axis.
 * @param {Object} axes - React axis components keyed by their respective orientation (i.e., top, right, etc.)
 * @param {Array} xDomain - domain of the x-axis data
 * @param {Array} yDomain - domain of the y-axis data
 * @returns {Object} Formatted tick values for each axis orientation,
 * or null for respective orientation if axis does not exist.
 */
function getFormattedTickValues(axes, xDomain, yDomain) {
  return mapValues(
    axes,
    (axis) => {
      if (axis) {
        const orientation = get(axis, ['props', 'orientation']);
        const userSpecifiedTickValues = get(axis, ['props', 'tickValues']);
        const tickValues = userSpecifiedTickValues ||
          (orientation === 'top' || orientation === 'bottom'
            ? xDomain
            : yDomain);
        const tickFormat = get(axis, ['props', 'tickFormat']);
        const formattedTicks = (tickFormat && tickValues.map(tick => tickFormat(tick))) || tickValues;
        return formattedTicks;
      // eslint-disable-next-line no-else-return
      } else {
        return null;
      }
    }
  );
}
/**
 * Calculate padding required for tick marks and tick mark padding for each axis.
 * @param {Object} axes - React axis components keyed by their respective orientation (i.e., top, right, etc.)
 * @returns {Object} Padding value for each axis orientation
 */
function calcPaddingFromTickMarks(axes) {
  return mapValues(
    axes,
    (axis) => {
      if (axis) {
        const tickSize = axis.props.tickSize;
        const tickPadding = axis.props.tickPadding;
        return tickSize + tickPadding;
      // eslint-disable-next-line no-else-return
      } else {
        return 0;
      }
    }
  );
}

/**
 * Given an axis component w/ label, determine the padding needed for the label (based on font height and additional buffer).
 * @param {Array} orientedAxisWithLabel - Opaque data structure as a flat array with keys assigned to each child.
 * @returns {{top: Number, right: Number, bottom: Number, left: Number}} Padding offset from label.
 */
function getLabelPadding(orientedAxisWithLabel) {
  const labelFontSize = parseFloat((get(
    orientedAxisWithLabel,
    ['props', 'labelStyle', 'fontSize'],
    `${DEFAULT_AXIS_PROPERTIES.axisLabelFontSize}px`
  )));
  return (labelFontSize * FONT_HEIGHT_SCALING_FACTOR)
  + parseFloat(ADDITIONAL_LABEL_PADDING);
}

/**
 * Calculate the amount of total padding needed and if tick values require rotation to fit into the available width.
 * @param {Object} - Variables on which padding is dependent.
 * @returns {[Object, Boolean]} Resultant padding and boolean indicating whether tick rotation is necessary.
 */
function calcPaddingFromTicks({
  axisStyle,
  minTickLabelSpacing,
  xDomain,
  xScaleType,
  yDomain,
  yScaleType,
  width,
  children,
}) {
  // Find each oriented axis component, if any, from React children.
  const axes = getAxesByOrientation(children);
  const {
    top: topAxis,
    right: rightAxis,
    bottom: bottomAxis,
    left: leftAxis } = axes;

  // Get the formatted tick values for each axis (using the domain as the tick values).
  const {
    top: topAxisTickValues,
    right: rightAxisTickValues,
    bottom: bottomAxisTickValues,
    left: leftAxisTickValues } = getFormattedTickValues(axes, xDomain, yDomain);

  const {
    top: topAxisTickMarkPadding,
    right: rightAxisTickMarkPadding,
    bottom: bottomAxisTickMarkPadding,
    left: leftAxisTickMarkPadding } = calcPaddingFromTickMarks(axes);

  // Determine if auto-formatting is possible based on the d3 scale type.
  const canAutoFormatXAxis = canAutoFormatAxes(xScaleType);
  const canAutoFormatYAxis = canAutoFormatAxes(yScaleType);

  // Determine axis style properties.
  const tickFontSize = get(axisStyle, 'fontSize', DEFAULT_AXIS_PROPERTIES.tickFontSize);
  const tickFontFamily = get(axisStyle, 'fontFamily', DEFAULT_AXIS_PROPERTIES.tickFontFamily);
  const axisProperties = { ...DEFAULT_AXIS_PROPERTIES, tickFontSize, tickFontFamily };

  // Determine if x-axis tick labels require rotation (not needed for y-axis since overlap is not a concern)
  // If both top & bottom axes exist and one requires rotation, then rotate both.
  const widestTopAxisTickLabelLength = topAxis
    ? calcLengthOfLongestTickLabel(
      topAxisTickValues,
      axisProperties
    )
    : 0;
  const widestBottomAxisTickLabelLength = bottomAxis
    ? calcLengthOfLongestTickLabel(
      bottomAxisTickValues,
      axisProperties
    )
    : 0;

  const leftAxisTickWidth = calcLengthOfLongestTickLabel(leftAxisTickValues, axisProperties) + leftAxisTickMarkPadding;
  const leftAxisLabelWidth = getLabelPadding(leftAxis);
  const rightAxisTickWidth = calcLengthOfLongestTickLabel(rightAxisTickValues, axisProperties) + rightAxisTickMarkPadding;
  const rightAxisLabelWidth = getLabelPadding(rightAxis);
  const approximateHorizontalAxisWidth = width - leftAxisTickWidth - leftAxisLabelWidth - rightAxisTickWidth - rightAxisLabelWidth;

  const numTicksThatFitOnTopAxis = calcNumTicksThatFit(widestTopAxisTickLabelLength + minTickLabelSpacing, approximateHorizontalAxisWidth);
  const numTicksThatFitOnBottomAxis = calcNumTicksThatFit(widestBottomAxisTickLabelLength + minTickLabelSpacing, approximateHorizontalAxisWidth);

  // TOP/BOTTOM: If ticks overlap, calculate the rotated length (i.e., at -45 deg.), but also subtract tick height.
  // RIGHT/LEFT: Ticks cannot overlap. Simply calculate the length of the string (i.e., at 90 deg.)
  let autoRotate;
  let padding;
  if (numTicksThatFitOnTopAxis < get(topAxisTickValues, 'length', 0)
    || numTicksThatFitOnBottomAxis < get(bottomAxisTickValues, 'length', 0)
  ) {
    autoRotate = true;
    padding = {
      top: (topAxis && canAutoFormatXAxis)
        ? sizeOfLongestRotatedString(topAxisTickValues, tickFontSize, TICK_LABEL_ROTATION_ANGLE) + topAxisTickMarkPadding
        : 0,
      right: (rightAxis && canAutoFormatYAxis)
        ? calcLengthOfLongestTickLabel(rightAxisTickValues, axisProperties) + rightAxisTickMarkPadding
        : 0,
      bottom: (bottomAxis && canAutoFormatXAxis)
        ? sizeOfLongestRotatedString(bottomAxisTickValues, tickFontSize, TICK_LABEL_ROTATION_ANGLE) + bottomAxisTickMarkPadding
        : 0,
      left: (leftAxis && canAutoFormatYAxis)
        ? calcLengthOfLongestTickLabel(leftAxisTickValues, axisProperties) + leftAxisTickMarkPadding
        : 0,
    };
  } else {
    autoRotate = false;
    padding = {
      top: (topAxis && canAutoFormatXAxis)
        ? (tickFontSize * FONT_HEIGHT_SCALING_FACTOR) + topAxisTickMarkPadding
        : 0,
      right: (rightAxis && canAutoFormatYAxis)
        ? calcLengthOfLongestTickLabel(rightAxisTickValues, axisProperties) + rightAxisTickMarkPadding
        : 0,
      bottom: (bottomAxis && canAutoFormatXAxis)
        ? (tickFontSize * FONT_HEIGHT_SCALING_FACTOR) + bottomAxisTickMarkPadding
        : 0,
      left: (leftAxis && canAutoFormatYAxis)
        ? calcLengthOfLongestTickLabel(leftAxisTickValues, axisProperties) + leftAxisTickMarkPadding
        : 0,
    };
  }
  return [padding, autoRotate];
}

/**
 * Given an array of React children components, find the axes components (if exist) and calculate the padding required for each label (if exists).
 * @param {Array} children - Opaque data structure as a flat array with keys assigned to each child.
 * @returns {{top: Number, right: Number, bottom: Number, left: Number}} Padding offsets for each label.
 */
function calcPaddingFromLabel(children) {
  const labeledAxesComponents = filter(children, (child) => !isEmpty(child.props.label));
  const {
    top: topAxis,
    right: rightAxis,
    bottom: bottomAxis,
    left: leftAxis
  } = getAxesByOrientation(labeledAxesComponents);

  return {
    top: (topAxis ? getLabelPadding(topAxis) : 0),
    right: (rightAxis ? getLabelPadding(rightAxis) : 0),
    bottom: (bottomAxis ? getLabelPadding(bottomAxis) : 0),
    left: (leftAxis ? getLabelPadding(leftAxis) : 0),
  };
}

/**
 * Combine two paddings according to a customizer.
 * @param {Array} paddings - Array of padding objects.
 * @param {Function} customizer - Function by which to customize assigned values.
 * @returns {{top: Number, right: Number, bottom: Number, left: Number}} Resultant padding.
 */
function mergePaddingsBy(paddings, customizer) {
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
export function calcPadding({
  axisStyle,
  children,
  minTickLabelSpacing,
  xDomain,
  xScaleType,
  yDomain,
  yScaleType,
  width,
  initialPadding,
}) {
  const paddingFromLabel = calcPaddingFromLabel(children);
  const [paddingFromTicks, autoRotateTickLabels] = calcPaddingFromTicks({
    axisStyle,
    minTickLabelSpacing,
    xDomain,
    xScaleType,
    yDomain,
    yScaleType,
    width,
    children,
  });
  // Add padding needed for labels to padding needed for ticks.
  const summedPadding = mergePaddingsBy(
    [paddingFromLabel, paddingFromTicks],
    (labelPadding = 0, tickPadding = 0) => labelPadding + tickPadding,
  );
  // Take largest padding property value from summed paddings (above) and user-specified padding
  // (i.e., still allow the ability to pad the chart more than what is auto-calculated).
  const mergedPaddings = mergePaddingsBy(
    [initialPadding, summedPadding],
    (initial = 0, summed = 0) => Math.max(initial, summed),
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
