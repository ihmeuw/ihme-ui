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


import StackedBarChart from './../../stacked/src/stacked';

import { dataGenerator } from '../../../../utils';

// These fields are specific to the dataset so these are hardcoded for now
// Will need to change in order to support different data
const yearField = 'year_id';
const populationField = 'population';
const locationField = 'location';

const data = dataGenerator({
  primaryKeys: [
    { name: 'location', values: ['Brazil', 'Russia', 'India', 'China', 'Mexico'] }
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
  { location: 'Mexico', values: data.filter((datum) => { return datum.location === 'Mexico'; }) }
];

// Should these be passed or calculated from given dataset within the BarChart component?
const populationFieldDomain = [minBy(data, populationField)[populationField], maxBy(data, populationField)[populationField]];
const yearFieldDomain = map(uniqBy(data, yearField), (obj) => { return (obj[yearField]); });
const locationFieldDomain = map(uniqBy(locationData, locationField), (obj) => { return (obj[locationField]); });
const colorScale = scaleOrdinal(schemeCategory10);

// create items given the data and the fields specified
const items = [
  {
    label: '2000',
    shapeColor: colorScale('2000'),
    shapeType: 'square'
  },
  {
    label: '2001',
    shapeColor: colorScale('2001'),
    shapeType: 'square'
  },
  {
    label: '2002',
    shapeColor: colorScale('2002'),
    shapeType: 'square'
  },
  {
    label: '2003',
    shapeColor: colorScale('2003'),
    shapeType: 'square'
  },
  {
    label: '2004',
    shapeColor: colorScale('2004'),
    shapeType: 'square'
  },
  {
    label: '2005',
    shapeColor: colorScale('2005'),
    shapeType: 'square'
  },
  {
    label: '2006',
    shapeColor: colorScale('2006'),
    shapeType: 'square'
  },
  {
    label: '2007',
    shapeColor: colorScale('2007'),
    shapeType: 'square'
  },
  {
    label: '2008',
    shapeColor: colorScale('2008'),
    shapeType: 'square'
  },
  {
    label: '2009',
    shapeColor: colorScale('2009'),
    shapeType: 'square'
  }
];

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
    console.log(`${event.type}::${datum}`);
    this.setState({
      selectedItems: xor(this.state.selectedItems, [datum]),
    });
  };

  onMouseLeave(event, datum) {
    console.log(`${event.type}::${datum}`);
    this.setState({
      focus: {},
    });
  };

  onMouseMove(event, datum) {
    console.log(`${event.type}::${datum}`);  };

  onMouseOver(event, datum) {
    console.log(`${event.type}::${datum}`);
    this.setState({
      focus: datum,
    });
  };

  render() {

    // console.log(locationData);

    return (
      <div id="wrapper">
        <StackedBarChart
          data={locationData}
          dataAccessors={{
            fill: yearField,
            key: 'id',
            stack: locationField,
            layer: yearField,
            value: populationField,
          }}
          colorScale={colorScale}
          fieldAccessors={{
            data: 'values',
            key: 'key',
          }}
          focus={this.state.focus}
          labelObject={{
            title: "Population Between 2000-2009",
            yLabel: "Country",
            xLabel: "Population"
          }}
          layerDomain={yearFieldDomain}
          legendObject={items}
          legendKey={{
            labelKey: "label",
            shapeColorKey: "shapeColor",
            shapeTypeKey: "shapeType",
          }}
          onClick={this.onClick}
          onMouseLeave={this.onMouseLeave}
          onMouseMove={this.onMouseMove}
          onMouseOver={this.onMouseOver}
          orientation="horizontal"
          scaleObject={{
            xScale: "linear",
            yScale:"band",
            xDomain: populationFieldDomain,
            yDomain: locationFieldDomain
          }}
          selection={this.state.selectedItems}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
