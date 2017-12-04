import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

const propTypes = {
  colors: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x1: PropTypes.number,
  x2: PropTypes.number
};

const defaultProps = {
  x1: 0,
  x2: 100
};

const LinearGradient = (props) => {
  const { colors, x1, x2, width, height } = props;
  const id = 'ihme-choropleth-linear-gradient-def';
  const offsetDivisor = colors.length - 1;

  return (
    <g>
      <defs>
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
      </defs>
      <rect
        x="0px"
        height={`${height}px`}
        stroke="none"
        fill={`url(#${id})`}
        width={width}
      >
      </rect>
    </g>
  );
};

LinearGradient.propTypes = propTypes;
LinearGradient.defaultProps = defaultProps;

export default LinearGradient;
