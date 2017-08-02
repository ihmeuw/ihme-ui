import { PropTypes } from 'react';
import { scaleLinear } from 'd3';
import { assign } from 'lodash';

import Axis from './axis';
import orientAxis, { Orientation } from './orientedAxis';

/**
 * `import { YAxis } from 'ihme-ui'`
 *
 * Chart y-axis that extends \<Axis /> and provides some useful defaults.
 *
 * All props documented on \<Axis /> are available on \<YAxis />.
 */
const YAxis = orientAxis(Axis, Orientation.VERTICAL);

YAxis.propTypes = assign({}, YAxis.propTypes, {
  orientation: PropTypes.oneOf(['left', 'right']),
});

YAxis.defaultProps = assign({}, YAxis.defaultProps, {
  orientation: 'left',
  scales: { y: scaleLinear() },
  width: 0,
  height: 0,
  padding: {
    left: 50,
    right: 50,
  },
});

export default YAxis;
