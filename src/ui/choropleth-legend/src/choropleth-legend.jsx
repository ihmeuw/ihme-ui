import React, { PropTypes } from 'react';
import d3Scale from 'd3-scale';

import LinearGradient from './linear-gradient';
import { ScatterPlot } from '../../shape';
import SvgText from '../../svg-text';
import Slider from './slider';
import { XAxis } from '../../axis';

const propTypes = {
  /* px width */
  width: PropTypes.number.isRequired,

  /* margins to subtract from width and height */
  margins: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),

  /* array of color steps, e.g. ['#fff', '#ccc', '#000', ...] */
  colorSteps: PropTypes.array.isRequired,

  /* function that accepts data as param, returns color */
  colorScale: PropTypes.func.isRequired,

  /* x-axis coord (as percentage) of the start of the gradient (e.g., 0) */
  x1: PropTypes.number,

  /* x-axis coord (as percentage) of the end of the gradient (e.g., 100) */
  x2: PropTypes.number,

  /*
    onClick for DensityPlot circles
    same API as ScatterPlot onClick
  */
  onClick: PropTypes.func,

  /*
    onMouseOver for DensityPlot circles
    same API as ScatterPlot onMouseOver
  */
  onMouseOver: PropTypes.func,

  /*
    callback to attach to slider handles
    should accept {Array} [min, max] -> the range extent as percentage
  */
  onSliderMove: PropTypes.func,

  /* [min, max] for xScale; xScale positions <circles> and provides axis */
  domain: PropTypes.array.isRequired,

  /* [min, max] for slider in data space */
  rangeExtent: PropTypes.array.isRequired,

  /* array of datum objects */
  data: PropTypes.array.isRequired,

  /* uniquely identifying property of datum, e.g., location_id */
  keyField: PropTypes.string.isRequired,

  /* property of datum object that holds value */
  valueField: PropTypes.string.isRequired,

  /* unit of data; axis label */
  unit: PropTypes.string,

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

const defaultProps = {
  margins: {
    top: 50,
    right: 100,
    bottom: 50,
    left: 100
  },
  x1: 0,
  x2: 100,
  zoom: 1
};

const getAdjustedWidth = (width, margins) => {
  return width - (margins.left + margins.right);
};

const tickFormat = (d) => {
  return (d >= 1000) ? `${(d / 1000)}k` : d;
};

const ChoroplethLegend = (props) => {
  const {
    width,
    margins,
    domain,
    colorSteps,
    colorScale,
    x1,
    x2,
    data,
    valueField,
    keyField,
    rangeExtent,
    onSliderMove,
    zoom,
    unit
  } = props;

  const adjustedWidth = getAdjustedWidth(width, margins);
  const xScale = d3Scale.scaleLinear()
    .domain(domain)
    .range([0, adjustedWidth])
    .clamp(true);
  const sliderHeight = 10 + (5 * zoom);

  return (
    <svg preserveAspectRatio="none" width={width} height="100%">
      <g transform={`translate(${margins.left}, ${margins.top})`}>
        <ScatterPlot
          data={data}
          isNested={false}
          scales={{ x: xScale }}
          dataAccessors={{ x: valueField, y: keyField }}
          keyField={keyField}
          dataField={valueField}
          colorScale={colorScale}
          size={180 * zoom}
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
            xScale={xScale}
            rangeExtent={rangeExtent}
            width={adjustedWidth}
            height={15}
            translateY={0}
            onSliderMove={onSliderMove}
            marginTop={margins.top}
            marginLeft={margins.left}
            zoom={zoom}
          />
          <XAxis
            scales={{ x: xScale }}
            translate={{ x: 0, y: 20 }}
            tickFormat={tickFormat}
          />
          <SvgText
            value={unit}
            anchor="middle"
            x={adjustedWidth / 2}
            y={65}
          />
        </g>
      </g>
    </svg>
  );
};

ChoroplethLegend.propTypes = propTypes;
ChoroplethLegend.defaultProps = defaultProps;

export default ChoroplethLegend;
