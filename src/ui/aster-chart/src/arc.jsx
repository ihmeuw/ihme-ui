import React from 'react';

import { CommonPropTypes } from '../../../utils';

export default function AsterArc(props) {
  const { className, d, fill, stroke, style } = props;

  return (
    <path
      className={className}
      d={d}
      fill={fill}
      stroke={stroke}
      style={style}
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
   * the svg fill of the arc
   */
  fill: React.PropTypes.string,

  /**
   * the svg stroke attribute of the arc
   */
  stroke: React.PropTypes.string,

  /**
   * the svg stroke attribute of the arc
   */
  style: CommonPropTypes.style,
};

AsterArc.defaultProps = {
  className: 'arc',
  fill: 'none',
  stroke: 'none',
  style: {},
};
