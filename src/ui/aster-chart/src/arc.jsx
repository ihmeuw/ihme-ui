import React from 'react';
import classNames from 'classnames';

import { CommonPropTypes } from '../../../utils';

export default function AsterArc(props) {
  const {
    className,
    d,
    datum,
    fill,
    style,
  } = props;

  return (
    <path
      className={classNames(className)}
      d={d}
      fill={fill}
      style={(typeof style === 'function') ? style(datum) : style}
    />
  );
}

AsterArc.propTypes = {
  /**
   * the css class of the arc
   */
  className: CommonPropTypes.className,

  /**
   * the d attribute of the path of the arc
   */
  d: React.PropTypes.string.isRequired,

  /**
   * Datum object corresponding to this AsterArc ("bound" data, in the language in D3)
   */
  datum: React.PropTypes.object,

  /**
   * the svg fill of the arc
   */
  fill: React.PropTypes.string,

  /**
   * Base inline styles applied to `<AsterArc />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<AsterArc />`.
   */
  style: CommonPropTypes.style,
};

AsterArc.defaultProps = {
  className: '',
  fill: 'none',
};
