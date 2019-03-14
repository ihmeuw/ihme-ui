import { isNaN, isUndefined } from 'lodash';
import { Float } from './numbers';

/**
 * @param {Number} num
 * @param {Array} range
 */
export function percentOfRange(num, range) {
  const [min, max] = range;
  return (1 / ((max - min) / (num - min)));
}

/**
 * @param {Number} percent -> value between [0, 1] inclusive
 * @param {Array} range
 */
export function numFromPercent(percent, range) {
  const [min, max] = range;
  return min + ((max - min) * percent);
}

/**
 * @param {Number} percent -> value between [0, 1] inclusive
 * @param {Array} range
 */
export function domainFromPercent(newDomain, oldDomain, rangeExtent) {
  // find what percent of range the old domain was clamped to
  let x1Pct = percentOfRange(rangeExtent[0], oldDomain);
  let x2Pct = percentOfRange(rangeExtent[1], oldDomain);

  // handle division errors, if any
  if (isNaN(x1Pct) || isUndefined(x1Pct)) x1Pct = 0;
  if (isNaN(x2Pct) || isUndefined(x2Pct)) x2Pct = 1;

  return [numFromPercent(x1Pct, newDomain), numFromPercent(x2Pct, newDomain)];
}

/**
 * Base check that value is within the range of extent (up to and including start and end)
 * if no extent is given, returns true
 * @param {number} value - e.g., 1993
 * @param {array} extent - e.g., [1990, 1994]
 * @param {number} [tolerance] - tolerance within which to consider value within extent (default: 0)
 * @return {Boolean}
 */
export function isWithinRange(value, extent, tolerance = 0) {
  // guard against no extents or malformed extents
  if (!extent || extent.length !== 2) return true;
  return !!((value > extent[0] || Math.abs(Float.subtract(value, extent[0])) <= tolerance) &&
  (value < extent[1] || Math.abs(Float.subtract(value, extent[1])) <= tolerance));
}

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
export function ensureWithinRange(value, extent) {
  if (extent.length < 1) return value;
  return Math.min(Math.max(Math.min(...extent), value), Math.max(...extent));
}
