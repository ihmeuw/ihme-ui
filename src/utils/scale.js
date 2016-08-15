import d3Scale from 'd3-scale';
import { forOwn } from 'lodash';
import { isWithinRange } from './index';

const SCALES = {
  ...Object.keys(d3Scale).reduce((acc, key) => {
    if (key.match(/scale[A-Z]/)) {
      return { ...acc, [key.toLowerCase().replace('scale', '')]: d3Scale[key] };
    }
    return acc;
  }, {}),
};

/**
 * Get a list of shortened d3 scale names.
 * @returns {Array} list of shortened scale names.
 */
export function getScaleTypes() {
  return Object.keys(SCALES);
}

/**
 * Get a d3 scale by shortened name.
 * @param type
 * @returns {scale|linear} specified scale type. Defaults to `linear`.
 */
export function getScale(type) {
  return SCALES[type] || SCALES.linear;
}

/**
 * Take values from range of scale and convert into values within its domain
 * Note: Only works on linear scale types.
 * @param {Function} scale -> d3 scale
 * @param {Array} values -> two values from the scale's range
 */
export const rangeToDomain = function rangeToDomain(scale, values) {
  return [scale.invert(values[0]), scale.invert(values[1])];
};

/**
 * Take values from domain of scale and convert into values within its range
 * @param {Function} scale -> d3 scale
 * @param {Array} values -> two values from the scale's domain
 */
export const domainToRange = function domainToRange(scale, values) {
  return [scale(values[0]), scale(values[1])];
};

/**
 * This is a simple wrapper for a clamped d3Scale.scaleLinear
 * that returns a `clampedValue` for any value outside of the scale's clamp
 * @param {string|number} clampedValue
 * @return {function} scale
 */
export function clampedLinearScale(clampedValue = '#ccc') {
  let clamps;
  const baseScale = d3Scale.scaleLinear()
    .clamp(true);

  function scale(value) {
    if (clamps && !isWithinRange(value, clamps)) return clampedValue;
    return baseScale(value);
  }

  /**
   * if clamping bounds are provided, sets values
   * below and above which clampedValue is applied
   * if called without arguments, returns current clamps
   * @param {array} nextClamps
   * @return {array|function} scale
   */
  scale.clamps = (nextClamps) => {
    /* eslint-disable max-len */
    if (!nextClamps) return clamps;
    if (!Array.isArray(nextClamps)) {
      throw new Error('clampedLinearScale.clamps must be an array of [minClampingExtent, maxClampingExtent]');
    }
    clamps = nextClamps;
    return scale;
    /* eslint-enable max-len */
  };

  /**
   * if domain is provided, sets domain of baseScale
   * if called without arguments, returns current domain of baseScale
   * @param {array} domain
   * @return {array|function}
   */
  scale.domain = (domain) => {
    if (!domain) return baseScale.domain();
    baseScale.domain(domain);
    return scale;
  };

  /**
   * return exact copy of scale
   * @return {function}
   */
  scale.copy = () => {
    const target = (value) => {
      if (clamps && !isWithinRange(value, clamps)) return clampedValue;
      return baseScale(value);
    };

    forOwn(scale, (fn, key) => {
      target[key] = fn;
    });

    return target;
  };

  /**
   * if range is provided, sets range of baseScale
   * if called without arguments, returns current range of baseScale
   * @param {array} range
   * @return {array|function}
   */
  scale.range = (range) => {
    if (!range) return baseScale.range();
    baseScale.range(range);
    return scale;
  };

  return scale;
}
