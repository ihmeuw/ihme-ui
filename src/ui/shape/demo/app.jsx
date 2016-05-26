import React from 'react';
import { render } from 'react-dom';

import d3Scale from 'd3-scale';

import { maxBy, minBy, map, uniqBy } from 'lodash';

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

const clickHandler = (text) => {
  return (datum) => {
    return () => {
      alert(`${text}::${datum[keyField]},${datum[valueField]}`);
    };
  };
};

const hoverHandler = (text) => {
  return (datum) => {
    return () => {
      console.log(`${text}::${datum[keyField]},${datum[valueField]}`);
    };
  };
};

const symbolScale = d3Scale.scaleOrdinal()
    .domain(['Brazil', 'Russia', 'India', 'China'])
    .range(['circle', 'square', 'triangle', 'cross']);

const colorScale = d3Scale.scaleCategory10();

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <section>
          <h3>Multiple datasets</h3>
          <pre><code>
    <MultiScatter
      data={[
        [datum1, datum2, ...],
        [...],
        ...
      ]}
      dataAccessors={{
        x: keyField,
        y: valueField
      }}
      keyField={'location'}
      dataField={'values'}
      symbolField={'location'}
      symbolScale={d3Scale.scaleOrdinal()
          .domain([...])
          .range([...])}
      colorScale={d3Scale.scaleCategory10()}
      scales={{
        x: d3Scale.scaleLinear(),
        y: d3Scale.scaleLinear()
      }}
      clickHandler={function(args) {...}}
      hoverHandler={function(args) {...}}
    />
          </code></pre>
            <AxisChart
              xDomain={keyFieldDomain}
              xScaleType="point"
              yDomain={valueFieldDomain}
              yScaleType="linear"
              width={500}
              height={300}
            >
              <XAxis />
              <YAxis />
              <MultiScatter
                data={locationData}
                dataAccessors={{
                  x: keyField,    // year_id
                  y: valueField   // population
                }}
                keyField={'location'}
                dataField={'values'}
                symbolField={'location'}
                symbolScale={symbolScale}
                scales={{
                  x: d3Scale.scaleLinear(),
                  y: d3Scale.scaleLinear()
                }}
                colorScale={colorScale}
                clickHandler={clickHandler('click')}
                hoverHandler={hoverHandler('hover')}
              />
            </AxisChart>
        </section>
        <section>
          <h3>One Dataset</h3>
          <pre><code>
    <Scatter
      data={[datum1, datum2, ...]}
      dataAccessors={{
        x: keyField,
        y: valueField
      }}
      symbolType={'circle'}
      color={'steelblue'}
      clickHandler={function(args) {...}}
      hoverHandler={function(args) {...}}
    />
          </code></pre>
            <AxisChart
              xDomain={keyFieldDomain}
              xScaleType="point"
              yDomain={valueFieldDomain}
              yScaleType="linear"
              width={500}
              height={300}
            >
              <XAxis />
              <YAxis />
              <Scatter
                data={data.filter((datum) => { return datum.location === 'India'; })}
                dataAccessors={{
                  x: keyField,    // year_id
                  y: valueField   // population
                }}
                symbolType={'circle'}
                color={'steelblue'}
                clickHandler={clickHandler('click')}
                hoverHandler={hoverHandler('hover')}
              />
            </AxisChart>
        </section>
        <section>
          <h3>One dimensional dataset: horizontal</h3>
          <pre><code>
    <Scatter
      data={[datum1, datum2, ...]}
      dataAccessors={{ x: valueField }}
      symbolType={'circle'}
      color={'tomato'}
      clickHandler={function(args) {...}}
      hoverHandler={function(args) {...}}
    />
          </code></pre>
            <AxisChart
              xDomain={valueFieldDomain}
              xScaleType="linear"
              yDomain={[0, 1]}
              yScaleType="linear"
              width={500}
              height={50}
            >
              <XAxis />
              <Scatter
                data={data.filter((datum) => { return datum.location === 'India'; })}
                dataAccessors={{ x: valueField }}
                symbolType={'circle'}
                color={'tomato'}
                clickHandler={clickHandler('click')}
                hoverHandler={hoverHandler('hover')}
              />
            </AxisChart>
        </section>
        <section>
          <h3>One dimensional dataset: vertical</h3>
          <pre><code>
    <Scatter
      data={[datum1, datum2, ...]}
      dataAccessors={{ y: valueField }}
      symbolType={'circle'}
      color={'cornflowerblue'}
      clickHandler={function(args) {...}}
      hoverHandler={function(args) {...}}
    />
          </code></pre>
            <AxisChart
              yDomain={valueFieldDomain}
              xScaleType="linear"
              xDomain={[0, 1]}
              yScaleType="linear"
              width={100}
              height={500}
            >
              <YAxis />
              <Scatter
                data={data.filter((datum) => { return datum.location === 'India'; })}
                dataAccessors={{ y: valueField }}
                symbolType={'circle'}
                color={'cornflowerblue'}
                clickHandler={clickHandler('click')}
                hoverHandler={hoverHandler('hover')}
              />
            </AxisChart>
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
