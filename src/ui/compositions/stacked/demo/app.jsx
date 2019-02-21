import React from 'react';
import { schemeCategory10, scaleOrdinal } from 'd3';
import ReactDOM from 'react-dom';
import bindAll from 'lodash/bindAll';
import xor from 'lodash/xor';

import StackedBarChart from './../../stacked/src/stacked';

import { dataGenerator } from '../../../../utils';

const yearField = 'year_id';
const populationField = 'population';
const locationField = 'location';

const years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009];

const locations = [
  'Brazil',
  'Russia',
  'India',
  'China',
  'Mexico',
  'Indonesia',
  'Nigeria',
  'Vietnam',
];

const data = dataGenerator({
  primaryKeys: [
    { name: 'location', values: locations }
  ],
  valueKeys: [
    { name: populationField, range: [100, 900], uncertainty: true }
  ]
});

const brazilData = data.filter(({ location }) => location === 'Brazil');

const STYLE = {
  height: true,
};

const colorScale = scaleOrdinal(schemeCategory10);

// create items given the data and the fields specified
const legendItems = [
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
      'onMouseOver',
    ]);
  }

  onClick(event, datum) {
    console.log(`${event.type}::${JSON.stringify(datum)}`);
    this.setState({
      selectedItems: xor(this.state.selectedItems, [datum]),
    });
  };

  onMouseLeave(event, datum) {
    console.log(`${event.type}::${JSON.stringify(datum)}`);
    this.setState({
      focus: undefined,
    });
  };

  onMouseOver(event, datum) {
    console.log(`${event.type}::${JSON.stringify(datum)}`);
    this.setState({
      focus: datum,
    });
  };

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <section>
          <h3>Normal Bar Chart Vertical Orientation</h3>
          <StackedBarChart
            categories={years}
            chartStyle={STYLE}
            data={brazilData}
            dataAccessors={{
              fill: yearField,
              category: yearField,
              value: populationField,
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Population",
              xLabel: "Year"
            }}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseOver={this.onMouseOver}
            orientation="vertical"
            selection={this.state.selectedItems}
          />
        </section>

        <section>
          <h3>Normal Bar Chart Horizontal Orientation</h3>
          <StackedBarChart
            categories={years}
            chartStyle={STYLE}
            data={brazilData}
            dataAccessors={{
              fill: yearField,
              category: yearField,
              value: populationField,
            }}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              xLabel: "Population",
              yLabel: "Year"
            }}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseOver={this.onMouseOver}
            orientation="horizontal"
            padding={{
              top: 20,
              right: 20,
              bottom: 50,
              left: 60,
            }}
          />
        </section>

        <section>
          <h3>Grouped Bar Chart Vertical Orientation</h3>
          <StackedBarChart
            categories={locations}
            subcategories={years}
            data={data}
            dataAccessors={{
              fill: yearField,
              category: locationField,
              subcategory: yearField,
              value: populationField,
            }}
            chartStyle={STYLE}
            colorScale={colorScale}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Population",
              xLabel: "Country"
            }}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
            onMouseOver={this.onMouseOver}
            orientation="vertical"
            selection={this.state.selectedItems}
            type="grouped"
          />
        </section>

        <section>
          <h3>Grouped Bar Chart Horizontal Orientation</h3>
          <StackedBarChart
            categories={locations}
            subcategories={years}
            data={data}
            dataAccessors={{
              fill: yearField,
              category: locationField,
              subcategory: yearField,
              value: populationField,
            }}
            chartStyle={STYLE}
            colorScale={colorScale}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Country",
              xLabel: "Population"
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
            selection={this.state.selectedItems}
            type="grouped"
          />
        </section>

        <section>
          <h3>Stacked Bar Chart Vertical Orientation with Legend</h3>
          <StackedBarChart
            chartStyle={STYLE}
            data={data}
            dataAccessors={{
              fill: yearField,
              category: locationField,
              subcategory: yearField,
              value: populationField,
            }}
            displayLegend
            colorScale={colorScale}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Population",
              xLabel: "Country"
            }}
            categories={locations}
            subcategories={years}
            legendItems={legendItems}
            legendAccessors={{
              labelKey: "label",
              shapeColorKey: "shapeColor",
              shapeTypeKey: "shapeType",
            }}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseOver={this.onMouseOver}
            orientation="vertical"
            padding={{
              top: 20,
              right: 20,
              bottom: 40,
              left: 70,
            }}
            selection={this.state.selectedItems}
            type="stacked"
          />
        </section>

        <section>
          <h3>Stacked Horizontal Bar Chart with Legend</h3>
          <StackedBarChart
            categories={locations}
            subcategories={years}
            chartStyle={STYLE}
            data={data}
            dataAccessors={{
              fill: yearField,
              category: locationField,
              subcategory: yearField,
              value: populationField,
            }}
            displayLegend
            colorScale={colorScale}
            focus={this.state.focus}
            labelAccessors={{
              title: "Population Between 2000-2009",
              yLabel: "Country",
              xLabel: "Population"
            }}
            legendItems={legendItems}
            legendAccessors={{
              labelKey: "label",
              shapeColorKey: "shapeColor",
              shapeTypeKey: "shapeType",
            }}
            onClick={this.onClick}
            onMouseLeave={this.onMouseLeave}
            onMouseOver={this.onMouseOver}
            orientation="horizontal"
            padding={{
              top: 20,
              right: 20,
              bottom: 50,
              left: 80,
            }}
            selection={this.state.selectedItems}
            type="stacked"
          />
        </section>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
