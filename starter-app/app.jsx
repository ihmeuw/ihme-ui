// react
import React from 'react';
import { render } from 'react-dom';

import { maxBy, minBy, map, uniqBy } from 'lodash';
import d3Scale from 'd3-scale';

import { dataGenerator } from 'ihme-ui/test-utils';
import ResponsiveContainer from 'ihme-ui/ui/responsive-container';
import AxisChart from 'ihme-ui/ui/axis-chart';
import { MultiLine } from 'ihme-ui/ui/shape';
import { XAxis, YAxis } from 'ihme-ui/ui/axis';
import Legend from 'ihme-ui/ui/legend';

const keyField = 'year_id';
const valueField = 'value';
const lowerBoundField = `${valueField}_lb`;
const upperBoundField = `${valueField}_ub`;

const usaData = dataGenerator({
  primaryKeys: [{ name: 'location', values: ['USA'] }],
  valueKeys: [
    { name: valueField, range: [200, 500], uncertainty: true }
  ],
  length: 10
});

const canadaData = dataGenerator({
  primaryKeys: [{ name: 'location', values: ['Canada'] }],
  valueKeys: [
    { name: valueField, range: [300, 550], uncertainty: true }
  ],
  length: 10
});

const lineData = [{ location: 'USA', symbol: 'circle', values: usaData }, { location: 'Canada', symbol: 'square', values: canadaData }];

const data = [...usaData, ...canadaData];
const yDomain = [minBy(data, lowerBoundField)[lowerBoundField], maxBy(data, upperBoundField)[upperBoundField]];
const xDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });
const colorScale = d3Scale.scaleOrdinal().domain(['USA', 'Canada']).range(['red', 'blue']);

const padding = {
  top: 20,
  bottom: 30,
  left: 70,
  right: 70
};

const axisStyle = {
  fontFamily: 'sans-serif',
  fontSize: '11px'
};

class App extends React.Component {
  render() {
    const legendItems = lineData.map(line => {
      return {
        label: line.location,
        symbol: line.symbol,
        color: colorScale(line.location)
      };
    });

    return (
      <div style={{ display: 'flex', flex: '1 0 auto' }}>
        <div style={{ display: 'flex', flex: '1 0 auto' }}>
          <ResponsiveContainer>
            <AxisChart
              padding={padding}
              xDomain={xDomain}
              xScaleType="point"
              yDomain={yDomain}
              yScaleType="linear"
              className={['foo', 'bar']}
            >
              <XAxis style={axisStyle} label="Probability" />
              <YAxis style={axisStyle} label="Year" />
              <MultiLine
                data={lineData}
                keyField={'location'}
                dataField={'values'}
                colorScale={colorScale}
                showUncertainty
                dataAccessors={{ x: keyField, y: valueField, y0: lowerBoundField, y1: upperBoundField }}
              />
            </AxisChart>
          </ResponsiveContainer>
        </div>
        <Legend
          items={legendItems}
          labelKey="label"
          symbolTypeKey="symbol"
          symbolColorKey="color"
          wrapperStyles={{ flex: '0 1 auto', width: 'auto' }}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
