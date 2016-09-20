import React, { PropTypes } from 'react';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anchor: PropTypes.oneOf(['start', 'middle', 'end']).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number,
  dx: PropTypes.number,
  dy: PropTypes.number,
  fill: PropTypes.string
};

const defaultProps = {
  fill: 'black'
};

const SvgText = (props) => {
  const {
    x,
    y,
    dx,
    dy,
    value,
    anchor,
    fill
  } = props;

  return (
    <text
      textAnchor={anchor}
      fill={fill}
      y={y}
      dy={dy}
      x={x}
      dx={dx}
    >
      {value}
    </text>
  );
};

SvgText.propTypes = propTypes;

SvgText.defaultProps = defaultProps;

export default SvgText;
