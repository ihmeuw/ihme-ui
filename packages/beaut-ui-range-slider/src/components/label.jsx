import React, { PropTypes } from 'react';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anchor: PropTypes.oneOf(['start', 'middle', 'end']).isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number,
    shift: PropTypes.number // how much to shift label left or right
  }).isRequired
};

const defaultProps = {
  position: {
    x: 0,
    y: 22,
    shift: 8
  },
  value: null
};

const positionLabel = (anchor, x, shift) => {
  switch (anchor) {
    case 'start':
      return x - shift;
    case 'middle':
      return x;
    case 'end':
      return x + shift;
    default:
      return x;
  };
};

const Label = (props) => {
  const { position: { x, y, shift }, value, anchor } = props;

  return (
    <text
      textAnchor={anchor}
      fill='black'
      y={y}
      x={positionLabel(anchor, x, shift)}
    >
      {(typeof value === 'number') ? value.toFixed(1) : value}
    </text>
  );
};

Label.propTypes = propTypes;

Label.defaultProps = defaultProps;

export default Label;
