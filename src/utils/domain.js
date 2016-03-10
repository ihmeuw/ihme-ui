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
  // if max and min are the same number (e.g., full range of dataset is 0 -> 0)
  // return single element array
  const [min, max] = domain;
  if (min === max) return domain;

  const ret = [];
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
