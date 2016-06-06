import { isNaN, isUndefined } from 'lodash';

/**
 * @param {Number} num
 * @param {Array} range
 */
export const percentOfRange = function percentOfRange(num, range) {
  const [min, max] = range;
  return (1 / ((max - min) / (num - min)));
};

/**
 * @param {Number} percent -> value between [0, 1] inclusive
 * @param {Array} range
 */
export const numFromPercent = function numFromPercent(percent, range) {
  const [min, max] = range;
  return min + ((max - min) * percent);
};

/**
 * @param {Number} percent -> value between [0, 1] inclusive
 * @param {Array} range
 */
export const domainFromPercent = function domainFromPercent(newDomain, oldDomain, rangeExtent) {
  // find what percent of range the old domain was clamped to
  let x1Pct = percentOfRange(rangeExtent[0], oldDomain);
  let x2Pct = percentOfRange(rangeExtent[1], oldDomain);

  // handle division errors, if any
  if (isNaN(x1Pct) || isUndefined(x1Pct)) x1Pct = 0;
  if (isNaN(x2Pct) || isUndefined(x2Pct)) x2Pct = 1;

  return [numFromPercent(x1Pct, newDomain), numFromPercent(x2Pct, newDomain)];
};

/**
 * Turn [min, max] domain into multi-step domain
 * that matches cardinality of colors array
 * @param {Array} colors -> array of colors to be used as range of scale
 * @param {Array} domain -> [min, max] of x-scale domain
 * @returns {Array}
 */
export const generateColorDomain = function generateColorDomain(colors, domain) {
  // TODO - evaluate this function for usefulness.
  // if max and min are the same number (e.g., full range of dataset is 0 -> 0)
  // return single element array
  const [min, max] = domain;
  if (min === max) return domain;

  const ret = [];
  // FIXME - divide by zero for color lists with only one color
  const increment = (Math.abs(max - min) / (colors.length - 1));
  let step = min - increment;

  // for as many colors as will exist in the scale's range
  // create a corresponding step in the scale's domain
  for (let i = colors.length; i > 0; i -= 1) {
    step = step + increment;
    ret.push(step);
  }

  return ret;
};

/**
 * Base check that value is within the range of extent (up to and including start and end)
 * @param {Number} value -> e.g., 1993
 * @param {Array} extent -> e.g., [1990, 1994]
 * @return {Boolean}
 */
export const isWithinRange = function withinRange(value, extent) {
  if (value >= extent[0] && value <= extent[1]) return true;
  return false;
};


/**
 * Check that value is within the range of extent
 * and return value or nearest value from within extent.
 * If extent is empty, returns value.
 *
 * E.g.:
 *  `ensureWithinRange(1993, [1990, 1994])` -> 1993
 *  `ensureWithinRange(1989, [1990, 1994])` -> 1990
 *  `ensureWithinRange(2000, [1990, 1994])` -> 1994
 *  `ensureWithinRange(2000, [])` -> 2000
 *
 * @param {Number} value
 * @param {Array} extent
 * @return {Number}
 */
export const ensureWithinRange = function ensureWithinRange(value, extent) {
  // value is too high, return upper bound of extent
  if (value > extent[1]) return extent[1];

  // value is too low, return lower bound of extent
  if (value < extent[0]) return extent[0];

  // no extent or within extent, return value
  return value;
};
