import React, { PropTypes } from 'react';
import classNames from 'classnames';
import assign from 'lodash/assign';
import bindAll from 'lodash/bindAll';

import {
  combineStyles,
  CommonDefaultProps,
  CommonPropTypes,
  memoizeByLastCall,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

const SYMBOL_ROTATE = {
  down: 180,
  left: 270,
  right: 90
};

/**
 * `import { Bar } from 'ihme-ui'`
 */
export class Bar extends PureComponent {
  constructor(props) {
    super(props);

    // this.combineStyles = memoizeByLastCall(combineStyles);
    // this.state = stateFromPropUpdates(Bar.propUpdates, {}, props, {});

    bindAll(this, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver'
    ]);

  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState(stateFromPropUpdates(Shape.propUpdates, this.props, nextProps, {}));
  // }

  onClick(event) {
    // const {
    //   datum,
    //   onClick,
    // } = this.props;
    //
    // onClick(event, datum, this);
    console.log("click");
  }

  onMouseLeave(event) {
    // const {
    //   datum,
    //   onMouseLeave,
    // } = this.props;
    //
    // onMouseLeave(event, datum, this);
    console.log("leave");

  }

  onMouseMove(event) {
    // const {
    //   datum,
    //   onMouseMove,
    // } = this.props;
    //
    // onMouseMove(event, datum, this);
    console.log("move");

  }

  onMouseOver(event) {
    // const {
    //   datum,
    //   onMouseOver,
    // } = this.props;
    //
    // onMouseOver(event, datum, this);
    console.log("over");

  }


  render() {
    // const {
    //   className,
    //   x,
    //   y,
    //   height,
    //   width,
    //   datum,
    //   focused,
    //   focusedClassName,
    //   selected,
    //   selectedClassName,
    //   translateX,
    //   translateY
    // } = this.props;

    // const { rotate, styles } = this.state;

    return (
      // add transform
      // add option for stacked/grouped
      <svg>
        <rect
          // className={classNames(className, {
          //   [selectedClassName]: selected && selectedClassName,
          //   [focusedClassName]: focused && focusedClassName,
          // }) || (void 0)}
          className={"testing"}
          x={this.props.x}
          y={this.props.y}
          height={height}
          width={width}
          fill={"#000000"}
          onClick={this.onClick}
          onMouseLeave={this.onMouseLeave}
          onMouseMove={this.onMouseMove}
          onMouseOver={this.onMouseOver}
          style={this.combineStyles(styles, datum)}
          transform={`translate(${translateX}, ${translateY}) rotate(${rotate})`}
        />
      </svg>
    );
  }
}


// Bar.propTypes = {
//   /**
//    * Class name applied to path.
//    */
//   className: CommonPropTypes.className,
//
//   /**
//    * Initial x position of svg element rect.
//    */
//   x: PropTypes.number,
//
//   /**
//    * Initial y position of svg element rect.
//    */
//   y: PropTypes.number,
//
//   /**
//    * Height of svg element rect.
//    */
//   height: PropTypes.number,
//
//   /**
//    * Width of svg element rect.
//    */
//   width: PropTypes.number,
//
//   /**
//    * Fill color for path.
//    */
//   fill: PropTypes.string,
//
//   /**
//    * Whether shape has focus.
//    */
//   focused: PropTypes.bool,
//
//   /**
//    * Class name applied if shape has focus.
//    */
//   focusedClassName: CommonPropTypes.className,
//
//   /**
//    * Inline styles applied if shape has focus.
//    * If an object, spread directly into inline styles.
//    * If a function, called with `props.datum` as argument and return value is spread into inline styles;
//    * signature: (datum) => obj
//    */
//   focusedStyle: CommonPropTypes.style,
//
//   /**
//    * onClick callback.
//    * signature: (SyntheticEvent, datum, instance) => {...}
//    */
//   onClick: PropTypes.func,
//
//   /**
//    * onMouseLeave callback.
//    * signature: (SyntheticEvent, datum, instance) => {...}
//    */
//   onMouseLeave: PropTypes.func,
//
//   /**
//    * onMouseMove callback.
//    * signature: (SyntheticEvent, datum, instance) => {...}
//    */
//   onMouseMove: PropTypes.func,
//
//   /**
//    * onMouseOver callback.
//    * signature: (SyntheticEvent, datum, instance) => {...}
//    */
//   onMouseOver: PropTypes.func,
//
//   /**
//    * Whether shape is selected.
//    */
//   selected: PropTypes.bool,
//
//   /**
//    * Class name applied if selected.
//    */
//   selectedClassName: CommonPropTypes.className,
//
//   /**
//    * Inline styles applied to selected `<Shape />`s.
//    * If an object, spread into inline styles.
//    * If a function, passed underlying datum corresponding to its `<Shape />`
//    * and return value spread into line styles;
//    * signature: (datum) => obj
//    */
//   selectedStyle: CommonPropTypes.style,
//
//   /**
//    * Base inline styles applied to `<Shape />`s.
//    * If an object, spread into inline styles.
//    * If a function, passed underlying datum corresponding to its `<Shape />`.
//    */
//   style: CommonPropTypes.style,
//
//   /**
//    * Move shape away from origin in x direction.
//    */
//   translateX: PropTypes.number,
//
//   /**
//    * Move shape away from origin in y direction.
//    */
//   translateY: PropTypes.number
//
// };
//
// Bar.defaultProps = {
//   x: 0,
//   y: 0,
//   fill: 'steelblue',
//   foused: false,
//   focusedClassName: 'focused',
//   focusedStyle: {
//     stroke: '#AAF',
//     strokeWidth: 1,
//   },
//   onClick: CommonDefaultProps.noop,
//   onMouseLeave: CommonDefaultProps.noop,
//   onMouseMove: CommonDefaultProps.noop,
//   onMouseOver: CommonDefaultProps.noop,
//   selected: false,
//   selectedClassName: 'selected',
//   selectedStyles: {
//     stroke: '#000',
//     strokeWidth: 1,
//   },
//   translateX: 0,
//   translateY: 0,
//   style: {},
// };
//
// Shape.propUpdates = {
//
//
//
//
// };



