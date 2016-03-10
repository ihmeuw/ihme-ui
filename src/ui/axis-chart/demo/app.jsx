import React from 'react';
import { render } from 'react-dom';

import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';

import d3Scale from 'd3-scale';

import { dataGenerator } from '../../../test-utils';
import { AxisChart } from '../.';
import { MultiLine } from '../../shape';
import { XAxis, YAxis } from '../../axis';


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

const lineData = [{ location: 'USA', values: usaData }, { location: 'Canada', values: canadaData }];

const data = [...usaData, ...canadaData];
const yDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
const xDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });
const colorScale = d3Scale.scaleOrdinal().domain(['USA', 'Canada']).range(['red', 'blue']);

const dims = {
  height: 600,
  width: 800
};

const margins = {
  top: 20,
  bottom: 30,
  left: 70,
  right: 70
};

const axisStyle = {
  fontFamily: 'sans-serif',
  fontSize: '11px'
};

class App extends React.Component {
  render() {
    return (
      <AxisChart
        width={dims.width}
        height={dims.height}
        margins={margins}
        xDomain={xDomain}
        xScaleType="point"
        yDomain={yDomain}
        yScaleType="linear"
        extraClasses={['foo', 'bar']}
      >
        <XAxis style={axisStyle} />
        <YAxis />
        <MultiLine
          data={lineData}
          keyField={'location'}
          dataField={'values'}
          colorScale={colorScale}
          dataAccessors={{ x: keyField, y: valueField }}
        />
      </AxisChart>
    );
  }
}

render(<App />, document.getElementById('app'));
