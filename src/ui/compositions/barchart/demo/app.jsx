import React from 'react';
import { schemeCategory10, scaleOrdinal } from 'd3';
import ReactDOM from 'react-dom';
import {
  bindAll,
  xor,
  maxBy,
  minBy,
  map,
  uniqBy,
} from 'lodash';


import AxisChart from './../../../axis-chart';
import ResponsiveContainer from './../../../responsive-container';
import { XAxis, YAxis } from './../../../axis';
import Bars from './../../../bar/src/bars';
import Legend from './../../../legend';

import { dataGenerator } from '../../../../utils';

// These fields are specific to the dataset so these are hardcoded for now
// Will need to change in order to support different data
const yearField = 'year_id';
const populationField = 'population';
const locationField = 'location';

const data = dataGenerator({
  primaryKeys: [
    { name: 'location', values: ['Brazil', 'Russia', 'India', 'China', 'Mexico', 'Indonesia', 'Nigeria', 'Vietnam'] }
  ],
  valueKeys: [
    { name: populationField, range: [100, 900], uncertainty: true }
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

// Should these be passed or calculated from given dataset within the BarChart component?
const populationFieldDomain = [minBy(data, populationField)[populationField], maxBy(data, populationField)[populationField]];
const yearFieldDomain = map(uniqBy(data, yearField), (obj) => { return (obj[yearField]); });
const locationFieldDomain = map(uniqBy(locationData, locationField), (obj) => { return (obj[locationField]); });
const colorScale = scaleOrdinal(schemeCategory10);

console.log(locationData);
console.log(data.filter((datum) => { return datum.location === 'India'; }));

// create items given the data and the fields specified
const items = [
  {
    label: 'Total Population',
    shapeColor: 'steelblue',
    shapeType: 'square'
  }
]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
    };

    bindAll(this, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
    ]);

  }

  onClick(event, datum) {
    console.log(`${event.type}::${datum[yearField]},${datum[populationField]}`);
    this.setState({
      selectedItems: xor(this.state.selectedItems, [datum]),
    });
  };

  onMouseLeave(event, datum) {
    console.log(`${event.type}::${datum[yearField]},${datum[populationField]}`);
    this.setState({
      focus: {},
    });
  };

  onMouseMove(event, datum) {
    console.log(`${event.type}::${datum[yearField]},${datum[populationField]}`);
  };

  onMouseOver(event, datum) {
    console.log(`${event.type}::${datum[yearField]},${datum[populationField]}`);
    this.setState({
      focus: datum,
    });
  };

  render() {
    return (
    <div id="wrapper">
      <h2>Title Goes Here</h2>
      {/*<div id="auto-resize">*/}
        <ResponsiveContainer>
          <AxisChart
            xDomain={yearFieldDomain}
            yDomain={populationFieldDomain}
            xScaleType="band"
            yScaleType="linear"
          >
            <XAxis
              label={"Years"}
            />
            <YAxis
              label={"Population"}
            />
            <Bars
              fill="steelblue"
              data={data.filter((datum) => { return datum.location === 'India'; })}
              dataAccessors={{
                fill: yearField,
                key: 'id',
                x: yearField,    // year_id
                y: populationField   // population
              }}
              focus={this.state.focus}
              onClick={this.onClick}
              onMouseLeave={this.onMouseLeave}
              onMouseMove={this.onMouseMove}
              onMouseOver={this.onMouseOver}
              selection={this.state.selectedItems}
            />
          </AxisChart>
        </ResponsiveContainer>
        <Legend
          items={items}
          labelKey="label"
          shapeColorKey="shapeColor"
          shapeTypeKey="shapeType"/>
      {/*</div>*/}
    </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
