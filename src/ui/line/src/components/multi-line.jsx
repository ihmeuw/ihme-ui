import React, { PropTypes } from 'react';
import map from 'lodash/map';
import omit from 'lodash/omit';

import Line from './line';

const propTypes = {
  // array of objects
  // e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ]
  data: PropTypes.arrayOf(PropTypes.object),

  // key name for topic of data
  keyField: PropTypes.string,

  // key name for values representing individual lines
  dataField: PropTypes.string,

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

export default class MultiLine extends React.Component {

  render() {
    const childProps = omit(this.props, ['data', 'keyField', 'dataField']);
    const {
      keyField,
      dataField,
      data
    } = this.props;

    return (
      <g>
        {
          // on each iteration, lineData is an object
          // e.g., { keyField: STRING, dataField: ARRAY }
          map(data, (lineData) => {
            return (
              <Line
                key={lineData[keyField]}
                data={lineData[dataField]}
                {...childProps}
              />);
          })
        }
      </g>
    );
  }
}

MultiLine.propTypes = propTypes;
