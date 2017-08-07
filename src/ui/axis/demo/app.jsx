import React from 'react';
import { render } from 'react-dom';
import { scaleBand, scaleLinear } from 'd3';
import range from 'lodash/range';

import { XAxis, YAxis } from '../';
import { ResponsiveContainer } from '../../';

const padding = {
  top: 40,
  right: 50,
  left: 50,
  bottom: 40,
};

function App({ width, height }) {
  return (
    <svg width={`${width}px`} height={`${height}px`}>
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        <XAxis
          autoFilterTickValues
          scale={scaleBand().domain(range(1970, 2011)).range([0, width - (padding.right + padding.left)])}
          width={width - (padding.right + padding.left)}
          height={height - (padding.bottom + padding.top)}
          orientation="top"
          label="Top XAxis"
          padding={padding}
        />
        <XAxis
          autoFilterTickValues
          scale={scaleBand().domain(range(1970, 2011)).range([0, width - (padding.right + padding.left)])}
          // translate={{ x: 0, y: 600 - (padding.bottom + padding.top) }}
          width={width - (padding.right + padding.left)}
          height={height - (padding.bottom + padding.top)}
          orientation="bottom"
          label="Bottom XAxis"
          padding={padding}
        />
        <YAxis
          autoFilterTickValues
          scale={scaleLinear().range([height - (padding.bottom + padding.top), 0])}
          width={width - (padding.right + padding.left)}
          height={height - (padding.bottom + padding.top)}
          orientation="left"
          label="Left YAxis"
          padding={padding}
        />
        <YAxis
          autoFilterTickValues
          scale={scaleLinear().domain([0, 100]).range([height - (padding.bottom + padding.top), 0])}
          width={width - (padding.right + padding.left)}
          height={height - (padding.bottom + padding.top)}
          orientation="right"
          label="Right YAxis"
          padding={padding}
        />
      </g>
    </svg>
  );
}

render(<ResponsiveContainer><App /></ResponsiveContainer>, document.getElementById('app'));
