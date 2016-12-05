import { getStringWidth } from '../../../../utils';

/**
 *
 * @param {array} options - array of option objects
 * @param {string} labelKey - key on option objects holding options' label
 * @param {bool} hierarchical - whether or not to take into account padding due to hierarchy
 * @param {number} [levelPadding] - optional padding (in px) to apply per level (only if hierarchical)
 * @returns {number} - pixel width of widest label
 */
export const getWidestLabel = (
  options = [],
  labelKey = '',
  hierarchical = false,
  levelPadding = 5
) => {
  return options.reduce((maxWidth, option) => {
    const labelWidth = getStringWidth(option[labelKey]);

    // take padding into account for hierarchically displayed list
    const fullWidth = hierarchical
      ? labelWidth + levelPadding * option.level
      : labelWidth;

    return Math.max(maxWidth, fullWidth);
  }, 0);
};
