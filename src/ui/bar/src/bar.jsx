import React, { PropTypes } from 'react';
import assign from 'lodash/assign';
import bindAll from 'lodash/bindAll';
import classNames from 'classnames';

import {
  combineStyles,
  CommonDefaultProps,
  CommonPropTypes,
  getShape,
  memoizeByLastCall,
  propsChanged,
  PureComponent,
  shapeTypes,
  stateFromPropUpdates,
} from '../../../utils';


export class Bar extends React.Component {
  constructor(props) {
    super(props);

    bindAll(this, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver'
    ]);

  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(Shape.propUpdates, this.props, nextProps, {}));
  }

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
    //   datum,
    //   translateX,
    //   translateY
    // } = this.props;

    // const { rotate, styles } = this.state;

    return (
      // add transform
      // add option for stacked/grouped
      <svg>
        <rect
          className={this.props.className}
          x={this.props.x}
          y={this.props.y}
          height={this.props.height}
          width={this.props.width}
          fill={"#000000"}
          onClick={this.onClick}
          onMouseLeave={this.onMouseLeave}
          onMouseMove={this.onMouseMove}
          onMouseOver={this.onMouseOver}
        />
      </svg>
    );
  }



}


Bar.propTypes = {
  /**
   * Class name applied to path.
   */
  className: CommonPropTypes.className,

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
   * Fill color for path.
   */
  fill: PropTypes.string,

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
   * Move shape away from origin in x direction.
   */
  translateX: PropTypes.number,

  /**
   * Move shape away from origin in y direction.
   */
  translateY: PropTypes.number

};

Bar.defaultProps = {
  x: 0,
  y: 0,
  fill: 'steelblue',
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  translateX: 0,
  translateY: 0

};



