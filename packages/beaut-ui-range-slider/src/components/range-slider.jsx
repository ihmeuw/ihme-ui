import React, { PropTypes } from 'react';

import LinearGradient from './linear-gradient';
import Label from './label';

const propTypes = {
  margins: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),

};

const defaultProps = {
  margins: {
    top: 20,
    right: 65,
    bottom: 0,
    left: 55
  }
};

export default class RangeSlider extends React.Component {

  render() {
    const { margins } = this.props;
    <svg preserveAspectRatio='none' height='100%'>
      <defs>
        <LinearGradient />
      </defs>
      <g transform={`translate(${margins.left}, ${margins.top})`}>
        <DensityPlot />
        <ColorLegend />
      </g>
    </svg>
  }
};

RangeSlider.propTypes = propTypes;

RangeSlider.defaultProps = defaultProps;
