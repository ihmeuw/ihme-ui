import React, { PropTypes } from 'react';

import { map, omit, noop } from 'lodash';

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
  }).isRequired,

  /*
    string for the type of symbol to be used
  */
  symbolType: PropTypes.string,

  /*
    string for the color of this data group
  */
  color: PropTypes.string,

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
  symbolType: 'circle',
  color: 'steelblue'
};

export default function Scatter(props) {
  const {
    data,
    symbolType,
    color,
    scales,
    dataAccessors
  } = props;

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
        map(data, (plotDatum) => {
          return (
            <Symbol
              key={`${plotDatum[dataAccessors.x]}:${plotDatum[dataAccessors.y]}`}
              data={plotDatum}
              type={symbolType}
              position={{
                x: plotDatum[dataAccessors.x] ? scales.x(plotDatum[dataAccessors.x]) : 0,
                y: plotDatum[dataAccessors.y] ? scales.y(plotDatum[dataAccessors.y]) : 0
              }}
              color={color}
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
