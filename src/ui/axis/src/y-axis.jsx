import React, { PropTypes } from 'react';
import { omit } from 'lodash';

import Axis, { calcTranslate, oneOfProp, AXIS_SCALE_PROP_TYPES } from './axis';

export default function YAxis(props) {
  const axisProps = omit(props, ['scales', 'translate', 'dimensions']);
  const translation = props.translate || calcTranslate(props.orientation, props.dimensions);

  return (
    <Axis
      scale={props.scale || props.scales.y}
      translate={translation}
      {...axisProps}
    />
  );
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

  /* OVERRIDE - orientation of ticks relative to axis line */
  orientation: PropTypes.oneOf(['left', 'right']),

  /* scales are provided by axis-chart, only y scale is used by YAxis */
  scale: oneOfProp(Y_AXIS_SCALE_PROP_TYPES),
  scales: oneOfProp(Y_AXIS_SCALE_PROP_TYPES),

  /*
   dimensions are provided by axis-chart
   used for calculating translate, required if translate is not specified
  */
  dimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

YAxis.defaultProps = {
  orientation: 'left',
};
