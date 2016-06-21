import { PropTypes } from 'react';
import ReactFauxDom from 'react-faux-dom';
import classNames from 'classnames';
import { axisBottom, axisLeft, axisRight, axisTop } from 'd3-axis';
import { select } from 'd3-selection';
import { intersection } from 'lodash';

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
export const calcTranslate = (orientation, dimensions) => {
  if (orientation === 'bottom') {
    return {
      x: 0,
      y: dimensions.height,
    };
  } else if (orientation === 'right') {
    return {
      x: dimensions.width,
      y: 0,
    };
  }
  return DEFAULT_TRANSLATE;
};

/**
 * Expose basic public API of d3-axis
 */
export default function Axis(props) {
  // create faux DOM element to use as
  // context for D3 side-effects
  const axisG = ReactFauxDom.createElement('g');
  const gSelection = select(axisG)
    .attr('class', classNames(style.common))
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

  return axisG.toReact();
}

export const AXIS_SCALE_PROP_TYPES = {
  scale: PropTypes.func.isRequired,
};

export function oneOfProp(propTypes) {
  return (props, propName, componentName, location, propFullName) => {
    let error = null;
    const validProps = intersection(Object.keys(props), Object.keys(propTypes));
    if (validProps.length === 1) {
      if (validProps[0] === propName) {
        error = propTypes[propName](props, propName, componentName, location, propFullName);
      }
    } else {
      /* eslint-disable max-len */
      error = `Exactly one of prop [\`${Object.keys(propTypes).join('`,`')}\`] must be specified in \`${componentName}\`.`;
      /* eslint-enable max-len */
    }
    return error && new Error(error);
  };
}

Axis.propTypes = {
  /* orientation of ticks relative to axis line */
  orientation: PropTypes.oneOf(Object.keys(AXIS_TYPES)).isRequired,

  /* style object to apply to element */
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
