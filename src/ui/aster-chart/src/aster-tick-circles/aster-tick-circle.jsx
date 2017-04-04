import React from 'react';

export default function AsterTickCircle(props) {
  const { r, style } = props;

  return (
    <circle
      r={r}
      style={style}
    />
  );
};

AsterTickCircle.propTypes = {
  /**
   * the radius of the circle
   */
  r: React.PropTypes.number,

  /**
   * inline style of circle
   */
  style: React.PropTypes.object,
};
