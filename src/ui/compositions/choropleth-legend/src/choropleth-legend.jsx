import React, { PropTypes } from 'react';
import { assign } from 'lodash';
import { scaleLinear } from 'd3';

import {
  colorSteps as defaultColorSteps,
  numberFormat,
  propsChanged,
  CommonPropTypes,
  PureComponent,
  stateFromPropUpdates,
} from '../../../../utils';

import LinearGradient from './linear-gradient';
import { Scatter } from '../../../shape';
import Slider from './slider';
import { XAxis } from '../../../axis';

import styles from './choropleth-legend.css';

const subtractMarginsFromWidth = (width, margins) => width - (margins.left + margins.right);

/**
 * `import { ChoroplethLegend } from 'ihme-ui'`
 */
export default class ChoroplethLegend extends PureComponent {
  constructor(props) {
    super(props);

    // separating slider's x- scale from scatter's x- scale allows
    // passing in non-linear scale to scatter
    // e.g., distribute density points in log-space while maintaining linear slider movement
    // the slider scale should always be linear
    const state = {
      sliderScale: scaleLinear().clamp(true),
    };

    this.state = stateFromPropUpdates(ChoroplethLegend.propUpdates, {}, props, state);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(
      ChoroplethLegend.propUpdates,
      this.props,
      nextProps,
      this.state
    ));
  }

  render() {
    const {
      axisTickFormat,
      axisTranslate,
      domain,
      width,
      height,
      focus,
      focusedClassName,
      focusedStyle,
      margins,
      colorSteps,
      colorScale,
      x1,
      x2,
      data,
      rangeExtent,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      onSliderMove,
      selectedLocations,
      sliderHandleFormat,
      unit,
      zoom,
    } = this.props;

    const {
      adjustedWidth,
      dataAccessors,
      scatterScaleMap,
      sliderScale,
    } = this.state;

    const sliderHeight = 10 + (5 * zoom);

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <Scatter
            colorScale={colorScale}
            data={data}
            dataAccessors={dataAccessors}
            focus={focus}
            focusedClassName={focusedClassName}
            focusedStyle={focusedStyle}
            onClick={onClick}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            onMouseOver={onMouseOver}
            scales={scatterScaleMap}
            selection={selectedLocations}
            size={180 * zoom}
            shapeClassName={styles['density-circle']}
          />
          <g transform={`translate(0, ${10 + (5 * zoom)})`}>
            <LinearGradient
              colors={colorSteps}
              x1={x1}
              x2={x2}
              width={adjustedWidth}
              height={sliderHeight}
            />
            <Slider
              domain={domain}
              xScale={sliderScale}
              rangeExtent={rangeExtent}
              width={adjustedWidth}
              height={15}
              translateY={0}
              onSliderMove={onSliderMove}
              labelFormat={sliderHandleFormat}
              marginTop={margins.top}
              marginLeft={margins.left}
              zoom={zoom}
            />
            <XAxis
              autoFilterTickValues
              label={unit}
              orientation="bottom"
              scales={scatterScaleMap}
              translate={axisTranslate}
              tickFormat={axisTickFormat}
              width={adjustedWidth}
            />
          </g>
        </g>
      </svg>
    );
  }
}

