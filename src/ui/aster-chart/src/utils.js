import { map } from 'lodash';

/**
 * @description generate a specific number of elements in an array between two values
 * @access public
 * @param {Number} start - starting value
 * @param {Number} stop - ending value
 * @param {Number} steps - length of output array
 * @return {Array} - array of numbers
 */
export default function innerRange(start, stop, steps) {
  const min = (start < stop) ? start : stop;
  const max = (stop > start) ? stop : start;

  const span = max - min;

  const values = map(Array(steps), (value, index) => min + ((span / (steps - 1)) * index));

  return (start > stop) ? values.reverse() : values;
}
