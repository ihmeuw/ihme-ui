import interact from 'interact.js';

/**
 * Determine the floating point precision of a number.
 * @param value
 * @returns {number}
 */
export function getFloatPrecision(value) {
  return value > 0 && value < 1 ? (1 - Math.ceil(Math.log(value) / Math.log(10))) : 0;
}

/**
 * Return a number to a specified precision as a workaround for floating point funkiness.
 * @param value
 * @param precision
 * @returns {number}
 */
export function valueWithPrecision(value, precision) {
  return +value.toFixed(precision);
}

export function getSnapTargetFunc(snapTarget, snapGridArgs = {}) {
  if (typeof snapTarget === 'function') {
    return snapTarget;
  } else if (typeof snapTarget === 'object') {
    return interact.createSnapGrid({
      ...snapGridArgs,
      ...snapTarget,
    });
  }
  return null;
}

export function getDimension(value) {
  if (typeof value === 'string') {
    return value;
  }
  return `${value}px`;
}
