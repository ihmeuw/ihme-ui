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
import groupBy from "lodash/groupBy";

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

const dataGroupedByLocation = groupBy(data, 'location');

const brazilDataGroupedByYear = groupBy(dataGroupedByLocation.Brazil, 'year_id');

const yearData = [
  { year: 2000, values: brazilDataGroupedByYear[2000] },
  { year: 2001, values: brazilDataGroupedByYear[2001] },
  { year: 2002, values: brazilDataGroupedByYear[2002] },
  { year: 2003, values: brazilDataGroupedByYear[2003] },
  { year: 2004, values: brazilDataGroupedByYear[2004] },
  { year: 2005, values: brazilDataGroupedByYear[2005] },
  { year: 2006, values: brazilDataGroupedByYear[2006] },
  { year: 2007, values: brazilDataGroupedByYear[2007] },
  { year: 2008, values: brazilDataGroupedByYear[2008] },
  { year: 2009, values: brazilDataGroupedByYear[2009] },
];

const locationData = [
  { location: 'Brazil', values: dataGroupedByLocation.Brazil },
  { location: 'Russia', values: dataGroupedByLocation.Russia },
  { location: 'India', values: dataGroupedByLocation.India },
  { location: 'China', values: dataGroupedByLocation.China },
  { location: 'Mexico', values: dataGroupedByLocation.Mexico },
  { location: 'Indonesia', values: dataGroupedByLocation.Indonesia },
  { location: 'Nigeria', values: dataGroupedByLocation.Nigeria },
  { location: 'Vietnam', values: dataGroupedByLocation.Vietnam },
];

const STYLE = {
  height: true,
};

const populationFieldDomain = [
  minBy(data, populationField)[populationField],
  maxBy(data, populationField)[populationField]
];
const yearFieldDomain = map(uniqBy(data, yearField), obj => obj[yearField]);
const locationFieldDomain = map(uniqBy(locationData, locationField), obj => obj[locationField]);
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
    console.log(`${event.type}::${datum}`);
  };

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
            padding={{
              top: 20,
              right: 20,
              bottom: 50,
              left: 60,
            }}
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
            padding={{
              top: 20,
              right: 20,
              bottom: 50,
              left: 60,
            }}
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
            padding={{
              top: 20,
              right: 20,
              bottom: 50,
              left: 80,
            }}
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
            padding={{
              top: 20,
              right: 20,
              bottom: 50,
              left: 80,
            }}
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
          <h3>Stacked Bar Chart Vertical Orientation with Legend</h3>
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
            padding={{
              top: 20,
              right: 20,
              bottom: 40,
              left: 70,
            }}
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
            padding={{
              top: 20,
              right: 20,
              bottom: 40,
              left: 70,
            }}
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
          <h3>Stacked Horizontal Bar Chart with Legend</h3>
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
            padding={{
              top: 20,
              right: 20,
              bottom: 50,
              left: 80,
            }}
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
            padding={{
              top: 20,
              right: 20,
              bottom: 50,
              left: 80,
            }}
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
