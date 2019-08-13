import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import classNames from 'classnames';
import {
  calcPadding,
  calcChartDimensions,
  canAutoFormatAxes,
  CommonPropTypes,
  getScale,
  getScaleTypes,
  propsChanged,
  shouldPureComponentUpdate,
} from '../../../utils';

const SCALE_TYPES = getScaleTypes();

/**
 * `import { AxisChart } from 'ihme-ui'`
 *
 * Wraps and provides its child charting components with height, width, scales, and padding
 */
export default class AxisChart extends React.Component {
  constructor(props) {
    super(props);
    const {
      autoFormatAxes,
      children,
      height,
      padding,
      style,
      width,
      xDomain,
      xScaleType,
      yScaleType,
      yDomain
    } = props;
    const [autoPadding, autoRotateTickLabels] =
      (autoFormatAxes && canAutoFormatAxes(xScaleType, yScaleType))
        ? calcPadding({
          // eslint-disable-next-line react/prop-types
          children: React.Children.toArray(children),
          xDomain,
          xScaleType,
          yDomain,
          yScaleType,
          height,
          width,
          style,
          initialPadding: padding
        })
        : [padding, false];
    const chartDimensions = calcChartDimensions(
      width,
      height,
      autoPadding
    );
    this.state = {
      autoRotateTickLabels,
      chartDimensions,
      padding: autoPadding,
      scales: {
        x: getScale(xScaleType)().domain(xDomain).range([0, chartDimensions.width]),
        y: getScale(yScaleType)().domain(yDomain).range([chartDimensions.height, 0]),
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      autoFormatAxes,
      children,
      xDomain,
      xScaleType,
      yDomain,
      yScaleType,
      width,
      height,
      style,
      padding,
    } = nextProps;

    let newAutoRotateTickLabels;
    let newChartDimensions;
    let newPadding;
    let newScales;

    if (propsChanged(
      this.props,
      nextProps,
      // eslint-disable-next-line max-len
      ['autoFormatAxes', 'xDomain', 'xScaleType', 'yDomain', 'yScaleType', 'height', 'width', 'padding']
    )) {
      [newPadding, newAutoRotateTickLabels] =
      (autoFormatAxes && canAutoFormatAxes(xScaleType, yScaleType))
        ? calcPadding({
        // eslint-disable-next-line react/prop-types
          children: React.Children.toArray(children),
          xDomain,
          xScaleType,
          yDomain,
          yScaleType,
          width,
          height,
          style,
          initialPadding: padding
        })
        : [padding, false];
      newChartDimensions = calcChartDimensions(
        width,
        height,
        newPadding
      );
    }

    const xChanged = newChartDimensions ||
                     propsChanged(this.props, nextProps, ['xScaleType', 'xDomain']);
    const yChanged = newChartDimensions ||
                     propsChanged(this.props, nextProps, ['yScaleType', 'yDomain']);
    if (xChanged || yChanged) {
      const chartDimensions = newChartDimensions || this.state.chartDimensions;
      newScales = {
        x: xChanged
          ? getScale(nextProps.xScaleType)().domain(xDomain)
            .range([0, chartDimensions.width])
          : this.state.scales.x,
        y: yChanged
          ? getScale(nextProps.yScaleType)().domain(yDomain)
            .range([chartDimensions.height, 0])
          : this.state.scales.y,
      };
    }

    this.setState({
      autoRotateTickLabels: newAutoRotateTickLabels,
      chartDimensions: newChartDimensions,
      padding: newPadding,
      scales: newScales,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.loading &&
      shouldPureComponentUpdate(this.props, this.state, nextProps, nextState);
  }

  render() {
    const { props } = this;
    const { chartDimensions, padding, scales, autoRotateTickLabels } = this.state;
    const clipPathId = uniqueId('chartClip_');

    return (
      <svg
        width={`${chartDimensions.width + padding.left + padding.right}px`}
        height={`${chartDimensions.height + padding.bottom + padding.top}px`}
        className={classNames(props.className)}
        style={props.style}
      >
        {props.clipPath ? (<defs>
          <clipPath id={clipPathId}>
            <rect
              width={`${chartDimensions.width}px`}
              height={`${chartDimensions.height}px`}
            >
            </rect>
          </clipPath>
        </defs>)
          : null
        }
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {
            React.Children.map(props.children, (child) => child && React.cloneElement(child, {
              scales,
              padding,
              rotateTickLabels: autoRotateTickLabels,
              clipPathId: props.clipPath ? clipPathId : (void 0),
              height: chartDimensions.height,
              width: chartDimensions.width
            }))
          }
        </g>
      </svg>
    );
  }
}

AxisChart.propTypes = {
  /**
   * auto-calculate chart padding needed for tick/axes labels and whether tick labels need rotation.
   * (will only be applied to axes whose scale type is categorical in nature (i.e., 'point', 'ordinal', 'band'))
   */
  autoFormatAxes: PropTypes.bool,

  /**
   * className applied to outermost svg element
   */
  className: CommonPropTypes.className,

  /**
   *  apply clipping path to charting area
   */
  clipPath: PropTypes.bool,

  /**
   *  pixel height of line chart
   */
  height: PropTypes.number.isRequired,

  /**
   * delay rendering while fetching data
   */
  loading: PropTypes.bool,

  /**
   * padding around the chart contents, space for Axis and Label
   */
  padding: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
    left: PropTypes.number,
  }),

  /**
   * inline styles to apply to outermost svg element
   */
  style: PropTypes.object,

  /**
   * pixel width of line chart
   */
  width: PropTypes.number.isRequired,

  /**
   * [min, max] for xScale (i.e., the domain of the data)
   */
  xDomain: PropTypes.array,

  /**
   * type of x scale
   * [name of d3 scale scale function](https://github.com/d3/d3-scale)
   */
  xScaleType: PropTypes.oneOf(SCALE_TYPES),

  /**
   * [min, max] yScale (i.e., the range of the data)
   */
  yDomain: PropTypes.array,

  /**
   * type of y scale
   * [name of d3 scale scale function](https://github.com/d3/d3-scale)
   */
  yScaleType: PropTypes.oneOf(SCALE_TYPES),
};

AxisChart.defaultProps = {
  padding: {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50,
  },
};
