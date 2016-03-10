import React, { PropTypes } from 'react';
import { map, omit, noop, isFunction } from 'lodash';

import Symbol from './symbol';

const propTypes = {
  // array of objects
  // e.g. [ {location: 'USA', values: []}, {location: 'Canada', values: []} ]
  data: PropTypes.arrayOf(PropTypes.object),

  // key name for topic of data
  keyField: PropTypes.string,

  // key name for values representing individual lines
  dataField: PropTypes.string,

  // key name for value of symbol
  symbolField: PropTypes.string,

  // function to transform symbol value to a shape
  symbolScale: PropTypes.func,

  // scales from d3Scale
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  style: PropTypes.object,

  size: PropTypes.number,

  // key names containing x, y data
  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }).isRequired,

  clickHandler: PropTypes.func,

  hoverHandler: PropTypes.func
};

const defaultProps = {
  clickHandler: noop,
  hoverHandler: noop
};

const ScatterPlot = (props) => {
  const childProps = omit(props, [
    'data',
    'keyField',
    'dataField',
    'symbolField',
    'symbolScale',
    'dataAccessors'
  ]);

  const {
    data,
    keyField,
    dataField,
    symbolField,
    symbolScale,
    dataAccessors,
    scales,
  } = props;

  return (
    <g>
      {
        map(data, (datum) => {
          const symbolType = isFunction(symbolScale)
            ? symbolScale(datum[symbolField])
            : datum[symbolField];

          return map(datum[dataField], (plotDatum) => {
            const position = {
              x: scales.x(plotDatum[dataAccessors.x]),
              y: scales.y(plotDatum[dataAccessors.y])
            };

            return (
              <Symbol
                key={`${datum[keyField]}:${plotDatum[dataAccessors.x]}`}
                data={plotDatum}
                type={symbolType}
                position={position}
                {...childProps}
              />
            );
          });
        })
      }
    </g>
  );
};

ScatterPlot.propTypes = propTypes;

ScatterPlot.defaultProps = defaultProps;

export default ScatterPlot;
