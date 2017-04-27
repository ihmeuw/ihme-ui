import React from 'react';
import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {
  assign,
  bindAll,
  noop,
  reduce,
} from 'lodash';

import {
  CommonPropTypes,
  propsChanged,
  propResolver,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

import {
  DY_BOTTOM,
  TEXT_DIVISOR_BOTTOM,
  TEXT_DIVISOR_MIDDLE,
  DY_MIDDLE,
  DY_TOP,
  TEXT_DIVISOR_TOP,
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

    this.state = stateFromPropUpdates(AsterScore.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      stateFromPropUpdates(
        AsterScore.propUpdates,
        this.props,
        nextProps,
        this.state,
        this
      )
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    // only update if data is not being currently loaded,
    // and when props have changed,
    return !nextProps.loading
      && PureRenderMixin.shouldComponentUpdate.call(this, nextProps, nextState);
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
      dyBottom,
      dyMiddle,
      dyTop,
      centerTextBottom,
      centerTextTop,
      className,
      radius,
      style,
      textDivisorBottom,
      textDivisorMiddle,
      textDivisorTop,
    } = this.props;

    return (
      <g
        className={classNames(className)}
        textAnchor="middle"
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseOver={this.onMouseOver}
        style={style}
      >
        <text
          dy={dyTop}
          fontSize={`${radius / textDivisorTop}px`}
        >
          {centerTextTop}
        </text>
        <text
          dy={dyMiddle}
          fontSize={`${radius / textDivisorMiddle}px`}
        >
          {this.state.average}
        </text>
        <text
          dy={dyBottom}
          fontSize={`${radius / textDivisorBottom}px`}
        >
          {centerTextBottom}
        </text>
      </g>
    );
  }
}

AsterScore.propTypes = {
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
   * For determining classes, if classes is a function.
   * If not providing classes, or providing classes as an object, this
   * prop is not necessary
   * (the dataset for the Aster-Chart)
   */
  data: React.PropTypes.arrayOf(React.PropTypes.object),

  /**
   * The `dy` attribute of the bottom text in the center element of the Aster-Chart.
   * This prop affects positioning
   */
  dyBottom: React.PropTypes.string,

  /**
   * The `dy` attribute of the middle text in the center element of the Aster-Chart.
   * This prop affects positioning
   */
  dyMiddle: React.PropTypes.string,

  /**
   * The `dy` attribute of the bottom text in the center element of the Aster-Chart.
   * This prop affects positioning
   */
  dyTop: React.PropTypes.string,

  /**
   * Function to format the average shown in center of Aster-Chart
   */
  formatScore: React.PropTypes.func.isRequired,

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

  /**
   *  radius of the aster chart
   */
  radius: React.PropTypes.number.isRequired,

  /**
   * Inline style applied to center score element of Aster-Chart.
   *
   * Unlike other classes props for Aster-Chart, this cannot be a function since no
   * data is being iterated over when it is applied.
   */
  style: React.PropTypes.objectOf(React.PropTypes.string),

  /**
   * The font size is determined by how big the radius of the Aster-Chart is.
   * 'textDivisorBottom' divides the radius to give the calculated font-size to fit in the center
   * of the Aster-Chart.  fontSize={`${radius / textDivisorBottom}px`}
   * This lets the font grow and shrink.
   */
  textDivisorBottom: React.PropTypes.number,
  /**
   * The font size is determined by how big the radius of the Aster-Chart is.
   * 'textDivisorMiddle' divides the radius to give the calculated font-size to fit in the center
   * of the Aster-Chart.  fontSize={`${radius / textDivisorMiddle}px`}
   * This lets the font grow and shrink.
   */
  textDivisorMiddle: React.PropTypes.number,

  /**
   * The font size is determined by how big the radius of the Aster-Chart is.
   * 'textDivisorTop' divides the radius to give the calculated font-size to fit in the center
   * of the Aster-Chart.  fontSize={`${radius / textDivisorTop}px`}
   * This lets the font grow and shrink.
   */
  textDivisorTop: React.PropTypes.number,

  /**
   * the name of the field of the Aster can derive value from.
   * i.e. measure, score, or any quantifiable value to display
   */
  valueField: CommonPropTypes.dataAccessor.isRequired,
};

AsterScore.defaultProps = {
  centerTextBottom: '',
  centerTextTop: '',
  className: styles.asterScore,
  data: [{}],
  dyBottom: DY_BOTTOM,
  dyMiddle: DY_MIDDLE,
  dyTop: DY_TOP,
  onClick: noop,
  onMouseLeave: noop,
  onMouseMove: noop,
  onMouseOver: noop,
  style: {},
  textDivisorBottom: TEXT_DIVISOR_BOTTOM,
  textDivisorMiddle: TEXT_DIVISOR_MIDDLE,
  textDivisorTop: TEXT_DIVISOR_TOP,
};

AsterScore.propUpdates = {
  average: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['data', 'formatScore', 'valueField'])) return state;

    return assign({}, state, {
      average: nextProps.formatScore(
        reduce(
          nextProps.data,
          (a, b) => a + +propResolver(b.data, nextProps.valueField),
          0
        ) / nextProps.data.length
      ),
    });
  },
};
