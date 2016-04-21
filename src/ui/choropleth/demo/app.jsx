import React from 'react';
import { render } from 'react-dom';

import { maxBy, minBy, memoize } from 'lodash';
import { scaleLinear } from 'd3-scale';
import d3 from 'd3';
import topojson from 'topojson';

import { colorSteps, getLocationIds } from '../../../test-utils';
import { generateColorDomain } from '../../../utils/domain';

import Choropleth from '../src/choropleth';
import Button from '../../button';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggleSubnational = this.toggleSubnational.bind(this);
    this.updateData = memoize(this.updateData);

    this.state = {
      showSubnational: false,
      ...this.updateData('country', props.topology)
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.topology === this.props.topology) return;

    const layer = this.state.showSubnational ? 'states' : 'country';

    this.setState({
      ...this.updateData(layer, newProps.topology)
    })
  }

  updateData(layer, topology) {
    const keyField = 'id';
    const valueField = 'mean';
    const geoJSON = topojson.feature(topology, topology.objects[layer]);
    const data = getLocationIds(geoJSON.features).map((locationId) => {
      return {
        [keyField]: locationId,
        [valueField]: Math.floor(Math.random() * 100)
      };
    });

    const domain = [minBy(data, valueField)[valueField], maxBy(data, valueField)[valueField]];
    const colorScale = scaleLinear()
      .domain(generateColorDomain(colorSteps, domain))
      .range(colorSteps)
      .clamp(true);

    return {
      keyField,
      valueField,
      data,
      domain,
      colorScale
    };
  }

  toggleSubnational() {
    // reverse logic
    const layer = this.state.showSubnational ? 'country' : 'states';
    this.setState({
      showSubnational: !this.state.showSubnational,
      ...this.updateData(layer, this.props.topology)
    });
  }

  render() {
    const {
      topology,
      width,
      height
    } = this.props;

    const {
      data,
      keyField,
      valueField,
      colorScale,
      showSubnational
    } = this.state;

    return (
      <div>
        <Choropleth
          layers={showSubnational ? ['states'] : ['country']}
          topology={topology}
          data={data}
          keyField={keyField}
          valueField={valueField}
          colorScale={colorScale}
          width={width - 200}
          height={height - 100}
        />
        <Button
          text="Toggle subnational"
          clickHandler={this.toggleSubnational}
          theme="light"
        />
      </div>
    );
  }
}

const container = document.getElementById('app');
const renderApp = (topology) => {
  const containerBBox = d3.select('#app').node().getBoundingClientRect();
  render(
    <App
      width={containerBBox.width}
      height={containerBBox.height || 500}
      topology={topology}
    />, container
  );
};

d3.json("//gist.githubusercontent.com/GabeMedrash/c5bbeb09ea2eee12635e664737656e00/raw/ed72a2ce609b5ccb2ebff361118501c47ee6f290/usa.json", function(error, topology) {
  if (error) throw error;

  renderApp(topology);

  /* throttler stolen from Mozilla (https://developer.mozilla.org/en-US/docs/Web/Events/resize) */
  (() => {
    const throttle = (type, name) => {
      let running = false;
      const func = () => {
        if (running) { return; }
        running = true;
        requestAnimationFrame(() => {
          window.dispatchEvent(new CustomEvent(name));
          running = false;
        });
      };
      window.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle('resize', 'optimizedResize');
  })();

  window.addEventListener('optimizedResize', () => {
    renderApp.call(null, topology);
  });
});


