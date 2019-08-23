import React from 'react';
import PropTypes from 'prop-types';
import {
  assign,
  get as getValue,
  identity,
  invoke,
  omit,
} from 'lodash';

import {
  filterTickValuesByWidth,
  filterTickValuesByHeight,
  propsChanged,
  stateFromPropUpdates,
} from '../../../utils';

import Axis from './axis';

export const Orientation = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};

const AXIS_TYPE_TO_SCALE_PATH = {
  [Orientation.HORIZONTAL]: 'scales.x',
  [Orientation.VERTICAL]: 'scales.y',
};

const AXIS_TYPE_TO_TICK_VALUE_FILTER = {
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
  class OrientedAxis extends React.PureComponent {
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
          {...axisProps}
          tickValues={this.state.tickValues}
          scale={this.props.scale || getValue(this.props, AXIS_TYPE_TO_SCALE_PATH[orientation])}
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
    tickPadding: 3,
    tickSize: 6,
  };

  OrientedAxis.propUpdates = {
    tickValues: (accum, propName, prevProps, nextProps) => {
      const {
        autoFilterTickValues,
        height,
        rotateTickValues,
        scale: scaleProp,
        tickFontFamily,
        tickFontSize,
        tickFormat,
        tickValues,
        width,
      } = nextProps;

      // Only filter tick values if they are not already being rotated.
      if (autoFilterTickValues
        && !rotateTickValues
        && propsChanged(prevProps, nextProps, ['scale', 'scales', 'width', 'height'])
      ) {
        const scale = scaleProp || getValue(nextProps, AXIS_TYPE_TO_SCALE_PATH[orientation]);
        const ticks = tickValues || invoke(scale, 'ticks') || scale.domain();
        const filterFn = AXIS_TYPE_TO_TICK_VALUE_FILTER[orientation] || identity;
        const result = assign({}, accum, {
          tickValues: filterFn(ticks, {
            height,
            tickFontFamily,
            tickFontSize,
            tickFormat: tickFormat || identity,
            width,
          }),
        });
        return result;
      // eslint-disable-next-line no-else-return
      } else {
        return accum;
      }
    }
  };

  return OrientedAxis;
}
