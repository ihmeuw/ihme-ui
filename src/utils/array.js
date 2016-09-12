import { isArray, isNaN as _isNaN, isNull, isUndefined, map, range as range_ } from 'lodash';
import { Float } from './numbers';

/**
 * Check if array contains crappy values (NaN, undefined, null)
 * @param {Array} arr
 * @return {Boolean} true if has crappy values, false otherwise
 */
export function hasCrappyValues(arr) {
  if (!arr || !isArray(arr) || !arr.length) return true;
  return arr.some((val) => _isNaN(val) || isNull(val) || isUndefined(val));
}

/**
 * turn [min, max] domain into domain of length
 * that matches cardinality of colors array
 * @param {array} domain - [min, max] of x-scale domain
 * @param {number} length - intended length of returned array
 * @returns {array}
 */
export function linspace(domain, length) {
  if (length < 2 || domain.length < 2 || domain[0] === domain[1]) return domain;

  const step = Float.divide(Math.abs(Float.subtract(domain[1], domain[0])), length - 1);
  const [min, max] = domain.sort((a, b) => a - b);

  return map(range_(length), (i) => {
    if (i === length - 1) return max;
    return Float.add(Float.multiply(i, step), min);
  });
}
