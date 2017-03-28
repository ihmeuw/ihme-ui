import React from 'react';
import { map } from 'lodash';

import AsterWhisker from './aster-whisker';

export default function AsterWhiskers(props) {
  const {
    data,
    domainEnd,
    innerRadius,
    radius,
  } = props;

  const whiskerFunction = (d) => {
    const r1 = ((radius - innerRadius) * (d.data.lower / domainEnd)) + innerRadius;
    const r2 = ((radius - innerRadius) * (d.data.upper / domainEnd)) + innerRadius;
    const a = ((d.startAngle + d.endAngle) / 2) - (Math.PI / 2);

    return {
      x1: Math.cos(a) * r1,
      y1: Math.sin(a) * r1,
      x2: Math.cos(a) * r2,
      y2: Math.sin(a) * r2,
    };
  };

  const boundsFunction = ({ x1, y1, x2, y2 }) => {
    const dx = (x2 - x1);
    const dy = (y2 - y1);
    const length = Math.max(1, Math.sqrt((dx * dx) + (dy * dy)));
    const hy = dy / length;
    const hx = dx / length;

    return {
      upper: {
        x1: x2 - (hy * 5),
        y1: y2 + (hx * 5),
        x2: x2 - (hy * -5),
        y2: y2 + (hx * -5),
      },
      lower: {
        x1: x1 - (hy * 5),
        y1: y1 + (hx * 5),
        x2: x1 - (hy * -5),
        y2: y1 + (hx * -5),
      },
    };
  };

  return (
    <g className="whiskers">
      {
        map(data, (d, i) => {
          const whisker = whiskerFunction(d);
          const bounds = boundsFunction(whisker);

          return (
            <g className="whisker" key={i}>
              <AsterWhisker
                className="whisker-line"
                x1={whisker.x1}
                y1={whisker.y1}
                x2={whisker.x2}
                y2={whisker.y2}
              />
              <AsterWhisker
                className="whisker-lower"
                x1={bounds.lower.x1}
                y1={bounds.lower.y1}
                x2={bounds.lower.x2}
                y2={bounds.lower.y2}
              />
              <AsterWhisker
                className="whisker-upper"
                x1={bounds.upper.x1}
                y1={bounds.upper.y1}
                x2={bounds.upper.x2}
                y2={bounds.upper.y2}
              />
            </g>
          );
        })
      }
    </g>
  );
};

