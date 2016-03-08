import React from 'react';
import { render } from 'react-dom';

import d3Scale from 'd3-scale';

import { maxBy, minBy, map, uniqBy } from 'lodash';

import { dataGenerator } from '../../../test-utils';
import { AxisChart } from '../../axis-chart';
import { ScatterPlot } from '../';


const keyField = 'year_id';
const valueField = 'value';

const usaData = dataGenerator({
  keyField,
  valueField,
  length: 10,
  dataQuality: 'best',
  useDates: true
});

const canadaData = dataGenerator({
  keyField,
  valueField,
  length: 10,
  dataQuality: 'best',
  useDates: true
});

const lineData = [
  { location: 'USA', values: usaData },
  { location: 'Canada', values: canadaData }
];

const data = [...usaData, ...canadaData];
const yDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
const xDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });

const dataAccessors = {
  x: keyField,
  y: valueField
};


const clickHandler = () => {
  return (text) => {
    return () => {
      alert(`Data::${text[keyField]},${text[valueField]}`);
    };
  };
};

const hoverHandler = (type) => {
  return (text) => {
    return () => {
      console.log(`${type}::${text[keyField]},${text[valueField]}`);
    };
  };
};

const symbolScale = d3Scale.scaleOrdinal().domain(['USA', 'Canada']).range(['circle', 'star']);

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
        <ScatterPlot
          data={lineData}
          dataAccessors={dataAccessors}
          keyField={'location'}
          dataField={'values'}
          symbolField={'location'}
          symbolScale={symbolScale}
          clickHandler={clickHandler('click')}
          hoverHandler={hoverHandler('hover')}
        />
      </AxisChart>
    );
  }
}

render(<App />, document.getElementById('app'));
