import React from 'react';

export default function AsterScore({ content, radius }) {
  return (
    <g
      className="aster-score"
      textAnchor="middle"
      dy="1em"
    >
      <text
        dy="-1.1em"
        fontSize={`${radius / 14}px`}
      >
        {content.topText}
      </text>
      <text
        dy=".39em"
        fontSize={`${radius / 6}px`}
      >
        {content.average}
      </text>
      <text
        dy="3.2em"
        fontSize={`${radius / 25}px`}
      >
        {content.bottomText}
      </text>
    </g>
  );
};


