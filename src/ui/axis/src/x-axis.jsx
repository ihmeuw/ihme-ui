import React, { PropTypes } from 'react';
import { assign, omit } from 'lodash';

import Axis, { sharedPropTypes, calcTranslate } from './axis';

const propTypes = assign({}, sharedPropTypes, {
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
});

const defaultProps = {
  position: 'bottom',
};

export default function XAxis(props) {
  const { scales, dimensions, position, translate } = props;
  const childProps = omit(props, ['scales', 'translate', 'dimensions']);
  const translation = translate || calcTranslate(position, dimensions);

  return (
    <Axis
      scale={scales.x}
      translate={translation}
      {...childProps}
    />
  );
}

XAxis.propTypes = propTypes;
XAxis.defaultProps = defaultProps;
