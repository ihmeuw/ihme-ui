import { getStringWidth } from '../../../../utils';

/**
 *
 * @param options {Array} -> array of option objects
 * @param labelKey {String} -> key on option objects holding options' label
 * @param hierarchical {Boolean} -> whether or not to take into account padding due to hierarchy
 * @returns {Number} pixel width of widest label
 */
export const getWidestLabel = (options = [], labelKey = '', hierarchical = false) => {
  return options.reduce((maxWidth, option) => {
    const labelWidth = getStringWidth(option[labelKey]);

    // take padding into account for hierarchically displayed list
    const fullWidth = hierarchical ? labelWidth + 5 * option.level : labelWidth;

    return Math.max(maxWidth, fullWidth);
  }, 0);
};
