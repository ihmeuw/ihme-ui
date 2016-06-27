import React from 'react';
import { render } from 'react-dom';
import { maxBy, minBy, map, uniqBy } from 'lodash';
import d3Scale from 'd3-scale';

import { dataGenerator } from '../../../test-utils';
import AxisChart from '../';
import { MultiLine } from '../../shape';
import { XAxis, YAxis } from '../../axis';
import Button from '../../button';

const keyField = 'year_id';
const valueField = 'value';

const data = dataGenerator({
  primaryKeys: [{ name: 'location', values: ['A', 'B', 'C', 'D', 'E', 'F'] }],
  valueKeys: [{ name: valueField, range: [200, 500], uncertainty: true }],
  length: 10,
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
const colorScale = d3Scale.scaleOrdinal().domain(['A', 'B', 'C', 'D', 'E', 'F'])
  .range(['red', 'blue', 'orange', 'green', 'salmon', 'violet']);

const dims = {
  width: 800,
  height: 600,
};

const padding = { top: 20, bottom: 40, left: 55, right: 20 };

const axisStyle = {
  fontFamily: 'sans-serif',
  fontSize: '11px',
};

const dataAccessors = { x: keyField, y: valueField, y0: 'value_lb', y1: 'value_ub' };
const chartClassName = ['foo', 'bar'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { render: 0 };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({
      render: this.state.render + 1,
      xScaleType: 'linear',
      xDomain: [Math.min(...xDomain), Math.max(...xDomain)],
      width: 600,
    });
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <Button
            text="Resize and change scale"
            clickHandler={this.onClick}
          />
        </div>
        <AxisChart
          width={this.state.width || dims.width}
          height={dims.height}
          padding={padding}
          xDomain={this.state.xDomain || xDomain}
          xScaleType={this.state.xScaleType || 'point'}
          yDomain={yDomain}
          yScaleType="linear"
          className={chartClassName}
        >
          <XAxis style={axisStyle} label="Year" />
          <YAxis style={axisStyle} label="Probability" />
          <MultiLine
            data={lineData}
            keyField={'location'}
            dataField={'values'}
            colorScale={colorScale}
            showUncertainty
            dataAccessors={dataAccessors}
          />
        </AxisChart>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
