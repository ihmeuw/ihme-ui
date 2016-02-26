import React, { PropTypes } from 'react';
import d3Scale from 'd3-scale';
import assign from 'lodash/assign';

const propTypes = {
  data: PropTypes.shape({
    /* [min, max] for xScale (i.e., the domain of the data) */
    xDomain: PropTypes.array,

    /* type of scale */
    xScaleType: PropTypes.oneOf(['linear', 'ordinal']),

    /* [min, max] yScale (i.e., the range of the data) */
    yDomain: PropTypes.array,

    /* type of scale */
    yScaleType: PropTypes.oneOf(['linear', 'ordinal']),

    /* array of data
      e.g. [ {location: 'USA', values: []}, {location: 'Canada', values: []} ] */
    values: PropTypes.arrayOf(PropTypes.object),

    /* uniquely identifying property on dataset, e.g., "location" */
    keyField: PropTypes.string.isRequired,

    /* name of prop on dataset that holds data array, e.g. "values" */
    valueField: PropTypes.string.isRequired,

    /* unit of data; axis label */
    unit: PropTypes.string
  }),

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
    PropTypes.node,
  ])
};

const defaultProps = {
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },
  data: {
    xScaleType: 'ordinal',
    keyField: 'key',
    valueField: 'values'
  }
};

export default class LineChart extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {
      width,
      height,
      margins,
      data: { xDomain, xScaleType, yDomain, yScaleType }
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
      data: { xDomain, xScaleType, yDomain, yScaleType }
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
    let scale;

    switch (type) {
      case 'ordinal':
        scale = d3Scale.scaleOrdinal();
        break;
      case 'linear': // falls through
      default:
        scale = d3Scale.scaleLinear();
    }
    return scale;
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

    const childProps = assign({}, scales);

    return (
      <svg
        width={`${dimensions.width}px`}
        height={`${dimensions.height}px`}
      >
        {
          React.Children.map(children, (child) => {
            return React.cloneElement(child, childProps);
          })
        }
      </svg>
    );
  }
}

LineChart.propTypes = propTypes;
LineChart.defaultProps = defaultProps;
