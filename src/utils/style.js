import assign from 'lodash/assign';
import castArray from 'lodash/castArray';
import reduce from 'lodash/reduce';

/**
 * Given list of inline-style objects and/or functions,
 * return single inline-style object
 * @param {array} [styles=[]] - inline-style objects and/or functions that resolve to objects
 * @param {...any} [args] - any arguments to call style functions with
 */
export function combineStyles(styles = [], ...args) {
  return reduce(castArray(styles), (accum, style) => {
    const resolvedStyle = typeof style === 'function' ? style(...args) : style;
    return assign({}, accum, resolvedStyle);
  }, {});
}
