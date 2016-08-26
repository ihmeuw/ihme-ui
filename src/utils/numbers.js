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
