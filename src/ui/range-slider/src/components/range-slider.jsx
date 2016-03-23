import React, { PropTypes } from 'react';
import d3Scale from 'd3-scale';

import LinearGradient from './linear-gradient';
import { ScatterPlot } from '../../../shape';
import Label from './label';
import Brush from './brush';

const propTypes = {
  /* px width */
  width: PropTypes.number,

  /* margins to subtract from width and height */
  margins: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),

  /* array of color steps, e.g. ['#fff', '#ccc', '#000', ...] */
  colorSteps: PropTypes.array,

  /* function that accepts data as param, returns color */
  colorScale: PropTypes.func,

  /* x-axis coord (as percentage) of the start of the gradient (e.g., 0) */
  x1: PropTypes.number,

  /* x-axis coord (as percentage) of the end of the gradient (e.g., 100) */
  x2: PropTypes.number,

  /* onClick for DensityPlot circles */
  onClick: PropTypes.func,

  /* onMouseOver for DensityPlot circles */
  onMouseOver: PropTypes.func,

  /* callback to attach to slider handles */
  onSlide: PropTypes.func,

  /* [min, max] for xScale; xScale positions <circles> and provides axis */
  domain: PropTypes.array,

  /* [min, max] for slider in data space */
  rangeExtent: PropTypes.array,

  /* array of datum objects */
  data: PropTypes.array,

  /* uniquely identifying property of datum, e.g., location_id */
  keyField: PropTypes.string.isRequired,

  /* property of datum object that holds value */
  valueField: PropTypes.string.isRequired,

  /* unit of data; axis label */
  unit: PropTypes.string
};

const defaultProps = {
  margins: {
    top: 20,
    right: 65,
    bottom: 0,
    left: 55
  },
  x1: 0,
  x2: 100,

};

export default class RangeSlider extends React.Component {

  getAdjustedWidth() {
    const { width, margins } = this.props;
    return width - (margins.left + margins.right);
  }

  render() {
    const {
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
      unit
    } = this.props;

    const adjustedWidth = this.getAdjustedWidth();
    const xScale = d3Scale.scaleLinear().domain(domain).range([0, adjustedWidth]);
    const linearGradientId = 'choropleth-linear-gradient-def';

    return (
      <svg preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <LinearGradient
            colors={colorSteps}
            x1={x1}
            x2={x2}
            id={linearGradientId}
          />
        </defs>
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <ScatterPlot
            data={data}
            isNested={false}
            scales={{ x: xScale }}
            dataAccessors={{ x: valueField, y: keyField }}
            keyField={keyField}
            dataField={valueField}
            colorScale={colorScale}
            size={81}
          />
          <rect
            y="10px" x="0px"
            height="15px"
            stroke="none"
            fill={`url(#${linearGradientId})`}
            width={adjustedWidth}
          >
          </rect>
          <Brush
            xScale={xScale}
            rangeExtent={rangeExtent}
            width={adjustedWidth}
          />
          <Label
            value={unit}
            anchor="middle"
            position={{
              x: adjustedWidth / 2,
              y: 65
            }}
          />
        </g>
      </svg>
    );
  }
}

RangeSlider.propTypes = propTypes;

RangeSlider.defaultProps = defaultProps;
