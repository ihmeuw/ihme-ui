import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  scaleOrdinal,
  schemeCategory10,
} from 'd3';

import { dataGenerator } from '../src/utils';

import {
  AxisChart,
  Button,
  MultiLine,
  MultiScatter,
  XAxis,
  YAxis,
} from '../src';

const locations = ['usa', 'can', 'mex', 'saf', 'ind', 'rus', 'kor', 'sud'];

const dataConfig = {
  primaryKeys: [
    { name: 'location', values: locations },
  ],
  valueKeys: [
    { name: 'mean', range: [300, 500], uncertainty: true },
    { name: 'output', range: [325, 475] },
    { name: 'input_a', range: [200, 600] },
    { name: 'input_b', range: [350, 450] },
    { name: 'input_c', range: [275, 525] },
  ],
  length: 20,
};

const rawData = dataGenerator(dataConfig);

const dimensions = {
  height: 500,
  width: 800,
  padding: { top: 20, bottom: 40, left: 55, right: 20 },
};

function getYDomain(data) {
  return data.reduce(([prevMin, prevMax], datum) => {
    let max = prevMax;
    let min = prevMin;

    ['mean_ub', 'mean_lb', 'output', 'input_a', 'input_b', 'input_c'].forEach(prop => {
      if (datum[prop] > max) { max = datum[prop]; }
      if (datum[prop] < min) { min = datum[prop]; }
    });

    return [min, max];
  }, [Infinity, -Infinity]);
}

const colorScale = scaleOrdinal()
  .domain(['mean', 'output', 'input_a', 'input_b', 'input_c'])
  .range(schemeCategory10);

const shapeScale = scaleOrdinal()
  .domain(['input_a', 'input_b', 'input_c'])
  .range(['cross', 'diamond', 'star']);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: props.location,
    };

    this.changeLocation = this.changeLocation.bind(this);
  }

  componentWillMount() {
    const data = rawData.filter(datum => datum.location === this.state.location);
    const xDomain = data.map(datum => datum.year_id);
    const yDomain = getYDomain(data);

    this.setState({ data, xDomain, yDomain });
  }

  changeLocation() {
    const prevLocation = this.state.location;
    const location = locations[(locations.indexOf(prevLocation) + 1) % locations.length];
    const data = rawData.filter(datum => datum.location === location);
    const yDomain = getYDomain(data);

    this.setState({ location, data, yDomain });
  }

  render() {
    const {
      data,
      location,
      xDomain,
      yDomain,
    } = this.state;

    const lineData = ['output', 'mean'].map(lineType => ({
      data: data.map(datum => ({
        value: datum[lineType],
        value_lb: datum[`${lineType}_lb`],
        value_ub: datum[`${lineType}_ub`],
        ...datum,
      })),
      lineType,
    }));

    const inputData = ['input_a', 'input_b', 'input_c'].map(inputType => ({
      data: data.map(datum => ({ input: datum[inputType], ...datum })),
      inputType,
    }));

    return (
      <div>
        <div>selected location: {location}</div>
        <div>
          <Button
            text={'Change Location'}
            onClick={this.changeLocation}
          />
        </div>
        <AxisChart
          height={dimensions.height}
          width={dimensions.width}
          padding={dimensions.padding}
          xDomain={xDomain}
          yDomain={yDomain}
          xScaleType="point"
          yScaleType="linear"
        >
          <MultiScatter
            colorScale={colorScale}
            data={inputData}
            dataAccessors={{
              fill: 'location',
              key: 'id',
              x: 'year_id',
              y: 'input',
            }}
            fieldAccessors={{
              color: 'inputType',
              data: 'data',
              key: 'inputType',
              shape: 'inputType',
            }}
            shapeScale={shapeScale}
          />
          <MultiLine
            areaStyle={{ strokeWidth: '1px', fillOpacity: '0.5' }}
            colorScale={colorScale}
            data={lineData}
            dataAccessors={{
              x: 'year_id',
              y: 'value',
              y0: 'value_lb',
              y1: 'value_ub',
            }}
            fieldAccessors={{
              color: 'lineType',
              data: 'data',
              key: 'lineType',
            }}
            showUncertainty
          />
          <XAxis label="Year" />
          <YAxis label="Population" />
        </AxisChart>
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.string,
  data: PropTypes.array,
};

const appProps = {
  location: 'mex',
};

ReactDOM.render(<App {...appProps} />, document.getElementById('app'));
