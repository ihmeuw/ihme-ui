import React from 'react';
import ReactDOM from 'react-dom';
import { bindAll, maxBy, minBy, map, slice, uniqBy, without, xor } from 'lodash';
import { dataGenerator } from '../../../utils';
import AxisChart from '../../axis-chart';
import { schemeCategory10, scaleOrdinal } from 'd3';
import { XAxis, YAxis } from '../../axis';
import MultiBars from '../src/multi-bars';

const yearField = 'year_id'; // was key
const populationField = 'population'; // was value
const locationField = 'location';

import Bars from '../src/bars';

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

const populationFieldDomain = [minBy(data, populationField)[populationField], maxBy(data, populationField)[populationField]];
const yearFieldDomain = map(uniqBy(data, yearField), (obj) => { return (obj[yearField]); });
const locationFieldDomain = map(uniqBy(locationData, locationField), (obj) => { return (obj[locationField]); });
const colorScale = scaleOrdinal(schemeCategory10);


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
      <div style={{ display: 'flex', flexDirection: 'column' }}>

      <section>
        <h3>One Dataset Default Orientation</h3>

        {/* <pre><code>
         <AxisChart
         height={300}
         width={500}
         xDomain={keyFieldDomain}
         yDomain={valueFieldDomain}
         xScaleType="band"
         yScaleType="linear"
         >
         <XAxis />
         <YAxis />
         <Bars
         fill="steelblue"
         data={[]}
         dataAccessors={{
         fill: keyField,
         key: 'id',
         x: keyField,    // year_id
         y: valueField   // population
         }}
         focus={this.state.focus}
         onClick={this.onClick}
         onMouseLeave={this.onMouseLeave}
         onMouseMove={this.onMouseMove}
         onMouseOver={this.onMouseOver}
         selection={this.state.selectedItems}
         />
         </AxisChart>
         </code></pre> */}
        <AxisChart
          height={300}
          width={500}
          xDomain={yearFieldDomain}
          yDomain={populationFieldDomain}
          xScaleType="band"
          yScaleType="linear"
        >
          <XAxis />
          <YAxis />
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
      </section>
      <section>
        <h3>One Dataset Horizontal Orientation</h3>
        {/* <pre><code>
         <AxisChart
         height={500}
         width={500}
         xDomain={valueFieldDomain}
         yDomain={keyFieldDomain}
         xScaleType="linear"
         yScaleType="band"
         >
         <XAxis/>
         <YAxis/>
         <Bars
         fill="steelblue"
         data={[]}
         dataAccessors={{
         fill: keyField,
         key: 'id',
         x: keyField,    // year_id
         y: valueField   // population
         }}
         focus={this.state.focus}
         onClick={this.onClick}
         onMouseLeave={this.onMouseLeave}
         onMouseMove={this.onMouseMove}
         onMouseOver={this.onMouseOver}
         selection={this.state.selectedItems}
         orientation="horizontal"
         />
         </AxisChart>
         </code></pre> */}
        <AxisChart
          height={300}
          width={500}
          xDomain={populationFieldDomain}
          yDomain={yearFieldDomain}
          xScaleType="linear"
          yScaleType="band"
        >
          <XAxis/>
          <YAxis/>
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
            orientation="horizontal"
          />
        </AxisChart>
      </section>
      <section>
        <h3>Grouped Bar Chart</h3>
        <AxisChart
          height={300}
          width={500}
          xDomain={locationFieldDomain}
          yDomain={populationFieldDomain}
          xScaleType="band"
          yScaleType="linear"
        >
          <XAxis/>
          <YAxis/>
          <MultiBars
          colorScale={colorScale}
          data={locationData}
          innerDomain={yearFieldDomain}
          dataAccessors={{
            fill: yearField,
            key: 'id', // rename to relate to inner grouping
            x: yearField, // field of nested data
            y: populationField,
          }}
          fieldAccessors={{
            data: 'values',
            key: 'location',
          }}
          focus={this.state.focus}
          focusedStyle={{
            stroke: '#000',
            strokeWidth: 2,
          }}
          onClick={this.onClick}
          onMouseLeave={this.onMouseLeave}
          onMouseMove={this.onMouseMove}
          onMouseOver={this.onMouseOver}
          selection={this.state.selectedItems}
          selectedStyle={{
            stroke: '#000',
            strokeWidth: 1,
          }}
          type="grouped"
        />
        </AxisChart>
      </section>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

