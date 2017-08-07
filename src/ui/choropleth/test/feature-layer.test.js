import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import { geoPath } from 'd3';
import { drop, find, map, omit } from 'lodash';
import { baseColorScale } from '../../../utils';

import FeatureLayer from '../src/feature-layer';
import Path from '../src/path';

import { getGeoJSON, getLocationIds } from './utils';

chai.use(chaiEnzyme());

describe('Choropleth <FeatureLayer />', () => {
  const features = getGeoJSON('states', 'feature').features;

  const data = getLocationIds(features).reduce((accum, locationId) => {
    /* eslint-disable no-param-reassign */
    accum[locationId] = {
      id: locationId,
      mean: Math.floor(Math.random() * 100)
    };

    return accum;
    /* eslint-enable no-param-reassign */
  }, {});

  const pathGenerator = geoPath();
  const colorScale = baseColorScale();

  describe('geometryKeyField', () => {
    const expectedNumberofPaths = Object.keys(data).length;

    it('pulls the geometryKeyField off feature if it exists', () => {
      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={data}
          geometryKeyField="id"
          keyField="id"
          valueField="mean"
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper.find('g')).to.have.exactly(expectedNumberofPaths).descendants(Path);
    });

    it('pulls the geometryKeyField off feature.properties', () => {
      const featuresWithProperties = features.map(feature => {
        const id = feature.id;
        return {
          ...omit(feature, 'id'),
          properties: {
            id,
          },
        };
      });

      const wrapper = shallow(
        <FeatureLayer
          features={featuresWithProperties}
          data={data}
          geometryKeyField="properties.id"
          keyField="id"
          valueField="mean"
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper.find('g')).to.have.exactly(expectedNumberofPaths).descendants(Path);
    });

    it('accepts a function as a geometryKeyField', () => {
      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={data}
          geometryKeyField={(feature) => feature.id}
          keyField="id"
          valueField="mean"
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper.find('g')).to.have.exactly(expectedNumberofPaths).descendants(Path);
    });
  });

  describe('valueField', () => {
    const featuresDecoratedWithData = map(features, (feature) =>
      Object.assign({}, feature, {
        properties: Object.assign({}, feature.properties, { mean: data[feature.id] }),
      })
    );
    const featureToTest = featuresDecoratedWithData[0];

    it('accepts a string as valueField', () => {
      const wrapper = shallow(
        <FeatureLayer
          features={featuresDecoratedWithData}
          data={data}
          geometryKeyField="id"
          keyField="id"
          valueField="mean"
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper
        .find('g')
        .find(Path)
        .filterWhere(n => n.prop('datum').id === featureToTest.id)
        .first()
      ).to.have.prop('fill', colorScale(featureToTest.properties.mean));
    });

    it('accepts a function as valueField', () => {
      const wrapper = shallow(
        <FeatureLayer
          features={featuresDecoratedWithData}
          data={data}
          geometryKeyField="id"
          keyField="id"
          valueField={(dataMappedToKeys, feature) => dataMappedToKeys[feature.id].mean}
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper
        .find('g')
        .find(Path)
        .filterWhere(n => n.prop('datum').id === featureToTest.id)
        .first()
      ).to.have.prop('fill', colorScale(featureToTest.properties.mean));
    });

    it('has a fill color when datum value is zero', () => {
      const testData = getLocationIds(features).reduce((accum, locationId) => {
        /* eslint-disable no-param-reassign */
        accum[locationId] = {
          id: locationId,
          mean: 0,
        };

        return accum;
        /* eslint-enable no-param-reassign */
      }, {});
      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={testData}
          geometryKeyField="id"
          keyField="id"
          valueField={(dataMappedToKeys, feature) => dataMappedToKeys[feature.id].mean}
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper
        .find('g')
        .find(Path)
        .filterWhere(n => n.prop('datum').id === featureToTest.id)
        .first()
      ).to.have.prop('fill', colorScale(0));
    });

    it('has a gray fill color when datum value is undefined', () => {
      const testData = getLocationIds(features).reduce((accum, locationId) => {
        /* eslint-disable no-param-reassign */
        accum[locationId] = {
          id: locationId,
          mean: undefined,
        };

        return accum;
        /* eslint-enable no-param-reassign */
      }, {});
      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={testData}
          geometryKeyField="id"
          keyField="id"
          valueField={(dataMappedToKeys, feature) => dataMappedToKeys[feature.id].mean}
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper
        .find('g')
        .find(Path)
        .filterWhere(n => n.prop('datum').id === featureToTest.id)
        .first()
      ).to.have.prop('fill', '#ccc');
    });
  });

  describe('selected', () => {
    it('marks the correct path as selected', () => {
      const selectedFeature = features[0];

      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={data}
          geometryKeyField="id"
          keyField="id"
          valueField="mean"
          pathGenerator={pathGenerator}
          colorScale={colorScale}
          selectedLocations={[find(data, { id: selectedFeature.id })]}
        />
      );

      wrapper.find('g').find(Path).forEach(n => {
        if (n.prop('feature').id === selectedFeature.id) {
          return expect(n.prop('selected')).to.be.true;
        }
        return expect(n.prop('selected')).to.be.false;
      });
    });

    it('renders selected features last', () => {
      const firstFeature = features[0];

      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={data}
          geometryKeyField="id"
          keyField="id"
          valueField="mean"
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper
        .find('g')
        .find(Path)
        .first()
        .props().feature
      ).to.equal(firstFeature);
      wrapper.setProps({ selectedLocations: [find(data, { id: firstFeature.id })] });
      expect(wrapper
        .find('g')
        .find(Path)
        .first()
        .props().feature
      ).to.not.equal(firstFeature);
      expect(wrapper
        .find('g')
        .find(Path)
        .last()
        .props().feature
      ).to.equal(firstFeature);
    });

    it('does a stable sort of the features', () => {
      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={data}
          geometryKeyField="id"
          keyField="id"
          valueField="mean"
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      wrapper.find('g').find(Path).forEach((node, idx) => {
        expect(node.props().feature).to.equal(features[idx]);
      });

      // selecting the first feature should result in the following order:
      // newIndex :|: oldIndex
      //        0 -> 1
      //        1 -> 2
      //        2 -> 0
      const selectedFeature = features[0];
      wrapper.setProps({ selectedLocations: [find(data, { id: selectedFeature.id })] });
      const expectedFeatureOrder = drop(features);
      expectedFeatureOrder.push(selectedFeature);

      wrapper.find('g').find(Path).forEach((node, idx) => {
        expect(node.props().feature).to.equal(expectedFeatureOrder[idx]);
      });
    });

    it(`does not update state.sortedFeatures 
        if neither selectedLocations nor features have changed`, () => {
      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={data}
          geometryKeyField="id"
          keyField="id"
          valueField="mean"
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      const initialState = wrapper.state('sortedFeatures');
      expect(initialState).to.deep.equal(features);
      wrapper.update();
      expect(initialState).to.equal(wrapper.state('sortedFeatures'));
    });
  });
});
