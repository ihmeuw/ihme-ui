import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import assign from 'lodash/assign';
import bindAll from 'lodash/bindAll';
import * as util from '../../../utils';

/**
 * `import { Bar } from 'ihme-ui'`
 *
 * A low-level component representing a simple rectangle, used as a primitive element in `Bars`,
 * `GroupedBars`, and `StackedBars`.
 */
export default class Bar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = util.memoizeByLastCall(util.combineStyles);
    this.state = util.stateFromPropUpdates(Bar.propUpdates, {}, props, {});

    bindAll(this, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver'
    ]);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(util.stateFromPropUpdates(Bar.propUpdates, this.props, nextProps, {}));
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
      fill,
      focused,
      focusedClassName,
      height,
      width,
      selected,
      selectedClassName,
      x,
      y,
    } = this.props;

    const { styles } = this.state;

    return (
      <rect
        className={
          classNames(
            className,
            {
              [selectedClassName]: selected && selectedClassName,
              [focusedClassName]: focused && focusedClassName,
            })
          || (void 0)
        }
        x={x}
        y={y}
        height={height}
        width={width}
        fill={fill}
        clipPath={clipPathId && `url(#${clipPathId})`}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
        style={this.combineStyles(styles, datum)}
      />
    );
  }
}

const {
  CommonDefaultProps,
  CommonPropTypes,
} = util;

Bar.propTypes = {
  /**
   * Class name applied to svg element rect.
   */
  className: CommonPropTypes.className,

  /**
   * If a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip this path to that container by passing in the clip path URL id.
   */
  clipPathId: PropTypes.string,

  /**
   * Datum object associated with the bar. The component makes no assumptions about the shape of
   * this object. It's only used as a parameter to client-supplied callbacks, like `onClick` and
   * the function form of `style`.
   */
  datum: PropTypes.object,

  /**
   * Fill color for svg element rect.
   */
  fill: PropTypes.string,

  /**
   * Whether svg element rect has focus.
   */
  focused: PropTypes.bool,

  /**
   * Class name applied if svg element rect has focus.
   */
  focusedClassName: CommonPropTypes.className,

  /**
   * Inline styles applied if svg element rect has focus.
   * If an object, spread directly into inline styles.
   * If a function, called with `props.datum` as argument and return value is spread into inline styles;
   * signature: (datum) => obj
   */
  focusedStyle: CommonPropTypes.style,

  /**
   * Height of svg element rect.
   */
  height: PropTypes.number.isRequired,

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
   * Whether svg element rect is selected.
   */
  selected: PropTypes.bool,

  /**
   * Class name applied if selected.
   */
  selectedClassName: CommonPropTypes.className,

  /**
   * Inline styles applied to selected `<Bar />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Bar />`
   * and return value spread into line styles;
   * signature: (datum) => obj
   */
  selectedStyle: CommonPropTypes.style,

  /**
   * Base inline styles applied to `<Bar />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Bar />`.
   */
  style: CommonPropTypes.style,

  /**
   * Width of svg element rect.
   */
  width: PropTypes.number.isRequired,

  /**
   * Initial x position of svg element rect.
   */
  x: PropTypes.number.isRequired,

  /**
   * Initial y position of svg element rect.
   */
  y: PropTypes.number.isRequired,
};

Bar.defaultProps = {
  fill: 'steelblue',
  focused: false,
  focusedClassName: 'focused',
  focusedStyle: {
    stroke: '#000',
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
  style: {},
};

Bar.propUpdates = {
  // update rect if bar prop changes
  styles: (accum, propName, prevProps, nextProps) => {
    if (!util.propsChanged(prevProps, nextProps, [
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
