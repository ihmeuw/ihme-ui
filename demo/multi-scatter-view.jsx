import React from 'react';
import PropTypes from 'prop-types';
import { extent } from 'd3';

import {
  AxisChart,
  Group,
  Option,
  MultiScatter,
  XAxis,
  YAxis,
} from '../src';

export default class MultiScatterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectedAge: 23 };

    this.changeAge = this.changeAge.bind(this);
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

  changeAge(selectedAge) {
    this.setState({ selectedAge });
  }

  render() {
    const { selectedAge } = this.state;

    return (
      <div>
        <div>
          <span>Age</span>
          <Group
            onClick={(_, selectedValue) => {
              this.changeAge(selectedValue);
            }}
          >
            <Option
              key={23}
              selected={selectedAge === 23}
              text={'5 - 14'}
              value={23}
            />
            <Option
              key={24}
              selected={selectedAge === 24}
              text={'15 - 49'}
              value={24}
            />
          </Group>
        </div>
        <div>

        </div>
      </div>
    );
  }
}

MultiScatterView.propTypes = {
  data: PropTypes.array,
  locations: PropTypes.array,
};
