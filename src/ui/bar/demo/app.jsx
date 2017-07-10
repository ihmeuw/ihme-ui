import React from 'react';
import ReactDOM from 'react-dom';
import { bindAll, maxBy, minBy, map, slice, uniqBy, without, xor } from 'lodash';
import { dataGenerator } from '../../../utils';
import { Bar } from '../src/bar';
import AxisChart from '../../axis-chart';
import { schemeCategory10, scaleOrdinal } from 'd3';
import { XAxis, YAxis } from '../../axis';

const keyField = 'year_id';
const valueField = 'population';

const data = dataGenerator({
  primaryKeys: [
    { name: 'location', values: ['Brazil', 'Russia', 'India', 'China', 'Mexico', 'Indonesia', 'Nigeria', 'Vietnam'] }
  ],
  valueKeys: [
    { name: valueField, range: [100, 900], uncertainty: true }
  ]
});

const locationData = [
  { location: 'Brazil', values: data.filter((datum) => { return datum.location === 'Brazil'; }) },
  { location: 'Russia', values: data.filter((datum) => { return datum.location === 'Russia'; }) },
  { location: 'India', values: data.filter((datum) => { return datum.location === 'India'; }) },
  { location: 'China', values: data.filter((datum) => { return datum.location === 'China'; }) },
  { location: 'Mexico', values: data.filter((datum) => { return datum.location === 'Mexico'; }) },
  { location: 'Indonesia', values: data.filter((datum) => { return datum.location === 'Indonesia'; }) },
  { location: 'Nigeria', values: data.filter((datum) => { return datum.location === 'Nigeria'; }) },
  { location: 'Vietnam', values: data.filter((datum) => { return datum.location === 'Vietnam'; }) }
];

const valueFieldDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
const keyFieldDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });
const colorScale = scaleOrdinal(schemeCategory10);


console.log(locationData);

class App extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //
    //
    // }

    // bindAll(this, [
    //
    //
    //
    // ]);

  }

  render() {


    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>


        <AxisChart
          height={300}
          width={500}
          xDomain={keyFieldDomain}
          yDomain={valueFieldDomain}
          xScaleType="point"
          yScaleType="linear"
        >
          <XAxis />
          <YAxis />

        </AxisChart>




      </div>
    );
  }








}


ReactDOM.render(<App />, document.getElementById('app'));

