import {
  scaleBand,
  scalePoint,
  scaleIdentity,
  scaleLinear,
  scaleLog,
  scaleOrdinal,
  scalePow,
  scaleSqrt,
  scaleQuantile,
  scaleQuantize,
  scaleSequential,
  scaleThreshold,
  scaleTime,
  scaleUtc,
} from 'd3';
import { forOwn } from 'lodash';
import { isWithinRange } from './index';

const SCALES = {
  band: scaleBand,
  identity: scaleIdentity,
  linear: scaleLinear,
  log: scaleLog,
  ordinal: scaleOrdinal,
  point: scalePoint,
  pow: scalePow,
  quantile: scaleQuantile,
  quantize: scaleQuantize,
  sqrt: scaleSqrt,
  sequential: scaleSequential,
  threshold: scaleThreshold,
  time: scaleTime,
  utc: scaleUtc,
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
 * This is a simple wrapper for a clamped d3Scale continuous scale
 * it returns a `clampedValue` for any value outside of the scale's clamp
 * @param {string|number} [clampedValue]
 * @param {number} [tolerance]
 * @return {function} scale
 */
export function clampedScale(clampedValue = '#ccc', tolerance) {
  let clamps;
  let baseScale;

  function scale(value) {
    if (clamps && !isWithinRange(value, clamps, tolerance)) return clampedValue;
    if (!baseScale) {
      throw new Error('clampedScale must be initialized with a base scale; see scale.base()');
    }
    return baseScale(value);
  }

  scale.base = (base) => {
    if (!base) return baseScale;

    if (!baseScale) {
      baseScale = base.clamp(true);
    } else {
      // copy over existing configuration
      const existingDomain = baseScale.domain().slice();
      const existingRange = baseScale.range().slice();
      baseScale = base
        .domain(existingDomain)
        .range(existingRange)
        .clamp(true);
    }
    return scale;
  };

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
      throw new Error('clampedScale.clamps must be an array of [minClampingExtent, maxClampingExtent]');
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
      if (clamps && !isWithinRange(value, clamps, tolerance)) return clampedValue;
      if (!baseScale) {
        throw new Error('clampedScale must be initialized with a base scale; see scale.base()');
      }
      return baseScale(value);
    };

    forOwn(scale, (fn, key) => {
      if (!target.hasOwnProperty(key)) target[key] = fn;
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
