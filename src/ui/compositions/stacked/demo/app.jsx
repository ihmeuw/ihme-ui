import React from 'react';
import { schemeCategory10, scaleOrdinal } from 'd3';
import ReactDOM from 'react-dom';
import bindAll from 'lodash/bindAll';
import xor from 'lodash/xor';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';

import StackedBarChart from './../../stacked/src/stacked';

import { dataGenerator } from '../../../../utils';

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

const yearData = [
  { year: 2000, values: data.filter((datum) => { return (datum.location === 'Brazil') && (datum.year_id === 2000) }) },
  { year: 2001, values: data.filter((datum) => { return (datum.location === 'Brazil') && (datum.year_id === 2001) }) },
  { year: 2002, values: data.filter((datum) => { return (datum.location === 'Brazil') && (datum.year_id === 2002) }) },
  { year: 2003, values: data.filter((datum) => { return (datum.location === 'Brazil') && (datum.year_id === 2003) }) },
  { year: 2004, values: data.filter((datum) => { return (datum.location === 'Brazil') && (datum.year_id === 2004) }) },
  { year: 2005, values: data.filter((datum) => { return (datum.location === 'Brazil') && (datum.year_id === 2005) }) },
  { year: 2006, values: data.filter((datum) => { return (datum.location === 'Brazil') && (datum.year_id === 2006) }) },
  { year: 2007, values: data.filter((datum) => { return (datum.location === 'Brazil') && (datum.year_id === 2007) }) },
  { year: 2008, values: data.filter((datum) => { return (datum.location === 'Brazil') && (datum.year_id === 2008) }) },
  { year: 2009, values: data.filter((datum) => { return (datum.location === 'Brazil') && (datum.year_id === 2009) }) },
];

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

