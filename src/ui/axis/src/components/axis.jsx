import { PropTypes } from 'react';

import d3Axis from 'd3-axis';
import d3Selection from 'd3-selection';

import { assign } from 'lodash';

import ReactFauxDom from 'react-faux-dom';

const AXIS_TYPES = {
  top: d3Axis.axisTop,
  right: d3Axis.axisRight,
  bottom: d3Axis.axisBottom,
  left: d3Axis.axisLeft
};

const defaultPropTypes = {
  /* where to position ticks relative to axis line */
  position: PropTypes.oneOf(Object.keys(AXIS_TYPES)),

  /* push axis in x or y directions */
  translate: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
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
  tickValues: PropTypes.array
};

const propTypes = assign({}, defaultPropTypes, {
  /* appropriate scale for axis */
  scale: PropTypes.func.isRequired
});

const defaultProps = {
  position: 'bottom',
  translate: {
    x: 0,
    y: 0
  }
};

const calcTranslate = (position, dimensions) => {
  if (position === 'bottom') {
    return {
      x: 0,
      y: dimensions.height
    };
  } else if (position === 'right') {
    return {
      x: dimensions.width,
      y: 0
    };
  }
  return defaultProps.translate;
};

/**
 * Expose basic public API of d3-axis
 */
const Axis = (props) => {
  const {
    position,
    translate,
    scale,
    ticks,
    tickFormat,
    tickSize,
    tickSizeInner,
    tickSizeOuter,
    tickPadding,
    tickValues
  } = props;

  // create faux DOM element to use as
  // context for D3 side-effects
  const axisG = ReactFauxDom.createElement('g');
  const gSelection = d3Selection.select(axisG)
    .attr('class', 'axis')
    .attr('transform', `translate(${translate.x}, ${translate.y})`);

  // axis generator straight outta d3-axis
  const axisGenerator = AXIS_TYPES[position](scale);

  // if we have configuration for the axis, apply it
  if (ticks) axisGenerator.ticks(ticks);
  if (tickFormat) axisGenerator.tickFormat(tickFormat);
  if (tickSize) axisGenerator.tickSize(tickSize);
  if (tickSizeInner) axisGenerator.tickSizeInner(tickSizeInner);
  if (tickSizeOuter) axisGenerator.tickSizeOuter(tickSizeOuter);
  if (tickPadding) axisGenerator.tickPadding(tickPadding);
  if (tickValues) axisGenerator.tickValues(tickValues);

  axisGenerator(gSelection);

  return axisG.toReact();
};

Axis.propTypes = propTypes;

Axis.defaultProps = defaultProps;

export default Axis;
export { AXIS_TYPES, defaultPropTypes, calcTranslate };
