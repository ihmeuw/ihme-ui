import { scaleLinear } from 'd3-scale';
import { generateColorDomain } from '../utils';

/**
 * 11 step diverging color scale
 * take from colorbrewer (http://colorbrewer2.org/)
 */
export const colorSteps = [
  '#a50026', // dark red
  '#d73027',
  '#f46d43',
  '#fdae61',
  '#fee090',
  '#ffffbf', // light yellow
  '#e0f3f8',
  '#abd9e9',
  '#74add1',
  '#4575b4',
  '#313695' // dark blue
];

/**
 * Basic, clamped, linear color scale
 * @param {Array} domain -> [min, max]
 * @returns {*}
 */
export const baseColorScale = (domain = [0, 1]) => {
  return scaleLinear()
    .domain(generateColorDomain(colorSteps, domain))
    .range(colorSteps)
    .clamp(true);
};
