import { PropTypes } from 'react';
import { scaleLinear } from 'd3-scale';
import { atLeastOneOfProp, propsChanged } from '../../../utils';

import Axis, { AXIS_SCALE_PROP_TYPES } from './axis';

export default class XAxis extends Axis {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      scale: props.scale || props.scales.x,
    };
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);

    this.setState({
      scale: nextProps.scale || nextProps.scales.x,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return propsChanged(this.props, nextProps, undefined, ['scale', 'scales']) ||
           propsChanged(this.state, nextState);
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

  /* OVERRIDE - orientation of ticks relative to axis line */
  orientation: PropTypes.oneOf(['top', 'bottom']),

  /* scales are provided by axis-chart, only x scale is used by XAxis */
  scale: atLeastOneOfProp(X_AXIS_SCALE_PROP_TYPES),
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
