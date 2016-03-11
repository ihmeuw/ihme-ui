import React, { PropTypes } from 'react';
import { map } from 'lodash';

const propTypes = {
  colors: PropTypes.array.isRequired,
  x1: PropTypes.number,
  x2: PropTypes.number,
  id: PropTypes.string
};

const defaultProps = {
  x1: 0,
  x2: 100,
  id: 'choropleth-linear-gradient-def'
};

const LinearGradient = (props) => {
  const { colors, x1, x2, id } = props;
  const offsetDivisor = colors.length - 1;

  return (
    <linearGradient
      id={id}
      x1={`${x1}%`}
      x2={`${x2}%`}
      y1="0%"
      y2="0%"
    >
      {map(colors, (color, index) => {
        return (
          <stop
            key={`${color}-${index}`}
            offset={index / offsetDivisor}
            stopColor={color}
          />
        );
      })}
    </linearGradient>
  );
};

LinearGradient.propTypes = propTypes;

LinearGradient.defaultProps = defaultProps;

export default LinearGradient;
