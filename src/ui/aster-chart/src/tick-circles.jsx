import React from 'react';
import classNames from 'classnames';
import { assign, map } from 'lodash';
import { scaleLinear } from 'd3';

import {
  CommonPropTypes,
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';

import { linspace } from '../../../utils/array';

export default class AsterTickCircles extends PureComponent {
  constructor(props) {
    super(props);

    this.state = stateFromPropUpdates(AsterTickCircles.propUpdates, {}, props, {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState(stateFromPropUpdates(
      AsterTickCircles.propUpdates,
      this.props,
      nextProps,
      this.state,
      this
    ));
  }

  renderCircles(tickValues, className, style) {
    return (
      <g>
        {
          map(tickValues, tick => (
            <circle
              className={classNames(className)}
              key={`circle-${tick}`}
              r={this.state.scale(tick)}
              style={style}
            />
          ))
        }
      </g>
    );
  }

  render() {
    const {
      children,
      classNameInnerTick,
      classNameOuterTick,
      styleInnerTick,
      styleOuterTick,
    } = this.props;

    const { tickValues } = this.state;

    return (
      <g>
        {this.renderCircles(
          tickValues.slice(1, -1),
          classNameInnerTick,
          styleInnerTick
        )}

        {children}

        {this.renderCircles(
          [tickValues[0], tickValues[tickValues.length - 1]],
          classNameOuterTick,
          styleOuterTick
        )}
      </g>
    );
  }
}

AsterTickCircles.propTypes = {
  /**
   * array of inner elements of the aster
   */
  children: React.PropTypes.oneOfType([
    CommonPropTypes.children,
    React.PropTypes.arrayOf(CommonPropTypes.children),
  ]).isRequired,

  /**
   * css class for the inner tick guides of the aster chart
   */
  classNameInnerTick: CommonPropTypes.className.isRequired,

  /**
   * css class for the outlining circles (most inner and most outer)
   */
  classNameOuterTick: CommonPropTypes.className.isRequired,

  /**
   * domain of data
   */
  domain: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,

  /**
   * size of the inner radius of the aster-chart
   */
  innerRadius: React.PropTypes.number.isRequired,

  /**
   * radius of aster-chart
   */
  radius: React.PropTypes.number.isRequired,

  /**
   * Inline style applied to inner ticks of Aster-Chart.
   *
   * Unlike other classes props for Aster-Chart, this cannot be a function since no
   * data is being iterated over when it is applied.
   */
  styleInnerTick: React.PropTypes.objectOf(React.PropTypes.string),

  /**
   * Inline style applied to outer ticks of Aster-Chart.
   *
   * Unlike other classes props for Aster-Chart, this cannot be a function since no
   * data is being iterated over when it is applied.
   */
  styleOuterTick: React.PropTypes.objectOf(React.PropTypes.string),

  /**
   * number of tick circles
   */
  ticks: React.PropTypes.number.isRequired,
};

AsterTickCircles.propUpdates = {
  scale: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['domain', 'innerRadius', 'radius'])) return state;

    return assign({}, state, {
      scale: scaleLinear()
        .domain(nextProps.domain)
        .range([nextProps.radius, nextProps.innerRadius]),
    });
  },
  ticks: (state, _, prevProps, nextProps) => {
    if (!propsChanged(prevProps, nextProps, ['domain', 'ticks'])) return state;

    return assign({}, state, {
      tickValues: linspace(nextProps.domain, nextProps.ticks),
    });
  },
};

AsterTickCircles.defaultProps = {
  styleInnerTick: {},
  styleOuterTick: {},
};
