import React, { PropTypes } from 'react';
import map from 'lodash/map';

import Line from './line';

const propTypes = {
  // array of arrays (each sub-array will be a line)
  data: PropTypes.array
};

export default class LineWrapper extends React.Component {

  render() {
    const { data } = this.props;
    return (
      <g>
        {
          map(data, (lineData) => {
            return <Line data={lineData} />;
          })
        }
      </g>
    );
  }
}

LineWrapper.propTypes = propTypes;
