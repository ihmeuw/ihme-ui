import React from 'react';
import { map } from 'lodash';
const { scaleLinear } = require('d3-scale');

import { innerRange } from '../../utils';
import AsterTickCircle from './aster-tick-circle';

export default function AsterTickCircles(props) {
  const {
    children,
    domain,
    innerRadius,
    innerTickStyle,
    outerTickStyle,
    radius,
    ticks,
  } = props;

  const tickValues = innerRange(domain[0], domain[1], ticks);

  // scale function to pass tick circles | set as default, but can be overridden
  const scaleFunction = scaleLinear()
    .domain(domain)
    .range([radius, innerRadius]);

  return (
    <g>
      <g>
        {
          map(tickValues.slice(1, -1), (d, i) => (
            <AsterTickCircle
              r={scaleFunction(d)}
              key={i}
              style={innerTickStyle}
            />
          ))
        }
      </g>

      {children}

      <g>
        {
          map([tickValues[0], tickValues[tickValues.length - 1]], (d, i) => (
            <AsterTickCircle
              r={scaleFunction(d)}
              key={i}
              style={outerTickStyle}
            />
        ))}
      </g>
    </g>
  );
};

AsterTickCircles.propTypes = {
  /**
   * array of inner elements of the aster
   */
  children: React.PropTypes.array,

  /**
   * style of inner ticks
   */
  innerTickStyle: React.PropTypes.object,

  /**
   * function to scale radius
   */
  scaleFunction: React.PropTypes.func,

  /**
   * array of tick values
   */
  tickValues: React.PropTypes.array,

  /**
   * style of outer ticks
   */
  outerTickStyle: React.PropTypes.object,
};

AsterTickCircles.defaultProps = {
  innerTickStyle: {
    stroke: 'gray',
    fill: 'none',
    strokeDasharray: '4 4',
  },
  outerTickStyle: {
    stroke: 'gray',
    fill: 'none',
    strokeWidth: '2px'
  },
};
