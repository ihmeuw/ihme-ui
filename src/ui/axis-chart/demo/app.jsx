import React from 'react';
import { render } from 'react-dom';

import maxBy from 'lodash/maxby';
import minBy from 'lodash/minby';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';

import { dataGenerator } from '../../../test-utils';
import { AxisChart } from '../';
import { MultiLine } from '../../shape';


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
        <MultiLine
          data={lineData}
          keyField={'location'}
          dataField={'values'}
          dataAccessors={{ x: keyField, y: valueField }}
        />
      </AxisChart>
    );
  }
}

render(<App />, document.getElementById('app'));
