import React, { PropTypes } from 'react';
import d3Shape from 'd3-shape';

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
  /* will match a SYMBOL_TYPE  */
  type: PropTypes.oneOf(Object.keys(SYMBOL_TYPES)),

  /* area in square pixels */
  size: PropTypes.number,

  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })

};

const defaultProps = {
  type: 'circle',
  size: 64,
  position: {
    x: 0,
    y: 0
  }
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
  const { type, size, position: { x, y } } = props;
  const symbol = getSymbolType(type);
  const pathGenerator = d3Shape.symbol().type(symbol).size(size);

  return (
    <path
      d={pathGenerator()}
      transform={`translate(${x}, ${y})`}
    />
  );
};

Symbol.propTypes = propTypes;

Symbol.defaultProps = defaultProps;

export default Symbol;
