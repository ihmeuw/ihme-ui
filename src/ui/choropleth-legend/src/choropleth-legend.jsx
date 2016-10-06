import React, { PropTypes } from 'react';
import { assign } from 'lodash';
import { scaleLinear } from 'd3';

import {
  numberFormat,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

import LinearGradient from './linear-gradient';
import { Scatter } from '../../shape';
import Slider from './slider';
import { XAxis } from '../../axis';

import styles from './choropleth-legend.css';

const subtractMarginsFromWidth = (width, margins) => width - (margins.left + margins.right);

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
            onClick={onClick}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            onMouseOver={onMouseOver}
            scales={scatterScaleMap}
            selection={selectedLocations}
            size={180 * zoom}
            symbolClassName={styles['density-circle']}
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
  /* must return a number */
  axisTickFormat: PropTypes.func,

  /*
    shift XAxis in the x- or y- directions;
    used to put some padding between the color gradient rect and the axis
    defaults to { x: 0, y: 20 }
  */
  axisTranslate: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),

  /* function that accepts data as param, returns color */
  colorScale: PropTypes.func.isRequired,

  /* array of color steps, e.g. ['#fff', '#ccc', '#000', ...] */
  colorSteps: PropTypes.array.isRequired,

  /* array of datum objects */
  data: PropTypes.array.isRequired,

  /* [min, max] for xScale; xScale positions <circles> and provides axis */
  domain: PropTypes.array.isRequired,

  /* px height */
  height: PropTypes.number,

  /*
   a property on datum objects or function which accepts datum;
   if provided, must resolve to a unique value per datum
   if not provided, density plot symbols are keyed as: `${xValue}:${yValue}:${index}`
   */
  keyField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),

  /* margins to subtract from width and height */
  margins: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),

  /*
   onClick for DensityPlot circles
   same API as Scatter onClick
   */
  onClick: PropTypes.func,

  /*
   onMouseLeave for DensityPlot circles
   same API as Scatter onMouseLeave
   */
  onMouseLeave: PropTypes.func,

  /*
   onMouseMove for DensityPlot circles
   same API as Scatter onMouseMove
   */
  onMouseMove: PropTypes.func,

  /*
   onMouseOver for DensityPlot circles
   same API as Scatter onMouseOver
   */
  onMouseOver: PropTypes.func,

  /*
   callback to attach to slider handles
   should accept {Array} [min, max] -> the range extent as percentage
   */
  onSliderMove: PropTypes.func,

  /* [min, max] for slider in data space */
  rangeExtent: PropTypes.array.isRequired,

  selectedLocations: PropTypes.arrayOf(PropTypes.object),

  sliderHandleFormat: PropTypes.func,

  /* unit of data; axis label */
  unit: PropTypes.string,

  valueField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,

  /* px width */
  width: PropTypes.number,

  /* x-axis coord (as percentage) of the start of the gradient (e.g., 0) */
  x1: PropTypes.number,

  /* x-axis coord (as percentage) of the end of the gradient (e.g., 100) */
  x2: PropTypes.number,

  /*
    a d3Scale for positioning density plot along its x-axis;
    must expose .domain and .range methods
    currently only supports continuous scales, should be extended to support others
  */
  xScale: PropTypes.func,

  /*
   float value used for implementing "zooming";
   any element that needs to become larger in "presentation mode"
   should respond to this scale factor.
   guide:
   zoom: 0 -> smallest possible
   zoom: 0.5 -> half of normal size
   zoom: 1 -> normal
   zoom: 2 -> twice normal size
   */
  zoom: PropTypes.number
};

ChoroplethLegend.defaultProps = {
  axisTickFormat: numberFormat,
  axisTranslate: {
    x: 0,
    y: 20
  },
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
