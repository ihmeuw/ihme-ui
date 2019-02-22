import React from 'react';
import { schemeCategory10, scaleOrdinal } from 'd3';
import ReactDOM from 'react-dom';
import bindAll from 'lodash/bindAll';
import xor from 'lodash/xor';

import BarChart from '../src/bar-chart';

import { dataGenerator } from '../../../../utils';

const yearField = 'year_id';
const populationField = 'population';
const locationField = 'location';

const years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007];

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
  ],
  year: years[0],
  length: years.length,
});

const brazilData = data.filter(({ location }) => location === 'Brazil');

const STYLE = {
  height: true,
};

const colorScale = scaleOrdinal(schemeCategory10);

const legendItems = years.map((year) => ({
  label: year,
  shapeColor: colorScale(year),
  shapeType: 'square',
}));

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
          <BarChart
            title="Brazil Population, 2000-2007"
            categories={years}
            chartStyle={STYLE}
            data={brazilData}
            dataAccessors={{
              category: yearField,
              value: populationField,
            }}
            focus={this.state.focus}
            axisLabels={{
              domain: "Year",
              range: "Population",
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
          <BarChart
            title="Brazil Population, 2000-2007"
            categories={years}
            chartStyle={STYLE}
            data={brazilData}
            dataAccessors={{
              category: yearField,
              value: populationField,
            }}
            focus={this.state.focus}
            axisLabels={{
              domain: "Year",
              range: "Population",
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
          <BarChart
            title="Population, 2000-2007"
            categories={locations}
            subcategories={years}
            data={data}
            dataAccessors={{
              category: locationField,
              subcategory: yearField,
              value: populationField,
            }}
            chartStyle={STYLE}
            fill={(datum) => colorScale(datum[yearField])}
            focus={this.state.focus}
            axisLabels={{
              domain: "Country",
              range: "Population",
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
          <BarChart
            title="Population, 2000-2007"
            categories={locations}
            subcategories={years}
            data={data}
            dataAccessors={{
              category: locationField,
              subcategory: yearField,
              value: populationField,
            }}
            chartStyle={STYLE}
            fill={(datum) => colorScale(datum[yearField])}
            focus={this.state.focus}
            axisLabels={{
              domain: "Country",
              range: "Population"
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
          <BarChart
            title="Population, 2000-2007"
            chartStyle={STYLE}
            data={data}
            dataAccessors={{
              category: locationField,
              subcategory: yearField,
              value: populationField,
            }}
            displayLegend
            fill={(datum) => colorScale(datum[yearField])}
            focus={this.state.focus}
            axisLabels={{
              domain: "Country",
              range: "Population",
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
          <BarChart
            title="Population, 2000-2007"
            categories={locations}
            subcategories={years}
            chartStyle={STYLE}
            data={data}
            dataAccessors={{
              category: locationField,
              subcategory: yearField,
              value: populationField,
            }}
            displayLegend
            fill={(datum) => colorScale(datum[yearField])}
            focus={this.state.focus}
            axisLabels={{
              domain: "Country",
              range: "Population",
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
