import React, { PropTypes } from 'react';
import { omit } from 'lodash';

import Axis, { calcTranslate } from './axis';

export default function YAxis(props) {
  const axisProps = omit(props, ['scales', 'translate', 'dimensions']);
  const translation = props.translate || calcTranslate(props.position, props.dimensions);

  return (
    <Axis
      scale={props.scale || props.scales.y}
      translate={translation}
      {...axisProps}
    />
  );
}

YAxis.propTypes = {
  ...Axis.propTypes,

  /* OVERRIDE - where to position ticks relative to axis line */
  position: PropTypes.oneOf(['left', 'right']),

  /* scales are provided by axis-chart, only y scale is used by YAxis */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func.isRequired,
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

YAxis.defaultProps = {
  position: 'left',
};
