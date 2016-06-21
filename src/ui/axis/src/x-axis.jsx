import React, { PropTypes } from 'react';
import { omit } from 'lodash';

import Axis, { calcTranslate } from './axis';

export default function XAxis(props) {
  const axisProps = omit(props, ['scales', 'translate', 'dimensions']);
  const translation = props.translate || calcTranslate(props.position, props.dimensions);

  return (
    <Axis
      scale={props.scale || props.scales.x}
      translate={translation}
      {...axisProps}
    />
  );
}

XAxis.propTypes = {
  ...Axis.propTypes,

  /* OVERRIDE - where to position ticks relative to axis line */
  position: PropTypes.oneOf(['top', 'bottom']),

  /* scales are provided by axis-chart, only x-scale is used by XAxis */
  scales: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func,
  }),

  /*
   dimensions are provided by axis-chart
   used for calculating translate, required if translate is not specified
  */
  dimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

XAxis.defaultProps = {
  position: 'bottom',
};
