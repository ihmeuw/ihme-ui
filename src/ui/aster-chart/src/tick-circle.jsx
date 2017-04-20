import React from 'react';
import classNames from 'classnames';
import { CommonPropTypes } from '../../../utils';

export default function AsterTickCircle({ className, r }) {
  return (
    <circle
      r={r}
      className={classNames(className)}
    />
  );
}

AsterTickCircle.propTypes = {
  /**
   * css class for the aster circle
   */
  className: CommonPropTypes.className.isRequired,

  /**
   * the radius of the circle
   */
  r: React.PropTypes.number.isRequired,
};
