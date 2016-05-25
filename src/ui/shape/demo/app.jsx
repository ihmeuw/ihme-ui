import React from 'react';
import { render } from 'react-dom';

import d3Scale from 'd3-scale';

import { maxBy, minBy, map, uniqBy } from 'lodash';

import { dataGenerator } from '../../../test-utils';
import AxisChart from '../../axis-chart';
import { XAxis, YAxis } from '../../axis';
import { ScatterPlot } from '../';


const keyField = 'year_id';
const valueField = 'value';

const locationData = dataGenerator({
  primaryKeys: [
    { name: 'location', values: ['Brazil', 'Russia', 'India', 'China'] }
  ],
  valueKeys: [
    { name: valueField, range: [100, 900], uncertainty: true }
  ]
});

const scatterData = [
  { location: 'Brazil', values: locationData.filter((datum) => { return datum.location === 'Brazil'; }) },
  { location: 'Russia', values: locationData.filter((datum) => { return datum.location === 'Russia'; }) },
  { location: 'India', values: locationData.filter((datum) => { return datum.location === 'India'; }) },
  { location: 'China', values: locationData.filter((datum) => { return datum.location === 'China'; }) }
];

const data = locationData;
const yDomain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
const xDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });

const dataAccessors = {
  x: keyField,
  y: valueField
};

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

const colorScale = d3Scale.scaleOrdinal()
    .domain(['Brazil', 'Russia', 'India', 'China'])
    .range(['red', 'blue', 'green', 'violet']);

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
    <ScatterPlot
      data={[
        [datum1, datum2, ...],
        [...],
        ...
      ]}
      dataAccessors={dataAccessors}
      keyField={'location'}
      dataField={'values'}
      symbolField={'location'}
      symbolScale={d3Scale.scaleOrdinal()
          .domain([...])
          .range([...])}
      colorScale={d3Scale.scaleOrdinal()
          .domain([...])
          .range([...])}
      clickHandler={function(args) {...}}
      hoverHandler={function(args) {...}}
    />
          </code></pre>
            <AxisChart
              xDomain={xDomain}
              xScaleType="point"
              yDomain={yDomain}
              yScaleType="linear"
              width={500}
              height={300}
            >
              <XAxis />
              <YAxis />
              <ScatterPlot
                data={scatterData}
                dataAccessors={dataAccessors}
                keyField={'location'}
                dataField={'values'}
                symbolField={'location'}
                symbolScale={symbolScale}
                colorScale={colorScale}
                clickHandler={clickHandler('click')}
                hoverHandler={hoverHandler('hover')}
              />
            </AxisChart>
        </section>
        <section>
          <h3>One Dataset</h3>
          <pre><code>
    <ScatterPlot
      data={[datum1, datum2, ...]}
      dataAccessors={dataAccessors}
      keyField={'location'}
      dataField={'values'}
      symbolField={'location'}
      isNested={false}
      symbolScale={d3Scale.scaleOrdinal()
          .domain([...])
          .range([...])}
      colorScale={d3Scale.scaleOrdinal()
          .domain([...])
          .range([...])}
      clickHandler={function(args) {...}}
      hoverHandler={function(args) {...}}
    />
          </code></pre>
            <AxisChart
              xDomain={xDomain}
              xScaleType="point"
              yDomain={yDomain}
              yScaleType="linear"
              width={500}
              height={300}
            >
              <XAxis />
              <YAxis />
              <ScatterPlot
                data={locationData.filter((datum) => { return datum.location === 'India'; })}
                dataAccessors={dataAccessors}
                keyField={'location'}
                dataField={'values'}
                symbolField={'location'}
                symbolScale={symbolScale}
                colorScale={colorScale}
                isNested={false}
                clickHandler={clickHandler('click')}
                hoverHandler={hoverHandler('hover')}
              />
            </AxisChart>
        </section>
        <section>
          <h3>One dimensional dataset</h3>
          <pre><code>
    <ScatterPlot
      data={[datum1, datum2, ...]}
      dataAccessors={{ x: valueField }}
      keyField={'location'}
      dataField={'values'}
      symbolField={'location'}
      isNested={false}
      is2d={false}
      symbolScale={d3Scale.scaleOrdinal()
          .domain([...])
          .range([...])}
      colorScale={d3Scale.scaleOrdinal()
          .domain([...])
          .range([...])}
      clickHandler={function(args) {...}}
      hoverHandler={function(args) {...}}
    />
          </code></pre>
            <AxisChart
              xDomain={yDomain}
              xScaleType="linear"
              yDomain={[0, 1]}
              yScaleType="linear"
              width={500}
              height={50}
            >
              <XAxis />
              <ScatterPlot
                data={locationData.filter((datum) => { return datum.location === 'India'; })}
                dataAccessors={{ x: valueField }}
                keyField={'location'}
                dataField={'values'}
                symbolField={'location'}
                symbolScale={symbolScale}
                colorScale={colorScale}
                isNested={false}
                is2d={false}
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
