import React, { PropTypes } from 'react';
import classNames from 'classnames';
import d3Shape from 'd3-shape';
import { assign, noop } from 'lodash';

import { eventHandleWrapper } from '../../../utils/events';
import {
  CommonPropTypes,
  propsChanged,
  PureComponent,
  stateFromPropUpdates
} from '../../../utils';

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
export default class Symbol extends PureComponent {
  static getPath(type, size) {
    const symbolType = SYMBOL_TYPES[type] || SYMBOL_TYPES.circle;
    return d3Shape.symbol().type(symbolType).size(size)();
  }

  /**
   * @param {Object}
   * @return {Object} computed style for
   */
  static getStyle({ data, fill, focused, focusedStyle, selected, selectedStyle, style }) {
    const baseStyle = { fill };
    const computedStyle = typeof style === 'function' ? style(data) : style;
    let computedSelectedStyle = {};
    let computedFocusedStyle = {};

    // if symbol is selected, compute selectedStyle
    if (selected) {
      computedSelectedStyle = typeof selectedStyle === 'function'
        ? selectedStyle(data)
        : selectedStyle;
    }

    // if symbol is focused, compute focusedStyle
    if (focused) {
      computedFocusedStyle = typeof focusedStyle === 'function'
        ? focusedStyle(data)
        : focusedStyle;
    }

    return assign({}, baseStyle, computedStyle, computedSelectedStyle, computedFocusedStyle);
  }

  constructor(props) {
    super(props);
    this.state = stateFromPropUpdates(Symbol.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Symbol.propUpdates, this.props, nextProps, {}));
  }

  render() {
    const {
      className,
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
    const { path, style } = this.state;

    return (
      <path
        d={path}
        className={classNames(className, {
          [selectedClassName]: selected,
          [focusedClassName]: focused,
        })}
        onClick={eventHandleWrapper(onClick, data, this)}
        onMouseLeave={eventHandleWrapper(onMouseLeave, data, this)}
        onMouseMove={eventHandleWrapper(onMouseMove, data, this)}
        onMouseOver={eventHandleWrapper(onMouseOver, data, this)}
        style={style}
        transform={`translate(${translateX}, ${translateY})`}
      />
    );
  }
}

Symbol.propTypes = {
  /* base classname to apply to symbol */
  className: PropTypes.string,

  /* Datum for the click and hover handlers. */
  data: PropTypes.object,

  fill: PropTypes.string,

  /* whether symbol has focus */
  focused: PropTypes.bool,

  /* classname to be applied if symbol has focus */
  focusedClassName: PropTypes.string,

  /*
    inline-style object or function to be applied if symbol has focus;
    if a function, is called with datum
    can override style and selectedStyle
  */
  focusedStyle: CommonPropTypes.style,

  itemKey: PropTypes.string,

  /* signature: function(event, data, Symbol) {...} */
  onClick: PropTypes.func,

  /* signature: function(event, data, Symbol) {...} */
  onMouseLeave: PropTypes.func,

  /* signature: function(event, data, Symbol) {...} */
  onMouseMove: PropTypes.func,

  /* signature: function(event, data, Symbol) {...} */
  onMouseOver: PropTypes.func,

  /* whether symbol is selected */
  selected: PropTypes.bool,

  /* classname to be applied if symbol is selected */
  selectedClassName: PropTypes.string,

  /*
   inline-style object or function to be applied if symbol is selected;
   if a function, is called with datum
   can override style
   */
  selectedStyle: CommonPropTypes.style,

  /* area in square pixels */
  size: PropTypes.number,

  /*
   inline-style object or function to be applied as base style;
   if a function, is called with datum
   */
  style: CommonPropTypes.style,

  translateX: PropTypes.number,

  translateY: PropTypes.number,

  /* a SYMBOL_TYPE  */
  type: PropTypes.oneOf(Object.keys(SYMBOL_TYPES)),
};

Symbol.defaultProps = {
  fill: 'steelblue',
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

Symbol.propUpdates = {
  // update path if symbol type or size have changed
  path: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['type', 'size'])) return accum;
    return assign(accum, {
      path: Symbol.getPath(nextProps.type, nextProps.size),
    });
  },

  // update style if data, focused, focusedStyle, selected, selectedStyle, or style have changed
  style: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, [
      'data',
      'fill',
      'focused',
      'focusedStyle',
      'selected',
      'selectedStyle',
      'style',
    ])) {
      return accum;
    }
    return assign(accum, {
      style: Symbol.getStyle({
        data: nextProps.data,
        fill: nextProps.fill,
        focused: nextProps.focused,
        focusedStyle: nextProps.focusedStyle,
        selected: nextProps.selected,
        selectedStyle: nextProps.selectedStyle,
        style: nextProps.style,
      }),
    });
  },
};

export { SYMBOL_TYPES };
