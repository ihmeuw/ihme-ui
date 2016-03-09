import React, { PropTypes } from 'react';

import { assign, omit } from 'lodash';

import Axis, { defaultPropTypes, calcTranslate } from './axis';

const propTypes = assign({}, defaultPropTypes, {
  /* OVERRIDE - where to position ticks relative to axis line */
  position: PropTypes.oneOf(['top', 'bottom']),

  /* appropriate scales for axis */
  scales: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,

  /* dimensions of chart, used for calculating translate, required if translate is not specified */
  dimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  })
});

const defaultProps = {
  position: 'bottom'
};

const XAxis = (props) => {
  const childProps = omit(props, ['scales', 'translate']);
  const scale = props.scales.x;
  const translate = props.translate || calcTranslate(props.position, props.dimensions);
  return (
    <Axis
      scale={scale}
      translate={translate}
      {...childProps}
    />
  );
};

XAxis.propTypes = propTypes;

XAxis.defaultProps = defaultProps;

export default XAxis;
