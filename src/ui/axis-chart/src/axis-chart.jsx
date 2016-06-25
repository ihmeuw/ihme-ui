import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { CommonPropTypes, getScale, getScaleTypes } from '../../../utils';

const SCALE_TYPES = getScaleTypes();

export function calcChartDimensions(width, height, padding) {
  return {
    width: width - (padding.left + padding.right),
    height: height - (padding.top + padding.bottom),
  };
}

export default class AxisChart extends React.Component {
  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props) {
    const dimensions = calcChartDimensions(props.width, props.height, props.padding);

    this.setState({
      dimensions,
      scales: {
        x: getScale(props.xScaleType)().domain(props.xDomain).range([0, dimensions.width]),
        y: getScale(props.yScaleType)().domain(props.yDomain).range([dimensions.height, 0]),
      },
    });
  }

  render() {
    const { padding } = this.props;
    const { dimensions, scales } = this.state;

    return (
      <svg
        width={`${dimensions.width + padding.left + padding.right}px`}
        height={`${dimensions.height + padding.bottom + padding.top}px`}
        className={classNames(this.props.className)}
      >
        <g transform={`translate(${padding.left}, ${padding.top})`}>
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

AxisChart.propTypes = {
  /* class names to appended to the element */
  className: CommonPropTypes.className,

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

  /* padding around the chart contents, space for Axis and Label */
  padding: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
    left: PropTypes.number,
  }),

  children: PropTypes.node,
};

AxisChart.defaultProps = {
  padding: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50,
  },
  xScaleType: 'linear',
};
