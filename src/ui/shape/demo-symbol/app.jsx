import React from 'react';
import { render } from 'react-dom';

import { maxBy, minBy, map, uniqBy } from 'lodash';

import d3Scale from 'd3-scale';

import { AxisChart } from '../../axis-chart';
import { Symbol, SYMBOL_TYPES } from '../';


const keyField = 'x';
const valueField = 'y';

const data = [];

Object.keys(SYMBOL_TYPES).forEach((e, i) => {
  data.push({
    x: e,
    y: i
  });
});

const yDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
const xDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });

const yScale = d3Scale.scaleLinear().domain(yDomain).range([600, 0]);
const xScale = d3Scale.scalePoint().domain(xDomain).range([0, 800]);

const handler = (type) => {
  return (text) => {
    return () => {
      console.log(`${type}:${text.x}`);
    };
  };
};

class App extends React.Component {
  render() {
    return (
      <AxisChart
        xDomain={xDomain}
        xScaleType="point"
        yDomain={yDomain}
        yScaleType="linear"
        width={800}
        height={600}
      >
        {
          map(data, (datum) => {
            const position = { x: xScale(datum[keyField]), y: yScale(6) };
            return (
              <Symbol
                key={datum[keyField]}
                data={datum}
                type={datum[keyField]}
                size={144}
                position={position}
                clickHandler={handler('click')}
                hoverHandler={handler('hover')}
              />
            );
          })
        }
      </AxisChart>
    );
  }
}

render(<App />, document.getElementById('app'));
