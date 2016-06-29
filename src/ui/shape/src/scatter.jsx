import React, { PropTypes } from 'react';
import { includes, map, noop, omit } from 'lodash';
import d3Scale from 'd3-scale';

import Symbol from './symbol';

export default function Scatter(props) {
  const {
    color,
    colorScale,
    data,
    dataAccessors,
    focus,
    scales,
    selection,
    symbolType
  } = props;

  // test to make sure both scales are present.
  const xScale = scales.x ? scales.x : d3Scale.scaleLinear();
  const yScale = scales.y ? scales.y : d3Scale.scaleLinear();

  const childProps = omit(props, [
    'color',
    'data',
    'dataAccessors',
    'focus',
    'scales',
    'selection',
    'symbolType'
  ]);

  return (
    <g>
      {
        map(data, (plotDatum, i) => {
          const xValue = plotDatum[dataAccessors.x];
          const yValue = plotDatum[dataAccessors.y];
          const key = `${xValue}:${yValue}:${i}`;
          return (
            <Symbol
              key={key}
              color={colorScale ? colorScale(xValue) : color}
              data={plotDatum}
              focused={focus === plotDatum}
              selected={includes(selection, plotDatum)}
              translateX={xValue ? xScale(xValue) : 0}
              translateY={yValue ? yScale(yValue) : 0}
              type={symbolType}
              {...childProps}
            />
          );
        })
      }
    </g>
  );
}

Scatter.propTypes = {
  /*
  string for the color of this data group
  */
  color: PropTypes.string,

  /*
  function for a scale of colors. If present, overrides color
  */
  colorScale: PropTypes.func,

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
  key names for accessing x and y data.
  */
  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }).isRequired,

  focus: PropTypes.object,

  onClick: PropTypes.func,

  onMouseLeave: PropTypes.func,

  onMouseMove: PropTypes.func,

  onMouseOver: PropTypes.func,

  /*
    scales from d3Scale
  */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }),

  selection: PropTypes.array,

  /*
  size of symbols
  */
  size: PropTypes.number,

  /*
    string for the type of symbol to be used
  */
  symbolType: PropTypes.string
};

Scatter.defaultProps = {
  color: 'steelblue',
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
  scales: {
    x: d3Scale.scaleLinear(),
    y: d3Scale.scaleLinear()
  },
  symbolType: 'circle'
};
