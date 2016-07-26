import React, { PropTypes } from 'react';
import classNames from 'classnames';
import d3Shape from 'd3-shape';
import { noop } from 'lodash';

import { eventHandleWrapper } from '../../../utils/events';
import { propsChanged } from '../../../utils/props';

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
    if (propsChanged(this.props, nextProps, ['type', 'size'])) {
      this.setState({
        path: this.createPath(nextProps.type, nextProps.size),
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return propsChanged(this.props, nextProps, [
      'selected', 'focused', 'translateX', 'translateY', 'className'
    ]);
  }

  /**
   * pass in data for selectedStyle(and other style) for function.
   * return a new object using Object.assign() instead of return for each if.
   * Reorder styling, default -> selected -> focused.
   */
  getStyle(data) {
    const { focused, focusedStyle, selected, selectedStyle, style } = this.props;
    const resultStyle = Object.assign(
      {},
      (typeof style === 'function' ? style(data) : { ...style })
    );
    if (selected) {
      Object.assign(
        resultStyle,
        (typeof selectedStyle === 'function' ? selectedStyle(data) : { ...selectedStyle })
      );
    }
    if (focused) {
      Object.assign(
        resultStyle,
        (typeof focusedStyle === 'function' ? focusedStyle(data) : { ...focusedStyle })
      );
    }
    return resultStyle;
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
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      selected,
      selectedClassName,
      translateX,
      translateY
    } = this.props;
    const { path } = this.state;

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
        style={this.getStyle(data)}
        transform={`translate(${translateX}, ${translateY})`}
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

  focusedStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),

  itemKey: PropTypes.string,

  /* partially applied fn that takes in datum and returns fn */
  onClick: PropTypes.func,

  /* partially applied fn that takes in datum and returns fn */
  onMouseLeave: PropTypes.func,

  /* partially applied fn that takes in datum and returns fn */
  onMouseMove: PropTypes.func,

  /* partially applied fn that takes in datum and returns fn */
  onMouseOver: PropTypes.func,

  selected: PropTypes.bool,

  selectedClassName: PropTypes.string,

  selectedStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),

  /* area in square pixels */
  size: PropTypes.number,

  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),

  translateX: PropTypes.number,

  translateY: PropTypes.number,

  /* will match a SYMBOL_TYPE  */
  type: PropTypes.oneOf(Object.keys(SYMBOL_TYPES)),
};

Symbol.defaultProps = {
  color: 'steelblue',
  focused: false,
  focusedClassName: 'focused',
  focusedStyle: {
    stroke: '#AAF',
    strokeWidth: 1
  },
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
  selected: false,
  selectedClassName: 'selected',
  selectedStyle: {
    stroke: '#000',
    strokeWidth: 1
  },
  size: 64,
  translateX: 0,
  translateY: 0,
  type: 'circle',
  style: {}
};

export { SYMBOL_TYPES };
