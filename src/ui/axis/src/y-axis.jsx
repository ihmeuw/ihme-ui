import React, { PropTypes } from 'react';
import { assign, omit } from 'lodash';

import Axis, { sharedPropTypes, calcTranslate } from './axis';

const propTypes = assign({}, sharedPropTypes, {
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
});

const defaultProps = {
  position: 'left',
};

export default function YAxis(props) {
  const childProps = omit(props, ['scales', 'translate', 'dimensions']);
  const translation = props.translate || calcTranslate(props.position, props.dimensions);

  return (
    <Axis
      scale={props.scales.y}
      translate={translation}
      {...childProps}
    />
  );
}

YAxis.propTypes = propTypes;
YAxis.defaultProps = defaultProps;
