import React, { PropTypes } from 'react';
import d3Scale from 'd3-scale';

const SCALE_TYPES = {
  band: d3Scale.scaleBand,
  linear: d3Scale.scaleLinear,
  ordinal: d3Scale.scaleOrdinal,
  point: d3Scale.scalePoint
};

const propTypes = {
  /* [min, max] for xScale (i.e., the domain of the data) */
  xDomain: PropTypes.array,

  /* type of scale */
  xScaleType: PropTypes.oneOf(Object.keys(SCALE_TYPES)),

  /* [min, max] yScale (i.e., the range of the data) */
  yDomain: PropTypes.array,

  /* type of scale */
  yScaleType: PropTypes.oneOf(Object.keys(SCALE_TYPES)),

  /* px width of line chart */
  width: PropTypes.number,

  /* px height of line chart */
  height: PropTypes.number,

  /* margins to subtract from width and height */
  margins: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),

  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

const defaultProps = {
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },
  xScaleType: 'ordinal'
};

export default class LineChart extends React.Component {

  componentWillMount() {
    const {
      width,
      height,
      margins,
      xDomain,
      xScaleType,
      yDomain,
      yScaleType
    } = this.props;
    const dimensions = this.calcDimensions(width, height, margins);

    this.setState({
      dimensions,
      scales: {
        x: this.getScale(xScaleType).domain(xDomain).range([0, dimensions.width]),
        y: this.getScale(yScaleType).domain(yDomain).range([dimensions.height, 0])
      }
    });
  }

  componentWillReceiveProps(props) {
    const {
      width,
      height,
      margins,
      xDomain,
      xScaleType,
      yDomain,
      yScaleType
    } = props;
    const dimensions = this.calcDimensions(width, height, margins);

    this.setState({
      dimensions,
      scales: {
        x: this.getScale(xScaleType).domain(xDomain).range([0, dimensions.width]),
        y: this.getScale(yScaleType).domain(yDomain).range([dimensions.height, 0])
      }
    });
  }

  // TODO maybe refactor following methods out of class
  getScale(type) {
    return SCALE_TYPES[type]() || SCALE_TYPES.linear();
  }

  calcDimensions(width, height, margins) {
    return {
      width: width - (margins.left + margins.right),
      height: height - (margins.top + margins.bottom)
    };
  }

  render() {
    const { children } = this.props;
    const { dimensions, scales } = this.state;

    return (
      <svg
        width={`${dimensions.width}px`}
        height={`${dimensions.height}px`}
      >
        {
          React.Children.map(children, (child) => {
            return React.cloneElement(child, { scales });
          })
        }
      </svg>
    );
  }
}

LineChart.propTypes = propTypes;
LineChart.defaultProps = defaultProps;
