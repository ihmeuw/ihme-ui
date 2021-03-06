import React from 'react';
import { render } from 'react-dom';
import { maxBy, minBy, map, uniqBy } from 'lodash';
import { scaleOrdinal, format } from 'd3';

import { dataGenerator } from '../../../utils';
import AxisChart from '../';
import { MultiLine } from '../../shape';
import { XAxis, YAxis } from '../../axis';
import Button from '../../button';

const keyField = 'year_id';
const valueField = 'value';

const data = dataGenerator({
  primaryKeys: [{ name: 'location', values: ['A', 'B', 'C', 'D', 'E', 'F'] }],
  valueKeys: [{ name: valueField, range: [200, 500], uncertainty: true }],
  length: 20,
});

const dataA = data.filter((d) => {
  return d.location === 'A';
});

const dataB = data.filter((d) => {
  return d.location === 'B';
});

const dataC = data.filter((d) => {
  return d.location === 'C';
});

const dataD = data.filter((d) => {
  return d.location === 'D';
});

const dataE = data.filter((d) => {
  return d.location === 'E';
});

const dataF = data.filter((d) => {
  return d.location === 'F';
});

const lineData = [
  { location: 'A', values: dataA },
  { location: 'B', values: dataB },
  { location: 'C', values: dataC },
  { location: 'D', values: dataD },
  { location: 'E', values: dataE },
  { location: 'F', values: dataF },
];

const yDomain = [minBy(data, 'value_lb').value_lb, maxBy(data, 'value_ub').value_ub];
const xDomain = map(uniqBy(data, keyField), (obj) => { return (obj[keyField]); });
const colorScale = scaleOrdinal().domain(['A', 'B', 'C', 'D', 'E', 'F'])
  .range(['red', 'blue', 'orange', 'green', 'salmon', 'violet']);

const dims = {
  width: 800,
  height: 600,
};

const padding = { top: 20, bottom: 40, left: 35, right: 20 };

const axisStyle = {
  fontFamily: 'sans-serif',
  fontSize: '11px',
};

const labelStyle = {
  fontFamily: 'sans-serif',
  fontSize: '16px',
}

const dataAccessors = { x: keyField, y: valueField, y0: 'value_lb', y1: 'value_ub' };
const chartClassName = ['foo', 'bar'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resizeChecked: false,
      autoFormatChecked: false,
    };
    this.onResizeButtonClick = this.onResizeButtonClick.bind(this);
    this.onAutoFormatToggle = this.onAutoFormatToggle.bind(this);
  }

  onResizeButtonClick() {
    this.setState( ({ resizeChecked }) => ({
      height: resizeChecked ? dims.height : 300,
      width: resizeChecked ? dims.width : 400,
      resizeChecked: !resizeChecked
    }));
  }

  onAutoFormatToggle() {
    this.setState(({ autoFormatChecked }) => ({ autoFormatChecked: !autoFormatChecked }));
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* <pre><code>
              <AxisChart
                autoFormatAxes={this.state.autoFormatChecked}
                width={this.state.width || dims.width}
                height={this.state.height || dims.height}
                xDomain={xDomain}
                xScaleType={'point'}
                yDomain={yDomain}
                yScaleType="linear"
                className={chartClassName}
              >
                <MultiLine
                  areaStyle={{ strokeWidth: '1px', fillOpacity: '0.5' }}
                  data={lineData}
                  fieldAccessors={{
                    data: 'values',
                    key: 'location',
                  }}
                  colorScale={colorScale}
                  showUncertainty
                  dataAccessors={dataAccessors}
                  onClick={()=>{console.log('click')}}
                />
                <XAxis
                  style={axisStyle}
                  label="Year"
                  labelStyle={labelStyle}
                  tickFormat={format("")}
                />
                <XAxis
                  style={axisStyle}
                  label="Year"
                  labelStyle={labelStyle}
                  orientation="top"
                  tickFormat={format("")}
                />
                <YAxis
                  style={axisStyle}
                  label="Probability"
                  labelStyle={labelStyle}
                />
              </AxisChart>
            </code></pre> */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button
            text="Resize chart"
            onClick={this.onResizeButtonClick}
          />
          <div>
            <label htmlFor="checkbox">Auto-format axes? </label>
            <input id= "checkbox" type="checkbox" onClick={this.onAutoFormatToggle} />
          </div>
        </div>
        <div style={{ height: '900px', width: '900px', textAlign: 'center', marginBottom: '20px' }}>
          <AxisChart
            autoFormatAxes={this.state.autoFormatChecked}
            width={this.state.width || dims.width}
            height={this.state.height || dims.height}
            xDomain={xDomain}
            xScaleType={'point'}
            yDomain={yDomain}
            yScaleType="linear"
            className={chartClassName}
          >
            <MultiLine
              areaStyle={{ strokeWidth: '1px', fillOpacity: '0.5' }}
              data={lineData}
              fieldAccessors={{
                data: 'values',
                key: 'location',
              }}
              colorScale={colorScale}
              showUncertainty
              dataAccessors={dataAccessors}
              onClick={()=>{console.log('click')}}
            />
            <XAxis
              style={axisStyle}
              label="Year"
              labelStyle={labelStyle}
              tickFormat={format("")}
            />
            <XAxis
              style={axisStyle}
              label="Year"
              labelStyle={labelStyle}
              orientation="top"
              tickFormat={format("")}
            />
            <YAxis
              style={axisStyle}
              label="Probability"
              labelStyle={labelStyle}
            />
          </AxisChart>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