ChoroplethLegend.propTypes = {
  /**
   * [format of axis ticks](https://github.com/d3/d3-axis#axis_tickFormat)
   */
  axisTickFormat: PropTypes.func,

  /**
   * shift axis in the x or y directions; use to put padding between the color gradient rect and the axis
   */
  axisTranslate: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),

  /**
   * color scale for density plot; should accept `datum[valueField]` and return color string
   */
  colorScale: PropTypes.func.isRequired,

  /**
   * color steps, e.g. ['#fff', '#ccc', '\#000', ...]
   */
  colorSteps: PropTypes.array,

  /**
   * array of datum objects
   */
  data: PropTypes.array.isRequired,

  /**
   * [min, max] for xScale; xScale positions density plot and provides axis
   */
  domain: PropTypes.array.isRequired,

  /**
   * The datum object corresponding to the `<Shape />` currently focused.
   */
  focus: PropTypes.object,

  /**
   * className applied if `<Shape />` has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * Inline styles applied to focused `<Shape />`.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Shape />`,
   * and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  focusedStyle: CommonPropTypes.style,

  /**
   * height of outermost svg
   */
  height: PropTypes.number,

  /**
   * uniquely identifying property of datum or function that accepts datum and returns unique value;
   * if not provided, density plot shapes are keyed as `${xValue}:${yValue}:${index}`
   */
  keyField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),

  /**
   * margins to subtract from width and height
   */
  margins: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),

  /**
   * onClick callback for density plot circles;
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onClick: PropTypes.func,

  /**
   * onMouseLeave callback for density plot circles;
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseLeave: PropTypes.func,

  /**
   * onMouseMove callback for density plot circles;
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseMove: PropTypes.func,

  /**
   * onMouseOver callback for density plot circles;
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * Callback to attach to slider handles;
   * passed the range extent as a decimal representing percent of the range, e.g, [0.2, 0.5].
   * signature: ([min, max]) => {...}
   */
  onSliderMove: PropTypes.func,

  /**
   * [min, max] for slider in data space;
   * if `isEqual(rangeExtent, domain)`, slider handles will be positioned at start and end of legend,
   * which makes `props.domain` a good initial value
   */
  rangeExtent: PropTypes.array.isRequired,

  /**
   * array of selected datum objects
   */
  selectedLocations: PropTypes.arrayOf(PropTypes.object),

  /**
   * formatter for handle labels
   */
  sliderHandleFormat: PropTypes.func,

  /**
   * unit of data; axis label
   */
  unit: PropTypes.string,

  /**
   * property of data objects used to position and fill density plot circles;
   * if a function, signature: (datum) => {...}
   */
  valueField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /**
   * width of outermost svg, in pixels
   */
  width: PropTypes.number,

  /**
   * x-axis coord (as percentage) of the start of the gradient (e.g., 0)
   */
  x1: PropTypes.number,

  /**
   * x-axis coord (as percentage) of the end of the gradient (e.g., 100)
   */
  x2: PropTypes.number,

  /**
   * scale for positioning density plot along its x-axis; must expose `domain` and `range` methods
   */
  xScale: PropTypes.func,

  /**
   * float value used for implementing "zooming";
   * any element that needs to become larger in "presentation mode" should respond to this scale factor.
   * Guide
   * zoom: 0 -> smallest possible
   * zoom: 0.5 -> half of normal size
   * zoom: 1 -> normal size ()
   * zoom: 2 -> twice normal size
   */
  zoom: PropTypes.number
};

ChoroplethLegend.defaultProps = {
  axisTickFormat: numberFormat,
  axisTranslate: {
    x: 0,
    y: 20
  },
  colorSteps: defaultColorSteps,
  margins: {
    top: 50,
    right: 100,
    bottom: 50,
    left: 100
  },
  sliderHandleFormat: numberFormat,
  x1: 0,
  x2: 100,
  xScale: scaleLinear(),
  zoom: 1
};

ChoroplethLegend.propUpdates = {
  dataAccessors: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['valueField'])) return state;
    // put dataAccessor object in state to avoid creating new object on each render
    return assign({}, state, {
      dataAccessors: {
        fill: nextProps.valueField,
        key: nextProps.keyField,
        x: nextProps.valueField,
      },
    });
  },
  scales: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['domain', 'width', 'margins', 'xScale'])) return state;
    const adjustedWidth = subtractMarginsFromWidth(nextProps.width, nextProps.margins);
    const xScale = nextProps.xScale.domain(nextProps.domain).range([0, adjustedWidth]);
    if (xScale.clamp) xScale.clamp(true);
    return assign({}, state, {
      adjustedWidth,
      scatterScaleMap: { x: xScale.copy() },
      sliderScale: state.sliderScale.domain(nextProps.domain).range([0, adjustedWidth]),
    });
  },
};
