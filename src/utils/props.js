import { PropTypes } from 'react';
import identity from 'lodash/identity';
import includes from 'lodash/includes';
import intersection from 'lodash/intersection';
import noop from 'lodash/noop';
import reduce from 'lodash/reduce';

export const CommonPropTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
  style: PropTypes.oneOfType([
    PropTypes.object, // e.g., inline styles
    PropTypes.func, // function to be passed some datum, required to return an object
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export const CommonDefaultProps = {
  noop,
  identity,
};

export function exactlyOneOfProp(propTypes) {
  return (props, propName, componentName, location, propFullName) => {
    let error = null;
    const validProps = intersection(Object.keys(props), Object.keys(propTypes));
    if (validProps.length === 1) {
      if (validProps[0] === propName) {
        error = propTypes[propName](props, propName, componentName, location, propFullName);
      }
    } else {
      /* eslint-disable max-len */
      error = `Exactly one of prop [\`${Object.keys(propTypes).join('`,`')}\`] must be specified in \`${componentName}\`. Found: [${validProps.length ? `\`${validProps.join('`,`')}\`` : ''}].`;
      /* eslint-enable max-len */
    }
    return error && new Error(error);
  };
}

export function atLeastOneOfProp(propTypes) {
  return (props, propName, componentName, location, propFullName) => {
    let error = null;
    const validProps = intersection(Object.keys(props), Object.keys(propTypes));
    if (validProps.length > 0) {
      if (includes(validProps, propName)) {
        error = propTypes[propName](props, propName, componentName, location, propFullName);
      }
    } else {
      /* eslint-disable max-len */
      error = `At least one of prop [\`${Object.keys(propTypes).join('`,`')}\`] must be specified in \`${componentName}\`.`;
      /* eslint-enable max-len */
    }
    return error && new Error(error);
  };
}

export function propsChanged(prevProps, nextProps, propsToCompare, propsToOmit) {
  return !reduce(propsToCompare || Object.keys(nextProps), (acc, prop) => {
    return acc && (includes(propsToOmit, prop) || prevProps[prop] === nextProps[prop]);
  }, true);
}

/**
 * Helper function to build a state object from updated props.
 *
 * The `propUpdates` object will define the prop name and the comparison action. The comparison
 * action is a callback with signature (accumulator, propName, prevProps, nextProps), that
 * evaluates the prop changes, and determines what to add to the state. The return value will be
 * the new accumulated state. It is important to return the accumulator even if no relevant prop
 * changes are found.
 *
 * @param {{ propName: comparisonActionCallback }} propUpdates - prop name and comparison action function.
 * @param {Object} prevProps
 * @param {Object} nextProps
 * @param {Object} state
 * @returns {Object} accumulated state.
 */
export function stateFromPropUpdates(propUpdates, prevProps, nextProps, state) {
  return reduce(propUpdates, (acc, value, key) => {
    return value(acc, key, prevProps, nextProps);
  }, state);
}

/**
 * Helper function to plug into `stateFromPropUpdates` to provide simplified comparison and update
 * functionality.
 *
 * The `func` callback will be called if the immediate prop has changed. Its signature is
 * (nextProp, propName, nextProps), and it determines what to add to the state. The return value
 * will be the new accumulated state.
 *
 * @param {updateFuncCallback} func
 * @returns {comparisonActionCallback} comparison action callback.
 */
export function updateFunc(func) {
  return (acc, key, prevProps = {}, nextProps) => {
    return prevProps[key] !== nextProps[key] ?
      { ...acc, ...func(nextProps[key], key, nextProps) } :
      acc;
  };
}

/**
 * @callback comparisonActionCallback
 * @param {Object} state accumulator
 * @param {string} propName
 * @param {Object} prevProps
 * @param {Object} nextProps
 */

/**
 * @callback updateFuncCallback
 * @param {any} nextProp
 * @param {string} propName
 * @param {Object} nextProps
 * @returns {Object} accumulated state.
 */
