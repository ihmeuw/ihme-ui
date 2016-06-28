import React, { PropTypes } from 'react';
import classNames from 'classnames';
import d3Shape from 'd3-shape';
import { noop } from 'lodash';

import { eventHandleWrapper } from '../../../utils/events';

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
export default class Symbol extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: this.createPath(props.type, props.size),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.type !== this.props.type ||
        nextProps.size !== this.props.size) {
      this.setState({
        path: this.createPath(nextProps.type, nextProps.size),
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const focused = this.props.focused !== nextProps.focused;
    const selected = this.props.selected !== nextProps.selected;
    const x = this.props.position.x !== nextProps.position.x;
    const y = this.props.position.y !== nextProps.position.y;
    const type = this.props.type !== nextProps.type;
    const color = this.props.color !== nextProps.color;
    return focused || selected || x || y || type || color;
  }

  createPath(type, size) {
    const symbolType = SYMBOL_TYPES[type] || SYMBOL_TYPES.circle;
    return d3Shape.symbol().type(symbolType).size(size)();
  }

  render() {
    const {
      className,
      color,
      data,
      focused,
      focusedClassName,
      focusedStyle,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      position: { x, y },
      selected,
      selectedClassName,
      selectedStyle,
      style
    } = this.props;
    const { path } = this.state;

    function getStyle() {
      if (selected) {
        return { ...selectedStyle };
      }
      if (focused) {
        return { ...focusedStyle };
      }
      return { ...style };
    }

    return (
      <path
        d={path}
        className={classNames(className, {
          [focusedClassName]: focused,
          [selectedClassName]: selected,
        })}
        fill={color}
        onClick={eventHandleWrapper(onClick, data, this)}
        onMouseLeave={eventHandleWrapper(onMouseLeave, data, this)}
        onMouseMove={eventHandleWrapper(onMouseMove, data, this)}
        onMouseOver={eventHandleWrapper(onMouseOver, data, this)}
        style={getStyle()}
        transform={`translate(${x}, ${y})`}
      />
    );
  }
}

Symbol.propTypes = {

  className: PropTypes.string,

  color: PropTypes.string,

  /* Datum for the click and hover handlers. */
  data: PropTypes.object,

  focused: PropTypes.bool,

  focusedClassName: PropTypes.string,

  focusedStyle: PropTypes.object,

  itemKey: PropTypes.string,

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

  selectedClassName: PropTypes.string,

  selectedStyle: PropTypes.object,

  /* area in square pixels */
  size: PropTypes.number,

  strokeWidth: PropTypes.number,

  style: PropTypes.object,

  /* will match a SYMBOL_TYPE  */
  type: PropTypes.oneOf(Object.keys(SYMBOL_TYPES)),
};

Symbol.defaultProps = {
  color: 'steelblue',
  focused: false,
  focusedClassName: 'focused',
  focusedStyle: {
    stroke: '#777',
    strokeWidth: 1
  },
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
  position: {
    x: 0,
    y: 0
  },
  selected: false,
  selectedClassName: 'selected',
  selectedStyle: {
    stroke: '#000',
    strokeWidth: 1
  },
  size: 64,
  type: 'circle',
  strokeWidth: 1,
  style: {}
};

export { SYMBOL_TYPES };
