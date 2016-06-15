import React, { PropTypes } from 'react';
import d3Scale from 'd3-scale';

import LinearGradient from './linear-gradient';
import { Scatter } from '../../shape';
import SvgText from '../../svg-text';
import Slider from './slider';
import { XAxis } from '../../axis';

const propTypes = {
  /* px width */
  width: PropTypes.number,

  /* px height */
  height: PropTypes.number,

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
    same API as Scatter onClick
  */
  onClick: PropTypes.func,

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
  if (d >= 1000) return `${(d / 1000)}k`;

  const fractional = Number(d.toFixed(2));
  const decimals = (fractional % 1).toFixed(2).split();
  const len = decimals.length;
  const hundreds = Number(decimals[(len - 1)]);
  const tens = Number(decimals[(len - 2)]);

  if (hundreds) return fractional;
  if (tens) return Number(d.toFixed(1));
  return d;
};

export default class ChoroplethLegend extends React.Component {
  constructor(props) {
    super(props);

    const adjustedWidth = getAdjustedWidth(props.width, props.margins);

    this.state = {
      adjustedWidth,
      xScale: this.generateLinearScale(props.domain, adjustedWidth)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.domain !== this.props.domain ||
      nextProps.width !== this.props.width ||
      nextProps.margins !== this.props.margins) {
      const adjustedWidth = getAdjustedWidth(nextProps.width, nextProps.margins);
      this.setState({
        adjustedWidth,
        xScale: this.generateLinearScale(nextProps.domain, adjustedWidth)
      });
    }
  }

  generateLinearScale(domain, width) {
    return d3Scale.scaleLinear()
      .domain(domain)
      .range([0, width])
      .clamp(true);
  }

  render() {
    const {
      width,
      height,
      margins,
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
    } = this.props;
    const { adjustedWidth, xScale } = this.state;

    const sliderHeight = 10 + (5 * zoom);

    return (
      <svg width={width} height={height}>
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <Scatter
            data={data}
            scales={{ x: xScale }}
            dataAccessors={{ x: valueField }}
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
  }
}

ChoroplethLegend.propTypes = propTypes;
ChoroplethLegend.defaultProps = defaultProps;
