import React, { PropTypes } from 'react';

const propTypes = {
  value: PropTypes.number.isRequired,
  anchor: PropTypes.oneOf(['start', 'end']).isRequired,
  xPosition: PropTypes.number.isRequired,
  yPosition: PropTypes.number
};

const defaultProps = {
  yPosition: 22,
  value: null
};

const SliderLabel = (props) => {
  const { xPosition, yPosition, value, anchor } = props;

  return (
    <text
      textAnchor={anchor}
      className='range-slider-label'
      fill='black'
      y={yPosition}
      x={(anchor === 'start') ? xPosition - 8 : xPosition + 8}
    >
      {value.toFixed(1)}
    </text>
  );
};

SliderLabel.propTypes = propTypes;

SliderLabel.defaultProps = defaultProps;

export default SliderLabel;
