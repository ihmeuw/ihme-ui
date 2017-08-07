/* global window */

import { getRenderedStringWidth } from '../../../../utils';

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
    const canvasContext = window && window.document.createElement('canvas').getContext('2d');
    const labelWidth = getRenderedStringWidth(option[labelKey], '12px Verdana', canvasContext);

    // take padding into account for hierarchically displayed list
    const fullWidth = hierarchical
      ? labelWidth + levelPadding * option.level
      : labelWidth;

    return Math.max(maxWidth, fullWidth);
  }, 0);
};

export const FLIP_MENU_UPWARDS_INLINE_STYLE = {
  borderRadius: '4px 4px 0 0',
  bottom: '100%',
  marginTop: '0px',
  marginBottom: '-1px',
  top: 'auto',
};
