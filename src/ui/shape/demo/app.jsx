import React from 'react';
import { render } from 'react-dom';

import { schemeCategory10, scaleOrdinal } from 'd3';

import { bindAll, maxBy, minBy, map, slice, uniqBy, without, xor } from 'lodash';

import { dataGenerator } from '../../../utils';
import AxisChart from '../../axis-chart';
import { XAxis, YAxis } from '../../axis';
import { MultiScatter, Scatter } from '../';


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

const shapeScale = scaleOrdinal()
  .domain(['Brazil', 'Russia', 'India', 'China', 'Mexico', 'Indonesia', 'Nigeria', 'Vietnam'])
  .range(['circle', 'cross', 'diamond', 'line', 'square', 'star', 'triangle', 'wye']);

const colorScale = scaleOrdinal(schemeCategory10);


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
    }

    console.log("hi");


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
          <h3>Multiple datasets</h3>
{/* <pre><code>
 <AxisChart
   height={300}
   width={500}
   xDomain={keyFieldDomain}
   xScaleType="point"
   yDomain={valueFieldDomain}
   yScaleType="linear"
 >
   <XAxis />
   <YAxis />
   <MultiScatter
     colorScale={colorScale}
     data={locationData}
     dataAccessors={{
       fill: keyField,
       key: 'id',
       x: keyField,    // year_id
       y: valueField   // population
     }}
     dataField="values"
     focus={this.state.focus}
     focusedStyle={{
       stroke: '#000',
       strokeWidth: 2,
     }}
     keyField="location"
     onClick={this.onClick}
     onMouseLeave={function(event, datum, Shape) {...}}
     onMouseMove={function(event, datum, Shape) {...}}
     onMouseOver={function(event, datum, Shape) {...}}
     selection={this.state.selectedItems}
     selectedStyle={{
       stroke: '#000',
       strokeWidth: 1,
     }}
     shapeField="location"
     shapeScale={shapeScale}
   />
 </AxisChart>
</code></pre> */}
            {/*<AxisChart*/}
              {/*height={300}*/}
              {/*width={500}*/}
              {/*xDomain={keyFieldDomain}*/}
              {/*xScaleType="point"*/}
              {/*yDomain={valueFieldDomain}*/}
              {/*yScaleType="linear"*/}
            {/*>*/}
              {/*<XAxis />*/}
              {/*<YAxis />*/}
              {/*<MultiScatter*/}
                {/*colorScale={colorScale}*/}
                {/*data={locationData}*/}
                {/*dataAccessors={{*/}
                  {/*fill: keyField,*/}
                  {/*key: 'id',*/}
                  {/*x: keyField,*/}
                  {/*y: valueField,*/}
                  {/*shape: 'location',*/}
                {/*}}*/}
                {/*fieldAccessors={{*/}
                  {/*data: 'values',*/}
                  {/*key: 'location',*/}
                {/*}}*/}
                {/*focus={this.state.focus}*/}
                {/*focusedStyle={{*/}
                  {/*stroke: '#000',*/}
                  {/*strokeWidth: 2,*/}
                {/*}}*/}
                {/*onClick={this.onClick}*/}
                {/*onMouseLeave={this.onMouseLeave}*/}
                {/*onMouseMove={this.onMouseMove}*/}
                {/*onMouseOver={this.onMouseOver}*/}
                {/*selection={this.state.selectedItems}*/}
                {/*selectedStyle={{*/}
                  {/*stroke: '#000',*/}
                  {/*strokeWidth: 1,*/}
                {/*}}*/}
                {/*shapeField="location"*/}
                {/*shapeScale={shapeScale}*/}
              {/*/>*/}
            {/*</AxisChart>*/}
        </section>
        <section>
          <h3>One Dataset</h3>
{/* <pre><code>
 <AxisChart
   height={300}
   width={500}
   xDomain={keyFieldDomain}
   xScaleType="point"
   yDomain={valueFieldDomain}
   yScaleType="linear"
 >
   <XAxis />
   <YAxis />
   <Scatter
     fill="steelblue"
     data={[]}
     dataAccessors={{
       fill: keyField,
       key: 'id',
       x: keyField,    // year_id
       y: valueField   // population
     }}
     focus={{}}
     onClick={function(event, datum, Shape) {...}}
     onMouseLeave={function(event, datum, Shape) {...}}
     onMouseMove={function(event, datum, Shape) {...}}
     onMouseOver={function(event, datum, Shape) {...}}
     selection={this.state.selectedItems}
     shapeType="circle"
   />
 </AxisChart>
</code></pre> */}
            <AxisChart
              height={300}
              width={500}
              xDomain={keyFieldDomain}
              xScaleType="point"
              yDomain={valueFieldDomain}
              yScaleType="linear"
            >
              <XAxis />
              <YAxis />
              <Scatter
                fill="steelblue"
                data={data.filter((datum) => { return datum.location === 'India'; })}
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
                shapeType="circle"
              />
            </AxisChart>
        </section>
        <section>
          <h3>One dimensional dataset: horizontal</h3>
{/* <pre><code>
<AxisChart
  height={50}
  width={500}
  xDomain={valueFieldDomain}
  xScaleType="linear"
  yDomain={[0, 1]}
  yScaleType="linear"
>
  <XAxis />
  <Scatter
    fill="tomato"
    data={[]}
    dataAccessors={{ x: valueField, key: 'id' }}
    onClick={function(event, datum, Shape) {...}}
    onMouseLeave={function(event, datum, Shape) {...}}
    onMouseMove={function(event, datum, Shape) {...}}
    onMouseOver={function(event, datum, Shape) {...}}
    shapeType="circle"
  />
</AxisChart>
</code></pre> */}
            <AxisChart
              height={50}
              width={500}
              xDomain={valueFieldDomain}
              xScaleType="linear"
              yDomain={[0, 1]}
              yScaleType="linear"
            >
              <XAxis />
              <Scatter
                fill="tomato"
                data={data.filter((datum) => { return datum.location === 'India'; })}
                dataAccessors={{ x: valueField, key: 'id' }}
                focus={this.state.focus}
                onClick={this.onClick}
                onMouseLeave={this.onMouseLeave}
                onMouseMove={this.onMouseMove}
                onMouseOver={this.onMouseOver}
                selection={this.state.selectedItems}
                shapeType="circle"
              />
            </AxisChart>
        </section>
        <section>
          <h3>One dimensional dataset: vertical</h3>
{/* <pre><code>
<AxisChart
  width={100}
  height={500}
  xDomain={[0, 1]}
  xScaleType="linear"
  yDomain={valueFieldDomain}
  yScaleType="linear"
>
  <YAxis />
  <Scatter
    fill={'cornflowerblue'}
    data={[]}
    dataAccessors={{ y: valueField, key: 'id' }}
    onClick={function(event, datum, Shape) {...}}
    onMouseLeave={function(event, datum, Shape) {...}}
    onMouseMove={function(event, datum, Shape) {...}}
    onMouseOver={function(event, datum, Shape) {...}}
    shapeType={'circle'}
  />
</AxisChart>
</code></pre> */}
            <AxisChart
              width={100}
              height={500}
              xDomain={[0, 1]}
              xScaleType="linear"
              yDomain={valueFieldDomain}
              yScaleType="linear"
            >
              <YAxis />
              <Scatter
                fill="cornflowerblue"
                data={data.filter((datum) => { return datum.location === 'India'; })}
                dataAccessors={{ y: valueField, key: 'id' }}
                focus={this.state.focus}
                onClick={this.onClick}
                onMouseLeave={this.onMouseLeave}
                onMouseMove={this.onMouseMove}
                onMouseOver={this.onMouseOver}
                selection={this.state.selectedItems}
                shapeType="circle"
              />
            </AxisChart>
        </section>
        <section>
          <h3>One dimensional dataset with color scale</h3>
{/* <pre><code>
<AxisChart
  height={50}
  width={500}
  xDomain={valueFieldDomain}
  xScaleType="linear"
  yDomain={[0, 1]}
  yScaleType="linear"
>
  <XAxis />
  <Scatter
    fill={scaleCategory10()}
    data={[]}
    dataAccessors={{ fill: valueField, key: 'id', x: valueField }}
    onClick={function(event, datum, Shape) {...}}
    onMouseLeave={function(event, datum, Shape) {...}}
    onMouseMove={function(event, datum, Shape) {...}}
    onMouseOver={function(event, datum, Shape) {...}}
    shapeType="circle"
  />
</AxisChart>
</code></pre> */}
            <AxisChart
              height={50}
              width={500}
              xDomain={valueFieldDomain}
              xScaleType="linear"
              yDomain={[0, 1]}
              yScaleType="linear"
            >
              <XAxis />
              <Scatter
                colorScale={colorScale}
                data={data.filter((datum) => { return datum.location === 'India'; })}
                dataAccessors={{ fill: valueField, key: 'id', x: valueField }}
                focus={this.state.focus}
                onClick={this.onClick}
                onMouseLeave={this.onMouseLeave}
                onMouseMove={this.onMouseMove}
                onMouseOver={this.onMouseOver}
                selection={this.state.selectedItems}
                shapeType="circle"
              />
            </AxisChart>
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
