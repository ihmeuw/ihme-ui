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
import AsterTickCircle from './tick-circle';

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

  renderCircles(tickValues, className) {
    return (
      <g>
        {
          map(tickValues, (d) => (
            <AsterTickCircle
              r={this.state.scale(d)}
              key={`circle-${d}`}
              className={classNames(className)}
            />
          ))
        }
      </g>
    );
  }

  render() {
    const {
      children,
      innerTickClassName,
      outerTickClassName,
    } = this.props;

    const { tickValues } = this.state;

    return (
      <g>
        {this.renderCircles(
          tickValues.slice(1, -1),
          innerTickClassName
        )}

        {children}

        {this.renderCircles(
          [tickValues[0], tickValues[tickValues.length - 1]],
          outerTickClassName
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
   * domain of data
   */
  domain: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,

  /**
   * size of the inner radius of the aster-chart
   */
  innerRadius: React.PropTypes.number.isRequired,

  /**
   * css class for the inner tick guides of the aster chart
   */
  innerTickClassName: CommonPropTypes.className,

  /**
   * css class for the outlining circles (most inner and most outer)
   */
  outerTickClassName: CommonPropTypes.className,

  /**
   * radius of aster-chart
   */
  radius: React.PropTypes.number.isRequired,

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
