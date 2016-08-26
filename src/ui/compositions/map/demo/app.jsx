import React from 'react';
import { render } from 'react-dom';
import * as d3Request from 'd3-request';
import {
  bindAll,
  find,
  flatMap,
  get as getValue,
  xor,
} from 'lodash';

import Map from '../';
import Button from '../../../button';
import { dataGenerator } from '../../../../test-utils';
import { numberFormat } from '../../../../utils';

const keyField = 'loc_id';
const valueField = (data, feature) => {
  if (!feature && data.hasOwnProperty('mean')) return data.mean;
  if (feature && feature.properties.hasOwnProperty('admin_id') && data.hasOwnProperty(feature.properties.admin_id)) return data[feature.properties.admin_id].mean;
  if (feature && feature.properties.hasOwnProperty('loc_id') && data.hasOwnProperty(feature.properties.loc_id)) return data[feature.properties.loc_id].mean;
  return null;
};

function randomNumberBetween0And99() {
  return Math.random() * 100 | 0;
}

function randomRange() {
  return [randomNumberBetween0And99(), randomNumberBetween0And99()].sort((a, b) => a - b);
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      selections: [],
      selectedChoroplethDomain: [0, 1],
      subnational: false,
    };

    bindAll(this, [
      'onClick',
      'onGenerateNewData',
      'onResetScale',
      'onSliderMove',
      'onToggleSubnational',
    ]);
  }

  componentWillMount() {
    this.setData();
  }

  onClick(event, locationDatum, Path) {
    let selectedDatum = locationDatum;
    const adminId = getValue(Path, ['props', 'feature', 'properties', 'admin_id'], null);
    if (adminId) {
      selectedDatum = find(this.state.data, (datum) => datum[keyField] == adminId);
    }

    this.setState({
      selections: xor(this.state.selections, [selectedDatum]),
    });
  }

  onGenerateNewData() {
    this.setData();
  }

  onSliderMove(selectedChoroplethDomain) {
    this.setState({
      selectedChoroplethDomain,
    });
  }

  onToggleSubnational() {
    this.setState({
      subnational: !this.state.subnational,
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
      valueKeys: [{ name: 'mean', range: dataRange }],
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
    const { data, range, selections, selectedChoroplethDomain, subnational } = this.state;

    if (!Array.isArray(data)) return null;

    return (
      <div id="wrapper">
        <Map
          axisTickFormat={numberFormat}
          data={data}
          domain={range}
          extentPct={selectedChoroplethDomain}
          geometryKeyField={`properties.${keyField}`}
          keyField={keyField}
          onClick={this.onClick}
          onResetScale={this.onResetScale}
          onSliderMove={this.onSliderMove}
          selectedLocations={selections}
          sliderHandleFormat={numberFormat}
          subnational={subnational}
          topology={topology}
          unit="Probability of death"
          valueField={valueField}
        />
        <Button
          onClick={this.onGenerateNewData}
          text="Generate new data"
        />
        <Button
          onClick={this.onToggleSubnational}
          text="Toggle subnational"
        />
      </div>
    );
  }
}

d3Request.json("world.topo.json", function(error, topology) {
  if (error) throw error;

  render(<App topology={topology} />, document.getElementById('app'));
});
