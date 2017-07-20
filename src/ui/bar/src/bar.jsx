import React, { PropTypes } from 'react';
import classNames from 'classnames';
import assign from 'lodash/assign';
import bindAll from 'lodash/bindAll';
import { scaleOrdinal } from 'd3';

import {
  combineStyles,
  CommonDefaultProps,
  CommonPropTypes,
  memoizeByLastCall,
  propsChanged,
  propResolver,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

/**
 * `import { Bar } from 'ihme-ui'`
 */
export default class Bar extends PureComponent {
  constructor(props) {
    super(props);

    this.combineStyles = memoizeByLastCall(combineStyles);
    this.state = stateFromPropUpdates(Bar.propUpdates, {}, props, {});

    bindAll(this, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver'
    ]);

  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Bar.propUpdates, this.props, nextProps, {}));
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
      x,
      y,
      height,
      rectHeight,
      rectWidth,
      datum,
      fill,
      focused,
      focusedClassName,
      selected,
      selectedClassName,
    } = this.props;

    const { styles } = this.state;

    return (
      <g>
        <rect
          className={classNames(className, {
             [selectedClassName]: selected && selectedClassName,
             [focusedClassName]: focused && focusedClassName,
           }) || (void 0)}
          x={x}
          y={y}
          height={rectHeight}
          width={rectWidth}
          fill={fill}
          clipPath={clipPathId && `url(#${clipPathId})`}
          onClick={this.onClick}
          onMouseLeave={this.onMouseLeave}
          onMouseMove={this.onMouseMove}
          onMouseOver={this.onMouseOver}
          style={this.combineStyles(styles, datum)}
        />
      </g>
    );
  }
}

Bar.propTypes = {
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
   * Initial x position of svg element rect.
   */
  x: PropTypes.number,

  /**
   * Initial y position of svg element rect.
   */
  y: PropTypes.number,

  /**
   * Height of svg element rect.
   */
  height: PropTypes.number,

  /**
   * Width of svg element rect.
   */
  width: PropTypes.number,

  /**
   * Datum object corresponding to this shape ("bound" data, in the language in D3)
   */
  datum: PropTypes.object,

  /**
   * Fill color for svg element rect.
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
   * Inline styles applied to selected `<Bar />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Bar />`
   * and return value spread into line styles;
   * signature: (datum) => obj
   */
  selectedStyle: CommonPropTypes.style,

  /**
   * Base inline styles applied to `<Shape />`s.
   * If an object, spread into inline styles.
   * If a function, passed underlying datum corresponding to its `<Bar />`.
   */
  style: CommonPropTypes.style,

};

Bar.defaultProps = {
  fill: 'steelblue',
  foused: false,
  focusedClassName: 'focused',
  focusedStyle: {
    stroke: '#AAF',
    strokeWidth: .5,
  },
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  selected: false,
  selectedClassName: 'selected',
  selectedStyles: {
    stroke: '#000',
    strokeWidth: .5,
  },
  style: {},
};

// Bar.propUpdates = {
//   rect: (acc, propName, prevProps, nextProps) => {
//     if (!propsChanged(prevProps, nextProps, ['data', 'dataAccessors', 'scales'])) {
//       return acc;
//     }
//
//     // const pathGenerator = scaleOrdinal()
//     //   .x((datum) => nextProps.scales.x(propResolver(datum, nextProps.dataAccessors.x)))
//     //   .y((datum) => nextProps.scales.y(propResolver(datum, nextProps.dataAccessors.y)));
//
//     return {
//       ...acc,
//       // path: pathGenerator(nextProps.data),
//     };
//   },
//
//   styles: (accum, propName, prevProps, nextProps) => {
//     if (!propsChanged(prevProps, nextProps, [
//         'fill',
//         'focused',
//         'focusedStyle',
//         'selected',
//         'selectedStyle',
//         'style',
//       ])) {
//       return accum;
//     }
//     const styles = [{ fill: nextProps.fill }, nextProps.style];
//
//     if (nextProps.selected) {
//       styles.push(nextProps.selectedStyle);
//     }
//
//     if (nextProps.focused) {
//       styles.push(nextProps.focusedStyle);
//     }
//
//     return assign({}, accum, {
//       styles,
//     });
//   }
// };
//
//
//
