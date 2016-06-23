import React from 'react';
import { render } from 'react-dom';

import d3Scale from 'd3-scale';

import { maxBy, minBy, map, slice, uniqBy, without } from 'lodash';

import { dataGenerator } from '../../../test-utils';
import AxisChart from '../../axis-chart';
import { XAxis, YAxis } from '../../axis';
import { MultiScatter, Scatter } from '../';


const keyField = 'year_id';
const valueField = 'population';

const data = dataGenerator({
  primaryKeys: [
    { name: 'location', values: ['Brazil', 'Russia', 'India', 'China'] }
  ],
  valueKeys: [
    { name: valueField, range: [100, 900], uncertainty: true }
  ]
});
  // [
  //   {location: 'Brazil', population: 100, year_id: 2000, ...},
  //   {location: 'Russia', population: 150, year_id: 2000, ...},
  //   ...
  // ]

const locationData = [
  { location: 'Brazil', values: data.filter((datum) => { return datum.location === 'Brazil'; }) },
  { location: 'Russia', values: data.filter((datum) => { return datum.location === 'Russia'; }) },
  { location: 'India', values: data.filter((datum) => { return datum.location === 'India'; }) },
  { location: 'China', values: data.filter((datum) => { return datum.location === 'China'; }) }
];
  // [
  //   {location: 'Brazil', values: [
  //     {location: 'Brazil', population: 100, year_id: 2000, ...},
  //     {location: 'Brazil', population: 120, year_id: 2001, ...},
  //      ...
  //   ]},
  //   {location: 'Russia', values: [
  //     {location: 'Russia', population: 100, year_id: 2000, ...},
  //     {location: 'Russia', population: 120, year_id: 2001, ...},
  //      ...
  //   ]},
  //   ...
  // ]

const valueFieldDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
//valueField: population

const keyFieldDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });
// keyField: year_id

const symbolScale = d3Scale.scaleOrdinal()
    .domain(['Brazil', 'Russia', 'India', 'China'])
    .range(['circle', 'square', 'triangle', 'cross']);

