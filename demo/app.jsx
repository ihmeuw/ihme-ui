import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  extent,
  scaleOrdinal,
  schemeCategory10,
} from 'd3';

import {
  AxisChart,
  Button,
  Group,
  Option,
  MultiLine,
  MultiScatter,
  XAxis,
  YAxis,
} from '../src';
import { data as rawData } from './data';
import { Scatter } from '../src/ui/shape'

const dataLocations = [
  { name: 'Brazil', id: 135 },
  { name: 'Russia', id: 62 },
  { name: 'India', id: 163 },
  { name: 'China', id: 6 },
  { name: 'South Africa', id: 196 },
];

// process raw data
const flatData = (function ({ data, keys }) {
  return data.map(row => row.reduce((acc, value, index) => ({ ...acc, [keys[index]]: value }), {}));
}(rawData));

const locationColorScale = scaleOrdinal()
  .domain(dataLocations.map(({ id }) => id))
  .range(schemeCategory10);

class App extends React.Component {
  constructor(props) {
    super(props);

    const initialLocation = this.props.locations[0];
    const {
      data,
      xDomain,
      yDomain,
    } = this.getLocationData(initialLocation.id);

    this.state = {
      selectedLocation: initialLocation,
      data,
      xDomain,
      yDomain,
    };

    this.changeLocation = this.changeLocation.bind(this);
  }

  getLocationData(locationId) {
    const data = this.props.data.filter(row => row.location === locationId);
    const xDomain = data.map(({ year }) => year).sort((a, b) => a - b);
    const yDomain = extent(
      data.reduce((acc, { lower, mean, upper }) => [...acc, lower, mean, upper], [])
    );

    return {
      data,
      xDomain,
      yDomain,
    };
  }

  changeLocation(selectedValue) {
    const selectedLocation = this.props.locations.find(location => location.id === selectedValue);
    const {
      data,
      xDomain,
      yDomain,
    } = this.getLocationData(selectedValue);

    this.setState({
      data,
      xDomain,
      yDomain,
      selectedLocation
    });
  }

  render() {
    const {
      selectedLocation,
      data,
      xDomain,
      yDomain,
    } = this.state;

    return (
      <div>
        <div>
          <Group
            onClick={(_, selectedValue) => {
              this.changeLocation(selectedValue);
            }}
          >
            {
              this.props.locations.map(({ name, id }) => (
                <Option
                  key={id}
                  selected={selectedLocation.id === id}
                  text={name}
                  value={id}
                />
              ))
            }
          </Group>
        </div>
        <div>
          <AxisChart
            height={500}
            width={800}
            xDomain={xDomain}
            xScaleType="point"
            yDomain={yDomain}
            yScaleType="linear"
          >
            <Scatter
              animate
              data={data}
              dataAccessors={{
                key: 'year',
                x: 'year',
                y: 'upper',
              }}
              fill={'blue'}
              shapeType={'line'}
            />
            <Scatter
              animate
              data={data}
              dataAccessors={{
                key: 'year',
                x: 'year',
                y: 'mean',
              }}
              fill={'green'}
            />
            <Scatter
              animate
              data={data}
              dataAccessors={{
                key: 'year',
                x: 'year',
                y: 'lower',
              }}
              fill={'red'}
              shapeType={'line'}
            />
            <XAxis />
            <YAxis />
          </AxisChart>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  data: PropTypes.array,
  locations: PropTypes.array,
};

ReactDOM.render(<App
  data={flatData}
  locations={dataLocations}
  locationColorScale={locationColorScale}
/>, document.getElementById('app'));
