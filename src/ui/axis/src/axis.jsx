import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactFauxDom from 'react-faux-dom';
import classNames from 'classnames';
import { axisBottom, axisLeft, axisRight, axisTop, scaleLinear, select } from 'd3';
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
 * `import { Axis } from 'ihme-ui'`
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
                   (propsChanged(this.props, nextProps, ['orientation', 'width', 'height']) ?
                     calcTranslate(nextProps.orientation, nextProps.width, nextProps.height) :
                     this.state.translate),
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

export const HEIGHT_PROP_TYPES = {
  height: PropTypes.number.isRequired,
  translate: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

export const WIDTH_PROP_TYPES = {
  translate: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  width: PropTypes.number.isRequired,
};


Axis.propTypes = {

  /**
   * className applied to outermost group element
   */
  className: CommonPropTypes.className,

  /**
   * height of charting area, minus padding
   * required if translate is not provided
   */
  height: atLeastOneOfProp(HEIGHT_PROP_TYPES),

  /**
   * the axis label
   */
  label: PropTypes.string,

  /**
   * className applied to text element surrounding axis label
   */
  labelClassName: CommonPropTypes.className,

  /**
   * inline styles applied to text element surrounding axis label
   */
  labelStyle: PropTypes.object,

  /**
   * where to position axis line; will position ticks accordingly
   * one of: "top", "right", "bottom", "left"
   */
  orientation: PropTypes.oneOf(Object.keys(AXIS_TYPES)).isRequired,

  /**
   * used to position label
   * keys: 'top', 'bottom', 'left', 'right'
   */
  padding: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }),

  /**
   *  appropriate scale for axis
   */
  scale: atLeastOneOfProp(AXIS_SCALE_PROP_TYPES),

  /**
   * inline styles to apply to outermost group element
   */
  style: PropTypes.object,

  /**
   * [number of axis ticks use](https://github.com/d3/d3-axis#axis_ticks)
   */
  ticks: PropTypes.number,

  /**
   * [alternative to tickValues and/or tickFormat](https://github.com/d3/d3-axis#axis_tickArguments)
   */
  tickArguments: PropTypes.array,

  /**
   * [format of axis ticks](https://github.com/d3/d3-axis#axis_tickFormat)
   */
  tickFormat: PropTypes.func,

  /**
   * [padding of axis ticks](https://github.com/d3/d3-axis#axis_tickPadding)
   */
  tickPadding: PropTypes.number,

  /**
   * [size of both inner and outer tick lines](https://github.com/d3/d3-axis#axis_tickSize)
   */
  tickSize: PropTypes.number,

  /**
   * [size of inner tick lines](https://github.com/d3/d3-axis#axis_tickSizeInner)
   */
  tickSizeInner: PropTypes.number,

  /**
   * [size of outer tick lines](https://github.com/d3/d3-axis#axis_tickSizeOuter)
   */
  tickSizeOuter: PropTypes.number,

  /**
   * [user-specified tick values](https://github.com/d3/d3-axis#axis_tickValues)
   */
  tickValues: PropTypes.array,

  /**
   * push axis in x or y direction
   * keys: 'x' (required), 'y' (required)
   * required if width and height are not provided
   */
  translate: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),

  /**
   * width of charting area, minus padding
   * required if translate is not specified
  */
  width: atLeastOneOfProp(WIDTH_PROP_TYPES),
};

Axis.defaultProps = {
  height: 0,
  padding: {
    top: 40,
    bottom: 40,
    left: 50,
    right: 50,
  },
  scale: scaleLinear(),
  width: 0,
};
