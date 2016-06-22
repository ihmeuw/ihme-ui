import React, { PropTypes } from 'react';
import { omit } from 'lodash';
import { oneOfProp } from '../../../utils';

import Axis, { AXIS_SCALE_PROP_TYPES } from './axis';
import { calcTranslate } from './utils';

export default function XAxis(props) {
  const axisProps = omit(props, ['scales', 'translate', 'width', 'height']);
  const translate = props.translate || calcTranslate(props.orientation, props.width, props.height);

  return (
    <Axis
      scale={props.scale || props.scales.x}
      translate={translate}
      {...axisProps}
    />
  );
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
  scale: oneOfProp(X_AXIS_SCALE_PROP_TYPES),
  scales: oneOfProp(X_AXIS_SCALE_PROP_TYPES),

  /*
   dimensions are provided by axis-chart
   used for calculating translate, required if translate is not specified
  */
  width: PropTypes.number,
  height: PropTypes.number,
};

XAxis.defaultProps = {
  orientation: 'bottom',
};
