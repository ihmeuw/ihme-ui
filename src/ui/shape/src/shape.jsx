import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { symbol } from 'd3';
import assign from 'lodash/assign';
import bindAll from 'lodash/bindAll';

import {
  combineStyles,
  CommonDefaultProps,
  CommonPropTypes,
  getShape,
  memoizeByLastCall,
  propsChanged,
  shapeTypes,
  stateFromPropUpdates,
} from '../../../utils';

const SYMBOL_ROTATE = {
  down: 180,
  left: 270,
  right: 90,
};

/**
 * `import { Shape } from 'ihme-ui'`
 */
export default class Shape extends React.PureComponent {
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

  constructor(props) {
    super(props);

    this.combineStyles = memoizeByLastCall(combineStyles);
    this.state = stateFromPropUpdates(Shape.propUpdates, {}, props, {});

    bindAll(this, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Shape.propUpdates, this.props, nextProps, {}));
  }

  onClick(event) {
    const {
      datum,
      onClick,
    } = this.props;

    onClick(event, datum, this);
  }

  onMouseLeave(event) {
    const {
      datum,
      onMouseLeave,
    } = this.props;

    onMouseLeave(event, datum, this);
  }

  onMouseMove(event) {
    const {
      datum,
      onMouseMove,
    } = this.props;

    onMouseMove(event, datum, this);
  }

  onMouseOver(event) {
    const {
      datum,
      onMouseOver,
    } = this.props;

    onMouseOver(event, datum, this);
  }

  render() {
    const {
      className,
      clipPathId,
      datum,
      focused,
      focusedClassName,
      selected,
      selectedClassName,
      translateX,
      translateY,
    } = this.props;
    const { path, rotate, styles } = this.state;

    return (
      <path
        d={path}
        className={classNames(className, {
          [selectedClassName]: selected && selectedClassName,
          [focusedClassName]: focused && focusedClassName,
        }) || (void 0)}
        clipPath={clipPathId && `url(#${clipPathId})`}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
        style={this.combineStyles(styles, datum)}
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
  fill: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.number),
  ]),

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
  shapeType: PropTypes.oneOfType([
    PropTypes.oneOf(shapeTypes()),
    PropTypes.arrayOf(PropTypes.oneOf(shapeTypes())),
  ]),

  /**
   * Move shape away from origin in x direction.
   */
  translateX: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),

  /**
   * Move shape away from origin in y direction.
   */
  translateY: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
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
    return assign({}, accum, {
      path: Shape.getPath(shapeType, nextProps.size),
      rotate: SYMBOL_ROTATE[rotate] || 0,
    });
  },

  // update style if datum, focused, focusedStyle, selected, selectedStyle, or style have changed
  styles: (accum, propName, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, [
      'fill',
      'focused',
      'focusedStyle',
      'selected',
      'selectedStyle',
      'style',
    ])) {
      return accum;
    }

    const styles = [{ fill: nextProps.fill }, nextProps.style];

    if (nextProps.selected) {
      styles.push(nextProps.selectedStyle);
    }

    if (nextProps.focused) {
      styles.push(nextProps.focusedStyle);
    }

    return assign({}, accum, {
      styles,
    });
  },
};
