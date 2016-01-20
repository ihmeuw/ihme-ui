import { PropTypes } from 'react';
import { isFinite } from 'lodash.isfinite';

const propTypes = {
  anchor: PropTypes.oneOf(['start', 'end']).isRequired,
  xPosition: PropTypes.number.isRequired,
  yPosition: PropTypes.number,
  value: PropTypes.number
};

const defaultProps = {
  yPosition: 22,
  value: null
};

export default const SliderLabel = (props) => {
    const { xPosition, yPosition, value, anchor } = props;

    if (!isFinite(xPosition) || !isFinite(value) || xPosition < 0) return null;

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
  }
};

SliderLabel.propTypes = propTypes;

SliderLabel.defaultProps = defaultProps;
