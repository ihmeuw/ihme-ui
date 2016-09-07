import { isFinite } from 'lodash';

/**
 * number formatter to be used as, for example, tickFormat fn and label formatter
 * if value is a non-finite number, returns empty string
 * @param {number} value
 * @param {number} [precision] defaults to three decimal places
 * @return {string}
 */
export function numberFormat(value, precision = 3) {
  if (!isFinite(value)) return '';
  if (value >= 1000) return `${(value / 1000).toFixed(precision)}k`;
  if (value <= 0.01) return value.toExponential(precision);
  return value.toFixed(precision);
}
