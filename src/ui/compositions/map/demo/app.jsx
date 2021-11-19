import React from 'react';
import { render } from 'react-dom';
import { json } from 'd3';
import {
  assign,
  bindAll,
  find,
  flatMap,
  get as getValue,
  reduce,
  xor,
  uniqueId,
} from 'lodash';

import Map from '../';
import Button from '../../../button';
import { dataGenerator, numberFormat, getRandomColor } from '../../../../utils';

const keyField = 'loc_id';
const valueField = (data, feature) => {
  if (!feature && data.hasOwnProperty('mean')) return data.mean;
  if (
    feature
    && feature.properties.hasOwnProperty('loc_id')
    && data.hasOwnProperty(feature.properties.loc_id)
  ) {
    return data[feature.properties.loc_id].mean;
  }
  return null;
};

function randomNumberBetween0And99() {
  return Math.random() * 100 | 0;
}

function randomRange() {
  return [randomNumberBetween0And99(), randomNumberBetween0And99()].sort((a, b) => a - b);
}

const MapLevel = {
  NATIONAL: 1,
  1: ['admin0', 'disputes'],
  SUBNATIONAL: 2,
  2: ['admin0', 'admin1', 'admin2', 'disputes'],
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      selections: [],
      selectedChoroplethDomain: [0, 1],
      mapLevel: MapLevel.NATIONAL,
      focus: {},
    };

    bindAll(this, [
      'onClick',
      'onGenerateNewData',
      'onResetScale',
      'onSliderMove',
      'onToggleColorAccessor',
      'onToggleSubnational',
      'onMouseOver',
      'onMouseLeave',
    ]);
  }

  componentWillMount() {
    this.setData();
  }

  onClick(event, locationDatum, Path) {
    let selectedDatum = locationDatum;
    const loc_id = getValue(Path, ['props', 'feature', 'properties', 'loc_id'], null);
    if (loc_id) {
      selectedDatum = find(this.state.data, (datum) => datum[keyField] == loc_id);
    }

    this.setState({
      selections: xor(this.state.selections, [selectedDatum]),
    });
  }

  onMouseOver(event, datum) {
    this.setState({ focus: datum });
  }

  onMouseLeave() {
    this.setState({ focus: {} });
  }

  onGenerateNewData() {
    this.setData();
  }

 onToggleColorAccessor() {
    this.setState({
      colorAccessor: this.state.colorAccessor === 'Color'
        ? null
        : 'Color',
    });
  }

  onSliderMove(selectedChoroplethDomain) {
    this.setState({
      selectedChoroplethDomain,
    });
  }

  onToggleSubnational() {
    this.setState({
      mapLevel: this.state.mapLevel === MapLevel.NATIONAL
        ? MapLevel.SUBNATIONAL
        : MapLevel.NATIONAL,
    });
  }

  onResetScale() {
    this.setState({
      selectedChoroplethDomain: [0, 1],
    });
  }

  setData() {
    const range = randomRange();
     const initialData = this.getData(this.getLocationIds(this.props.topology.objects), range);
     const colorData = reduce(initialData, (result, value, key) => {
       result.push(assign(value, {}, { Color: getRandomColor() }));
       return result;
     }, []);

   this.setState({
      data: colorData,
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

  filterGeometries(key) {
    return (geometries, feature) => {
      const { claimants = [], admins = [] } = feature.properties;

      if (key === 'disputes') {
        geometries.push({
          ...feature,
          properties: {
            disputed: true,
            claimants,
            admins,
            loc_id: uniqueId('dispute'),
          },
        });
      } else {
        geometries.push({
          ...feature,
        });
      }

      return geometries;
    };
  }

  prepTopology(topology) {
    const { objects, ...restTopology } = topology;
    return {
      ...restTopology,
      objects: reduce(objects, (results, { geometries, ...restObject }, key) => {
        const filteredGeometries = geometries.reduce(this.filterGeometries(key), []);
        if (filteredGeometries.length || key === 'disputes') {
          results[key] = {
            ...restObject,
            geometries: filteredGeometries,
          };
        }
        return results;
      }, {}),
    };
  }

  render() {
    const { topology } = this.props;
    const { colorAccessor, data, mapLevel, range, selections, selectedChoroplethDomain } = this.state;

    if (!Array.isArray(data)) return null;

    return (
      <div id="wrapper">
        <Map
          ariaLabelMap="Demo map aria label"
          axisTickFormat={numberFormat}
          data={data}
          domain={range}
          extentPct={selectedChoroplethDomain}
          focus={this.state.focus}
          geometryKeyField={`properties.${keyField}`}
          colorAccessor={colorAccessor}
          layerStyle={layer => (layer === 'disputes') ? { fill: 'transparent' } : {}}
          keyField={keyField}
          onClick={this.onClick}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
          onResetScale={this.onResetScale}
          onSliderMove={this.onSliderMove}
          selectedLocations={selections}
          sliderHandleFormat={numberFormat}
          topojsonObjects={MapLevel[mapLevel]}
          topology={this.prepTopology(topology)}
          unit="Probability of death"
          valueField={valueField}
          zoomControlsClassName={'zoom-controls-class'}
        />
        <Button
          onClick={this.onToggleColorAccessor}
          text="Toggle color accessor"
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

json("world.topo.json", function(error, topology) {
  if (error) throw error;

  render(<App topology={topology} />, document.getElementById('app'));
});
