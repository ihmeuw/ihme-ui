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
 * Quick Merge merges 1 level of properties of source objects into the target object,
 * and returns the target object.
 *
 * usage:
 *  source1 = {
 *    feature: { global: ..., canada: ..., },
 *    mesh: { borders: ..., },
 *  }
 *
 *  source2 = {
 *    feature: { usa: ... },
 *  }
 *
 *  quickMerge({}, source1, source2)
 *  -> {
 *       feature: { global: ..., canada: ..., usa: ..., },
 *       mesh: { borders: ..., },
 *     }
 *
 * @param {Object} target -> target object
 * @param {Object} sources -> source objects
 * @returns {Object} Merged target object
 */
export function quickMerge(target = {}, ...sources) {
  return reduce(sources, (acc, source) => {
    return Object.assign(acc, reduce(source, (acc2, obj, key) => {
      return {
        ...acc2,
        [key]: {
          ...acc2[key],
          ...obj
        }
      };
    }, acc));
  }, target);
}
