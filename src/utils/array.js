import { isArray, isNaN as _isNaN, isNull, isUndefined } from 'lodash';

/**
 * Check if array contains crappy values (NaN, undefined, null)
 * @param {Array} arr
 * @return {Boolean} true if has crappy values, false otherwise
 */
export function hasCrappyValues(arr) {
  if (!arr || !isArray(arr) || !arr.length) return true;
  return arr.some((val) => {
    return _isNaN(val) || isNull(val) || isUndefined(val);
  });
}
