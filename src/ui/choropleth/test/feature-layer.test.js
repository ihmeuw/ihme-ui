import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import d3 from 'd3';
import { drop, omit } from 'lodash';
import { getGeoJSON, getLocationIds, baseColorScale } from '../../../test-utils';

import FeatureLayer from '../src/feature-layer';
import Path from '../src/path';

chai.use(chaiEnzyme());

describe('Choropleth <FeatureLayer />', () => {
  const features = getGeoJSON('states', 'feature').features;

  // keyField references the id field on the returned geoJSON
  const keyField = 'id';

  // valueField references the key on the data built up below
  // which holds the value to map to the location
  const valueField = 'mean';

  const data = getLocationIds(features).reduce((map, locationId) => {
    /* eslint-disable no-param-reassign */
    map[locationId] = {
      [valueField]: Math.floor(Math.random() * 100)
    };

    return map;
    /* eslint-enable no-param-reassign */
  }, {});

  const pathGenerator = d3.geo.path();
  const colorScale = baseColorScale();

  describe('keyField', () => {
    const expectedNumberofPaths = Object.keys(data).length;

    it('pulls the keyField off feature if it exists', () => {
      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={data}
          keyField={keyField}
          valueField={valueField}
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper.find('g')).to.have.exactly(expectedNumberofPaths).descendants(Path);
    });

    it('pulls the keyField off feature.properties', () => {
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
          keyField={keyField}
          valueField={valueField}
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper.find('g')).to.have.exactly(expectedNumberofPaths).descendants(Path);
    });

    it('accepts a function as a keyField', () => {
      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={data}
          keyField={(feature) => feature.id}
          valueField={valueField}
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper.find('g')).to.have.exactly(expectedNumberofPaths).descendants(Path);
    });
  });

  describe('valueField', () => {
    const featureToTest = features[0];

    it('accepts a string as valueField', () => {
      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={data}
          keyField={keyField}
          valueField={valueField}
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper
        .find('g')
        .find(Path)
        .filterWhere(n => n.prop('locationId') === featureToTest.id)
        .first()
      ).to.have.prop('fill', colorScale(featureToTest.mean));
    });

    it('accepts a function as valueField', () => {
      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={data}
          keyField={keyField}
          valueField={(datum) => datum.mean}
          pathGenerator={pathGenerator}
          colorScale={colorScale}
        />
      );

      expect(wrapper
        .find('g')
        .find(Path)
        .filterWhere(n => n.prop('locationId') === featureToTest.id)
        .first()
      ).to.have.prop('fill', colorScale(featureToTest.mean));
    });
  });

  describe('selected', () => {
    it('marks the correct path as selected', () => {
      const selectedFeature = features[0];

      const wrapper = shallow(
        <FeatureLayer
          features={features}
          data={data}
          keyField={keyField}
          valueField={valueField}
          pathGenerator={pathGenerator}
          colorScale={colorScale}
          selectedLocations={[selectedFeature.id]}
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
          keyField={keyField}
          valueField={valueField}
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
      wrapper.setProps({ selectedLocations: [firstFeature.id] });
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
          keyField={keyField}
          valueField={valueField}
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
      wrapper.setProps({ selectedLocations: [selectedFeature.id] });
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
          keyField={keyField}
          valueField={valueField}
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
