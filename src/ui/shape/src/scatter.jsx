import React, { PropTypes } from 'react';

import { map, omit, noop } from 'lodash';
import d3Scale from 'd3-scale';

import Symbol from './symbol';

const propTypes = {
  /*
    array of objects
    e.g.
    [
      {year_id: 2000, valueKey: 340},
      {year_id: 2001, valueKey: 350},
      ...
    ]
  */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /*
    scales from d3Scale
  */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }),

  /*
    string for the type of symbol to be used
  */
  symbolType: PropTypes.string,

  /*
    string for the color of this data group
  */
  color: PropTypes.string,

  /*
    function for a scale of colors. If present, overrides color
  */
  colorScale: PropTypes.func,

  /*
    size of symbols
  */
  size: PropTypes.number,

  /*
    key names for accessing x and y data.
  */
  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }).isRequired,

  onClick: PropTypes.func,

  onHover: PropTypes.func
};
const defaultProps = {
  onClick: noop,
  onHover: noop,
  scales: {
    x: d3Scale.scaleLinear(),
    y: d3Scale.scaleLinear()
  },
  symbolType: 'circle',
  color: 'steelblue'
};

export default function Scatter(props) {
  const {
    data,
    symbolType,
    color,
    colorScale,
    scales,
    dataAccessors
  } = props;

  // test to make sure both scales are present.
  const xScale = scales.x ? scales.x : d3Scale.scaleLinear();
  const yScale = scales.y ? scales.y : d3Scale.scaleLinear();

  const childProps = omit(props, [
    'data',
    'scales',
    'symbolType',
    'color',
    'dataAccessors'
  ]);

  return (
    <g>
      {
        map(data, (plotDatum, i) => {
          const xValue = plotDatum[dataAccessors.x];
          const yValue = plotDatum[dataAccessors.y];
          return (
            <Symbol
              key={`${xValue}:${yValue}:${i}`}
              data={plotDatum}
              type={symbolType}
              position={{
                x: xValue ? xScale(xValue) : 0,
                y: yValue ? yScale(yValue) : 0
              }}
              color={colorScale ? colorScale(xValue) : color}
              {...childProps}
            />
          );
        })
      }
    </g>
  );
}

Scatter.propTypes = propTypes;

Scatter.defaultProps = defaultProps;
