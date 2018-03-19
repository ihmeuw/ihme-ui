import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  scaleOrdinal,
  schemeCategory10,
} from 'd3';

import {
  Group,
  Option,
} from '../src';
import { data as rawData } from './data';
import ScatterView from './scatter-view';
import MultiScaterView from './multi-scatter-view';

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

const views = {
  Scatter: ScatterView,
  MultiScatter: MultiScaterView,
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedComponentView: 'Scatter',
    };

    this.changeComponent = this.changeComponent.bind(this);
  }

  changeComponent(selectedComponentView) {
    this.setState({ selectedComponentView });
  }

  render() {
    const {
      selectedComponentView,
    } = this.state;
    const ViewComponent = views[selectedComponentView];

    return (
      <div>
        <div>
          <span>Component</span>
          <Group
            onClick={(_, value) => { this.changeComponent(value); }}
          >
            <Option
              key={'Scatter'}
              selected={selectedComponentView === 'Scatter'}
              text={'Scatter'}
              value={'Scatter'}
            />
            <Option
              key={'MultiScatter'}
              selected={selectedComponentView === 'MultiScatter'}
              text={'Multi-Scatter'}
              value={'MultiScatter'}
            />
          </Group>
        </div>
        <div>
          <ViewComponent
            {...this.props}
          />
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
