import { PropTypes } from 'react';
import intersection from 'lodash/intersection';

export const CommonPropTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ])
};

export function oneOfProp(propTypes) {
  return (props, propName, componentName, location, propFullName) => {
    let error = null;
    const validProps = intersection(Object.keys(props), Object.keys(propTypes));
    if (validProps.length === 1) {
      if (validProps[0] === propName) {
        error = propTypes[propName](props, propName, componentName, location, propFullName);
      }
    } else {
      /* eslint-disable max-len */
      error = `Exactly one of prop [\`${Object.keys(propTypes).join('`,`')}\`] must be specified in \`${componentName}\`.`;
      /* eslint-enable max-len */
    }
    return error && new Error(error);
  };
}
