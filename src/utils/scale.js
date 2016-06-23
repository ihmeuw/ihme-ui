import d3Scale from 'd3-scale';
import transform from 'lodash/transform';
import camelCase from 'lodash/camelCase';

/**
 * Get a list of shortened d3 scale names.
 * @returns {Array} list of shortened scale names.
 */
export function getScaleTypes() {
  return transform(Object.keys(d3Scale), (acc, key) => {
    if (key.startsWith('scale')) acc.push(key.toLowerCase().replace('scale', ''));
  });
}

/**
 * Get a d3 scale by shortened name.
 * @param type
 * @returns {scale|linear} specified scale type. Defaults to `linear`.
 */
export function getScale(type) {
  return (d3Scale[camelCase(`scale ${type}`)] || d3Scale.scaleLinear);
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
