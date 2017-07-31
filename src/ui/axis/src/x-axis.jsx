import React, { PropTypes } from 'react';
import { scaleLinear } from 'd3';
import omit from 'lodash/omit';

import { atLeastOneOfProp, propsChanged } from '../../../utils';

import Axis, { AXIS_SCALE_PROP_TYPES } from './axis';

/**
 * `import { XAxis } from 'ihme-ui'`
 *
 * Chart x-axis that extends \<Axis /> and provides some useful defaults.
 *
 * All props documented on \<Axis /> are available on \<XAxis />.
 */
export default class XAxis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      scale: props.scale || props.scales.x,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      scale: nextProps.scale || nextProps.scales.x,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return propsChanged(this.props, nextProps, undefined, ['scale', 'scales']) ||
           propsChanged(this.state, nextState);
  }

  render() {
    const axisProps = omit(this.props, ['scale', 'scales']);
    return (
      <Axis
        scale={this.state.scale}
        {...axisProps}
      />
    );
  }
}

const X_AXIS_SCALE_PROP_TYPES = {
  ...AXIS_SCALE_PROP_TYPES,
  scales: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func,
  }).isRequired,
};

XAxis.propTypes = {
  ...Axis.propTypes,

  /**
   * where to position axis line
   * one of: 'top', 'bottom'
   */
  orientation: PropTypes.oneOf(['top', 'bottom']),

  /**
   * alternative to providing scales object with key 'x' and scale function as value
   */
  scale: atLeastOneOfProp(X_AXIS_SCALE_PROP_TYPES),

  /**
   *  scales are provided by axis-chart, only x scale is used by XAxis
   */
  scales: atLeastOneOfProp(X_AXIS_SCALE_PROP_TYPES),
};

XAxis.defaultProps = {
  orientation: 'bottom',
  scales: { x: scaleLinear() },
  width: 0,
  height: 0,
  padding: {
    top: 40,
    bottom: 40,
  },
};
