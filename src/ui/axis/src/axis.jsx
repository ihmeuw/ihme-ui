import React, { PropTypes } from 'react';
import ReactFauxDom from 'react-faux-dom';
import classNames from 'classnames';
import { axisBottom, axisLeft, axisRight, axisTop } from 'd3-axis';
import { select } from 'd3-selection';
import { mean } from 'lodash';
import { oneOfProp } from '../../../utils';

import style from './axis.css';

export const AXIS_TYPES = {
  top: axisTop,
  right: axisRight,
  bottom: axisBottom,
  left: axisLeft,
};

const DEFAULT_TRANSLATE = {
  x: 0,
  y: 0,
};

/* these propTypes are shared by <Axis />, <XAxis />, and <YAxis /> */
export const calcTranslate = (orientation, width = 0, height = 0) => {
  if (orientation === 'bottom') {
    return {
      x: 0,
      y: height,
    };
  } else if (orientation === 'right') {
    return {
      x: width,
      y: 0,
    };
  }
  return DEFAULT_TRANSLATE;
};

function calcLabelPosition({ orientation, translate, padding }, center) {
  switch (orientation) {
    case 'top':
      return {
        x: translate.x,
        y: translate.y - padding.top,
        dX: center,
        dY: '1em',
      };
    case 'bottom':
      return {
        x: translate.x,
        y: translate.y + padding.bottom,
        dX: center,
        dY: '-0.2em',
      };
    case 'left':
      return {
        x: translate.y,
        y: translate.x - padding.left,
        dX: -center,
        dY: '1em',
        rotate: 270,
      };
    case 'right':
      return {
        x: translate.y,
        y: -(translate.x + padding.right),
        dX: center,
        dY: '1em',
        rotate: 90,
      };
    default:
      return {
        x: translate.x,
        y: translate.y,
        dX: 0,
        dY: 0,
      };
  }
}

/**
 * Expose basic public API of d3-axis
 */
export default function Axis(props) {
  // create faux DOM element to use as context for D3 side-effects
  const axisG = ReactFauxDom.createElement('g');
  const gSelection = select(axisG)
    .attr('class', classNames(style.common, props.className))
    .attr('transform', `translate(${props.translate.x}, ${props.translate.y})`);

  // axis generator straight outta d3-axis
  const axisGenerator = AXIS_TYPES[props.orientation](props.scale);

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

  const center = mean(props.scale.range());

  const labelPosition = props.label && calcLabelPosition(props, center);

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

export const AXIS_SCALE_PROP_TYPES = {
  scale: PropTypes.func.isRequired,
};

Axis.propTypes = {
  label: PropTypes.any,
  labelClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
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
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  style: PropTypes.object,

  /* push axis in x or y directions */
  translate: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),

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
  scale: oneOfProp(AXIS_SCALE_PROP_TYPES),
};

Axis.defaultProps = {
  translate: DEFAULT_TRANSLATE,
};