const colorScale = d3Scale.scaleCategory10();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: []
    }
  }

  clickHandler(text) {
    return (datum, itemKey) => {
      return () => {
        alert(`${text}::${datum[keyField]},${datum[valueField]}`);
      };
    };
  };

  onMouseLeave(text) {
    return (datum, itemKey) => {
      return () => {
        const newState = slice(this.state.selectedItems, 0);
        const index = newState.indexOf(itemKey);
        newState.splice(index, 1);
        this.setState({selectedItems: newState})
        console.log(`${text}::${datum[keyField]},${datum[valueField]}`);
      };
    };
  };

  onMouseMove(text) {
    return (datum, itemKey) => {
      return () => {
        console.log(`${text}::${datum[keyField]},${datum[valueField]}`);
      };
    };
  };

  onMouseOver(text) {
    return (datum, itemKey) => {
      return () => {
        const newState = slice(this.state.selectedItems, 0);
        newState.push(itemKey);
        this.setState({selectedItems: newState})
        console.log(`${text}::${datum[keyField]},${datum[valueField]}`);
      };
    };
  };


  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <section>
          <h3>Multiple datasets</h3>
          <pre><code>
    <MultiScatter
      colorScale={d3Scale.scaleCategory10()}
      data={[
        [datum1, datum2, ...],
        [...],
        ...
      ]}
      dataAccessors={{
        x: keyField,
        y: valueField
      }}
      dataField={'values'}
      keyField={'location'}
      onClick={function(args) {...}}
      onMouseLeave={function(args) {...}}
      onMouseMove={function(args) {...}}
      onMouseOver={function(args) {...}}
      scales={{
        x: d3Scale.scaleLinear(),
        y: d3Scale.scaleLinear()
      }}
      symbolField={'location'}
      symbolScale={d3Scale.scaleOrdinal()
          .domain([...])
          .range([...])}
    />
          </code></pre>
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
                  x: keyField,    // year_id
                  y: valueField   // population
                }}
                keyField={'location'}
                dataField={'values'}
                onClick={this.clickHandler('click')}
                onMouseLeave={this.onMouseLeave('leave')}
                onMouseMove={this.onMouseMove('move')}
                onMouseOver={this.onMouseOver('over')}
                scales={{
                  x: d3Scale.scaleLinear(),
                  y: d3Scale.scaleLinear()
                }}
                selectedItemKeys={this.state.selectedItems}
                symbolField={'location'}
                symbolScale={symbolScale}
              />
            </AxisChart>
        </section>
        <section>
          <h3>One Dataset</h3>
          <pre><code>
    <Scatter
      color={'steelblue'}
      data={[datum1, datum2, ...]}
      dataAccessors={{
        x: keyField,
        y: valueField
      }}
      onClick={function(args) {...}}
      onMouseLeave={function(args) {...}}
      onMouseMove={function(args) {...}}
      onMouseOver={function(args) {...}}
      symbolType={'circle'}
    />
          </code></pre>
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
                color={'steelblue'}
                data={data.filter((datum) => { return datum.location === 'India'; })}
                dataAccessors={{
                  x: keyField,    // year_id
                  y: valueField   // population
                }}
                onClick={this.clickHandler('click')}
                onMouseLeave={this.onMouseLeave('leave')}
                onMouseMove={this.onMouseMove('move')}
                onMouseOver={this.onMouseOver('over')}
                selectedItemKeys={this.state.selectedItems}
                symbolType={'circle'}
              />
            </AxisChart>
        </section>
        <section>
          <h3>One dimensional dataset: horizontal</h3>
          <pre><code>
    <Scatter
      color={'tomato'}
      data={[datum1, datum2, ...]}
      dataAccessors={{ x: valueField }}
      onClick={function(args) {...}}
      onMouseLeave={function(args) {...}}
      onMouseMove={function(args) {...}}
      onMouseOver={function(args) {...}}
      symbolType={'circle'}
    />
          </code></pre>
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
                color={'tomato'}
                data={data.filter((datum) => { return datum.location === 'India'; })}
                dataAccessors={{ x: valueField }}
                onClick={this.clickHandler('click')}
                onMouseLeave={this.onMouseLeave('leave')}
                onMouseMove={this.onMouseMove('move')}
                onMouseOver={this.onMouseOver('over')}
                selectedItemKeys={this.state.selectedItems}
                symbolType={'circle'}
              />
            </AxisChart>
        </section>
        <section>
          <h3>One dimensional dataset: vertical</h3>
          <pre><code>
    <Scatter
      color={'cornflowerblue'}
      data={[datum1, datum2, ...]}
      dataAccessors={{ y: valueField }}
      symbolType={'circle'}
      onClick={function(args) {...}}
      onMouseLeave={function(args) {...}}
      onMouseMove={function(args) {...}}
      onMouseOver={function(args) {...}}
    />
          </code></pre>
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
                color={'cornflowerblue'}
                data={data.filter((datum) => { return datum.location === 'India'; })}
                dataAccessors={{ y: valueField }}
                onClick={this.clickHandler('click')}
                onMouseLeave={this.onMouseLeave('leave')}
                onMouseMove={this.onMouseMove('move')}
                onMouseOver={this.onMouseOver('over')}
                selectedItemKeys={this.state.selectedItems}
                symbolType={'circle'}
              />
            </AxisChart>
        </section>
        <section>
          <h3>One dimensional dataset: with colors</h3>
          <pre><code>
    <Scatter
      color={d3Scale.scaleCategory10()}
      data={[datum1, datum2, ...]}
      dataAccessors={{ x: valueField }}
      onClick={function(args) {...}}
      onMouseLeave={function(args) {...}}
      onMouseMove={function(args) {...}}
      onMouseOver={function(args) {...}}
      symbolType={'circle'}
    />
          </code></pre>
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
                dataAccessors={{ x: valueField }}
                onClick={this.clickHandler('click')}
                onMouseLeave={this.onMouseLeave('leave')}
                onMouseMove={this.onMouseMove('move')}
                onMouseOver={this.onMouseOver('over')}
                selectedItemKeys={this.state.selectedItems}
                symbolType={'circle'}
              />
            </AxisChart>
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
