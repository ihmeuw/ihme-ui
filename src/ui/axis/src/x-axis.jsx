import { PropTypes } from 'react';
import { scaleLinear } from 'd3';
import { assign } from 'lodash';

import Axis from './axis';
import orientAxis, { Orientation } from './orientedAxis';

/**
 * `import { XAxis } from 'ihme-ui'`
 *
 * Chart x-axis that extends \<Axis /> and provides some useful defaults.
 *
 * All props documented on \<Axis /> are available on \<XAxis />.
 */
const XAxis = orientAxis(Axis, Orientation.HORIZONTAL);

XAxis.propTypes = assign({}, XAxis.propTypes, {
  orientation: PropTypes.oneOf(['top', 'bottom']),
});

XAxis.defaultProps = assign({}, XAxis.defaultProps, {
  orientation: 'bottom',
  scales: { x: scaleLinear() },
  width: 0,
  height: 0,
  padding: {
    top: 40,
    bottom: 40,
  },
});

export default XAxis;
