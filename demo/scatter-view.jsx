import React from 'react';
import PropTypes from 'prop-types';
import { extent } from 'd3';

import {
  AxisChart,
  Group,
  Option,
  Scatter,
  XAxis,
  YAxis,
} from '../src';

export default class ScatterView extends React.Component {
  constructor(props) {
    super(props);

    const locationData = props.locations.reduce((acc, { id }) => {
      return {
        ...acc,
        [id]: this.getLocationData(id),
      };
    }, {});

    this.state = {
      selectedLocation: props.locations[0],
      locationData,
    };

    this.changeLocation = this.changeLocation.bind(this);
  }

  getLocationData(locationId) {
    const data = this.props.data.filter(row => row.location === locationId && row.age === 23);
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

    this.setState({ selectedLocation });
  }

  render() {
    const {
      selectedLocation,
      locationData,
    } = this.state;

    const {
      data,
      xDomain,
      yDomain,
    } = locationData[selectedLocation.id];

    return (
      <div>
        <div>
          <span>Location</span>
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

ScatterView.propTypes = {
  data: PropTypes.array,
  locations: PropTypes.array,
};
