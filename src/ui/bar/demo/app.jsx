import React from 'react';
import ReactDOM from 'react-dom';
import { bindAll, maxBy, minBy, map, slice, uniqBy, without, xor } from 'lodash';
import { dataGenerator } from '../../../utils';
import AxisChart from '../../axis-chart';
import { schemeCategory10, scaleOrdinal } from 'd3';
import { XAxis, YAxis } from '../../axis';
import MultiBars from '../src/multi-bars';

const keyField = 'year_id';
const valueField = 'population';
import Bars from '../src/bars';

const outerField = 'location';

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
const outerKeyDomain = map(uniqBy(locationData, outerField), (obj) => { return (obj[outerField]); });

const colorScale = scaleOrdinal(schemeCategory10);

console.log(data);
console.log(locationData);
console.log(outerKeyDomain);
console.log(keyFieldDomain);
console.log(valueFieldDomain);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
    }

    bindAll(this, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
    ]);

  }

  onClick(event, datum) {
    console.log(`${event.type}::${datum[keyField]},${datum[valueField]}`);
    this.setState({
      selectedItems: xor(this.state.selectedItems, [datum]),
    });
  };

  onMouseLeave(event, datum) {
    console.log(`${event.type}::${datum[keyField]},${datum[valueField]}`);
    this.setState({
      focus: {},
    });
  };

  onMouseMove(event, datum) {
    console.log(`${event.type}::${datum[keyField]},${datum[valueField]}`);
  };

  onMouseOver(event, datum) {
    console.log(`${event.type}::${datum[keyField]},${datum[valueField]}`);
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
          xDomain={keyFieldDomain}
          yDomain={valueFieldDomain}
          xScaleType="band"
          yScaleType="linear"
        >
          <XAxis />
          <YAxis />
          {/*<Bars*/}
          {/*fill="steelblue"*/}
          {/*data={data.filter((datum) => { return datum.location === 'India'; })}*/}
          {/*dataAccessors={{*/}
            {/*fill: keyField,*/}
            {/*key: 'id',*/}
            {/*x: keyField,    // year_id*/}
            {/*y: valueField   // population*/}
          {/*}}*/}
          {/*focus={this.state.focus}*/}
          {/*onClick={this.onClick}*/}
          {/*onMouseLeave={this.onMouseLeave}*/}
          {/*onMouseMove={this.onMouseMove}*/}
          {/*onMouseOver={this.onMouseOver}*/}
          {/*selection={this.state.selectedItems}*/}
        {/*/>*/}
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
          xDomain={valueFieldDomain}
          yDomain={keyFieldDomain}
          xScaleType="linear"
          yScaleType="band"
        >
          <XAxis/>
          <YAxis/>
          {/*<Bars*/}
            {/*fill="steelblue"*/}
            {/*data={data.filter((datum) => { return datum.location === 'India'; })}*/}
            {/*dataAccessors={{*/}
              {/*fill: keyField,*/}
              {/*key: 'id',*/}
              {/*x: keyField,    // year_id*/}
              {/*y: valueField   // population*/}
            {/*}}*/}
            {/*focus={this.state.focus}*/}
            {/*onClick={this.onClick}*/}
            {/*onMouseLeave={this.onMouseLeave}*/}
            {/*onMouseMove={this.onMouseMove}*/}
            {/*onMouseOver={this.onMouseOver}*/}
            {/*selection={this.state.selectedItems}*/}
            {/*orientation="horizontal"*/}
          {/*/>*/}
        </AxisChart>
      </section>
      <section>
        <h3>Grouped Bar Chart</h3>
        <AxisChart
          height={300}
          width={500}
          xDomain={keyFieldDomain}
          yDomain={valueFieldDomain}
          xScaleType="band"
          yScaleType="linear"
        >
          <XAxis/>
          <YAxis/>
          <MultiBars
            colorScale={colorScale}
            data={locationData}
            outerDomain={outerKeyDomain}
            dataAccessors={{
              fill: outerField,
              key: 'id',
              x: keyField,
              y: valueField,
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
          />


        </AxisChart>
      </section>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

