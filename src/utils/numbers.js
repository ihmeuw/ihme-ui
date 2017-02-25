import { isFinite } from 'lodash';

/**
 * number formatter to be used as, for example, tickFormat fn and label formatter
 * if value is a non-finite number, returns empty string
 * @param {number} value
 * @return {string}
 */
export function numberFormat(value) {
  if (!isFinite(value)) return '';
  if (value >= 1000) return `${(value / 1000).toFixed(3)}k`;
  if (value <= 0.01) return value.toExponential(3);
  return value.toFixed(2);
}

export const Float = {
  /**
   * determine power of 10 by which to multiply float
   * in order to turn it into an integer
   * @param {number} float
   * @return {number}
   */
  floatToIntMultiplier(float) {
    const [, fraction] = float.toString().split('.');
    if (!fraction) return 1;
    return Math.pow(10, fraction.length);
  },

  /**
   * determine largest power of 10 necessary to turn all numbers
   * in a set into integers
   * @param rest - numbers
   * @return {number} - a power of 10
   */
  maxMultiplier(...rest) {
    return rest.reduce((prev, next) =>
      Math.max(prev, this.floatToIntMultiplier(next)),
     -Infinity);
  },

  add(...rest) {
    const multiplier = this.maxMultiplier(...rest);
    return (rest.reduce((accum, num) => accum + Math.round(num * multiplier), 0)) / multiplier;
  },

  /**
   * divide two numbers without floating point errors
   * @param {number} dividend
   * @param {number} divisor
   * @return {number}
   */
  divide(dividend, divisor) {
    const multiplier = this.maxMultiplier(dividend, divisor);
    return (Math.round(dividend * multiplier) / Math.round(divisor * multiplier));
  },

  /**
   * multiply two numbers without floating point errors
   * @param rest
   * @return {number}
   */
  multiply(...rest) {
    const multiplier = this.maxMultiplier(...rest);
    return rest.reduce((accum, num) =>
      (Math.round(accum * multiplier) * Math.round(num * multiplier)) / Math.pow(multiplier, 2)
    , 1);
  },

  /**
   * subtract two numbers without floating point errors
   * @param minuend
   * @param subtrahend
   * @return {number}
   */
  subtract(minuend, subtrahend) {
    const multiplier = this.maxMultiplier(minuend, subtrahend);
    return (Math.round(minuend * multiplier) - Math.round(subtrahend * multiplier)) / multiplier;
  },
};
