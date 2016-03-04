import React, { PropTypes } from 'react';

import { map, omit } from 'lodash';

import Symbol from './symbol';


const propTypes = {
  // array of objects
  // e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ]
  data: PropTypes.arrayOf(PropTypes.object),

  // key name for topic of data
  keyField: PropTypes.string,

  // key name for values representing individual lines
  dataField: PropTypes.string,

  symbolField: PropTypes.string,

  // scales from d3Scale
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  style: PropTypes.object,

  // key names containing x, y data
  dataAccessors: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string
  }).isRequired,

  clickHandler: PropTypes.func,

  hoverHandler: PropTypes.func
};

const defaultProps = {
  size: 64,
  clickHandler: () => { return () => { return; }; },
  hoverHandler: () => { return () => { return; }; }
};

const ScatterPlot = (props) => {
  const childProps = omit(props, ['data', 'keyField', 'dataField', 'symbolField']);
  const {
    data,
    keyField,
    dataField,
    symbolField,
    dataAccessors,
    scales,
    size
  } = props;

  return (
    <g>
      {
        map(data, (datum) => {
          const symbolType = datum[symbolField];

          return map(datum[dataField], (plotDatum) => {
            const position = {
              x: scales.x(plotDatum[dataAccessors.x]),
              y: scales.y(plotDatum[dataAccessors.y])
            };

            return (
              <Symbol
                key={`${keyField}::${plotDatum[dataAccessors.x]},${plotDatum[dataAccessors.y]}`}
                data={plotDatum}
                type={symbolType}
                position={position}
                size={size}
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
