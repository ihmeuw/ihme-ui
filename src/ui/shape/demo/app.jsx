import React from 'react';
import { render } from 'react-dom';

import {
  range,
  scaleLinear,
  scaleOrdinal,
  schemeCategory10,
} from 'd3';

import { bindAll, maxBy, minBy, map, slice, uniqBy, without, xor } from 'lodash';

import { dataGenerator } from '../../../utils';
import AxisChart from '../../axis-chart';
import { XAxis, YAxis } from '../../axis';
import {
  Area,
  Line,
  MultiLine,
  MultiScatter,
  Scatter,
} from '../';

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
const valueUncertaintyDomain = [
  minBy(data, 'population_lb')['population_lb'],
  maxBy(data, 'population_ub')['population_ub']
];

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
      country: 2,
    }

    bindAll(this, [
      'onClick',
      'onMouseLeave',
      'onMouseMove',
      'onMouseOver',
      'setNextLocation',
    ]);
  }

  setNextLocation() {
    this.setState({ country: (this.state.country + 1) % locationData.length });
  }

  getCurrentLocationData() {
    return data.filter(
      datum => datum.location === locationData[this.state.country].location,
    );
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

  renderMultiLineDemo() {
    const lineDataSet = locationData.reduce(
      (accum, line, index) => {
        switch(index) {
          case this.state.country:
            accum.push({ ...line, key: 0 });
            break;
          case (this.state.country + 1) % locationData.length:
            accum.push({ ...line, key: 1 });
            break;
          case (this.state.country + 2) % locationData.length:
            accum.push({ ...line, key: 2 });
            break;
        }
        return accum;
      },
      [],
    ).sort((line_a, line_b) => line_a.key - line_b.key);

    return (
      <section>
        <h3>Multi Line</h3>
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
   <MultiLine
     animate={{
       timing: { duration: 666 },
       stroke: { start() { console.log('started'); return {}; }},
     }}
     colorScale={colorScale}
     data={lineDataSet}
     dataAccessors={{
       x: 'year_id',
       y: 'population',
     }}
     fieldAccessors={{
       key: 'key',
       color: 'location',
       data: 'values',
     }}
     scales={{ x: scaleLinear(), y: scaleLinear() }}
     lineStyle={(values) => {
       const [{ location }] = values;
       if (location === locationData[this.state.country].location) {
         return {
           strokeWidth: this.state.country + 1,
           strokeDasharray: 5,
         };
       }
       return {};
     }}
   />
 </AxisChart>
</code></pre> */}
        <p>
          {lineDataSet.map(({ location, key }) =>
            <span style={{
              backgroundColor: colorScale(location),
              marginRight: 5,
              color: 'white',
              padding: 10,
            }}>line {key + 1}</span>
          )}
        </p>
        <button onClick={this.setNextLocation}>
          press to look at next line set
        </button>
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
          <MultiLine
            animate={{
              timing: { duration: 666 },
              stroke: { start() { console.log('started'); return {}; }},
            }}
            colorScale={colorScale}
            data={lineDataSet}
            dataAccessors={{
              x: 'year_id',
              y: 'population',
            }}
            fieldAccessors={{
              key: 'key',
              color: 'location',
              data: 'values',
            }}
            scales={{ x: scaleLinear(), y: scaleLinear() }}
            lineStyle={(values) => {
              const [{ location }] = values;
              if (location === locationData[this.state.country].location) {
                return {
                  strokeWidth: this.state.country + 1,
                  strokeDasharray: 5,
                };
              }
              return {};
            }}
          />
        </AxisChart>
      </section>
    )
  }

  renderLineDemo() {
    const style = {
      shapeRendering: 'geometricPrecision',
      stroke: colorScale(this.state.country),
      strokeWidth: this.state.country + 1,
    };

    return (
      <section>
        <h3>Line</h3>
{/* <pre><code>
 <AxisChart
   height={300}
   width={500}
   xDomain={keyFieldDomain}
   xScaleType="point"
   yDomain={valueUncertaintyDomain}
   yScaleType="linear"
 >
   <XAxis />
   <YAxis />
   <Area
     animate
     data={currentLocationData}
     dataAccessors={{
       x: 'year_id',
       y0: 'population_lb',
       y1: 'population_ub',
     }}
     scales={{ x: scaleLinear(), y: scaleLinear() }}
     style={{ fill: colorScale(currentLocationId), opacity: 0.4 }}
   />
   <Line
     animate={{
       stroke: () => ({
         timing: { delay: 1000, duration: 3000 },
         events: {
           interrupt() {
             console.log('The `stroke` animation has been interrupted!');
           },
         },
       }),
       strokeWidth: {
         timing: { duration: 2500 },
         events: {
           end: () => { console.log('The `strokeWidth` animation has ended!'); },
         },
       },
     }}
     data={this.getCurrentLocationData()}
     dataAccessors={{ x: 'year_id', y: 'population' }}
     scales={{ x: scaleLinear(), y: scaleLinear() }}
     style={style}
   />
 </AxisChart>
</code></pre> */}
        <h3>{locationData[this.state.country].location}</h3>
        <button onClick={this.setNextLocation}>
          press to look at next country
        </button>
        <AxisChart
          height={300}
          width={500}
          xDomain={keyFieldDomain}
          xScaleType="point"
          yDomain={valueUncertaintyDomain}
          yScaleType="linear"
        >
          <XAxis />
          <YAxis />
          <Area
            animate
            data={this.getCurrentLocationData()}
            dataAccessors={{
              x: 'year_id',
              y0: 'population_lb',
              y1: 'population_ub',
            }}
            scales={{
              x: scaleLinear(),
              y: scaleLinear(),
            }}
            style={{
              fill: colorScale(this.state.country + 1),
              opacity: 0.4,
            }}
          />
          <Line
            animate={{
              stroke: () => ({
                timing: { delay: 1000, duration: 3000 },
                events: {
                  interrupt() {
                    console.log('The `stroke` animation has been interrupted!');
                  },
                },
              }),
              strokeWidth: {
                timing: { duration: 2500 },
                events: {
                  end: () => { console.log('The `strokeWidth` animation has ended!'); },
                },
              },
            }}
            data={this.getCurrentLocationData()}
            dataAccessors={{ x: 'year_id', y: 'population' }}
            scales={{ x: scaleLinear(), y: scaleLinear() }}
            style={style}
          />
        </AxisChart>
      </section>
    );
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {this.renderLineDemo()}
        {this.renderMultiLineDemo()}
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
                  x: keyField,
                  y: valueField,
                  shape: 'location',
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
                shapeField="location"
                shapeScale={shapeScale}
              />
            </AxisChart>
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
     animate
     fill="steelblue"
     data={[]}
     dataAccessors={{
       fill: keyField,
       key: keyField,
       x: keyField,    // year_id
       y: valueField   // population
     }}
     focus={this.state.focus}
     onClick={function(event, datum, Shape) {...}}
     onMouseLeave={function(event, datum, Shape) {...}}
     onMouseMove={function(event, datum, Shape) {...}}
     onMouseOver={function(event, datum, Shape) {...}}
     selection={this.state.selectedItems}
     shapeType="circle"
   />
 </AxisChart>
 </code></pre> */}
          <h3>{locationData[this.state.country].location}</h3>
          <button onClick={this.setNextLocation}>
            press to look at next country
          </button>
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
                animate
                fill="steelblue"
                data={this.getCurrentLocationData()}
                dataAccessors={{
                  fill: keyField,
                  key: keyField,
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
