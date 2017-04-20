import React from 'react';
import classNames from 'classnames';
import { bindAll, noop } from 'lodash';

import { CommonPropTypes, PureComponent } from '../../../utils';
import {
  BOTTOM_DY,
  BOTTOM_TEXT_DIVISOR,
  MIDDLE_TEXT_DIVISOR,
  MIDDLE_DY,
  SCORE_GROUP_DY,
  TOP_DY,
  TOP_TEXT_DIVISOR,
} from './constants';
import styles from './aster-chart.css';

export default class AsterScore extends PureComponent {
  constructor(props) {
    super(props);

    bindAll(this, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
    ]);
  }

  // e.g., select the average (score)
  onClick(e) {
    e.preventDefault();

    this.props.onClick(e, this.props, this);
  }

  // e.g., destroy tooltip
  onMouseLeave(e) {
    e.preventDefault();

    this.props.onMouseLeave(e, this.props, this);
  }

  // e.g., position tooltip
  onMouseMove(e) {
    e.preventDefault();

    this.props.onMouseMove(e, this.props, this);
  }

  // e.g., init tooltip
  onMouseOver(e) {
    e.preventDefault();

    this.props.onMouseOver(e, this.props, this);
  }

  render() {
    const {
      average,
      bottomDy,
      centerTextBottom,
      centerTextTop,
      className,
      middleDy,
      radius,
      scoreGroupDy,
      topDy,
    } = this.props;

    return (
      <g
        className={classNames(className)}
        textAnchor="middle"
        dy={scoreGroupDy}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
      >
        <text
          dy={topDy}
          fontSize={`${radius / TOP_TEXT_DIVISOR}px`}
        >
          {centerTextTop}
        </text>
        <text
          dy={middleDy}
          fontSize={`${radius / MIDDLE_TEXT_DIVISOR}px`}
        >
          {average}
        </text>
        <text
          dy={bottomDy}
          fontSize={`${radius / BOTTOM_TEXT_DIVISOR}px`}
        >
          {centerTextBottom}
        </text>
      </g>
    );
  }
}

AsterScore.propTypes = {
  /**
   *  the 'average' is the content displayed in the center of the score element
   */
  average: React.PropTypes.oneOf([React.PropTypes.string, React.PropTypes.number]),

  /**
   *  text to display below score of the Aster-Chart's center element
   */
  centerTextBottom: React.PropTypes.string,

  /**
   *  text to display above score of the Aster-Chart's center element
   */
  centerTextTop: React.PropTypes.string,

  /**
   *  class of asterScore center element
   */
  className: CommonPropTypes.className,

  /**
   *  radius of the aster chart
   */
  radius: React.PropTypes.number.isRequired,

  /**
   *  function to be called when clicked
   */
  onClick: React.PropTypes.func,

  /**
   *  function to be called when onMouseLeave
   */
  onMouseLeave: React.PropTypes.func,

  /**
   *  function to be called when onMouseMove
   */
  onMouseMove: React.PropTypes.func,

  /**
   *  function to be called when onMouseOver
   */
  onMouseOver: React.PropTypes.func,
};

AsterScore.defaultProps = {
  bottomDy: BOTTOM_DY,
  className: styles.asterScore,
  middleDy: MIDDLE_DY,
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
  scoreGroupDy: SCORE_GROUP_DY,
  topDy: TOP_DY,
};

