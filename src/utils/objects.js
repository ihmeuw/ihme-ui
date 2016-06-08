import { reduce } from 'lodash';

/**
 * if given property is a function, call it with given obj
 * otherwise, plain old object access
 * @param obj
 * @param property
 * @returns {*}
 */
export function propResolver(obj, property) {
  return typeof property === 'function' ? property(obj) : obj[property];
}

/**
 * Quick Merge merges 1 level of keyed properties of source objects into the target object.
 * @param {Object} target -> target object
 * @param {Object} sources -> source objects
 * @returns {Object} Merged target object
 */
export function quickMerge(target = {}, ...sources) {
  return reduce(sources, (acc, source) => {
    return reduce(source, (acc2, obj, key) => {
      return {
        ...acc2,
        [key]: {
          ...acc2[key],
          ...obj
        }
      };
    }, { ...acc });
  }, { ...target });
}
