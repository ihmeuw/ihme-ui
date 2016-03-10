import React, { PropTypes } from 'react';
import { flatMap, map, omit, noop, isFunction } from 'lodash';

import Symbol from './symbol';

const propTypes = {
  /*
    array of datasets (nested) or array of datum (flat; single dataset)
    e.g., nested: [ {location: 'USA', values: []}, {location: 'Canada', values: []} ]
    e.g., flat: [{loc: 1, mean: 3.0, sex: 2, year: 2013}, {loc: 1, mean: 3.0, sex: 2, year: 2013}]
   */
  data: PropTypes.arrayOf(PropTypes.object),

  /* whether the data given to ScatterPlot is nested (i.e., contains multiple dastasets) */
  isNested: PropTypes.bool,

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
  isNested: true,
  clickHandler: noop,
  hoverHandler: noop,
  dataField: 'values',
  symbolField: 'type',
  colorScale: () => { return 'steelblue'; }
};

/*
  TODO extract shared logic out of renderMultipleDatasets and renderSingleDataset
 */
/* eslint-disable react/prop-types */
const renderMultipleDatasets = (props, childProps) => {
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

const renderSingleDataset = (props, childProps) => {
  const {
    data,
    keyField,
    dataField,
    colorScale,
    scales,
  } = props;

  return (
    <g>
      {
        // on each iteration, plotDatum is an object
        // e.g. { loc_id: 1234, sex: 2, age_id: 27, mean: 99.3, ub: 100, lb: 90.1 }
        map(data, (plotDatum) => {
          // position the symbol in the x-y plane
          const position = {
            x: scales.x(plotDatum[dataField]),
            y: 0
          };

          return (
            <Symbol
              key={`${plotDatum[keyField]}`}
              data={plotDatum}
              type={'circle'}
              position={position}
              color={colorScale(plotDatum[dataField])}
              {...childProps}
            />
          );
        })
      }
    </g>
  );
};
/* eslint-enable react/prop-types */

const ScatterPlot = (props) => {
  const { isNested } = props;
  const childProps = omit(props, [
    'data',
    'keyField',
    'dataField',
    'symbolField',
    'symbolScale',
    'dataAccessors',
    'colorScale',
    'isNested',
    'scales'
  ]);

  if (isNested) return renderMultipleDatasets(props, childProps);
  return renderSingleDataset(props, childProps);
};

ScatterPlot.propTypes = propTypes;

ScatterPlot.defaultProps = defaultProps;

export default ScatterPlot;
