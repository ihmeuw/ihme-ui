import React, { PropTypes } from 'react';
import map from 'lodash/map';

import Line from './line';

const propTypes = {
  // array of objects
  // e.g. [ {location: 'USA',values: []}, {location: 'Canada', values: []} ]
  data: PropTypes.arrayOf(PropTypes.object),

  // describes the data objects contained in this.props.data array
  dataDescriptor: PropTypes.shape({
    keyField: PropTypes.string,
    dataField: PropTypes.string
  }),
};

export default class LineWrapper extends React.Component {

  render() {
    const {
      data,
      dataDescriptor: { keyField, dataField }
    } = this.props;

    return (
      <g>
        {
          // on each iteration, lineData is an object
          // e.g., { keyField: STRING, dataField: ARRAY }
          map(data, (lineData) => {
            return (
              <Line
                key={keyField}
                data={lineData[dataField]}
              />);
          })
        }
      </g>
    );
  }
}

LineWrapper.propTypes = propTypes;
