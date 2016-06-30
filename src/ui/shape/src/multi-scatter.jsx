import React, { PropTypes } from 'react';

import { castArray, map, noop, omit } from 'lodash';
import { scaleLinear } from 'd3-scale';

import Scatter from './scatter';

export default function MultiScatter(props) {
  const {
    colorScale,
    data,
    dataField,
    focus,
    keyField,
    selection,
    symbolScale,
  } = props;

  const childProps = omit(props, [
    'colorScale',
    'data',
    'dataField',
    'keyField',
    'symbolField',
    'symbolScale',
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
              color={color}
              data={values}
              key={`scatter:${key}`}
              selection={castArray(selection)}
              focus={focus}
              symbolType={symbolType}
              {...childProps}
            />
          );
        })
      }
    </g>
  );
}

MultiScatter.propTypes = {
  /*
  function that accepts keyField, and returns a color for the symbol.
  */
  colorScale: PropTypes.func,

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
  key names for accessing x and y data.
  */
  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }).isRequired,

  /*
  key that holds individual datum to be represented in the scatter plot.
  */
  dataField: PropTypes.string,

  /*
    unique key that identifies the dataset to be plotted within the array of datasets.
  */
  keyField: PropTypes.string,

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
  }).isRequired,

  selection: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),

  focus: PropTypes.object,

  /*
  size of symbols.
  */
  size: PropTypes.number,

  /*
    key name for value of symbol
  */
  symbolField: PropTypes.string,

  /*
    function to transform symbol value to a shape
  */
  symbolScale: PropTypes.func
};

MultiScatter.defaultProps = {
  colorScale: () => { return 'steelblue'; },
  dataField: 'values',
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
  symbolField: 'type',
  symbolScale: () => { return 'circle'; },
  scales: { x: scaleLinear(), y: scaleLinear() },
};
