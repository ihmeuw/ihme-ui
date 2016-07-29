import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { includes, isFinite, map, noop, pick } from 'lodash';
import { CommonPropTypes, propResolver } from '../../../utils';

import Symbol from './symbol';

export default function Scatter(props) {
  const {
    className,
    colorScale,
    data,
    dataAccessors,
    fill,
    focus,
    scales,
    selection,
    symbolClassName,
  } = props;

  const childProps = pick(props, [
    'focusedClassName',
    'focusedStyle',
    'onClick',
    'onMouseLeave',
    'onMouseMove',
    'onMouseOver',
    'selectedClassName',
    'selectedStyle',
    'size',
    'symbolType',
  ]);

  return (
    <g className={classNames(className) || (void 0)}>
      {
        map(data, (plotDatum, i) => {
          // value passed into colorScale
          // use dataAccessors.x as fail-over for backward compatibility
          const fillValue = propResolver(plotDatum, dataAccessors.fill || dataAccessors.x);

          // value passed into xScale
          const xValue = propResolver(plotDatum, dataAccessors.x);

          // value passed into yScale
          const yValue = propResolver(plotDatum, dataAccessors.y);
          const key = `${xValue}:${yValue}:${i}`;
          return (
            <Symbol
              className={symbolClassName}
              key={key}
              datum={plotDatum}
              fill={colorScale && isFinite(fillValue) ? colorScale(fillValue) : fill}
              focused={focus === plotDatum}
              selected={includes(selection, plotDatum)}
              translateX={scales.x && isFinite(xValue) ? scales.x(xValue) : 0}
              translateY={scales.y && isFinite(yValue) ? scales.y(yValue) : 0}
              {...childProps}
            />
          );
        })
      }
    </g>
  );
}

Scatter.propTypes = {
  /* base classname to apply to scatter <g> wrapper */
  className: CommonPropTypes.className,

  /* function for a scale of colors. If present, overrides fill */
  colorScale: PropTypes.func,

  /* array of datum objects */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  /*
    accessors on datum objects
      fill: property on data to provide fill (will be passed to colorScale)
      x: property on data to position in x-direction
      y: property on data to position in y-direction
  */
  dataAccessors: PropTypes.shape({
    fill: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  }).isRequired,

  /* string for the color of this data group */
  fill: PropTypes.string,

  /* the symbol to focus */
  focus: PropTypes.object,

  /* signature: function(event, data, Symbol) {...} */
  onClick: PropTypes.func,

  /* signature: function(event, data, Symbol) {...} */
  onMouseLeave: PropTypes.func,

  /* signature: function(event, data, Symbol) {...} */
  onMouseMove: PropTypes.func,

  /* signature: function(event, data, Symbol) {...} */
  onMouseOver: PropTypes.func,

  /* scales */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,

  /* a symbol that is selected, or an array of symbols selected */
  selection: PropTypes.array,

  /* size of symbols; see Symbol.propTypes */
  size: PropTypes.number,

  /* base classname to apply to symbol */
  symbolClassName: CommonPropTypes.className,

  /* string for the type of symbol to be used */
  symbolType: PropTypes.string,
};

Scatter.defaultProps = {
  fill: 'steelblue',
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
  size: 64,
  symbolType: 'circle',
};
