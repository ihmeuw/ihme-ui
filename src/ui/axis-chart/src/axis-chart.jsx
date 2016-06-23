import React, { PropTypes } from 'react';
import classNames from 'classnames';
import d3Scale from 'd3-scale';

const SCALE_TYPES = {
  band: d3Scale.scaleBand,
  linear: d3Scale.scaleLinear,
  ordinal: d3Scale.scaleOrdinal,
  point: d3Scale.scalePoint
};

const propTypes = {
  /* extra class names to appended to the element */
  extraClasses: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.object
  ]),

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
    bottom: PropTypes.number,
    right: PropTypes.number,
    left: PropTypes.number
  }),

  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

const defaultProps = {
  extraClasses: [],
  margins: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  },
  xScaleType: 'ordinal'
};

export function getScale(type) {
  return SCALE_TYPES[type]() || SCALE_TYPES.linear();
}

export function calcDimensions(width, height, margins) {
  return {
    width: width - (margins.left + margins.right),
    height: height - (margins.top + margins.bottom)
  };
}

export default class AxisChart extends React.Component {
  componentWillMount() {
    this.componentWillReceiveProps(this.props);
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
    const dimensions = calcDimensions(width, height, margins);

    this.setState({
      dimensions,
      scales: {
        x: getScale(xScaleType).domain(xDomain).range([0, dimensions.width]),
        y: getScale(yScaleType).domain(yDomain).range([dimensions.height, 0])
      }
    });
  }

  render() {
    const { margins } = this.props;
    const { dimensions, scales } = this.state;

    return (
      <svg
        width={`${dimensions.width + margins.left + margins.right}px`}
        height={`${dimensions.height + margins.bottom + margins.top}px`}
        className={classNames(this.props.extraClasses)}
      >
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          {
            React.Children.map(this.props.children, (child) => {
              if (child === undefined || child === null) return child;
              return React.cloneElement(child, { scales, dimensions });
            })
          }
        </g>
      </svg>
    );
  }
}

AxisChart.propTypes = propTypes;

AxisChart.defaultProps = defaultProps;
