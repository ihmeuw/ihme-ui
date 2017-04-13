import React from 'react';
import { isEmpty } from 'lodash';

import { CommonPropTypes, PureComponent } from '../../../utils';
import AsterWhisker from './whisker';

export default class AsterWhiskers extends PureComponent {
  static getBounds({ x1, y1, x2, y2 }, lengthMultiplier) {
    const dx = (x2 - x1);
    const dy = (y2 - y1);
    const length = Math.max(1, Math.sqrt((dx * dx) + (dy * dy)));
    const hy = dy / length;
    const hx = dx / length;

    return {
      upper: {
        x1: x2 - (hy * lengthMultiplier),
        y1: y2 + (hx * lengthMultiplier),
        x2: x2 - (hy * -lengthMultiplier),
        y2: y2 + (hx * -lengthMultiplier),
      },
      lower: {
        x1: x1 - (hy * lengthMultiplier),
        y1: y1 + (hx * lengthMultiplier),
        x2: x1 - (hy * -lengthMultiplier),
        y2: y1 + (hx * -lengthMultiplier),
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = props;
  }

  getWhiskers(d) {
    const {
      domainEnd,
      innerRadius,
      radius,
      uncertaintyProps,
    } = this.props;
    const { lower, upper } = uncertaintyProps;

    const r1 = ((radius - innerRadius) * (d.data[lower] / domainEnd)) + innerRadius;
    const r2 = ((radius - innerRadius) * (d.data[upper] / domainEnd)) + innerRadius;
    const a = ((d.startAngle + d.endAngle) / 2) - (Math.PI / 2);

    return {
      x1: Math.cos(a) * r1,
      y1: Math.sin(a) * r1,
      x2: Math.cos(a) * r2,
      y2: Math.sin(a) * r2,
    };
  }

  render() {
    const { className, data, lengthMultiplier, uncertaintyProps } = this.props;
    if (isEmpty(uncertaintyProps)) return null;

    const whisker = this.getWhiskers(data);
    const bounds = AsterWhiskers.getBounds(whisker, lengthMultiplier);

    return (
      <g className={className}>
        <g>
          <AsterWhisker
            x1={whisker.x1}
            y1={whisker.y1}
            x2={whisker.x2}
            y2={whisker.y2}
          />
          <AsterWhisker
            x1={bounds.lower.x1}
            y1={bounds.lower.y1}
            x2={bounds.lower.x2}
            y2={bounds.lower.y2}
          />
          <AsterWhisker
            x1={bounds.upper.x1}
            y1={bounds.upper.y1}
            x2={bounds.upper.x2}
            y2={bounds.upper.y2}
          />
        </g>
      </g>
    );
  }
}

AsterWhiskers.propTypes = {
  /**
   * css class
   */
  className: CommonPropTypes.className.isRequired,

  /**
   * last number of the domain
   */
  domainEnd: React.PropTypes.number.isRequired,

  /**
   * data for whisker
   */
  data: React.PropTypes.shape({
    endAngle: React.PropTypes.number,
    index: React.PropTypes.number,
    padAngle: React.PropTypes.number,
    startAngle: React.PropTypes.number,
    value: React.PropTypes.number,
  }).isRequired,

  /**
   * size of inner radius of aster-chart
   */
  innerRadius: React.PropTypes.number.isRequired,

  /**
   * multiply the resulting whisker by this prop, big number makes big whisker
   */
  lengthMultiplier: React.PropTypes.number,

  /**
   * size of full radius of aster-chart
   */
  radius: React.PropTypes.number.isRequired,

  /**
   * what key to use to access the uncertainty property
   */
  uncertaintyProps: React.PropTypes.shape({
    lower: React.PropTypes.string,
    upper: React.PropTypes.string,
  }),
};

AsterWhiskers.defaultProps = {
  uncertaintyProps: null,
  lengthMultiplier: 5,
};
