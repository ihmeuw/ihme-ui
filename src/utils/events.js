/**
 * a generalized function for passing an event object as the first arg
 * to a given event handler, along with any optional args
 * @param callback {Function}
 * @param rest {Any}
 * @returns {function()}
 */
export default function eventHandleWrapper(callback, ...rest) {
  return (event) => { callback(event, ...rest); };
}
