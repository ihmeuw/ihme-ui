import React, { PropTypes } from 'react';
import d3Shape from 'd3-shape';

import { noop } from 'lodash';

const SYMBOL_TYPES = {
  circle: d3Shape.symbolCircle,
  square: d3Shape.symbolSquare,
  triangle: d3Shape.symbolTriangle,
  cross: d3Shape.symbolCross,
  diamond: d3Shape.symbolDiamond,
  star: d3Shape.symbolStar,
  wye: d3Shape.symbolWye
};

const propTypes = {
  /* Datum for the click and hover handlers. */
  data: PropTypes.object,

  /* will match a SYMBOL_TYPE  */
  type: PropTypes.oneOf(Object.keys(SYMBOL_TYPES)),

  /* area in square pixels */
  size: PropTypes.number,

  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),

  color: PropTypes.string,

  strokeWidth: PropTypes.number,

  /* partially applied fn that takes in datum and returns fn */
  clickHandler: PropTypes.func,

  /* partially applied fn that takes in datum and returns fn */
  hoverHandler: PropTypes.func
};

const defaultProps = {
  type: 'circle',
  size: 64,
  position: {
    x: 0,
    y: 0
  },
  color: 'steelblue',
  strokeWidth: 1,
  clickHandler: noop,
  hoverHandler: noop
};

/**
 * @param {String} type -> key of SYMBOL_TYPES
 */
const getSymbolType = (type) => {
  return SYMBOL_TYPES[type] || SYMBOL_TYPES[defaultProps.type];
};

/*
* <Symbol /> is a wrapper
* Public API should expose basic public API of d3Shape.symbol()
**/
const Symbol = (props) => {
  const {
    data,
    type,
    size,
    position: { x, y },
    color,
    strokeWidth,
    clickHandler,
    hoverHandler
  } = props;

  const symbol = getSymbolType(type);
  const pathGenerator = d3Shape.symbol().type(symbol).size(size);

  return (
    <path
      d={pathGenerator()}
      transform={`translate(${x}, ${y})`}
      stroke={color}
      fill={color}
      strokeWidth={`${strokeWidth}px`}
      onClick={clickHandler(data)}
      onMouseOver={hoverHandler(data)}
    />
  );
};

Symbol.propTypes = propTypes;

Symbol.defaultProps = defaultProps;

export default Symbol;
export { SYMBOL_TYPES };
