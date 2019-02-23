import React from 'react';
import ReactDOM from 'react-dom';
import { schemeCategory10, scaleOrdinal } from 'd3';
import bindAll from 'lodash/bindAll';
import xor from 'lodash/xor';

import {
  Bar,
  Bars,
  GroupedBars,
  StackedBars,
} from '../';

import AxisChart from '../../axis-chart';
import { XAxis, YAxis } from '../../axis';

import * as util from '../../../utils';

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

const data = util.dataGenerator({
  primaryKeys: [
    { name: 'location', values: locations }
  ],
  valueKeys: [
    { name: populationField, range: [100, 900], uncertainty: true }
  ],
  year: years[0],
  length: years.length,
});

const indiaData = data.filter(({ location }) => location === 'India');

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

  onMouseMove(event, datum) {
    console.log(`${event.type}::${JSON.stringify(datum)}`);
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
          <h3>Bar, manually sized and positioned</h3>
          <svg height={200} width={200}>
            <Bar
              x={50}
              y={0}
              height={200}
              width={100}
              datum={data[0]}
              fill="orange"
              focused={this.state.focus === data[0]}
              selected={this.state.selectedItems.includes(data[0])}
              onClick={this.onClick}
              onMouseLeave={this.onMouseLeave}
              onMouseMove={this.onMouseMove}
              onMouseOver={this.onMouseOver}
            />
          </svg>
        </section>

        <section>
          <h3>Bars, no axes</h3>
          <svg height={300} width={500}>
            <Bars
              categories={years}
              data={indiaData}
              dataAccessors={{
                category: yearField,
                value: populationField
              }}
              fill="steelblue"
              focus={this.state.focus}
              height={300}
              width={500}
              onClick={this.onClick}
              onMouseLeave={this.onMouseLeave}
              onMouseMove={this.onMouseMove}
              onMouseOver={this.onMouseOver}
              selection={this.state.selectedItems}
            />
          </svg>
        </section>

        <section>
          <h3>Bars with axes, horizontal orientation</h3>
          <AxisChart
            height={300}
            width={500}
            xDomain={[0, util.computeDataMax(indiaData, populationField)]}
            yDomain={years}
            xScaleType="linear"
            yScaleType="band"
          >
            <XAxis/>
            <YAxis/>
            <Bars
              categories={years}
              data={indiaData}
              dataAccessors={{
                category: yearField,
                value: populationField
              }}
              fill="steelblue"
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
          <h3>GroupedBars with axes, vertical orientation</h3>
          <AxisChart
            height={500}
            width={800}
            xDomain={locations}
            yDomain={[0, util.computeDataMax(data, populationField)]}
            xScaleType="band"
            yScaleType="linear"
          >
            <XAxis/>
            <YAxis/>
            <GroupedBars
              categories={locations}
              subcategories={years}
              data={data}
              dataAccessors={{
                category: locationField,
                subcategory: yearField,
                value: populationField,
              }}
              fill={(datum) => colorScale(datum[yearField])}
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

        <section>
          <h3>StackedBars with axes, horizontal orientation</h3>
          <AxisChart
            height={800}
            width={800}
            xDomain={[0, util.computeStackMax(data, locationField, populationField)]}
            yDomain={locations}
            xScaleType="linear"
            yScaleType="band"
          >
            <XAxis/>
            <YAxis/>
            <StackedBars
              categories={locations}
              subcategories={years}
              data={data}
              dataAccessors={{
                category: locationField,
                subcategory: yearField,
                value: populationField,
              }}
              fill={(datum) => colorScale(datum[yearField])}
              focus={this.state.focus}
              focusedStyle={{
                stroke: '#000',
                strokeWidth: 2,
              }}
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
            />
          </AxisChart>
        </section>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('app'));

