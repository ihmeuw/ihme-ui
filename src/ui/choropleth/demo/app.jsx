import React from 'react';
import { render } from 'react-dom';

import { bindAll, filter, find, flatMap, forEach, includes, values, xor } from 'lodash';
import { json, scaleLinear } from 'd3';

import { dataGenerator } from '../../../test-utils';
import { colorSteps } from '../../../utils';
import { generateColorDomain } from '../../../utils/domain';

import ResponsiveContainer from '../../responsive-container';
import Choropleth from '../';
import Button from '../../button';

// Array is used to maintain layer order.
const LAYERS = [
  { name: 'national', object: 'national', type: 'feature', visible: true, },
  { name: 'subnational', object: 'subnational', type: 'feature', visible: false, },
  { name: 'boundary', object: 'national', type: 'mesh', visible: false, style: { stroke: 'white', strokeWidth: '5px' }, filterFn: boundaryFilterFn(['101', '102', '130'])},
];

function boundaryFilterFn(selections) {
  const setOfSelections = new Set(selections);
  return (a) => setOfSelections.has(a.properties.loc_id);
}

const keyField = 'location_id';
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
      return includes(layerNames, name);
    });
    const locIds = flatMap(collections, (collection) => {
      return collection.geometries.map((geometry) => geometry.properties.loc_id);
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
      const layers = [...this.state.layers];

      forEach(filter(layers, layerName), (layer) => {
        layer.visible = !layer.visible;
      });
      this.setState({ layers, });
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
              colorScale={colorScale}
              controls
              data={data}
              geometryKeyField="properties.loc_id"
              keyField={keyField}
              layers={layers}
              maxZoom={3}
              minZoom={1}
              onClick={this.selectLocation}
              topology={this.props.topology}
              valueField={valueField}
              selectedLocations={selections}
            />
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button style={{ margin: '0.2em' }}
                  text="Toggle subnational"
                  onClick={this.toggleVisibility({ name: 'subnational' })}
          />
          <Button style={{ margin: '0.2em' }}
                  text="Toggle boundaries"
                  onClick={this.toggleVisibility({ type: 'mesh' })}
          />
        </div>
      </div>
    );
  }
}

json("world.topo.json", function(error, topology) {
  if (error) throw error;
  render(<App topology={topology} />, document.getElementById('app'));
});
