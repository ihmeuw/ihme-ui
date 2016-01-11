/**
 * Take values from range of scale and convert into values within its domain
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
