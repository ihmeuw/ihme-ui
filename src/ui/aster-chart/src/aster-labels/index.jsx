import React from 'react';
import { map } from 'lodash';

function angleFunction(d, offset, threshold) {
  const angle = ((d.startAngle + d.endAngle) * (90 / Math.PI)) + offset;
  return angle > threshold ? angle - 180 : angle;
}

function determineLabelTransform(d, outlineFunction) {
  const center = outlineFunction.centroid(d);
  const angle = angleFunction(d, -90, 90);

  return `translate(${center}) rotate(${angle})`;
}

const outerArcFunction = (d, outlineFunction) => {
  const angle = angleFunction(d, 0, 0);

  let newArc = /(^.+?)L/.exec(outlineFunction(d))[1];
  newArc = newArc.replace(/,/g, ' ');

  if (newArc === 'M0 0') return newArc;

  if (angle < 90 && angle > -90) {
    const newStart = /0 0 1 (.*?)$/.exec(newArc)[1];
    const newEnd = /M(.*?)A/.exec(newArc)[1];
    const middleSec = /A(.*?)0 0 1/.exec(newArc)[1];

    newArc = `M${newStart}A${middleSec}0 0 0 ${newEnd}`;
  }

  return newArc;
};

export default function AsterLabels(props) {
  const {
    data,
    labelProp,
    radius,
    scoreProp,
    outlineFunction,
  } = props;

  return (
    // labels
    <g>
      {
        map(data, (d, i) => (
          <g key={i}>
            <text
              className="label-outline"
              dy=".35em"
              dx={(angleFunction(d) < 0) ? '-16px' : '16px'}
              textAnchor="middle"
              transform={determineLabelTransform(d, outlineFunction)}
              fontSize={`${radius / 30}px`}
            >
              {d.data[labelProp]}
            </text>
            <text
              className="label"
              dy=".35em"
              dx={(angleFunction(d) < 0) ? '-16px' : '16px'}
              textAnchor="middle"
              transform={determineLabelTransform(d, outlineFunction)}
              fontSize={`${radius / 30}px`}
            >
              {d.data[labelProp]}
            </text>


            <path
              className="outer-arc"
              id={`outer-arc-${i}`}
              d={outerArcFunction(d, outlineFunction)}
            />
            <text
              className="outer-label"
              dy={(angleFunction(d, 0, 0) < 90 && angleFunction(d, 0, 0) > -90) ? 18 : -8}
            >

              <textPath
                startOffset="50%"
                xlinkHref={`#outer-arc-${i}`}
              >
                {d.data[scoreProp]}
              </textPath>
            </text>
          </g>
        ))
      }
    </g>
  );
};
