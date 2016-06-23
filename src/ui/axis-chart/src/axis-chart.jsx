import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { getScale, getScaleTypes } from '../../../utils';

const SCALE_TYPES = getScaleTypes();

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
  xScaleType: PropTypes.oneOf(SCALE_TYPES),

  /* [min, max] yScale (i.e., the range of the data) */
  yDomain: PropTypes.array,

  /* type of scale */
  yScaleType: PropTypes.oneOf(SCALE_TYPES),

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

  children: PropTypes.node,
};

const defaultProps = {
  extraClasses: [],
  margins: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
  },
  xScaleType: 'linear'
};

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
    const dimensions = calcDimensions(props.width, props.height, props.margins);

    this.setState({
      dimensions,
      scales: {
        x: getScale(props.xScaleType)().domain(props.xDomain).range([0, dimensions.width]),
        y: getScale(props.yScaleType)().domain(props.yDomain).range([dimensions.height, 0])
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
              return child && React.cloneElement(child, { scales, dimensions });
            })
          }
        </g>
      </svg>
    );
  }
}

AxisChart.propTypes = propTypes;

AxisChart.defaultProps = defaultProps;
