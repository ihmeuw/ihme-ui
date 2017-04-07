import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { symbol } from 'd3';
import { assign } from 'lodash';

import { eventHandleWrapper } from '../../../utils/events';
import {
  CommonDefaultProps,
  CommonPropTypes,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';
import { getShape, shapeTypes } from '../../../utils/shape';

const SYMBOL_ROTATE = {
  down: 180,
  left: 270,
  right: 90,
};

/**
 * `import { Shape } from 'ihme-ui'`
 */
export default class Shape extends PureComponent {
  /**
   * Return path string for given shape type and size
   * @param type {String}
   * @param size {Number}
   * @return {String}
   */
  static getPath(type, size) {
    const shapeType = getShape(type);
    return symbol().type(shapeType).size(size)();
  }

  /**
   * Calculate style given base style, selected style, and focused style
   * @param {Object}
   * @return {Object} computed style
   */
  static getStyle({ datum, fill, focused, focusedStyle, selected, selectedStyle, style }) {
    const baseStyle = { fill };
    const computedStyle = typeof style === 'function' ? style(datum) : style;
    let computedSelectedStyle = {};
    let computedFocusedStyle = {};

    // if shape is selected, compute selectedStyle
    if (selected) {
      computedSelectedStyle = typeof selectedStyle === 'function' ?
        selectedStyle(datum) : selectedStyle;
    }

    // if shape is focused, compute focusedStyle
    if (focused) {
      computedFocusedStyle = typeof focusedStyle === 'function' ?
        focusedStyle(datum) : focusedStyle;
    }

    return assign({}, baseStyle, computedStyle, computedSelectedStyle, computedFocusedStyle);
  }

  constructor(props) {
    super(props);
    this.state = stateFromPropUpdates(Shape.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Shape.propUpdates, this.props, nextProps, {}));
  }

  render() {
    const {
      className,
      clipPathId,
      datum,
      focused,
      focusedClassName,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      selected,
      selectedClassName,
      translateX,
      translateY,
    } = this.props;
    const { path, rotate, style } = this.state;

    return (
      <path
        d={path}
        className={classNames(className, {
          [selectedClassName]: selected && selectedClassName,
          [focusedClassName]: focused && focusedClassName,
        }) || (void 0)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        onClick={eventHandleWrapper(onClick, datum, this)}
        onMouseLeave={eventHandleWrapper(onMouseLeave, datum, this)}
        onMouseMove={eventHandleWrapper(onMouseMove, datum, this)}
        onMouseOver={eventHandleWrapper(onMouseOver, datum, this)}
        style={style}
        transform={`translate(${translateX}, ${translateY}) rotate(${rotate})`}
      />
    );
  }
}

Shape.propTypes = {
  /**
   * Class name applied to path.
   */
  className: CommonPropTypes.className,

  /**
   * If a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip this path to that container by passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * Datum object corresponding to this shape ("bound" data, in the language in D3)
   */
  datum: PropTypes.object,

  /**
   * Fill color for path.
   */
  fill: PropTypes.string,

  /**
   * Whether shape has focus.
   */
  focused: PropTypes.bool,

  /**
   * Class name applied if shape has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * Inline styles applied if shape has focus.
   * If an object, spread directly into inline styles.
   * If a function, called with `props.datum` as argument and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  focusedStyle: CommonPropTypes.style,

  /**
   * onClick callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onClick: PropTypes.func,

  /**
   * onMouseLeave callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseLeave: PropTypes.func,

  /**
   * onMouseMove callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseMove: PropTypes.func,

  /**
   * onMouseOver callback.
   * signature: (SyntheticEvent, datum, instance) => {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * Whether shape is selected.
   */
  selected: PropTypes.bool,

  /**
   * Class name applied if selected.
   */
  selectedClassName: CommonPropTypes.className,

  /**
   * Inline styles applied to selected `<Shape />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Shape />`
   * and return value spread into line styles;
   * signature: (datum) => obj
   */
  selectedStyle: CommonPropTypes.style,

  /**
   * Area in square pixels.
   */
  size: PropTypes.number,

  /**
   * Base inline styles applied to `<Shape />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Shape />`.
   */
  style: CommonPropTypes.style,

  /**
   * Type of shape to render, driven by d3-shape.
   * One of: 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'
   */
  shapeType: PropTypes.oneOf(shapeTypes()),

  /**
   * Move shape away from origin in x direction.
   */
  translateX: PropTypes.number,

  /**
   * Move shape away from origin in y direction.
   */
  translateY: PropTypes.number,
};

Shape.defaultProps = {
  fill: 'steelblue',
  focused: false,
  focusedClassName: 'focused',
  focusedStyle: {
    stroke: '#AAF',
    strokeWidth: 1,
  },
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  selected: false,
  selectedClassName: 'selected',
  selectedStyle: {
    stroke: '#000',
    strokeWidth: 1,
  },
  size: 64,
  translateX: 0,
  translateY: 0,
  shapeType: 'circle',
  style: {},
};

Shape.propUpdates = {
  // update path if shape type or size have changed
  path: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['shapeType', 'size'])) return accum;
    const [shapeType, rotate] = nextProps.shapeType.split(' ', 2);
    return assign(accum, {
      path: Shape.getPath(shapeType, nextProps.size),
      rotate: SYMBOL_ROTATE[rotate] || 0,
    });
  },

  // update style if datum, focused, focusedStyle, selected, selectedStyle, or style have changed
  style: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, [
      'datum',
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
      style: Shape.getStyle({
        datum: nextProps.datum,
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
