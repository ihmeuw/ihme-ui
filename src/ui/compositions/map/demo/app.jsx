import React from 'react';
import { render } from 'react-dom';
import * as d3Request from 'd3-request';
import { bindAll, flatMap, get as getValue } from 'lodash';

import Map from '../';
import Button from '../../../button';
import { dataGenerator } from '../../../../test-utils';

const keyField = 'loc_id';
const valueField = 'mean';

function randomNumberBetween0And99() {
  return Math.random() * 100 | 0;
}

function randomRange() {
  return [randomNumberBetween0And99(), randomNumberBetween0And99()].sort((a, b) => a -b);
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      selectedChoroplethDomain: [0, 1],
    };

    bindAll(this, [
      'onGenerateNewData',
      'onResetScale',
      'onSliderMove',
    ]);
  }

  componentWillMount() {
    this.setData();
  }

  onGenerateNewData() {
    this.setData();
  }

  onSliderMove(selectedChoroplethDomain) {
    this.setState({
      selectedChoroplethDomain,
    });
  }

  onResetScale() {
    this.setState({
      selectedChoroplethDomain: [0, 1],
    });
  }

  setData() {
    const range = randomRange();
    this.setState({
      data: this.getData(this.getLocationIds(this.props.topology.objects), range),
      range,
    });
  }

  getData(locationIds, dataRange) {
    return dataGenerator({
      primaryKeys: [{ name: keyField, values: locationIds }],
      valueKeys: [{ name: valueField, range: dataRange }],
      length: 1
    });
  }

  getLocationIds(topologyObjects) {
    return flatMap(topologyObjects, (collection) => {
      return collection.geometries.map((geometry) => getValue(geometry, ['properties', 'loc_id']));
    });
  }

  render() {
    const { topology } = this.props;
    const { data, range, selectedChoroplethDomain } = this.state;

    if (!Array.isArray(data)) return null;

    return (
      <div id="wrapper">
        <Map
          data={data}
          domain={range}
          extentPct={selectedChoroplethDomain}
          geometryKeyField={`properties.${keyField}`}
          keyField={keyField}
          onResetScale={this.onResetScale}
          onSliderMove={this.onSliderMove}
          topology={topology}
          unit="Probability of death"
          valueField={valueField}
        />
        <Button
          onClick={this.onGenerateNewData}
          text="Generate new data"
        />
      </div>
    );
  }
}

d3Request.json("world.topo.json", function(error, topology) {
  if (error) throw error;

  render(<App topology={topology} />, document.getElementById('app'));
});
