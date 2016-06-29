import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactFauxDom from 'react-faux-dom';
import classNames from 'classnames';
import { axisBottom, axisLeft, axisRight, axisTop } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import mean from 'lodash/mean';
import { CommonPropTypes, atLeastOneOfProp, propsChanged } from '../../../utils';

import { calcLabelPosition, calcTranslate } from './utils';
import style from './axis.css';

export const AXIS_TYPES = {
  top: axisTop,
  right: axisRight,
  bottom: axisBottom,
  left: axisLeft,
};

/**
 * Expose basic public API of d3-axis
 */
export default class Axis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: props.scale,
      translate: props.translate || calcTranslate(props.orientation, props.width, props.height),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      scale: nextProps.scale,
      translate: nextProps.translate ||
                 propsChanged(this.props, nextProps, ['orientation', 'width', 'height']) ?
                   calcTranslate(nextProps.orientation, nextProps.width, nextProps.height) :
                   this.state.translate,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return PureRenderMixin.shouldComponentUpdate(this, nextProps, nextState);
  }

  render() {
    const { props, state } = this;

    // create faux DOM element to use as context for D3 side-effects
    const axisG = ReactFauxDom.createElement('g');
    const gSelection = select(axisG)
      .attr('class', classNames(style.common, props.className))
      .attr('transform', `translate(${state.translate.x}, ${state.translate.y})`);

    // axis generator straight outta d3-axis
    const axisGenerator = AXIS_TYPES[props.orientation](state.scale);

    // if we have configuration for the axis, apply it
    if (props.ticks) axisGenerator.ticks(props.ticks);
    if (props.tickArguments) axisGenerator.tickArguments(props.tickArguments);
    if (props.tickFormat) axisGenerator.tickFormat(props.tickFormat);
    if (props.tickSize) axisGenerator.tickSize(props.tickSize);
    if (props.tickSizeInner) axisGenerator.tickSizeInner(props.tickSizeInner);
    if (props.tickSizeOuter) axisGenerator.tickSizeOuter(props.tickSizeOuter);
    if (props.tickPadding) axisGenerator.tickPadding(props.tickPadding);
    if (props.tickValues) axisGenerator.tickValues(props.tickValues);

    axisGenerator(gSelection);

    axisG.setAttribute('style', props.style);

    const center = mean(state.scale.range());

    const labelPosition = props.label &&
      calcLabelPosition(props.orientation, state.translate, props.padding, center);

    return (
      <g>
        {axisG.toReact()}
        {props.label && <text
          className={props.labelClassName}
          style={props.labelStyle}
          x={labelPosition.x}
          y={labelPosition.y}
          dx={labelPosition.dX}
          dy={labelPosition.dY}
          transform={`rotate(${labelPosition.rotate || 0})`}
          textAnchor="middle"
        >
          {props.label}
        </text>}
      </g>
    );
  }
}

export const AXIS_SCALE_PROP_TYPES = {
  scale: PropTypes.func.isRequired,
};

export const WIDTH_PROP_TYPES = {
  translate: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  width: PropTypes.number.isRequired,
};

export const HEIGHT_PROP_TYPES = {
  translate: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  height: PropTypes.number.isRequired,
};

Axis.propTypes = {
  label: PropTypes.any,
  labelClassName: CommonPropTypes.className,
  labelStyle: PropTypes.object,

  padding: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }),

  /* orientation of ticks relative to axis line */
  orientation: PropTypes.oneOf(Object.keys(AXIS_TYPES)).isRequired,

  /* class name and style to apply to the axis */
  className: CommonPropTypes.className,
  style: PropTypes.object,

  /* push axis in x or y directions */
  translate: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),

  /*
   dimensions are provided by axis-chart
   used for calculating translate, required if translate is not specified
  */
  width: atLeastOneOfProp(WIDTH_PROP_TYPES),
  height: atLeastOneOfProp(HEIGHT_PROP_TYPES),

  /* see d3-axis docs */
  ticks: PropTypes.number,
  tickArguments: PropTypes.array,
  tickFormat: PropTypes.func,
  tickSize: PropTypes.number,
  tickSizeInner: PropTypes.number,
  tickSizeOuter: PropTypes.number,
  tickPadding: PropTypes.number,
  tickValues: PropTypes.array,

  /* appropriate scale for axis */
  scale: atLeastOneOfProp(AXIS_SCALE_PROP_TYPES),
};

Axis.defaultProps = {
  scale: scaleLinear(),
  width: 0,
  height: 0,
};
