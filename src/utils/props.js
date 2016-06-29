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
  style: PropTypes.object,
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

export function stateFromPropUpdates(propUpdates, prevProps, nextProps, state) {
  return reduce(propUpdates, (acc, value, key) => {
    return value(acc, key, prevProps, nextProps);
  }, state);
}

export function updateFunc(func) {
  return (acc, key, prevProps = {}, nextProps) => {
    return prevProps[key] !== nextProps[key] ?
      { ...acc, ...func(nextProps[key], key, nextProps) } :
      acc;
  };
}
