import React from 'react';
import { render } from 'react-dom';

import { maxBy, minBy, memoize, bindAll, filter, flatMap } from 'lodash';
import { scaleLinear } from 'd3-scale';

import { colorSteps, dataGenerator } from '../../../test-utils';
import { generateColorDomain } from '../../../utils/domain';

import ResponsiveContainer from '../../responsive-container';
import Choropleth from '../';
import Button from '../../button';

const LAYERS = {
  global: { name: 'global', type: 'feature' },
  subnational: { name: 'subnational', type: 'feature' }
};

class App extends React.Component {
  constructor(props) {
    super(props);

    const initialVisibleLayer = [LAYERS.global];

    this.state = {
      selections: [],
      layers: initialVisibleLayer,
      ...this.updateData(initialVisibleLayer, props.topology)
    };

    bindAll(this, [
      'toggleSubnational',
      'selectLocation'
    ]);
  }

  updateData(layers, topology) {
    const layerNames = layers.map(layer => layer.name);
    const keyField = 'id';
    const valueField = 'mean';
    const collections = filter(topology.objects, (collection, name) => {
      return layerNames.includes(name);
    });
    const locIds = flatMap(collections, (collection) => {
      return collection.geometries.map((geometry) => geometry.id);
    });

    // calc upper and lower bounds of data
    const val1 = Math.random() * 100 | 0;
    const val2 = Math.random() * 100 | 0;

    const data = dataGenerator({
      primaryKeys: [{ name: keyField, values: locIds }],
      valueKeys: [
        { name: valueField, range: [Math.min(val1, val2), Math.max(val1, val2)] }
      ],
      length: 1
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
    const layerNames = this.state.layers.map(layer => layer.name);
    let newLayers;

    if (layerNames.includes('subnational')) {
      newLayers = filter(this.state.layers, layer => layer.name !== 'subnational');
    } else {
      newLayers = [...this.state.layers, LAYERS.subnational];
    }

    this.setState({
      layers: newLayers,
      ...this.updateData(newLayers, this.props.topology)
    });
  }

  selectLocation(locId) {
    const { selections } = this.state;

    let newSelections;
    if (selections.includes(locId)) {
      newSelections = selections.filter((loc) => { return loc !== locId; });
    } else {
      newSelections = [locId, ...selections];
    }

    this.setState({
      selections: newSelections
    });
  }

  render() {
    const {
      data,
      keyField,
      valueField,
      colorScale,
      selections,
      layers
    } = this.state;

    return (
      <div style={{ display: 'flex', flex: '1 1 auto', justifyContent: 'center'}}>
        <div style={{ flex: '1 0 auto', maxWidth: '70%' }}>
          <ResponsiveContainer>
            <Choropleth
              layers={layers}
              topology={this.props.topology}
              data={data}
              keyField={keyField}
              valueField={valueField}
              colorScale={colorScale}
              selectedLocations={selections}
              onClick={this.selectLocation}
            />
          </ResponsiveContainer>
        </div>
        <Button
          text="Toggle subnational"
          clickHandler={this.toggleSubnational}
        />
      </div>
    );
  }
}

d3.json("//gist.githubusercontent.com/GabeMedrash/1dce23941015acc17d3fa2a670083d8f/raw/b0ae443ac0ad6d3a2425e12382680e5829345b60/world.topo.json", function(error, topology) {
  if (error) throw error;
  render(<App topology={topology} />, document.getElementById('app'));
});


