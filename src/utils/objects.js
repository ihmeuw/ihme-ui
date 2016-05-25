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
