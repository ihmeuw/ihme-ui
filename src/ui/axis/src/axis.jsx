import { PropTypes } from 'react';
import ReactFauxDom from 'react-faux-dom';
import classNames from 'classnames';
import { axisBottom, axisLeft, axisRight, axisTop } from 'd3-axis';
import { select } from 'd3-selection';
import { assign } from 'lodash';

import { default as defaultStyle } from './axis.css';

export const AXIS_TYPES = {
  top: axisTop,
  right: axisRight,
  bottom: axisBottom,
  left: axisLeft,
};

/* these propTypes are shared by <Axis />, <XAxis />, and <YAxis /> */
export const sharedPropTypes = {
  /* where to position ticks relative to axis line */
  position: PropTypes.oneOf(Object.keys(AXIS_TYPES)),

  /* style object to apply to element */
  style: PropTypes.object,

  /* push axis in x or y directions */
  translate: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),

  /* number of ticks to use */
  ticks: PropTypes.number,

  /* see d3-axis docs */
  tickFormat: PropTypes.func,

  /* see d3-axis docs */
  tickSize: PropTypes.number,

  /* see d3-axis docs */
  tickSizeInner: PropTypes.number,

  /* see d3-axis docs */
  tickSizeOuter: PropTypes.number,

  /* see d3-axis docs */
  tickPadding: PropTypes.number,

  /* see d3-axis docs */
  tickValues: PropTypes.array,
};

const propTypes = assign({}, sharedPropTypes, {
  /* appropriate scale for axis */
  scale: PropTypes.func.isRequired,
});

const defaultProps = {
  position: 'bottom',
  translate: {
    x: 0,
    y: 0,
  },
};

export const calcTranslate = (position, dimensions) => {
  if (position === 'bottom') {
    return {
      x: 0,
      y: dimensions.height,
    };
  } else if (position === 'right') {
    return {
      x: dimensions.width,
      y: 0,
    };
  }
  return defaultProps.translate;
};

/**
 * Expose basic public API of d3-axis
 */
export default function Axis(props) {
  // create faux DOM element to use as
  // context for D3 side-effects
  const axisG = ReactFauxDom.createElement('g');
  const gSelection = select(axisG)
    .attr('class', classNames(defaultStyle.common))
    .attr('transform', `translate(${props.translate.x}, ${props.translate.y})`);

  // axis generator straight outta d3-axis
  const axisGenerator = AXIS_TYPES[props.position](props.scale);

  // if we have configuration for the axis, apply it
  if (props.ticks) axisGenerator.ticks(props.ticks);
  if (props.tickFormat) axisGenerator.tickFormat(props.tickFormat);
  if (props.tickSize) axisGenerator.tickSize(props.tickSize);
  if (props.tickSizeInner) axisGenerator.tickSizeInner(props.tickSizeInner);
  if (props.tickSizeOuter) axisGenerator.tickSizeOuter(props.tickSizeOuter);
  if (props.tickPadding) axisGenerator.tickPadding(props.tickPadding);
  if (props.tickValues) axisGenerator.tickValues(props.tickValues);

  axisGenerator(gSelection);

  axisG.setAttribute('style', props.style);

  return axisG.toReact();
}

Axis.propTypes = propTypes;
Axis.defaultProps = defaultProps;
