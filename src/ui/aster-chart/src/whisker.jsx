import React from 'react';

export default function AsterWhisker(props) {
  const { x1, x2, y1, y2 } = props;

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
    />
  );
}

AsterWhisker.propTypes = {
  /**
   * the x1 attribute of the whisker line
   */
  x1: React.PropTypes.number.isRequired,

  /**
   * the x2 attribute of the whisker line
   */
  x2: React.PropTypes.number.isRequired,

  /**
   * the y1 attribute of the whisker line
   */
  y1: React.PropTypes.number.isRequired,

  /**
   * the y2 attribute of the whisker line
   */
  y2: React.PropTypes.number.isRequired,
};

