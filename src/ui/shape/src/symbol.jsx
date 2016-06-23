import React, { PropTypes } from 'react';
import d3Shape from 'd3-shape';

import { noop } from 'lodash';

const SYMBOL_TYPES = {
  circle: d3Shape.symbolCircle,
  cross: d3Shape.symbolCross,
  diamond: d3Shape.symbolDiamond,
  line: {
    draw(context, size) {
      const width = Math.sqrt(size);
      const height = 1.5;
      return context.rect(-width / 2, -height / 2, width, height);
    }
  },
  square: d3Shape.symbolSquare,
  star: d3Shape.symbolStar,
  triangle: d3Shape.symbolTriangle,
  wye: d3Shape.symbolWye
};

/*
* <Symbol /> is a wrapper
* Public API should expose basic public API of d3Shape.symbol()
**/
export default function Symbol(props) {
  const {
    color,
    data,
    itemKey,
    onClick,
    onMouseLeave,
    onMouseMove,
    onMouseOver,
    position: { x, y },
    selected,
    size,
    strokeWidth,
    type
  } = props;

  const pathGenerator = d3Shape.symbol().type(SYMBOL_TYPES[type]).size(size);

  return (
    <path
      d={pathGenerator()}
      fill={color}
      onClick={onClick(data, itemKey)}
      onMouseLeave={onMouseLeave(data, itemKey)}
      onMouseMove={onMouseMove(data, itemKey)}
      onMouseOver={onMouseOver(data, itemKey)}
      stroke={selected ? '#000' : color}
      strokeWidth={`${strokeWidth}px`}
      transform={`translate(${x}, ${y})`}
    />
  );
}

Symbol.propTypes = {

  color: PropTypes.string,

  /* Datum for the click and hover handlers. */
  data: PropTypes.object,

  itemKey: PropTypes.string.isRequired,

  /* partially applied fn that takes in datum and returns fn */
  onClick: PropTypes.func,

  /* partially applied fn that takes in datum and returns fn */
  onMouseLeave: PropTypes.func,

  /* partially applied fn that takes in datum and returns fn */
  onMouseMove: PropTypes.func,

  /* partially applied fn that takes in datum and returns fn */
  onMouseOver: PropTypes.func,

  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),

  selected: PropTypes.bool,

  /* area in square pixels */
  size: PropTypes.number,

  strokeWidth: PropTypes.number,

  /* will match a SYMBOL_TYPE  */
  type: PropTypes.oneOf(Object.keys(SYMBOL_TYPES)),
};

Symbol.defaultProps = {
  color: 'steelblue',
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
  position: {
    x: 0,
    y: 0
  },
  selected: false,
  size: 64,
  type: 'circle',
  strokeWidth: 1
};

export { SYMBOL_TYPES };
