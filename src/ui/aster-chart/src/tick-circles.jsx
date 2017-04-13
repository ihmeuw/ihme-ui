import React from 'react';
import { map } from 'lodash';
import { scaleLinear } from 'd3';

import { CommonPropTypes } from '../../../utils';
import { linspace } from '../../../utils/array';
import AsterTickCircle from './tick-circle';

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

  const tickValues = linspace(domain, ticks);

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
}

AsterTickCircles.propTypes = {
  /**
   * array of inner elements of the aster
   */
  children: React.PropTypes.oneOfType([
    CommonPropTypes.children,
    React.PropTypes.arrayOf(CommonPropTypes.children),
  ]).isRequired,

  /**
   * domain of data
   */
  domain: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,

  /**
   * size of the inner radius of the aster-chart
   */
  innerRadius: React.PropTypes.number.isRequired,

  /**
   * styles of inner ticks
   */
  innerTickStyle: React.PropTypes.shape({
    stroke: React.PropTypes.string,
    fill: React.PropTypes.string,
    strokeDasharray: React.PropTypes.string,
  }),

  /**
   * styles of outer ticks
   */
  outerTickStyle: React.PropTypes.shape({
    stroke: React.PropTypes.string,
    fill: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
  }),

  /**
   * radius of aster-chart
   */
  radius: React.PropTypes.number.isRequired,

  /**
   * number of tick circles
   */
  ticks: React.PropTypes.number.isRequired,
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
