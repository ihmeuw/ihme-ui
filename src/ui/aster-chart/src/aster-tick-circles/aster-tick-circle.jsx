import React from 'react';

export default function AsterTickCircle(props) {
  const { r, style } = props;

  return (
    <circle
      r={r}
      style={style}
    />
  );
}

AsterTickCircle.propTypes = {
  /**
   * the radius of the circle
   */
  r: React.PropTypes.number.isRequired,

  /**
   * inline style of circle
   */
  style: React.PropTypes.shape({
    stroke: React.PropTypes.string,
    fill: React.PropTypes.string,
    strokeDasharray: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
  }).isRequired,
};
