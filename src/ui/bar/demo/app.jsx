import React from 'react';
import ReactDOM from 'react-dom';
import { bindAll, maxBy, minBy, map, uniqBy, xor } from 'lodash';
import { dataGenerator } from '../../../utils';
import AxisChart from '../../axis-chart';
import { schemeCategory10, scaleOrdinal, stack, max } from 'd3';
import { XAxis, YAxis } from '../../axis';
import MultiBars from '../src/multi-bars';

const yearField = 'year_id';
const populationField = 'population';
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



// const dataStacked = stack().keys(yearFieldDomain)(stackedData);
// const stackedDomain = [0, max(dataStacked, function(data) {  return max(data, function(d) { return d[1]; });  })];


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
        <h3>Normal Bar Chart Vertical Orientation</h3>
        {/* <pre><code>
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
         stack: yearField,    // year_id
         value: populationField   // population
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
            stack: yearField,    // year_id
            value: populationField   // population
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
        <h3>Normal Bar Chart Horizontal Orientation</h3>
        {/* <pre><code>
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
         stack: yearField,    // year_id
         value: populationField   // population
         }}
         focus={this.state.focus}
         onClick={this.onClick}
         onMouseLeave={this.onMouseLeave}
         onMouseMove={this.onMouseMove}
         onMouseOver={this.onMouseOver}
         orientation="horizontal"
         selection={this.state.selectedItems}
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
              stack: yearField,    // year_id
              value: populationField   // population
            }}
            focus={this.state.focus}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="horizontal"
            selection={this.state.selectedItems}
          />
        </AxisChart>
      </section>
      <section>
        <h3>Grouped Bar Chart Vertical Orientation</h3>
        {/* <pre><code>
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
         dataAccessors={{
         fill: yearField,
         key: 'id',
         stack: locationField, // stack field
         layer: yearField,  // x axis
         value: populationField, // y axis
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
         layerDomain={yearFieldDomain}
         onClick={this.onClick}
         onMouseLeave={this.onMouseLeave}
         onMouseMove={this.onMouseMove}
         onMouseOver={this.onMouseOver}
         selection={this.state.selectedItems}
         selectedStyle={{
         stroke: '#000',
         strokeWidth: 1,
         }}
         grouped
         />
         </AxisChart>
         </code></pre> */}
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
          dataAccessors={{
            fill: yearField,
            key: 'id',
            stack: locationField, // stack field
            layer: yearField,  // x axis
            value: populationField, // y axis
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
          layerDomain={yearFieldDomain}
          onClick={this.onClick}
          onMouseLeave={this.onMouseLeave}
          onMouseMove={this.onMouseMove}
          onMouseOver={this.onMouseOver}
          selection={this.state.selectedItems}
          selectedStyle={{
            stroke: '#000',
            strokeWidth: 1,
          }}
          grouped
        />
        </AxisChart>
      </section>
        <section>
          <h3>Grouped Bar Chart Horizontal Orientation</h3>
          {/* <pre><code>
           <AxisChart
           height={300}
           width={500}
           xDomain={populationFieldDomain}
           yDomain={locationFieldDomain}
           xScaleType="linear"
           yScaleType="band"
           >
           <XAxis/>
           <YAxis/>
           <MultiBars
           colorScale={colorScale}
           data={locationData}
           dataAccessors={{
           fill: yearField,
           key: 'id',
           stack: locationField, // stack field
           layer: populationField, // layer field
           value: yearField,
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
           layerDomain={yearFieldDomain}
           onClick={this.onClick}
           onMouseLeave={this.onMouseLeave}
           onMouseMove={this.onMouseMove}
           onMouseOver={this.onMouseOver}
           orientation='horizontal'
           selection={this.state.selectedItems}
           selectedStyle={{
           stroke: '#000',
           strokeWidth: 1,
           }}
           grouped
           />
           </AxisChart>
           </code></pre> */}
          <AxisChart
            height={300}
            width={500}
            xDomain={populationFieldDomain}
            yDomain={locationFieldDomain}
            xScaleType="linear"
            yScaleType="band"
          >
            <XAxis/>
            <YAxis/>
            <MultiBars
              colorScale={colorScale}
              data={locationData}
              dataAccessors={{
                fill: yearField,
                key: 'id',
                stack: locationField, // stack field
                layer: populationField, // layer field
                value: yearField,
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
              layerDomain={yearFieldDomain}
              onClick={this.onClick}
              onMouseLeave={this.onMouseLeave}
              onMouseMove={this.onMouseMove}
              onMouseOver={this.onMouseOver}
              orientation='horizontal'
              selection={this.state.selectedItems}
              selectedStyle={{
                stroke: '#000',
                strokeWidth: 1,
              }}
              grouped
            />
          </AxisChart>
        </section>
      <section>
        <h3>Stacked Bar Chart Vertical Orientation</h3>
        {/* <pre><code>
         <AxisChart
         height={500}
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
         dataAccessors={{
         fill: yearField,
         key: 'id',
         stack: locationField,
         layer: yearField,
         value: populationField,
         }}
         fieldAccessors={{
         data: 'values',
         key: 'key',
         }}
         focus={this.state.focus}
         focusedStyle={{
         stroke: '#000',
         strokeWidth: 2,
         }}
         layerDomain={yearFieldDomain}
         onClick={this.onClick}
         onMouseLeave={this.onMouseLeave}
         onMouseMove={this.onMouseMove}
         onMouseOver={this.onMouseOver}
         selection={this.state.selectedItems}
         selectedStyle={{
         stroke: '#000',
         strokeWidth: 1,
         }}
         stacked
         />
         </AxisChart>
         </code></pre> */}
        <AxisChart
          height={500}
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
            dataAccessors={{
              fill: yearField,
              key: 'id',
              stack: locationField,
              layer: yearField,
              value: populationField,
            }}
            fieldAccessors={{
              data: 'values',
              key: 'key',
            }}
            focus={this.state.focus}
            focusedStyle={{
              stroke: '#000',
              strokeWidth: 2,
            }}
            layerDomain={yearFieldDomain}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            selection={this.state.selectedItems}
            selectedStyle={{
              stroke: '#000',
              strokeWidth: 1,
            }}
            stacked
          />
        </AxisChart>
      </section>

        <section>
          <h3>Stacked Horizontal Bar Chart</h3>
          {/* <pre><code>
           <AxisChart
           height={500}
           width={500}
           xDomain={populationFieldDomain}
           yDomain={locationFieldDomain}
           xScaleType="linear"
           yScaleType="band"
           >
           <XAxis/>
           <YAxis/>
           <MultiBars
           colorScale={colorScale}
           // data={data.filter((datum) => { return datum.location === 'Indiaa'; })}
           data={locationData}
           dataAccessors={{
           fill: yearField,
           key: 'id', // rename to relate to inner grouping
           layer: yearField,
           value: populationField,
           stack: locationField
           }}
           fieldAccessors={{
           data: 'values',
           key: 'key',
           }}
           focus={this.state.focus}
           focusedStyle={{
           stroke: '#000',
           strokeWidth: 2,
           }}
           layerDomain={yearFieldDomain}
           onClick={this.onClick}
           onMouseLeave={this.onMouseLeave}
           onMouseMove={this.onMouseMove}
           onMouseOver={this.onMouseOver}
           orientation="horizontal"
           selection={this.state.selectedItems}
           selectedStyle={{
           stroke: '#000',
           strokeWidth: 1,
           }}
           stacked
           />
           </AxisChart>
           </code></pre> */}
          <AxisChart
            height={500}
            width={500}
            xDomain={populationFieldDomain}
            yDomain={locationFieldDomain}
            xScaleType="linear"
            yScaleType="band"
          >
            <XAxis/>
            <YAxis/>
            <MultiBars
              colorScale={colorScale}
              // data={data.filter((datum) => { return datum.location === 'Indiaa'; })}
              data={locationData}
              dataAccessors={{
                fill: yearField,
                key: 'id', // rename to relate to inner grouping
                layer: yearField,
                value: populationField,
                stack: locationField
              }}
              fieldAccessors={{
                data: 'values',
                key: 'key',
              }}
              focus={this.state.focus}
              focusedStyle={{
                stroke: '#000',
                strokeWidth: 2,
              }}
              layerDomain={yearFieldDomain}
              onClick={this.onClick}
              onMouseLeave={this.onMouseLeave}
              onMouseMove={this.onMouseMove}
              onMouseOver={this.onMouseOver}
              orientation="horizontal"
              selection={this.state.selectedItems}
              selectedStyle={{
                stroke: '#000',
                strokeWidth: 1,
              }}
              stacked
            />
          </AxisChart>
        </section>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('app'));

