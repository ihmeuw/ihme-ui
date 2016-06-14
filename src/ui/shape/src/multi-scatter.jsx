import React, { PropTypes } from 'react';

import { map, omit, noop } from 'lodash';

import Scatter from './scatter';

const propTypes = {
  /*
    array of object
    e.g.
    [
      {keyField: 'USA', dataField: []},
      {keyField: 'Canada', dataField: []},
      {keyField: 'Mexico', dataField: []}
    ]
  */
  data: PropTypes.arrayOf(PropTypes.object),

  /*
    unique key that identifies the dataset to be plotted within the array of datasets.
  */
  keyField: PropTypes.string,

  /*
    key that holds individual datum to be represented in the scatter plot.
  */
  dataField: PropTypes.string,

  /*
    key name for value of symbol
  */
  symbolField: PropTypes.string,

  /*
    function to transform symbol value to a shape
  */
  symbolScale: PropTypes.func,

  /*
    function that accepts keyField, and returns a color for the symbol.
  */
  colorScale: PropTypes.func,

  /*
    scales from d3Scale
  */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  /*
    size of symbols.
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
  dataField: 'values',
  symbolField: 'type',
  colorScale: () => { return 'steelblue'; },
  symbolScale: () => { return 'circle'; }
};

export default function MultiScatter(props) {
  const {
    colorScale,
    symbolScale,
    keyField,
    dataField,
    data,
  } = props;

  const childProps = omit(props, [
    'data',
    'keyField',
    'dataField',
    'symbolField',
    'symbolScale',
    'colorScale',
  ]);

  return (
    <g>
      {
        map(data, (scatterData) => {
          const key = scatterData[keyField];
          const values = scatterData[dataField];
          const color = colorScale(scatterData[keyField]);
          const symbolType = symbolScale(scatterData[keyField]);

          return (
            <Scatter
              key={`scatter:${key}`}
              data={values}
              color={color}
              symbolType={symbolType}
              {...childProps}
            />
          );
        })
      }
    </g>
  );
}

MultiScatter.propTypes = propTypes;

MultiScatter.defaultProps = defaultProps;