const STYLE = {
  height: true,
};

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
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <section>
          <h3>Normal Bar Chart Vertical Orientation</h3>
          {/* <pre><code>
          <StackedBarChart
            chartStyle={STYLE}
            data={yearData}
            dataAccessors={{
              fill: yearField,
              key: 'id',
              stack: yearField,
              layer: locationField,
              value: populationField,
            }}
            fieldAccessors={{
              data: 'values',
              key: 'key',
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Population",
              xLabel: "Year"
            }}
            layerDomain={yearFieldDomain}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="vertical"
            scaleAccessors={{
              xScale: "band",
              yScale: "linear",
              xDomain: yearFieldDomain,
              yDomain: populationFieldDomain,
            }}
            selection={this.state.selectedItems}
          />
         </code></pre> */}
          <StackedBarChart
            chartStyle={STYLE}
            data={yearData}
            dataAccessors={{
              fill: yearField,
              key: 'id',
              stack: yearField,
              layer: locationField,
              value: populationField,
            }}
            fieldAccessors={{
              data: 'values',
              key: 'key',
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Population",
              xLabel: "Year"
            }}
            layerDomain={yearFieldDomain}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="vertical"
            scaleAccessors={{
              xScale: "band",
              yScale: "linear",
              xDomain: yearFieldDomain,
              yDomain: populationFieldDomain,
            }}
            selection={this.state.selectedItems}
          />
        </section>
        <section>
          <h3>Normal Bar Chart Horizontal Orientation</h3>
          {/* <pre><code>
          <StackedBarChart
            chartStyle={STYLE}
            data={yearData}
            dataAccessors={{
              fill: yearField,
              key: 'id',
              stack: yearField,
              layer: locationField,
              value: populationField,
            }}
            fieldAccessors={{
              data: 'values',
              key: 'key',
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              xLabel: "Population",
              yLabel: "Year"
            }}
            layerDomain={yearFieldDomain}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="horizontal"
            scaleAccessors={{
              yScale: "band",
              xScale: "linear",
              yDomain: yearFieldDomain,
              xDomain: populationFieldDomain,
            }}
            selection={this.state.selectedItems}
          />
         </code></pre> */}
          <StackedBarChart
            chartStyle={STYLE}
            data={yearData}
            dataAccessors={{
              fill: yearField,
              key: 'id',
              stack: yearField,
              layer: locationField,
              value: populationField,
            }}
            fieldAccessors={{
              data: 'values',
              key: 'key',
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              xLabel: "Population",
              yLabel: "Year"
            }}
            layerDomain={yearFieldDomain}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="horizontal"
            scaleAccessors={{
              yScale: "band",
              xScale: "linear",
              yDomain: yearFieldDomain,
              xDomain: populationFieldDomain,
            }}
            selection={this.state.selectedItems}
          />
        </section>
        <section>
          <h3>Grouped Bar Chart Vertical Orientation</h3>
          {/* <pre><code>
          <StackedBarChart
            chartStyle={STYLE}
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
              key: 'location',
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Population",
              xLabel: "Country"
            }}
            layerDomain={yearFieldDomain}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="vertical"
            scaleAccessors={{
              xScale: "band",
              yScale: "linear",
              xDomain: locationFieldDomain,
              yDomain: populationFieldDomain,
            }}
            selection={this.state.selectedItems}
            type={'grouped'}
          />
         </code></pre> */}
          <StackedBarChart
            chartStyle={STYLE}
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
              key: 'location',
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Population",
              xLabel: "Country"
            }}
            layerDomain={yearFieldDomain}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="vertical"
            scaleAccessors={{
              xScale: "band",
              yScale: "linear",
              xDomain: locationFieldDomain,
              yDomain: populationFieldDomain,
            }}
            selection={this.state.selectedItems}
            type={'grouped'}
          />
        </section>
        <section>
          <h3>Grouped Bar Chart Horizontal Orientation</h3>
          {/* <pre><code>
          <StackedBarChart
            chartStyle={STYLE}
            data={locationData}
            dataAccessors={{
              fill: yearField,
              key: 'id',
              stack: locationField,
              layer: populationField,
              value: yearField,
            }}
            colorScale={colorScale}
            fieldAccessors={{
              data: 'values',
              key: 'location',
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Country",
              xLabel: "Population"
            }}
            layerDomain={yearFieldDomain}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="horizontal"
            scaleAccessors={{
              yScale: "band",
              xScale: "linear",
              yDomain: locationFieldDomain,
              xDomain: populationFieldDomain,
            }}
            selection={this.state.selectedItems}
            type={'grouped'}
          />
           </code></pre> */}
          <StackedBarChart
            chartStyle={STYLE}
            data={locationData}
            dataAccessors={{
              fill: yearField,
              key: 'id',
              stack: locationField,
              layer: populationField,
              value: yearField,
            }}
            colorScale={colorScale}
            fieldAccessors={{
              data: 'values',
              key: 'location',
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Country",
              xLabel: "Population"
            }}
            layerDomain={yearFieldDomain}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="horizontal"
            scaleAccessors={{
              yScale: "band",
              xScale: "linear",
              yDomain: locationFieldDomain,
              xDomain: populationFieldDomain,
            }}
            selection={this.state.selectedItems}
            type={'grouped'}
          />
        </section>
        <section>
          <h3>Stacked Bar Chart Vertical Orientation</h3>
          {/* <pre><code>
          <StackedBarChart
            chartStyle={STYLE}
            data={locationData}
            dataAccessors={{
              fill: yearField,
              key: 'id',
              stack: locationField,
              layer: yearField,
              value: populationField,
            }}
            displayLegend={true}
            colorScale={colorScale}
            fieldAccessors={{
              data: 'values',
              key: 'key',  // if stacked
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Population",
              xLabel: "Country"
            }}
            layerDomain={yearFieldDomain}
            legendAccessors={items}
            legendKey={{
              labelKey: "label",
              shapeColorKey: "shapeColor",
              shapeTypeKey: "shapeType",
            }}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="vertical"
            scaleAccessors={{
              xScale: "band",
              yScale: "linear",
              xDomain: locationFieldDomain,
              yDomain: populationFieldDomain,
            }}
            selection={this.state.selectedItems}
            type={'stacked'}
          />
         </code></pre> */}
          <StackedBarChart
            chartStyle={STYLE}
            data={locationData}
            dataAccessors={{
              fill: yearField,
              key: 'id',
              stack: locationField,
              layer: yearField,
              value: populationField,
            }}
            displayLegend={true}
            colorScale={colorScale}
            fieldAccessors={{
              data: 'values',
              key: 'key',  // if stacked
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Population",
              xLabel: "Country"
            }}
            layerDomain={yearFieldDomain}
            legendAccessors={items}
            legendKey={{
              labelKey: "label",
              shapeColorKey: "shapeColor",
              shapeTypeKey: "shapeType",
            }}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="vertical"
            scaleAccessors={{
              xScale: "band",
              yScale: "linear",
              xDomain: locationFieldDomain,
              yDomain: populationFieldDomain,
            }}
            selection={this.state.selectedItems}
            type={'stacked'}
          />
        </section>

        <section>
          <h3>Stacked Horizontal Bar Chart</h3>
          {/* <pre><code>
          <StackedBarChart
            chartStyle={STYLE}
            data={locationData}
            dataAccessors={{
              fill: yearField,
              key: 'id',
              stack: locationField,
              layer: yearField,
              value: populationField,
            }}
            displayLegend={true}
            colorScale={colorScale}
            fieldAccessors={{
              data: 'values',
              key: 'key',  // if stacked
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Country",
              xLabel: "Population"
            }}
            layerDomain={yearFieldDomain}
            legendAccessors={items}
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
            scaleAccessors={{
              xScale: "linear",
              yScale: "band",
              xDomain: populationFieldDomain,
              yDomain: locationFieldDomain,
            }}
            selection={this.state.selectedItems}
            type={'stacked'}
          />
           </code></pre> */}
          <StackedBarChart
            chartStyle={STYLE}
            data={locationData}
            dataAccessors={{
              fill: yearField,
              key: 'id',
              stack: locationField,
              layer: yearField,
              value: populationField,
            }}
            displayLegend={true}
            colorScale={colorScale}
            fieldAccessors={{
              data: 'values',
              key: 'key',  // if stacked
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Country",
              xLabel: "Population"
            }}
            layerDomain={yearFieldDomain}
            legendAccessors={items}
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
            scaleAccessors={{
              xScale: "linear",
              yScale: "band",
              xDomain: populationFieldDomain,
              yDomain: locationFieldDomain,
            }}
            selection={this.state.selectedItems}
            type={'stacked'}
          />
        </section>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('app'));
