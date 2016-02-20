import { isNaN, isUndefined } from 'lodash/lang';

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
