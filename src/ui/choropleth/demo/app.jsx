import React from 'react';
import { render } from 'react-dom';

import { forEach, bindAll, filter, flatMap, values, xor } from 'lodash';
import { scaleLinear } from 'd3-scale';

import { colorSteps, dataGenerator } from '../../../test-utils';
import { generateColorDomain } from '../../../utils/domain';

import ResponsiveContainer from '../../responsive-container';
import Choropleth from '../';
import Button from '../../button';

const LAYERS = [
  { name: 'global', object: 'global', type: 'feature', visible: true, },
  { name: 'subnational', object: 'subnational', type: 'feature', visible: false, },
  { name: 'boundary', object: 'global', type: 'mesh', visible: true, style: { stroke: 'red', strokeWidth: '1px' }, filterFn: boundaryFilterFn([101, 102, 130])},
  // { name: 'subnational-boundary', object: 'subnational', type: 'mesh', visible: true, style: { stroke: 'blue', strokeWidth: '1px' }, },
];

function boundaryFilterFn(selections) {
  return (a) => {
    return selections.includes(a.id);
  }
}

const keyField = 'id';
const valueField = 'mean';
const dataRange = [0, 100];

const colorScale = scaleLinear()
  .domain(generateColorDomain(colorSteps, dataRange))
  .range(colorSteps)
  .clamp(true);

class App extends React.Component {
  constructor(props) {
    super(props);

    const layers = LAYERS.slice(0);

    this.state = {
      selections: [],
      layers,
      domain: dataRange,
      keyField,
      valueField,
      colorScale,
      ...this.updateData(layers, props.topology)
    };

    bindAll(this, [
      'toggleVisibility',
      'selectLocation',
    ]);
  }

  updateData(layers, topology) {
    const layerNames = layers.map(layer => layer.name);
    const collections = filter(topology.objects, (collection, name) => {
      return layerNames.includes(name);
    });
    const locIds = flatMap(collections, (collection) => {
      return collection.geometries.map((geometry) => geometry.id);
    });

    const data = dataGenerator({
      primaryKeys: [{ name: keyField, values: locIds }],
      valueKeys: [{ name: valueField, range: dataRange }],
      length: 1
    });

    return { data, };
  }

  toggleVisibility(layerName) {
    return () => {
      console.log('layers', filter(this.state.layers, layerName));
      forEach(filter(this.state.layers, layerName), (layer) => {
        layer.visible = !layer.visible;
      });
      this.setState({ ...this.state.layers, });
    }
  }

  selectLocation(_, locId) {
    this.setState({ selections: xor(this.state.selections, [locId]), });
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button style={{ margin: '0.2em' }}
                  text="Toggle subnational"
                  clickHandler={this.toggleVisibility({ name: 'subnational' })}
          />
          <Button style={{ margin: '0.2em' }}
                  text="Toggle boundaries"
                  clickHandler={this.toggleVisibility({ type: 'mesh' })}
          />
        </div>
      </div>
    );
  }
}

d3.json("https://gist.githubusercontent.com/GabeMedrash/1dce23941015acc17d3fa2a670083d8f/raw/b0ae443ac0ad6d3a2425e12382680e5829345b60/world.topo.json", function(error, topology) {
  if (error) throw error;
  render(<App topology={topology} />, document.getElementById('app'));
});
