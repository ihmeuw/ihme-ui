import React, { PropTypes } from 'react';
import {
  assign,
  get as getValue,
  identity,
  invoke,
  omit,
} from 'lodash';

import {
  propsChanged,
  PureComponent,
  stateFromPropUpdates,
} from '../../../utils';
import {
  filterTickValuesByWidth,
  filterTickValuesByHeight
} from './utils';

import Axis from './axis';

export const Orientation = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};

const AXIS_TYPE_TO_SCALE_PATH = {
  [Orientation.HORIZONTAL]: 'scales.x',
  [Orientation.VERTICAL]: 'scales.y',
};

const AXIS_TYPE_TO_TICK_VALUE_FITLER = {
  [Orientation.HORIZONTAL]: filterTickValuesByWidth,
  [Orientation.VERTICAL]: filterTickValuesByHeight,
};

/**
 *
 * @param {React.Component} AxisComponent
 * @param {string} orientation - oneOf([Orientation.HORIZONTAL, Orientation.VERTICAL])
 * @return {OrientedAxis}
 */
export default function orientAxis(AxisComponent, orientation) {
  class OrientedAxis extends PureComponent {
    constructor(props) {
      super(props);
      this.state = stateFromPropUpdates(OrientedAxis.propUpdates, {}, props, {});
    }

    componentWillReceiveProps(nextProps) {
      this.setState(stateFromPropUpdates(OrientedAxis.propUpdates, this.props, nextProps, {}));
    }

    render() {
      const axisProps = omit(this.props, ['scale', 'scales']);
      return (
        <AxisComponent
          tickValues={this.state.tickValues}
          scale={this.props.scale || getValue(this.props, AXIS_TYPE_TO_SCALE_PATH[orientation])}
          {...axisProps}
        />
      );
    }
  }

  OrientedAxis.propTypes = {
    ...Axis.propTypes,

    /**
     * if true, will dynamically filter tick values by the available width or height
     */
    autoFilterTickValues: PropTypes.bool,

    /**
     * required if and only if `props.scales` is not provided
     */
    scale: PropTypes.func,

    /**
     * required if and only if `props.scale` is not provided
     */
    scales: PropTypes.shape({
      x: PropTypes.func,
      y: PropTypes.func,
    }),

    /**
     * font-family of axis ticks
     * used when taking measurement of widest tick if autoFilterTickValues === true
     */
    tickFontFamily: PropTypes.string,

    /**
     * font size of axis ticks, in pixels
     * used when taking measurement of widest tick or to determine tick height
     * if autoFilterTickValues === true
     */
    tickFontSize: PropTypes.number,
  };

  OrientedAxis.defaultProps = {
    tickFontFamily: 'Helvetica',
    tickFontSize: 12,
  };

  OrientedAxis.propUpdates = {
    tickValues: (accum, propName, prevProps, nextProps) => {
      const {
        autoFilterTickValues,
        height,
        scale: scaleProp,
        tickFontFamily,
        tickFontSize,
        tickFormat,
        tickValues,
        width,
      } = nextProps;

      if (!autoFilterTickValues ||
        !propsChanged(prevProps, nextProps, ['scale', 'scales', 'width', 'height'])
      ) {
        return accum;
      }

      const scale = scaleProp || getValue(nextProps, AXIS_TYPE_TO_SCALE_PATH[orientation]);
      const ticks = tickValues || invoke(scale, 'ticks') || scale.domain();
      const filterFn = AXIS_TYPE_TO_TICK_VALUE_FITLER[orientation] || identity;

      return assign({}, accum, {
        tickValues: filterFn(ticks, {
          height,
          tickFontFamily,
          tickFontSize,
          tickFormat: tickFormat || identity,
          width,
        }),
      });
    }
  };

  return OrientedAxis;
}
