import React, { PropTypes } from 'react';
import { scaleLinear } from 'd3';
import omit from 'lodash/omit';

import { atLeastOneOfProp, propsChanged } from '../../../utils';

import Axis, { AXIS_SCALE_PROP_TYPES } from './axis';

/**
 * `import { YAxis } from 'ihme-ui'`
 *
 * Chart y-axis that extends \<Axis /> and provides some useful defaults.
 *
 * All props documented on \<Axis /> are available on \<YAxis />.
 */
export default class YAxis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      scale: props.scale || props.scales.y,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      scale: nextProps.scale || nextProps.scales.y,
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

const Y_AXIS_SCALE_PROP_TYPES = {
  ...AXIS_SCALE_PROP_TYPES,
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func.isRequired,
  }).isRequired,
};

YAxis.propTypes = {
  ...Axis.propTypes,

  /**
   * where to position axis line
   * one of: 'left', 'right'
   */
  orientation: PropTypes.oneOf(['left', 'right']),

  /**
   * alternative to providing scales object with key 'y' and scale function as value
   */
  scale: atLeastOneOfProp(Y_AXIS_SCALE_PROP_TYPES),

  /**
   *  scales are provided by axis-chart, only y scale is used by YAxis
   */
  scales: atLeastOneOfProp(Y_AXIS_SCALE_PROP_TYPES),
};

YAxis.defaultProps = {
  orientation: 'left',
  scales: { y: scaleLinear() },
  width: 0,
  height: 0,
  padding: {
    left: 50,
    right: 50,
  },
};
