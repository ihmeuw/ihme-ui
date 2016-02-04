import React, { PropTypes } from 'react';
import d3Scale from 'd3-scale';

import LinearGradient from './linear-gradient';
import DensityPlot from './density-plot';
import Label from './label';

// import Brush from './brush';

const propTypes = {
  margins: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),
  colors: PropTypes.shape({
    steps: PropTypes.array,
    scale: PropTypes.func,
    x1: PropTypes.number,
    x2: PropTypes.number
  }),
  callbacks: PropTypes.shape({
    // onClick for DensityPlot circles
    click: PropTypes.func,

    // onMouseOver for DensityPlot circles
    mouseover: PropTypes.func,

    // callback to attach to slider handles
    slide: PropTypes.func
  }),
  data: PropTypes.shape({
    // [min, max] for xScale; xScale positions <circles> and provides axis
    domain: PropTypes.array,

    // [min, max] for slider in data space
    rangeExtent: PropTypes.array,

    // array of datum objects
    values: PropTypes.array,

    // uniquely identifying property on datum, e.g., location_id
    keyField: PropTypes.string.isRequired,

    // name of prop on datum that holds
    valueField: PropTypes.string.isRequired,

    // unit of data; axis label
    unit: PropTypes.string
  })
};

const defaultProps = {
  margins: {
    top: 20,
    right: 65,
    bottom: 0,
    left: 55
  }
};

export default class RangeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 600
    };

    this.storeSvgRef = this.storeSvgRef.bind(this);
  }

  componentDidMount() {
    /* eslint-disable react/no-did-mount-set-state */

    const width = this.backingInstanceWidth(this._slider);
    if (!width) return;

    this.setState({
      width
    });

    /* eslint-enable react/no-did-mount-set-state */
  }

  static rectWidth(which, edgePosition, containerWidth) {
    if (which === 'left') return (edgePosition) ? edgePosition : 0;

    if (containerWidth && edgePosition) {
      const diff = containerWidth - edgePosition;
      return (diff < 0) ? 0 : diff;
    }

    return 0;
  }

  static backingInstanceWidth(el) {
    return el.getBoundingClientRect().width;
  }

  static storeSvgRef(el) {
    this._slider = el;
  }

  render() {
    const { margins, colors, data } = this.props;
    let { width } = this.state;
    width = width - (margins.left + margins.right);

    const xScale = d3Scale.scaleLinear().domain(data.domain).range([0, width]);

    return (
      <svg preserveAspectRatio="none" width="100%" height="100%" ref={this.storeSvgRef}>
        <defs>
          <LinearGradient
            colors={colors.steps}
            x1={colors.x1}
            x2={colors.x2}
          />
        </defs>
        <g transform={`translate(${margins.left}, ${margins.top})`}>
          <DensityPlot
            data={data.values}
            xScale={xScale}
            width={width}
            keyField={data.keyField}
            valueField={data.valueField}
            colorScale={colors.scale}
          />
          <rect
            y="10px" x="0px"
            height="15px"
            stroke="none"
            fill="url(#choropleth-linear-gradient-def)"
            width={width}
          >
          </rect>
          <Label
            value={data.unit}
            anchor="middle"
            position={{
              x: width / 2,
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
