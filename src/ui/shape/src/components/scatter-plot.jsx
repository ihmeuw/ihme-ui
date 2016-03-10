import React, { PropTypes } from 'react';
import { flatMap, map, omit, noop, isFunction } from 'lodash';

import Symbol from './symbol';

const propTypes = {
  /*
    array of objects
    e.g. [ {location: 'USA', values: []}, {location: 'Canada', values: []} ]
   */
  data: PropTypes.arrayOf(PropTypes.object),

  /* key name for topic of data */
  keyField: PropTypes.string,

  /* key name for values representing individual lines */
  dataField: PropTypes.string,

  /* key name for value of symbol */
  symbolField: PropTypes.string,

  /* function to transform symbol value to a shape */
  symbolScale: PropTypes.func,

  /* fn that accepts keyfield, and returns stroke color for line */
  colorScale: PropTypes.func,

  /* scales from d3Scale */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  size: PropTypes.number,

  /* key names containing x, y data */
  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }).isRequired,

  clickHandler: PropTypes.func,

  hoverHandler: PropTypes.func
};

const defaultProps = {
  clickHandler: noop,
  hoverHandler: noop,
  colorScale: () => { return 'steelblue'; }
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
    colorScale,
    dataAccessors,
    scales,
  } = props;

  return (
    <g>
      {
        // on each iteration, scatterData is an object
        // e.g., { keyField: STRING, dataField: ARRAY }
        flatMap(data, (scatterData) => {
          // get symbol type (e.g., 'circle', 'triangle')
          const symbolType = isFunction(symbolScale)
            ? symbolScale(scatterData[symbolField])
            : scatterData[symbolField];

          // get symbol stroke
          const symbolStroke = colorScale(scatterData[keyField]);

          // on each iteration, plotDatum is an object
          // e.g. { loc_id: 1234, sex: 2, age_id: 27, mean: 99.3, ub: 100, lb: 90.1 }
          return map(scatterData[dataField], (plotDatum) => {
            // position the symbol in the x-y plane
            const position = {
              x: scales.x(plotDatum[dataAccessors.x]),
              y: scales.y(plotDatum[dataAccessors.y])
            };

            return (
              <Symbol
                key={`${scatterData[keyField]}:${plotDatum[dataAccessors.x]}`}
                data={plotDatum}
                type={symbolType}
                position={position}
                color={symbolStroke}
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
