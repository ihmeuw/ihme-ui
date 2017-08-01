import {
  filter,
  map,
  range as range_,
} from 'lodash';
import { Float } from './numbers';

/**
 * turn [min, max] domain into array of length
 * @param {array} domain - [min, max]
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

/**
 * filter list of elements to length equal to or less than maxLength
 * @param {array} list
 * @param {number} maxLength
 * @return {array}
 */
export function choose(list, maxLength) {
  // if can only choose 2 items, choose first and last element
  if (maxLength === 2 && list.length > 2) {
    return [list[0], list[list.length - 1]];
  }
  const mod = Math.ceil(list.length / maxLength);
  return filter(list, (_, idx) => idx % mod === 0);
}
